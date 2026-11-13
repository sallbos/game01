/**
 * SALEH GAMING — Cloudflare Worker
 * worker/index.js
 *
 * Uses Cloudflare Workers Module Syntax (ES Modules).
 * Serves static website assets via the Workers Static Assets binding.
 * Handles routing, 404s, and safe error handling.
 */

export default {
  /**
   * Main fetch handler — called on every incoming HTTP request.
   *
   * @param {Request}     request  - The incoming Request object.
   * @param {object}      env      - Environment bindings (ASSETS, secrets, KV, etc.)
   * @param {ExecutionContext} ctx - Execution context (waitUntil, passThroughOnException)
   * @returns {Promise<Response>}
   */
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // ── 1. Security: Block non-GET/HEAD methods for static assets ──────
      if (!['GET', 'HEAD'].includes(request.method)) {
        return new Response('Method Not Allowed', {
          status: 405,
          headers: { Allow: 'GET, HEAD' },
        });
      }

      // ── 2. Redirect trailing slash (except root) ───────────────────────
      if (url.pathname !== '/' && url.pathname.endsWith('/')) {
        const canonical = new URL(request.url);
        canonical.pathname = url.pathname.slice(0, -1);
        return Response.redirect(canonical.toString(), 301);
      }

      // ── 3. Serve from the ASSETS binding (Workers Static Assets) ──────
      //    The ASSETS binding is configured in wrangler.toml as:
      //      [assets]
      //      directory = "."
      //    It serves every file in the publish directory automatically.
      if (env.ASSETS) {
        const assetResponse = await env.ASSETS.fetch(request);

        // If the asset was found, return it with extra security headers
        if (assetResponse.status !== 404) {
          return addSecurityHeaders(assetResponse, url.pathname);
        }
      }

      // ── 4. SPA fallback: return index.html for unknown paths ───────────
      //    Games are loaded in <iframe src="games/X.html"> so they always
      //    have real paths — this fallback is for direct URL navigation.
      if (env.ASSETS && !url.pathname.includes('.')) {
        const indexRequest = new Request(
          new URL('/index.html', request.url).toString(),
          request
        );
        const indexResponse = await env.ASSETS.fetch(indexRequest);
        if (indexResponse.status === 200) {
          return addSecurityHeaders(indexResponse, '/index.html');
        }
      }

      // ── 5. Offline / 404 fallback ──────────────────────────────────────
      if (env.ASSETS) {
        const offlineRequest = new Request(
          new URL('/offline.html', request.url).toString(),
          request
        );
        const offlineResponse = await env.ASSETS.fetch(offlineRequest);
        if (offlineResponse.status === 200) {
          // Return offline page with 404 status for missing assets
          const body = await offlineResponse.text();
          return new Response(body, {
            status: 404,
            headers: {
              'Content-Type': 'text/html;charset=UTF-8',
              ...securityHeadersObj(),
            },
          });
        }
      }

      // ── 6. Last-resort plain 404 ───────────────────────────────────────
      return new Response(notFoundHTML(), {
        status: 404,
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          ...securityHeadersObj(),
        },
      });

    } catch (err) {
      // ── 7. Safe error handler ──────────────────────────────────────────
      console.error('[SALEH GAMING Worker Error]', err);
      return new Response(errorHTML(err), {
        status: 500,
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns an object of security / cache response headers.
 * @param {string} [pathname] - Optional path to tailor Cache-Control.
 */
function securityHeadersObj(pathname = '') {
  // Determine cache duration based on asset type
  let cacheControl = 'public, max-age=86400'; // 1 day default

  if (pathname.startsWith('/assets/icons/') || pathname.startsWith('/assets/images/')) {
    cacheControl = 'public, max-age=31536000, immutable'; // 1 year for icons
  } else if (pathname === '/service-worker.js') {
    cacheControl = 'no-cache, no-store, must-revalidate'; // Never cache SW
  } else if (pathname === '/manifest.json') {
    cacheControl = 'public, max-age=86400';
  } else if (pathname.startsWith('/games/')) {
    // All 20 game files get 1-day cache
    cacheControl = 'public, max-age=86400';
  } else if (pathname === '/style.css' || pathname === '/script.js') {
    cacheControl = 'public, max-age=86400';
  }

  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cache-Control': cacheControl,
  };
}

/**
 * Clones a Response and injects security headers.
 * Preserves the original Content-Type and status.
 */
function addSecurityHeaders(response, pathname = '') {
  const newHeaders = new Headers(response.headers);
  const security = securityHeadersObj(pathname);

  for (const [key, value] of Object.entries(security)) {
    // Don't override Content-Type set by the asset binding
    if (key.toLowerCase() !== 'content-type' || !newHeaders.has('Content-Type')) {
      newHeaders.set(key, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/** Minimal inline 404 page HTML */
function notFoundHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>404 — SALEH GAMING</title>
  <style>
    body{background:#0a0a0f;color:#e8e8f0;font-family:system-ui,sans-serif;
         display:flex;align-items:center;justify-content:center;min-height:100vh;
         text-align:center;padding:24px}
    h1{font-size:4rem;font-weight:900;
       background:linear-gradient(135deg,#6c00ff,#00b4ff);
       -webkit-background-clip:text;-webkit-text-fill-color:transparent;
       background-clip:text}
    p{color:#8888aa;margin:12px 0 28px}
    a{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6c00ff,#0080ff);
      color:#fff;border-radius:8px;font-weight:700;text-decoration:none}
  </style>
</head>
<body>
  <div>
    <div style="font-size:4rem">⚡</div>
    <h1>404</h1>
    <p>This page doesn't exist — but 10 great games do!</p>
    <a href="/">← Back to SALEH GAMING</a>
  </div>
</body>
</html>`;
}

/** Minimal inline 500 error page HTML */
function errorHTML(err) {
  const msg = typeof err === 'object' && err.message
    ? err.message
    : 'An unexpected error occurred.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Error — SALEH GAMING</title>
  <style>
    body{background:#0a0a0f;color:#e8e8f0;font-family:system-ui,sans-serif;
         display:flex;align-items:center;justify-content:center;min-height:100vh;
         text-align:center;padding:24px}
    h1{font-size:2rem;font-weight:900;color:#ff5555}
    p{color:#8888aa;margin:8px 0 24px}
    code{background:#14141f;padding:4px 10px;border-radius:4px;font-size:0.85rem;color:#ff9955}
    a{color:#00b4ff}
  </style>
</head>
<body>
  <div>
    <div style="font-size:3rem">⚠️</div>
    <h1>Server Error</h1>
    <p><code>${msg}</code></p>
    <p><a href="/">← Return to SALEH GAMING</a></p>
  </div>
</body>
</html>`;
}
