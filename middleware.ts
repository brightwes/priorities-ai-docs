/**
 * Vercel Routing Middleware — optional HTTP Basic Auth for the docs site.
 *
 * When DOCS_SITE_ACCESS_PASSWORD is set (e.g. on Vercel), all routes require
 * the matching credentials. Use the same user/password you use for other
 * internal gates, or the same shared secret your team uses with Vercel
 * Deployment Protection elsewhere.
 *
 * Local `docusaurus start` does not run this middleware (Vercel-only).
 */

import { next } from '@vercel/functions/middleware';

const ACCESS_USER = process.env.DOCS_SITE_ACCESS_USER?.trim() || 'priorities';
const ACCESS_PASSWORD = process.env.DOCS_SITE_ACCESS_PASSWORD?.trim() ?? '';

function parseBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header?.startsWith('Basic ')) return null;
  try {
    const decoded = atob(header.slice(6).trim());
    const colon = decoded.indexOf(':');
    if (colon < 0) return null;
    return { user: decoded.slice(0, colon), pass: decoded.slice(colon + 1) };
  } catch {
    return null;
  }
}

export default function middleware(request: Request) {
  if (!ACCESS_PASSWORD) {
    return next();
  }

  const parsed = parseBasicAuth(request.headers.get('authorization'));
  if (parsed && parsed.user === ACCESS_USER && parsed.pass === ACCESS_PASSWORD) {
    return next();
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Priorities.ai Docs"',
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  matcher: '/:path*',
};
