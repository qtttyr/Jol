from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from core.config import settings
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging
import traceback

from routers import projects, knowledge, content, roadmap, intelligence

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for JOL marketing AI"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
]

if settings.ENV == "development":
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log the full traceback internally
    logger.error(f"Unhandled Exception: {exc}\n{traceback.format_exc()}")
    
    # Return a safe message to the client
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

# Include Routers
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(knowledge.router, prefix=settings.API_V1_STR)
app.include_router(content.router, prefix=settings.API_V1_STR)
app.include_router(roadmap.router, prefix=settings.API_V1_STR)
app.include_router(intelligence.router, prefix=settings.API_V1_STR)

# Background Scheduler
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup_event():
    import scheduler as task_scheduler
    task_scheduler.setup_scheduler(scheduler)
    scheduler.start()
    
@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()

@app.get("/")
def root():
    return {"message": "Welcome to Jol API. Go to /docs for Swagger UI."}
