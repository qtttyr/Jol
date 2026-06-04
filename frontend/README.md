# Jol Frontend

AI marketing autopilot for early-stage technical founders.

## Tech Stack

- React 19 + TypeScript 5.9
- Vite 7 + Tailwind CSS v4
- shadcn/ui + Radix primitives
- Zustand (state) + Framer Motion (animations)
- Recharts (charts) + Sonner (toasts)
- Supabase Auth + Axios (API)

## Getting Started

```bash
npm install
npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Type check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Environment

Copy `.env.example` to `.env` and fill in your Supabase credentials.

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=http://127.0.0.1:8000/api
```
