import type { Env } from './index';

export async function handleScheduled(env: Env): Promise<void> {
  const now = Date.now();
  const { results } = await env.link_tracker_db
    .prepare('SELECT id FROM links WHERE expires_at IS NOT NULL AND expires_at < ?')
    .bind(now)
    .all<{ id: string }>();

  for (const link of results) {
    await env.link_tracker_db.prepare('DELETE FROM click_events WHERE link_id = ?').bind(link.id).run();
    await env.link_tracker_db.prepare('DELETE FROM links WHERE id = ?').bind(link.id).run();
  }
}
