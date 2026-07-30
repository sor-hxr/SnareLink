import { handleRedirect } from './routes/redirect';
import { handleLogin, handleVerify } from './routes/auth';
import {
  handleListLinks, handleCreateLink, handleUpdateLink, handleDeleteLink,
  handleGetLinkSummary, handleGetLinkClicks,
} from './routes/links';
import { handleEnrich } from './routes/enrich';
import { serveDashboard } from './routes/dashboard';
import { serveManifest } from './manifest';
import { serveServiceWorker } from './sw';

export interface Env {
  link_tracker_db: D1Database;
  RESEND_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/') return serveDashboard();
    if (url.pathname === '/api/login') return handleLogin(request, env);
    if (url.pathname === '/api/verify') return handleVerify(request, env);
    if (url.pathname === '/manifest.json') return serveManifest();
    if (url.pathname === '/sw.js') return serveServiceWorker();

    const enrichMatch = url.pathname.match(/^\/api\/enrich\/([a-f0-9-]+)$/);
    if (enrichMatch) return handleEnrich(request, env, enrichMatch[1]);

    const summaryMatch = url.pathname.match(/^\/api\/links\/([a-f0-9-]+)\/summary$/);
    if (summaryMatch) return handleGetLinkSummary(request, env, summaryMatch[1]);

    const clicksMatch = url.pathname.match(/^\/api\/links\/([a-f0-9-]+)\/clicks$/);
    if (clicksMatch) return handleGetLinkClicks(request, env, clicksMatch[1]);

    const linkIdMatch = url.pathname.match(/^\/api\/links\/([a-f0-9-]+)$/);
    if (linkIdMatch) {
      if (request.method === 'PUT') return handleUpdateLink(request, env, linkIdMatch[1]);
      if (request.method === 'DELETE') return handleDeleteLink(request, env, linkIdMatch[1]);
    }

    if (url.pathname === '/api/links') {
      return request.method === 'POST' ? handleCreateLink(request, env) : handleListLinks(request, env);
    }

    const slug = url.pathname.slice(1);
    return handleRedirect(request, env, slug);
  },
};
