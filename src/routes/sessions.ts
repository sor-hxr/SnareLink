import type { Env } from '../index';
import { getUserFromRequest } from '../lib/auth';

export async function handleListSessions(request: Request, env: Env): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const { results } = await env.link_tracker_db
    .prepare('SELECT id, user_agent, created_at, last_seen, expires_at FROM sessions WHERE user_id = ? ORDER BY last_seen DESC')
    .bind(user.id)
    .all<{ id: string; user_agent: string; created_at: number; last_seen: number; expires_at: number }>();

  const sessions = results.map(s => ({
    id: s.id,
    is_current: s.id === user.sessionId,
    user_agent: s.user_agent,
    created_at: s.created_at,
    last_seen: s.last_seen,
    expires_at: s.expires_at,
  }));

  return new Response(JSON.stringify({ sessions }), { headers: { 'content-type': 'application/json' } });
}

export async function handleRevokeSession(request: Request, env: Env, sessionId: string): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  await env.link_tracker_db
    .prepare('DELETE FROM sessions WHERE id = ? AND user_id = ?')
    .bind(sessionId, user.id)
    .run();

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}

export async function handleRevokeAllSessions(request: Request, env: Env): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const body = await request.json<{ include_current?: boolean }>().catch(() => ({}));

  if (body?.include_current) {
    await env.link_tracker_db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run();
  } else {
    await env.link_tracker_db
      .prepare('DELETE FROM sessions WHERE user_id = ? AND id != ?')
      .bind(user.id, user.sessionId)
      .run();
  }

  await env.link_tracker_db.prepare('DELETE FROM magic_tokens WHERE user_id = ? AND used = 0').bind(user.id).run();

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}
