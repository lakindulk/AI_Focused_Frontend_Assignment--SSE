# CookIT — AI-Powered Recipe & Meal Planning Assistant

CookIT is an AI-powered cooking companion built with React 19 + TypeScript. Search for recipes by ingredient or dish, generate a 7-day meal plan, chat with an AI chef, and analyse food photos for recipe ideas.

Works without an API key — runs in demo mode with pre-loaded data out of the box.

---

## Stack

React 19 · TypeScript · Vite · Zustand · React Router v7 · Framer Motion · Plain CSS

---

## Local Setup

**1. Clone and install**

```bash
git clone https://github.com/your-username/cookit.git
cd cookit
npm install
```

**2. Create a `.env.local` file**

```env
VITE_AI_PROVIDER=claude          # claude | openai | gemini | openrouter
VITE_AI_API_KEY=your_key_here
VITE_AI_MODEL=claude-haiku-4-5-20251001
```

> No API key? Leave `VITE_AI_API_KEY` empty — the app runs fully in demo mode.

**3. Start the dev server**

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

---

## Build

```bash
npm run build
npm run preview
```

---

## Deploy (Vercel)

Push to GitHub, import at [vercel.com/new](https://vercel.com/new), and add the three env vars above in the Vercel dashboard. The included `vercel.json` and `api/claude.ts` edge function handle everything else automatically.
