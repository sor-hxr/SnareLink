import { computeBotScore, hashIp } from '../lib/scoring';
import { isInAppBrowser, isChromiumBased } from '../lib/ua-parse';
import type { Env } from '../index';

export async function handleRedirect(request: Request, env: Env, username: string, slug: string): Promise<Response> {
  const link = await env.link_tracker_db
    .prepare(
      `SELECT links.id, links.destination_url, links.show_preview
       FROM links JOIN users ON links.user_id = users.id
       WHERE users.username = ? AND links.slug = ?`
    )
    .bind(username, slug)
    .first<{ id: string; destination_url: string; show_preview: number }>();

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

  if (link.show_preview) {
    const previewHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="refresh" content="3;url=${link.destination_url}">
    <style>body{background:#0a0c10;color:#c7cdd8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center}
    a{color:#5b7fff}</style></head><body>
    <div><p>Redirecting you to:</p><p><strong>${link.destination_url}</strong></p><p><a href="${link.destination_url}">Continue now</a></p></div>
    </body></html>`;
    return new Response(previewHtml, { headers: { 'content-type': 'text/html' } });
  }

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