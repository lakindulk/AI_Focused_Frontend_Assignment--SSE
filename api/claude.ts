/**
 * Vercel Edge Function — proxies /api/claude/* → api.anthropic.com/*
 *
 * This replaces the Vite dev-server proxy (which only runs locally).
 * Edge runtime supports streaming responses, so SSE from Anthropic works.
 */
export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  // Handle CORS pre-flight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  const apiKey = process.env.VITE_AI_API_KEY ?? '';
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'VITE_AI_API_KEY not set on server' }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders() },
    });
  }

  // Strip the /api/claude prefix and forward the rest to Anthropic
  const url = new URL(request.url);
  const anthropicPath = url.pathname.replace(/^\/api\/claude/, '') || '/';
  const target = `https://api.anthropic.com${anthropicPath}${url.search}`;

  const upstream = await fetch(target, {
    method: request.method,
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: request.method !== 'GET' && request.method !== 'HEAD'
      ? request.body
      : undefined,
    // @ts-expect-error — duplex required for streaming request bodies
    duplex: 'half',
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      ...corsHeaders(),
    },
  });
}

function corsHeaders(): Record<string, string> {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, x-api-key, anthropic-version, anthropic-beta',
  };
}
