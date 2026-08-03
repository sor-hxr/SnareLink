import type { Env } from '../index';

export async function getUserFromRequest(request: Request, env: Env): Promise<{ id: string; email: string; sessionId: string } | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) return null;

  const sessionId = match[1];

  const row = await env.link_tracker_db
    .prepare(
      `SELECT users.id as id, users.email as email, sessions.expires_at as expires_at
       FROM sessions JOIN users ON sessions.user_id = users.id
       WHERE sessions.id = ?`
    )
    .bind(sessionId)
    .first<{ id: string; email: string; expires_at: number }>();

  if (!row || row.expires_at < Date.now()) return null;

  await env.link_tracker_db
    .prepare('UPDATE sessions SET last_seen = ? WHERE id = ?')
    .bind(Date.now(), sessionId)
    .run();

  return { id: row.id, email: row.email, sessionId };
}

