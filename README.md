# CookIT — AI-Powered Recipe & Meal Planning Assistant

CookIT is a modern AI-powered cooking companion built with React, TypeScript, and Vite. It helps users discover recipes, plan weekly meals, analyse ingredient photos, save favourites, export meal plans, and chat with a context-aware cooking assistant.

This project was built as a senior-level frontend assignment focused on AI integration, prompt engineering, streaming user experiences, and clean React architecture.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [AI Provider Support](#ai-provider-support)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Demo Mode](#demo-mode)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [AI Integration](#ai-integration)
- [Prompt Engineering](#prompt-engineering)
- [Design System](#design-system)
- [Challenges and Solutions](#challenges-and-solutions)
- [Evaluation Highlights](#evaluation-highlights)

---

## Overview

CookIT turns everyday cooking tasks into simple AI-assisted workflows.

Users can search for recipes in natural language, generate personalised weekly meal plans, upload ingredient photos, ask cooking questions, and save favourite recipes. The app supports live AI streaming so results appear progressively instead of waiting for a full response.

The project also includes an offline-friendly demo mode, allowing evaluators to explore the full product experience without needing an API key.

---

## Key Features

| Feature | What it does |
|---|---|
| **AI Recipe Search** | Generates 5 recipes from a natural-language query and streams results progressively. |
| **Smart Recommendations** | Filters recipe suggestions by diet, cooking time, calories, and difficulty. |
| **Weekly Meal Planner** | Creates a personalised 7-day meal plan with progressively streamed days. |
| **AI Cooking Assistant** | Provides a streaming chat assistant that understands the currently viewed recipe. |
| **Photo Ingredient Analysis** | Lets users upload or capture a food photo so AI can detect ingredients and suggest recipes. |
| **Ingredient Quick-Pick** | Provides one-tap ingredient chips that open an inline recipe picker from the home page. |
| **Favourites** | Saves recipes across sessions using Zustand persistence and localStorage. |
| **Meal Plan PDF Export** | Exports the current weekly meal plan as a formatted A4 PDF using jsPDF. |
| **Demo Mode** | Runs fully offline with curated mock recipes and meal plans when no API key is configured. |
| **Mobile Navigation** | Includes a mobile-first bottom navigation experience with safe-area support. |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Build Tool | **Vite 8** | Fast development server, HMR, and proxy support. |
| UI Library | **React 19** | Modern component-based frontend architecture. |
| Language | **TypeScript 6** | Type safety across services, stores, components, and AI response shapes. |
| Routing | **React Router v7** | Client-side routing with a future-friendly loader mental model. |
| State Management | **Zustand 5** | Lightweight global state with persisted favourites and assistant history. |
| Async State | **TanStack Query 5** | Caching and refetch behaviour for recipe detail lookups. |
| Animation | **Framer Motion 12** | Smooth page, card, chip, and layout transitions. |
| Notifications | **react-hot-toast** | Lightweight user feedback and mobile-friendly toast positioning. |
| PDF Export | **jsPDF** | Programmatic meal plan PDF generation without DOM capture. |

---

## AI Provider Support

CookIT is provider-agnostic. The AI provider can be selected using the `VITE_AI_PROVIDER` environment variable.

Supported providers:

- `claude`
- `openai`
- `gemini`
- `openrouter`

This allows the project to be tested with different AI platforms without changing component or store logic.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- **Node.js 20+**
- **npm 10+**
- An API key from at least one supported provider:
  - Anthropic Claude
  - OpenAI
  - Google Gemini
  - OpenRouter

---

## Environment Variables

Create a `.env.local` file in the project root.

```env
# Choose one provider
VITE_AI_PROVIDER=claude

# Add the API key for your selected provider
VITE_AI_API_KEY=your_api_key_here

# Optional: override the default model
VITE_AI_MODEL=claude-haiku-4-5-20251001
```

### Example provider configurations

#### Claude

```env
VITE_AI_PROVIDER=claude
VITE_AI_API_KEY=your_anthropic_key
VITE_AI_MODEL=claude-haiku-4-5-20251001
```

#### OpenAI

```env
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=your_openai_key
VITE_AI_MODEL=gpt-4o-mini
```

#### Gemini

```env
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY=your_gemini_key
VITE_AI_MODEL=gemini-1.5-flash
```

#### OpenRouter

```env
VITE_AI_PROVIDER=openrouter
VITE_AI_API_KEY=your_openrouter_key
VITE_AI_MODEL=openai/gpt-4o-mini
```

---

## Running the App

### 1. Clone the repository

```bash
git clone <repo-url>
cd "AI_Focused_Frontend_Assignment -SSE"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will run at:

```text
http://localhost:5173
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build locally

```bash
npm run preview
```

---

## Demo Mode

CookIT automatically switches to **Demo Mode** when `VITE_AI_API_KEY` is missing or empty.

In Demo Mode:

- No live AI calls are made.
- Curated mock recipes are used.
- Mock weekly meal plans are available.
- All core pages remain navigable.
- A Demo Mode badge appears in the navbar.

This makes the app easy to review without requiring external credentials.

---

## Deployment

The project is pre-configured for **Vercel**.

### Deploying to Vercel

1. Push the project to GitHub.
2. Go to Vercel and import the repository.
3. Add the required environment variables:
   - `VITE_AI_PROVIDER`
   - `VITE_AI_API_KEY`
   - `VITE_AI_MODEL`
4. Deploy the project.

### Vercel rewrites

The `vercel.json` file handles both API routing and client-side routing.

```json
{
  "rewrites": [
    { "source": "/api/claude/:path*", "destination": "/api/claude" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Claude production proxy

The app includes a Vercel Edge Function at:

```text
api/claude.ts
```

This function forwards Claude requests to Anthropic, injects the API key server-side, and supports streaming responses without buffering.

---

## Project Structure

```text
.
├── api/
│   └── claude.ts                  # Vercel Edge Function for Claude proxy
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── assistant/             # Assistant sidebar and context UI
│   │   ├── chat/                  # Chat bubbles, input, streaming text
│   │   ├── favorites/             # Favourite recipe views and filters
│   │   ├── home/                  # Hero, search, trending, ingredient picker
│   │   ├── layout/                # Navbar, MobileNav, PageWrapper
│   │   ├── meal-planner/          # Planner form, tabs, week grid, detail cards
│   │   ├── recipe/                # Recipe cards, grids, nutrition, steps
│   │   ├── recipe-detail/         # Detail header, insights, cooking mode
│   │   ├── recommendations/       # Filters, active chips, recommendation UI
│   │   └── ui/                    # Reusable design system components
│   ├── constants/                 # Cuisine emoji map, cache keys
│   ├── hooks/                     # Custom hooks for AI, search, favourites
│   ├── pages/                     # Route-level page components
│   ├── services/
│   │   ├── aiService.ts           # AI calls, streaming generators, provider logic
│   │   ├── mockData.ts            # Demo recipes and meal plan data
│   │   └── prompts.ts             # Centralised AI prompt templates
│   ├── store/                     # Zustand stores
│   ├── types/                     # Shared TypeScript types
│   └── utils/
│       ├── exportPDF.ts           # Meal plan PDF export
│       └── index.ts               # Shared helpers such as uid and image compression
├── .env.local                     # Local environment variables, gitignored
├── vercel.json                    # Vercel rewrites for SPA and API proxy
└── vite.config.ts                 # Vite config and development proxy
```

---

## Architecture

CookIT separates UI, state, AI services, and prompt logic into clear layers.

### State management

The app uses four main Zustand stores:

```text
searchStore      # Query, filters, streaming results, AbortController
recipeStore      # Loaded recipe detail and selected recipe state
favoriteStore    # Persisted saved recipes using localStorage
assistantStore   # Chat sessions and conversation history
```

The `searchStore` owns an `AbortController`. When the user starts a new search, the previous request is cancelled immediately so stale streaming results cannot overwrite newer results.

### Service layer

All AI communication is handled inside:

```text
src/services/aiService.ts
```

Components and stores do not call `fetch` directly. This keeps the frontend easier to test, maintain, and extend.

The service layer is responsible for:

- Provider selection
- Streaming response handling
- Demo mode fallback
- Image analysis formatting
- Token budget control
- Partial JSON recovery

### Component organisation

Components are grouped by product domain instead of by generic type. This makes the codebase easier to navigate because related UI and behaviour live close together.

Reusable primitives are kept in:

```text
src/components/ui/
```

Domain-specific components are kept in folders such as:

```text
src/components/recipe/
src/components/meal-planner/
src/components/chat/
src/components/home/
```

---

## AI Integration

### Provider-agnostic service

The app uses `VITE_AI_PROVIDER` to switch between Claude, OpenAI, Gemini, and OpenRouter.

Claude uses the Anthropic SDK for native streaming. Other providers use `fetch` with either standard JSON responses or SSE-style streaming parsing.

### Streaming generators

The app uses async generators to power progressive UI updates.

```typescript
streamGenerateRecipes(query, filters?, signal?)  // Streams recipe search results
streamSmartSearch(query, signal?)                // Streams smart recommendations
streamMealPlan(preferences?, signal?)            // Streams weekly meal plan days
```

Each generator:

1. Opens a streaming AI connection.
2. Collects incoming tokens in a buffer.
3. Extracts complete JSON objects from partial text.
4. Yields the latest complete result set.
5. Falls back to final full JSON parsing when the stream ends.

This allows the first recipe card or meal plan day to appear quickly while the rest of the response continues loading.

### Image analysis

The `analyzeImageForRecipes()` function supports multiple provider-specific image formats:

- Claude: multimodal image content block
- OpenAI and OpenRouter: `image_url` data URI
- Gemini: `inline_data` with `mime_type`

Images are compressed in the browser before upload using Canvas:

- Maximum longest edge: `1024px`
- Output format: JPEG
- Quality: `85%`

This reduces large mobile camera uploads from several megabytes to a much smaller payload before they are sent to the AI provider.

### Claude CORS proxy

Claude cannot be called directly from the browser because Anthropic API requests require custom headers that trigger CORS preflight issues.

CookIT solves this with a two-environment proxy:

- **Development:** Vite proxy forwards `/api/claude/*` to Anthropic.
- **Production:** Vercel Edge Function forwards Claude requests server-side.

The client always points Claude requests to:

```text
/api/claude
```

This keeps the browser on the same origin and avoids direct cross-origin Anthropic calls.

---

## Prompt Engineering

CookIT uses schema-first prompts to make AI responses easier to parse and render.

### Schema-first responses

Structured AI prompts include the expected JSON shape directly inside the prompt.

```json
{
  "id": "slug",
  "title": "",
  "description": "1 sentence max",
  "cookingTime": 0,
  "difficulty": "Easy",
  "ingredients": [],
  "instructions": []
}
```

This reduces ambiguity around field names, types, and nesting.

### Token budget discipline

Token limits are enforced both in API options and inside the prompts.

```typescript
export const TOKEN_LIMITS = {
  recipeSearch: 1800,
  smartSearch: 1500,
  assistantChat: 1500,
  mealPlan: 1800,
  streaming: 1500,
  imageAnalysis: 2400,
  chefTips: 600,
} as const;
```

Keeping token budgets tight improves time-to-first-token and reduces the risk of truncated JSON.

### Hard output constraints

Prompts use measurable rules instead of vague wording.

Examples:

- Maximum 6 ingredients per recipe
- Maximum 5 instruction steps
- Each instruction under 10 words
- Description under 20 words
- AI tip under 15 words

This keeps responses compact and consistent.

### Meal plan optimisation

Meal plans use lightweight recipe stubs. Full ingredients and instructions are loaded only when the user opens a recipe detail page.

This avoids generating full data for every meal in a 7-day plan, reducing latency and token usage.

### Partial JSON recovery

The app includes a custom `recoverPartialJsonArray()` parser.

It walks the streamed text buffer character by character and tracks JSON brace depth. Whenever a complete object is found, it is parsed and added to the UI immediately.

This means partial AI responses can still be useful even if a stream is interrupted.

---

## Design System

CookIT uses a warm editorial food-magazine style instead of a generic SaaS interface.

### Visual direction

The interface uses warm parchment backgrounds, rich dark typography, and orange highlights to create a premium cooking experience.

```css
--color-warm-100: #F5EFE6;
--color-warm-200: #EDE4D8;
--color-warm-300: #E0D5C5;
--color-warm-500: #B8A898;
--color-warm-900: #2C2416;
--color-primary:  #E8894A;
--color-navbar:   #1A1A1A;
```

### Typography

- **Playfair Display** for headings
- **Inter** for body text, forms, cards, and ingredient lists

### UX principles

#### Progressive disclosure

Search results, meal plan days, and recipe content appear as soon as usable AI data is available.

#### Context-aware AI

The cooking assistant can answer questions based on the recipe currently being viewed.

#### Mobile-first behaviour

The app includes:

- Fixed bottom mobile navigation
- Safe-area inset support
- Collapsible filter panels
- Bottom-sheet modal patterns
- Touch-friendly controls

#### Zero-friction review

Demo Mode lets reviewers test the product without API keys.

---

## Challenges and Solutions

### 1. Claude CORS limitations

**Problem:** The Anthropic API cannot be called directly from the browser because custom headers cause CORS preflight requests that are blocked.

**Solution:** Added a Vite proxy for development and a Vercel Edge Function for production. The browser only calls the same-origin `/api/claude` endpoint.

---

### 2. Streaming JSON from an LLM

**Problem:** AI providers stream raw text tokens, which means JSON often arrives in incomplete fragments that cannot be parsed with `JSON.parse()` immediately.

**Solution:** Built `recoverPartialJsonArray()`, a brace-depth parser that extracts complete JSON objects from the stream as soon as they become valid.

---

### 3. Token budget and response completeness

**Problem:** Large `max_tokens` values increased latency and encouraged overly verbose responses that could still end in truncated JSON.

**Solution:** Tuned token limits to match each response type and added explicit brevity rules inside prompts.

---

### 4. Race conditions during search

**Problem:** Users could trigger multiple searches quickly, causing older streams to overwrite newer results.

**Solution:** Added an `AbortController` to cancel the previous stream before starting a new one.

---

### 5. React 19 form event typing

**Problem:** Existing form event types caused TypeScript issues after moving to React 19.

**Solution:** Updated form handlers to use `React.SyntheticEvent<HTMLFormElement>`.

---

### 6. Dynamic AI recipe detail pages

**Problem:** AI-generated recipes did not exist in static mock data, so recipe detail pages could show a 404 state.

**Solution:** Extended recipe lookup to check search results and favourites before falling back to mock data.

---

### 7. Large image uploads

**Problem:** Mobile camera photos were often 3-5 MB, increasing upload time and causing possible API issues.

**Solution:** Compressed images client-side using Canvas before sending them to the AI provider.

---

## Evaluation Highlights

| Area | Where to look |
|---|---|
| **AI Integration** | `src/services/aiService.ts` |
| **Prompt Engineering** | `src/services/prompts.ts` |
| **Frontend Architecture** | `src/store/`, `src/hooks/`, `src/components/` |
| **Reusable Components** | `src/components/ui/` |
| **Streaming UX** | Recipe search, smart search, meal planner, assistant chat |
| **Demo Mode** | `src/services/mockData.ts` and AI service fallback logic |
| **PDF Export** | `src/utils/exportPDF.ts` |
| **Mobile UX** | `MobileNav`, responsive layouts, bottom-sheet patterns |

---

## Summary

CookIT demonstrates a production-minded AI frontend architecture with thoughtful UX, clean state management, provider-agnostic AI services, streaming responses, prompt constraints, image analysis, PDF export, and a polished mobile-first interface.

The result is a friendly cooking assistant that is easy to run, easy to review, and easy to extend.
