# ⚡ Jol — AI Marketing Autopilot

**Because the best marketing comes from builders, not billboards.**

Jol is an AI-native marketing copilot for technical founders who'd rather ship than sell. It generates **founder-quality content**, builds **growth roadmaps**, and tracks **market intelligence** — so you can build in public without burning out on content.

---

## Philosophy

Most marketing tools are built for marketers. Templates. Calendars. "Post better."

Jol is built for **builders** — people who write code, design systems, and ship products. You don't need a content calendar. You need a **second brain** that understands your product, your voice, and your audience. Someone who can:

- Turn a product insight into a **storytelling post** that doesn't sound like a press release
- Build a **growth roadmap** that adapts to your actual stage (pre-revenue → scaling)
- Track **what competitors are doing** without you spending hours on news scrolling

No fluff. No "revolutionary." No "game-changer." Just real writing from real product experience.

---

## What It Does

### ✍️ Content Generation
Post types: `data_driven` · `storytelling` · `hot_take`
Styles: `professional` · `casual` · `humorous` · `academic`
Languages: 12 languages (EN, RU, ES, FR, DE, IT, PT, JA, KO, ZH, AR, HI)
Platforms: LinkedIn · Reddit · Medium · Telegram · Threads · Instagram

Every post uses **proper Markdown** — bold for emphasis, italic for tone, headers for structure, lists for scannability. Never auto-publishes — you copy, you paste, you own.

### 🗺️ Growth Roadmap
AI generates an 8-step roadmap tailored to your niche and stage. Each step includes how-to instructions, resources, KPIs, and timeframes. Track progress, toggle steps done, regenerate on demand.

### 🧠 Market Intelligence
AI-powered digest of trends, competitor moves, and insights for your niche. Sentiment analysis, actionable recommendations.

---

## Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 · TypeScript · Vite · Tailwind CSS 4 · shadcn/ui · Framer Motion · React Router 7 · Zustand · TanStack Query · Recharts |
| **Backend** | Python · FastAPI · Supabase (Postgres + Auth) · Redis · APScheduler |
| **AI** | Google Gemini (roadmap, intelligence) · Groq (content generation) — Llama 3.1 / Qwen |
| **Infra** | PWA-ready (service worker + workbox) · Docker-ready |

---

## Project Structure

```
jol/
├── frontend/                    # React SPA
│   └── src/
│       ├── components/          # UI components (shadcn + custom)
│       │   ├── content/         # Post cards, editor, preview, platform preview
│       │   ├── roadmap/         # Step cards, progress visualization
│       │   └── ui/              # Base UI kit (button, card, modal, etc.)
│       ├── pages/
│       │   └── dashboard/       # Overview, Content, Roadmap, Intelligence, Settings
│       ├── hooks/               # usePosts, useRoadmap, useIntelligence, etc.
│       └── types/               # TypeScript types (post, roadmap, intelligence)
│
└── backend/
    ├── main.py                  # FastAPI app
    ├── routers/                 # API endpoints (content, roadmap, intelligence, projects)
    ├── agents/                  # AI agents (content, roadmap, intelligence, brand voice)
    ├── services/                # AI client (Gemini + Groq), rate limiter, formatting
    ├── prompts/                 # Writing prompts, roadmap prompts, intelligence prompts
    ├── core/                    # Config, security, rate limiter, exceptions
    ├── models/                  # Pydantic models (post, project, roadmap, intelligence)
    └── db/                      # Supabase client, Redis client
```

---

## Local Setup

```bash
# Backend
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # fill in your keys
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Required Environment Variables (backend)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `GOOGLE_AI_STUDIO_KEY` | Gemini API key |
| `GROQ_API_KEY` | Groq API key |
| `REDIS_URL` | optional, for rate limiting |

---

## Plans

| Plan | Generations/day | Features |
|------|:---------------:|----------|
| **Free** | 1 | All platforms, 12 languages, 4 styles |
| **Pro** | 3 | Priority generation, unlimited history |
| **Dev** | ∞ | Everything, rate limit bypass |

---

## Philosophy, continued

> *"Write like a founder. Build like an engineer."*

Every line of generated content goes through a **premium writer prompt** that bans 15+ buzzwords (no "synergy," no "leverage," no "paradigm shift"). The AI is instructed to sound human, expensive, and impossible to ignore — because that's what your audience deserves.

Jol doesn't replace your voice. It amplifies it.
