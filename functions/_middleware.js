// Cloudflare Pages middleware for winvest.llc.
//
// Chatwoot toggle: when CHATWOOT_ENABLED is truthy AND CHATWOOT_WEBSITE_TOKEN is set,
// inject `window.CHATWOOT_CONFIG` right before /chatwoot.js. The pages ship
// `enabled: false` with no token as the safe default, so with no env vars nothing changes.
//
// Env vars (Cloudflare Pages -> Settings -> Environment variables, per Production/Preview):
//   CHATWOOT_ENABLED        "1" to turn the widget on (anything else = off)
//   CHATWOOT_WEBSITE_TOKEN  website inbox token (never commit it)
//   CHATWOOT_BASE_URL       default https://support.suncoastservers.com

const LOADER = '<script src="/chatwoot.js"';

function chatwootConfig(env) {
  const token = String(env.CHATWOOT_WEBSITE_TOKEN || '').trim();
  const enabled = /^(1|true|yes|on)$/i.test(String(env.CHATWOOT_ENABLED || '').trim());
  if (!enabled || !token) return null;

  return {
    enabled: true,
    websiteToken: token,
    baseUrl: String(env.CHATWOOT_BASE_URL || 'https://support.suncoastservers.com').replace(/\/+$/, ''),
  };
}

export async function onRequest(context) {
  const response = await context.next();
  const config = chatwootConfig(context.env || {});
  if (!config) return response;

  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const html = await response.text();
  if (!html.includes(LOADER)) return new Response(html, response);

  const snippet = `<script>window.CHATWOOT_CONFIG = Object.assign({}, window.CHATWOOT_CONFIG || {}, ${JSON.stringify(
    config
  )});</script>\n  `;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.set('cache-control', 'no-store');

  return new Response(html.replace(LOADER, snippet + LOADER), {
    status: response.status,
    headers,
  });
}
