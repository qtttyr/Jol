startup-autopilot/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
│
├── frontend/ # React + Vite + Tailwind
│ ├── index.html
│ ├── vite.config.ts
│ ├── tailwind.config.ts
│ ├── tsconfig.json
│ ├── package.json
│ │
│ └── src/
│ ├── main.tsx # Entry point, BrowserRouter
│ ├── App.tsx # Routes: /, /dashboard, /login
│ │
│ ├── config/
│ │ └── constants.ts # API_URL, plan limits, app config
│ │
│ ├── lib/
│ │ ├── api.ts # Axios instance + interceptors + JWT
│ │ ├── supabase.ts # Supabase client (auth only)
│ │ └── utils.ts # cn(), formatDate(), truncate()
│ │
│ ├── store/ # Zustand — глобальный стейт
│ │ ├── authStore.ts # user, plan, token, login/logout
│ │ ├── projectStore.ts # activeProject, projects[]
│ │ └── uiStore.ts # sidebar open, modals, toasts
│ │
│ ├── hooks/ # React Query хуки
│ │ ├── useProjects.ts # CRUD проектов
│ │ ├── usePosts.ts # генерация, история, редактирование
│ │ ├── useRoadmap.ts # получение, refresh
│ │ ├── useIntelligence.ts # weekly digest
│ │ ├── useRedditThreads.ts # треды, статусы
│ │ └── useAuth.ts # login, logout, session
│ │
│ ├── types/
│ │ ├── project.ts # Project, Stage, BrandVoice
│ │ ├── post.ts # Post, PostType, PostStatus
│ │ ├── roadmap.ts # Roadmap, RoadmapStep
│ │ ├── intelligence.ts # WeeklyDigest, Trend
│ │ └── reddit.ts # RedditThread, ThreadStatus
│ │
│ ├── pages/
│ │ ├── Landing.tsx # Лендинг — hero, features, pricing
│ │ ├── Login.tsx # Supabase Auth UI
│ │ ├── Onboarding.tsx # 3 шага: описание → brand voice → первый пост
│ │ └── dashboard/
│ │ ├── DashboardLayout.tsx # Sidebar + топбар + outlet
│ │ ├── Overview.tsx # Метрики, saved time counter
│ │ ├── Content.tsx # Лента постов + кнопка генерации
│ │ ├── Roadmap.tsx # Roadmap шаги с прогрессом
│ │ ├── Intelligence.tsx # Weekly digest + советы
│ │ ├── Reddit.tsx # Треды + черновики ответов
│ │ └── Settings.tsx # Проект, brand voice, тариф
│ │
│ └── components/
│ ├── ui/ # Базовые UI-компоненты
│ │ ├── Button.tsx # variants: primary, secondary, ghost
│ │ ├── Card.tsx # с hover-эффектом
│ │ ├── Badge.tsx # статусы, типы постов
│ │ ├── Input.tsx
│ │ ├── Textarea.tsx
│ │ ├── Modal.tsx # side panel вместо popup
│ │ ├── Skeleton.tsx # loading states
│ │ └── Toast.tsx
│ │
│ ├── layout/
│ │ ├── Sidebar.tsx # навигация, активный проект
│ │ ├── Topbar.tsx # breadcrumb, user menu
│ │ └── PlanGuard.tsx # блокировка Pro-фич на Free
│ │
│ ├── content/
│ │ ├── PostCard.tsx # карточка поста, статус, платформа
│ │ ├── PostEditor.tsx # редактор с LinkedIn/Telegram превью
│ │ ├── GenerateButton.tsx # кнопка + счётчик лимитов
│ │ └── PlatformPreview.tsx # как выглядит в LinkedIn vs Telegram
│ │
│ ├── roadmap/
│ │ ├── RoadmapStep.tsx # шаг с иконкой, статусом, описанием
│ │ └── RoadmapProgress.tsx # прогресс-бар по шагам
│ │
│ ├── reddit/
│ │ ├── ThreadCard.tsx # тред + черновик ответа
│ │ └── ReplyEditor.tsx # редактирование черновика
│ │
│ └── onboarding/
│ ├── StepIndicator.tsx
│ ├── ProjectForm.tsx # название, ниша, стадия, описание
│ └── BrandVoiceForm.tsx # загрузка 3 статей
│
│
└── backend/ # FastAPI (Python 3.11+)
├── Dockerfile
├── requirements.txt
├── .env.example
│
├── main.py # FastAPI app, CORS, роутеры, scheduler
├── scheduler.py # APScheduler: daily content, weekly digest
│
├── core/
│ ├── config.py # Settings через pydantic-settings
│ ├── security.py # JWT decode, get_current_user
│ ├── rate_limiter.py # slowapi, лимиты по плану
│ └── exceptions.py # кастомные HTTP-ошибки
│
├── db/
│ ├── supabase.py # Supabase client (сервисный ключ)
│ └── redis.py # Redis client, get/set/delete с TTL
│
├── models/
│ ├── project.py # Pydantic схемы Project
│ ├── post.py # Post, PostType, PostStatus
│ ├── roadmap.py # Roadmap, RoadmapStep
│ ├── intelligence.py # WeeklyDigest, Trend
│ └── reddit.py # RedditThread
│
├── routers/
│ ├── projects.py # POST/PATCH /api/projects
│ ├── knowledge.py # POST /api/projects/{id}/knowledge
│ ├── content.py # POST generate, GET posts, PATCH post
│ ├── roadmap.py # GET roadmap, POST refresh
│ ├── intelligence.py # GET digest
│ └── reddit.py # GET threads, PATCH thread
│
├── services/
│ ├── plan_guard.py # проверка лимитов по плану перед LLM
│ ├── cache_service.py # логика кэша: check → hit/miss → store
│ ├── embedding_service.py # создание embeddings, chunking
│ └── format_service.py # Python-форматирование постов под платформы
│
├── agents/
│ ├── content_agent.py # LangChain RAG → генерация 3 постов (1 запрос)
│ ├── brand_voice_agent.py # анализ статей → style summary (~300 токенов)
│ ├── roadmap_agent.py # анализ ниши + стадии → маркетинг-план
│ ├── intelligence_agent.py # RSS + Google Trends → digest + совет
│ └── reddit_agent.py # поиск тредов + черновик ответа
│
└── prompts/
├── content_prompts.py # system prompts для постов (кэшируются)
├── roadmap_prompts.py
├── intelligence_prompts.py
└── reddit_prompts.py
uvicorn main:app --reload
.\venv\Scripts\Activate.ps1
