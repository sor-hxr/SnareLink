/// <reference types="@cloudflare/workers-types" />

import { Ai } from "@cloudflare/ai";

import { handleRedirect } from './routes/redirect';
import { handleLogin, handleVerify } from './routes/auth';
import { handleChat } from './routes/chat';
import { handleListSessions, handleRevokeSession, handleRevokeAllSessions } from './routes/sessions';
import {
  handleListLinks,
  handleCreateLink,
  handleUpdateLink,
  handleDeleteLink,
  handleSetUsername,
  handleGetMe,
  handleGetLinkSummary,
  handleGetLinkClicks,
  handleGetAnalytics,
} from './routes/links';
import { handleEnrich } from './routes/enrich';
import { servePrivacy, serveTerms, serveAbout, servePricing } from './routes/pages';
import { serveDashboard } from './routes/dashboard';
import { serveManifest } from './manifest';
import { serveServiceWorker } from './sw';
import { handleScheduled } from './scheduled';

export interface Env {
  link_tracker_db: D1Database;
  RATE_LIMIT_KV: KVNamespace;
  RESEND_API_KEY: string;
  AI: Ai;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/') return serveDashboard();
    if (url.pathname === '/analytics' || url.pathname === '/account') return serveDashboard();
    if (url.pathname === '/api/login') return handleLogin(request, env);
    if (url.pathname === '/api/verify') return handleVerify(request, env);
    if (url.pathname === '/api/username') return handleSetUsername(request, env);
    if (url.pathname === '/api/me') return handleGetMe(request, env);
    if (url.pathname === '/api/chat') return handleChat(request, env);
    if (url.pathname === '/api/analytics') return handleGetAnalytics(request, env);
    if (url.pathname === '/api/sessions') return handleListSessions(request, env);
    const sessionIdMatch = url.pathname.match(/^\/api\/sessions\/([a-f0-9-]+)$/);
    if (sessionIdMatch && request.method === 'DELETE') return handleRevokeSession(request, env, sessionIdMatch[1]);
    if (url.pathname === '/api/sessions/revoke-all') return handleRevokeAllSessions(request, env);
    if (url.pathname === '/privacy') return servePrivacy();
    if (url.pathname === '/terms') return serveTerms();
    if (url.pathname === '/about') return serveAbout();
    if (url.pathname === '/pricing') return servePricing();
    if (url.pathname === '/manifest.json') return serveManifest();
    if (url.pathname === '/sw.js') return serveServiceWorker();
    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nAllow: /\nSitemap: https://snarelink.me/sitemap.xml', { headers: { 'content-type': 'text/plain' } });
    }
    if (url.pathname === '/sitemap.xml') {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://snarelink.me/</loc></url></urlset>`;
      return new Response(sitemap, { headers: { 'content-type': 'application/xml' } });
    }

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
      return request.method === 'POST'
        ? handleCreateLink(request, env)
        : handleListLinks(request, env);
    }

    const pathParts = url.pathname.slice(1).split('/');
    if (pathParts.length === 2 && pathParts[0] && pathParts[1]) {
      return handleRedirect(request, env, pathParts[0], pathParts[1]);
    }

    return new Response('Not found', { status: 404 });
  },

  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    await handleScheduled(env);
  },
};