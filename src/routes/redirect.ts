import { computeBotScore, hashIp } from '../lib/scoring';
import { isInAppBrowser, isChromiumBased } from '../lib/ua-parse';
import type { Env } from '../index';

export async function handleRedirect(request: Request, env: Env, slug: string): Promise<Response> {
  const link = await env.link_tracker_db
    .prepare('SELECT id, destination_url FROM links WHERE slug = ?')
    .bind(slug)
    .first<{ id: string; destination_url: string }>();

  if (!link) return new Response('Not found', { status: 404 });

  const { score: botScore, reasons } = computeBotScore(request);
  const cf = request.cf as any;
  const ua = request.headers.get('user-agent') || '';
  const rawIp = request.headers.get('cf-connecting-ip') || '';
  const ipHash = rawIp ? await hashIp(rawIp) : null;
  const inApp = isInAppBrowser(ua);

  const headerSnapshot: Record<string, string> = {};
  for (const [key, value] of request.headers.entries()) headerSnapshot[key] = value;

  const clickId = crypto.randomUUID();

  await env.link_tracker_db
    .prepare(
      `INSERT INTO click_events
       (id, link_id, timestamp, country, city, referrer, user_agent, ip_asn, bot_score,
        tcp_rtt, http_protocol, tls_version, colo, accept_language, ip_hash, raw_headers,
        is_in_app_browser, bot_score_reasons)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      clickId, link.id, Date.now(),
      cf?.country || null, cf?.city || null,
      request.headers.get('referer') || null, ua,
      cf?.asOrganization || null, botScore,
      cf?.clientTcpRtt || null, cf?.httpProtocol || null,
      cf?.tlsVersion || null, cf?.colo || null,
      request.headers.get('accept-language') || null,
      ipHash, JSON.stringify(headerSnapshot),
      inApp ? 1 : 0, JSON.stringify(reasons)
    )
    .run();

  if (isChromiumBased(ua)) {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
<script>
(async function(){
  try {
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
      const hints = await navigator.userAgentData.getHighEntropyValues(['platformVersion','model','fullVersionList']);
      fetch('/api/enrich/${clickId}', { method: 'POST', keepalive: true, headers: {'content-type':'application/json'}, body: JSON.stringify(hints) });
    }
  } catch (e) {}
  window.location.replace(${JSON.stringify(link.destination_url)});
})();
</script>
</body></html>`;
    return new Response(html, { headers: { 'content-type': 'text/html' } });
  }

  return Response.redirect(link.destination_url, 302);
}
