import type { Env } from '../index';

export async function handleEnrich(request: Request, env: Env, clickId: string): Promise<Response> {
  const body = await request.json<{ platformVersion?: string; model?: string }>().catch(() => null);
  if (!body) return new Response(null, { status: 204 });

  const osVersion = body.platformVersion ? `v${body.platformVersion}${body.model ? ' (' + body.model + ')' : ''}` : null;
  if (osVersion) {
    await env.link_tracker_db
      .prepare('UPDATE click_events SET os_version = ? WHERE id = ?')
      .bind(osVersion, clickId)
      .run();
  }
  return new Response(null, { status: 204 });
}
