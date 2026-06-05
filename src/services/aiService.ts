import Anthropic from '@anthropic-ai/sdk';
import toast from 'react-hot-toast';
import type { Recipe, ChatMessage, MealPlanDay } from '@/types';
import {
  RECIPE_RECOMMENDATION_PROMPT,
  ASSISTANT_SYSTEM_PROMPT,
  SMART_SEARCH_PROMPT,
  MEAL_PLAN_PROMPT,
  IMAGE_RECIPE_PROMPT,
} from './prompts';
import { mockRecipes, mockMealPlan } from './mockData';

const AI_PROVIDER = (import.meta.env.VITE_AI_PROVIDER || 'openai').trim();
const AI_API_KEY  = (import.meta.env.VITE_AI_API_KEY  || '').trim();
const AI_MODEL    = (import.meta.env.VITE_AI_MODEL    || 'gpt-4o-mini').trim();

export const TOKEN_LIMITS = {
  recipeSearch:  1800,
  smartSearch:   1500,
  assistantChat: 1500,
  mealPlan:      1800,
  chefTips:       600,
  streaming:     1500,
  imageAnalysis: 2400,
} as const;

export type TokenLimitKey = keyof typeof TOKEN_LIMITS;

const isConfigured = (): boolean => AI_API_KEY.length > 0;

let _anthropicClient: Anthropic | null = null;
const getAnthropicClient = (): Anthropic => {
  if (!_anthropicClient) {
    _anthropicClient = new Anthropic({
      apiKey: AI_API_KEY,
      baseURL: `${window.location.origin}/api/claude`,
      dangerouslyAllowBrowser: true,
    });
  }
  return _anthropicClient;
};

let _warnShown = false;
const showApiError = (msg: string, id: string) => {
  if (_warnShown) return;
  _warnShown = true;
  toast.error(msg, { duration: 6000, id });
};

const isNetworkError = (err: unknown): boolean =>
  err instanceof TypeError && /fetch|network|failed/i.test(String(err));

const parseJsonFromText = <T>(text: string): T => {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return JSON.parse(fence[1].trim());
  const raw = text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  if (raw) return JSON.parse(raw[1]);
  return JSON.parse(text);
};

const recoverPartialJsonArray = <T>(text: string): T[] => {
  const items: T[] = [];
  const start = text.indexOf('[');
  if (start === -1) return items;
  let depth = 0;
  let itemStart = -1;
  for (let i = start + 1; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      if (depth === 0) itemStart = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && itemStart !== -1) {
        try { items.push(JSON.parse(text.slice(itemStart, i + 1))); } catch { /* skip */ }
        itemStart = -1;
      }
    }
  }
  return items;
};

// ── Low-level transport ────────────────────────────────────────────────────

const callClaude = async (
  systemPrompt: string,
  userMessage: string,
  maxTokens: number
): Promise<string> => {
  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: AI_MODEL || 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
};

async function* streamClaude(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number
): AsyncGenerator<string> {
  const client = getAnthropicClient();
  const stream = await client.messages.stream({
    model: AI_MODEL || 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  });
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}

const getApiUrl = (): string => {
  switch (AI_PROVIDER) {
    case 'openai':     return 'https://api.openai.com/v1/chat/completions';
    case 'gemini':
      return `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent`;
    case 'openrouter': return 'https://openrouter.ai/api/v1/chat/completions';
    default:           return 'https://api.openai.com/v1/chat/completions';
  }
};

const getHeaders = (): Record<string, string> => {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (AI_PROVIDER === 'openai' || AI_PROVIDER === 'openrouter') {
    h['Authorization'] = `Bearer ${AI_API_KEY}`;
  }
  return h;
};

const buildFetchBody = (
  systemPrompt: string,
  userMessage: string,
  maxTokens: number,
  stream = false
): Record<string, unknown> => {
  if (AI_PROVIDER === 'gemini') {
    return {
      contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.8 },
    };
  }
  return {
    model: AI_MODEL,
    max_tokens: maxTokens,
    stream,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage   },
    ],
  };
};

const extractFetchText = (data: Record<string, unknown>): string => {
  if (AI_PROVIDER === 'gemini') {
    const c = data.candidates as Array<{ content: { parts: Array<{ text: string }> } }>;
    return c?.[0]?.content?.parts?.[0]?.text || '';
  }
  const ch = data.choices as Array<{ message: { content: string } }>;
  return ch?.[0]?.message?.content || '';
};

const callFetch = async (
  systemPrompt: string,
  userMessage: string,
  maxTokens: number
): Promise<string> => {
  const url =
    AI_PROVIDER === 'gemini'
      ? `${getApiUrl()}?key=${AI_API_KEY}`
      : getApiUrl();

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(buildFetchBody(systemPrompt, userMessage, maxTokens)),
    });
  } catch (netErr) {
    if (isNetworkError(netErr)) {
      showApiError('Network error — check your API key and provider settings.', 'net-err');
    }
    throw netErr;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => `HTTP ${res.status}`);
    if (res.status === 401) showApiError('Invalid API key — check VITE_AI_API_KEY in .env.', 'auth-err');
    else if (res.status === 429) showApiError('Rate limit hit — using demo data.', 'rate-err');
    throw new Error(`API ${res.status}: ${body}`);
  }

  return extractFetchText(await res.json());
};

const callAI = async (
  systemPrompt: string,
  userMessage: string,
  maxTokens: number
): Promise<string> => {
  if (AI_PROVIDER === 'claude') return callClaude(systemPrompt, userMessage, maxTokens);
  return callFetch(systemPrompt, userMessage, maxTokens);
};

// SSE reader for OpenAI / OpenRouter fetch streaming
async function* streamFetch(
  url: string,
  body: Record<string, unknown>,
  signal?: AbortSignal
): AsyncGenerator<string> {
  let res: Response;
  try {
    res = await fetch(url, { method: 'POST', headers: getHeaders(), signal, body: JSON.stringify(body) });
  } catch (netErr) {
    if (signal?.aborted) return;
    if (isNetworkError(netErr)) showApiError('Network error — check your API key and provider settings.', 'net-err');
    throw netErr;
  }

  if (!res.ok || !res.body) {
    const bodyText = await res.text().catch(() => `HTTP ${res.status}`);
    if (res.status === 401) showApiError('Invalid API key — check VITE_AI_API_KEY in .env.', 'auth-err');
    else if (res.status === 429) showApiError('Rate limit hit — using demo data.', 'rate-err');
    throw new Error(`API ${res.status}: ${bodyText}`);
  }

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  try {
    while (true) {
      if (signal?.aborted) { reader.cancel(); return; }
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
        try {
          const json = JSON.parse(line.slice(6));
          const text = json.choices?.[0]?.delta?.content || '';
          if (text) yield text;
        } catch { /* skip malformed */ }
      }
    }
  } catch (e) {
    if (signal?.aborted) return;
    console.warn('Stream interrupted:', e);
  }
}

// Generic streaming JSON array parser — yields progressively growing arrays as tokens arrive
async function* streamJsonArray<T>(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number,
  signal?: AbortSignal
): AsyncGenerator<T[]> {
  let accumulated = '';
  let lastCount = 0;

  const tryYield = (): T[] | null => {
    const items = recoverPartialJsonArray<T>(accumulated);
    if (items.length > lastCount) {
      lastCount = items.length;
      return items;
    }
    return null;
  };

  if (AI_PROVIDER === 'claude') {
    const client = getAnthropicClient();
    const stream = await client.messages.stream({
      model: AI_MODEL || 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });
    for await (const event of stream) {
      if (signal?.aborted) return;
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        accumulated += event.delta.text;
        const batch = tryYield();
        if (batch) yield batch;
      }
    }
  } else if (AI_PROVIDER === 'openai' || AI_PROVIDER === 'openrouter') {
    const body = {
      model: AI_MODEL,
      max_tokens: maxTokens,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage   },
      ],
    };
    for await (const chunk of streamFetch(
      AI_PROVIDER === 'openrouter' ? 'https://openrouter.ai/api/v1/chat/completions'
                                   : 'https://api.openai.com/v1/chat/completions',
      body,
      signal
    )) {
      if (signal?.aborted) return;
      accumulated += chunk;
      const batch = tryYield();
      if (batch) yield batch;
    }
  } else {
    // Gemini: no native SSE — single non-streaming call, emit once when done
    const text = await callFetch(systemPrompt, userMessage, maxTokens);
    accumulated = text;
  }

  // Final clean parse
  try {
    const final = parseJsonFromText<T[]>(accumulated);
    if (Array.isArray(final) && final.length > lastCount) {
      yield final;
      lastCount = final.length;
    }
  } catch { /* partial recovery is sufficient */ }

  if (lastCount === 0) throw new Error('AI returned no parseable data');
}

// ── Public streaming exports ───────────────────────────────────────────────

export async function* streamGenerateRecipes(
  query: string,
  filters?: { ingredients?: string[]; dietary?: string[]; maxTime?: number; maxCalories?: number },
  signal?: AbortSignal
): AsyncGenerator<Recipe[]> {
  if (!isConfigured()) {
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    yield mockFilterRecipes(query, filters);
    return;
  }
  const filterDesc = filters ? `\nFilters: ${JSON.stringify(filters)}` : '';
  yield* streamJsonArray<Recipe>(
    RECIPE_RECOMMENDATION_PROMPT,
    `User query: "${query}"${filterDesc}`,
    TOKEN_LIMITS.recipeSearch,
    signal
  );
}

export async function* streamSmartSearch(
  query: string,
  signal?: AbortSignal
): AsyncGenerator<Recipe[]> {
  if (!isConfigured()) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
    const q = query.toLowerCase();
    const r = mockRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.dietaryTags.some((t) => t.toLowerCase().includes(q)) ||
        r.cuisineType?.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
    yield r.length > 0 ? r : mockRecipes.slice(0, 6);
    return;
  }
  yield* streamJsonArray<Recipe>(
    SMART_SEARCH_PROMPT.replace('{query}', query),
    query,
    TOKEN_LIMITS.smartSearch,
    signal
  );
}

export async function* streamMealPlan(
  preferences?: string,
  signal?: AbortSignal
): AsyncGenerator<MealPlanDay[]> {
  if (!isConfigured()) {
    await new Promise((r) => setTimeout(r, 600));
    yield mockMealPlan;
    return;
  }
  const msg = preferences
    ? `Generate a meal plan with these preferences: ${preferences}`
    : 'Generate a balanced, varied 7-day meal plan.';
  yield* streamJsonArray<MealPlanDay>(MEAL_PLAN_PROMPT, msg, TOKEN_LIMITS.mealPlan, signal);
}

// ── Legacy non-streaming exports (kept for compatibility) ──────────────────

const mockFilterRecipes = (
  query: string,
  filters?: { ingredients?: string[]; dietary?: string[]; maxTime?: number; maxCalories?: number }
): Recipe[] => {
  let results = [...mockRecipes];
  if (filters?.dietary?.length)
    results = results.filter((r) =>
      filters.dietary!.some((tag) =>
        r.dietaryTags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  if (filters?.maxTime)     results = results.filter((r) => r.cookingTime <= filters.maxTime!);
  if (filters?.maxCalories) results = results.filter((r) => r.calories    <= filters.maxCalories!);
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.dietaryTags.some((t) => t.toLowerCase().includes(q)) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
  }
  return results.length > 0 ? results : mockRecipes.slice(0, 6);
};

export const generateRecipes = async (
  query: string,
  filters?: { ingredients?: string[]; dietary?: string[]; maxTime?: number; maxCalories?: number }
): Promise<Recipe[]> => {
  if (!isConfigured()) {
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 900));
    return mockFilterRecipes(query, filters);
  }
  const filterDesc = filters ? `\nFilters: ${JSON.stringify(filters)}` : '';
  const res = await callAI(
    RECIPE_RECOMMENDATION_PROMPT,
    `User query: "${query}"${filterDesc}`,
    TOKEN_LIMITS.recipeSearch
  );
  return parseJsonFromText<Recipe[]>(res);
};

export const smartSearch = async (query: string): Promise<Recipe[]> => {
  if (!isConfigured()) {
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));
    const q = query.toLowerCase();
    const r = mockRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.dietaryTags.some((t) => t.toLowerCase().includes(q)) ||
        r.cuisineType?.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
    return r.length > 0 ? r : mockRecipes.slice(0, 6);
  }
  const res = await callAI(
    SMART_SEARCH_PROMPT.replace('{query}', query),
    query,
    TOKEN_LIMITS.smartSearch
  );
  return parseJsonFromText<Recipe[]>(res);
};

export const generateMealPlan = async (preferences?: string): Promise<MealPlanDay[]> => {
  if (!isConfigured()) {
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    return mockMealPlan;
  }
  const msg = preferences
    ? `Generate a meal plan with these preferences: ${preferences}`
    : 'Generate a balanced, varied 7-day meal plan.';
  const res = await callAI(MEAL_PLAN_PROMPT, msg, TOKEN_LIMITS.mealPlan);

  try {
    const days = parseJsonFromText<MealPlanDay[]>(res);
    if (Array.isArray(days) && days.length >= 3) return days;
  } catch { /* fall through */ }

  const recovered = recoverPartialJsonArray<MealPlanDay>(res);
  if (recovered.length >= 3) {
    const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const presentDays = new Set(recovered.map((d) => d.day));
    const filler = mockMealPlan.filter((d) => !presentDays.has(d.day));
    return [...recovered, ...filler].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
  }

  return mockMealPlan;
};

// ── Assistant streaming ────────────────────────────────────────────────────

const MOCK_CHAT =
  "I'd be happy to help! 👨‍🍳\n\n" +
  "• **Temperature matters** — preheat your pan before adding ingredients.\n" +
  "• **Season in layers** — add salt at each stage of cooking.\n" +
  "• **Taste as you go** — adjust seasoning continuously.\n" +
  "• **Rest your proteins** — letting meat rest redistributes juices.\n\n" +
  "Would you like more detail on any of these? ✨";

async function* mockStream(text: string): AsyncGenerator<string> {
  for (const ch of text) {
    yield ch;
    await new Promise((r) => setTimeout(r, 12 + Math.random() * 16));
  }
}

export const streamAIResponse = async function* (
  messages: ChatMessage[],
  _recipeContext?: string,
  signal?: AbortSignal
): AsyncGenerator<string> {
  if (!isConfigured()) {
    for await (const chunk of mockStream(MOCK_CHAT)) {
      if (signal?.aborted) return;
      yield chunk;
    }
    return;
  }

  const systemMsg = _recipeContext
    ? `${ASSISTANT_SYSTEM_PROMPT}\n\nCurrent recipe context: ${_recipeContext}`
    : ASSISTANT_SYSTEM_PROMPT;

  if (AI_PROVIDER === 'claude') {
    try {
      const sdkMessages = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      for await (const chunk of streamClaude(systemMsg, sdkMessages, TOKEN_LIMITS.streaming)) {
        if (signal?.aborted) return;
        yield chunk;
      }
    } catch (err) {
      if (signal?.aborted) return;
      if (err instanceof Anthropic.APIError) {
        if (err.status === 401) showApiError('Invalid API key — check VITE_AI_API_KEY in your .env.', 'auth-err');
        else if (err.status === 429) showApiError('Rate limit hit — using demo response.', 'rate-err');
        else showApiError(`Claude API error ${err.status}. Using demo response.`, `claude-${err.status}`);
      } else {
        showApiError('AI request failed. Using demo response.', 'stream-err');
      }
      yield* mockStream(MOCK_CHAT);
    }
    return;
  }

  if (AI_PROVIDER === 'gemini') {
    try {
      const text = await callFetch(systemMsg, messages[messages.length - 1]?.content || '', TOKEN_LIMITS.streaming);
      if (signal?.aborted) return;
      yield* mockStream(text);
    } catch {
      yield* mockStream(MOCK_CHAT);
    }
    return;
  }

  const url = getApiUrl();
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      signal,
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: TOKEN_LIMITS.streaming,
        stream: true,
        messages: [
          { role: 'system', content: systemMsg },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
  } catch {
    if (signal?.aborted) return;
    yield* mockStream(MOCK_CHAT);
    return;
  }

  if (!response.ok || !response.body) {
    if (response.status === 401) showApiError('Invalid API key — check VITE_AI_API_KEY in .env.', 'auth-err');
    yield* mockStream(MOCK_CHAT);
    return;
  }

  const reader  = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer    = '';
  try {
    while (true) {
      if (signal?.aborted) { reader.cancel(); return; }
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
        try {
          const json = JSON.parse(line.slice(6));
          const text = json.choices?.[0]?.delta?.content || '';
          if (text) yield text;
        } catch { /* skip malformed */ }
      }
    }
  } catch (streamErr) {
    if (signal?.aborted) return;
    console.warn('Stream interrupted:', streamErr);
  }
};

export const chatWithAssistant = async (
  messages: ChatMessage[],
  recipeContext?: string
): Promise<string> => {
  if (!isConfigured()) {
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_CHAT;
  }
  const sys = recipeContext
    ? `${ASSISTANT_SYSTEM_PROMPT}\n\nCurrent recipe context: ${recipeContext}`
    : ASSISTANT_SYSTEM_PROMPT;
  const formatted = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
  return callAI(sys, formatted, TOKEN_LIMITS.assistantChat);
};

// ── Image analysis ─────────────────────────────────────────────────────────

export interface ImageAnalysisResult {
  detectedIngredients: string[];
  recipes: Recipe[];
}

export const analyzeImageForRecipes = async (
  imageBase64: string,
  mimeType: string
): Promise<ImageAnalysisResult> => {
  const mockFallback: ImageAnalysisResult = {
    detectedIngredients: ['tomato', 'onion', 'garlic', 'bell pepper'],
    recipes: mockRecipes.slice(0, 4),
  };

  if (!isConfigured()) {
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));
    return mockFallback;
  }

  try {
    let text = '';

    if (AI_PROVIDER === 'claude') {
      const client = getAnthropicClient();
      const response = await client.messages.create({
        model: AI_MODEL || 'claude-sonnet-4-6',
        max_tokens: TOKEN_LIMITS.imageAnalysis,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: imageBase64,
              },
            },
            { type: 'text', text: IMAGE_RECIPE_PROMPT },
          ],
        }],
      });
      const block = response.content[0];
      text = block.type === 'text' ? block.text : '';
    } else if (AI_PROVIDER === 'openai' || AI_PROVIDER === 'openrouter') {
      const res = await fetch(getApiUrl(), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: TOKEN_LIMITS.imageAnalysis,
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
              { type: 'text', text: IMAGE_RECIPE_PROMPT },
            ],
          }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      text = data.choices?.[0]?.message?.content || '';
    } else if (AI_PROVIDER === 'gemini') {
      const url = `${getApiUrl()}?key=${AI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: IMAGE_RECIPE_PROMPT },
            ],
          }],
          generationConfig: { maxOutputTokens: TOKEN_LIMITS.imageAnalysis, temperature: 0.7 },
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    if (!text) return mockFallback;
    const result = parseJsonFromText<ImageAnalysisResult>(text);
    if (!result?.recipes?.length) return mockFallback;
    return result;
  } catch {
    return mockFallback;
  }
};

export const getRecipeById  = (id: string): Recipe | undefined => mockRecipes.find((r) => r.id === id);
export const getAllRecipes   = (): Recipe[] => mockRecipes;
export const getTokenLimits = (): typeof TOKEN_LIMITS => TOKEN_LIMITS;
