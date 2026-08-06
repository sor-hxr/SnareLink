import type { Env } from '../index';
import { getUserFromRequest } from '../lib/auth';
import { parseUserAgent } from '../lib/ua-parse';
import { isRateLimited } from '../lib/rateLimit';

const DATACENTER_HINTS = ['amazon', 'google cloud', 'microsoft azure', 'digitalocean', 'ovh', 'hetzner'];

function toRankedList(counts: Record<string, number>) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([key, count]) => ({ key, count }));
}

function normalizeUrl(url: string): string | null {
  let trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host === 'localhost' || host.startsWith('127.') || host.startsWith('10.') ||
        host.startsWith('192.168.') || host.startsWith('169.254.') || host === '0.0.0.0') {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}



export async function handleListLinks(request: Request, env: Env): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const userRow = await env.link_tracker_db
    .prepare('SELECT plan_tier FROM users WHERE id = ?')
    .bind(user.id)
    .first<{ plan_tier: string }>();

  const { results } = await env.link_tracker_db
    .prepare(
      `SELECT links.id, links.slug, links.destination_url, links.created_at, links.expires_at,
              COUNT(click_events.id) as total_clicks
       FROM links
       LEFT JOIN click_events ON click_events.link_id = links.id
       WHERE links.user_id = ?
       GROUP BY links.id
       ORDER BY links.created_at DESC`
    )
    .bind(user.id)
    .all();

  return new Response(JSON.stringify({
    links: results,
    plan_tier: userRow?.plan_tier ?? 'free',
    link_count: results.length,
  }), {
    headers: { 'content-type': 'application/json' },
  });
}

export async function handleGetMe(request: Request, env: Env): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const row = await env.link_tracker_db
    .prepare('SELECT username, plan_tier, email FROM users WHERE id = ?')
    .bind(user.id)
    .first<{ username: string | null; plan_tier: string; email: string }>();

  return new Response(JSON.stringify({
    username: row?.username ?? null,
    plan_tier: row?.plan_tier ?? 'free',
    email: row?.email ?? null,
  }), {
    headers: { 'content-type': 'application/json' },
  });
}

export async function handleSetUsername(request: Request, env: Env): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const body = await request.json<{ username?: string }>().catch(() => null);
  const username = body?.username?.trim().toLowerCase();

  if (!username || !/^[a-z0-9_-]{3,20}$/.test(username)) {
    return new Response(JSON.stringify({ error: 'Username must be 3-20 chars, letters/numbers/-/_ only' }), { status: 400 });
  }

  const existing = await env.link_tracker_db
    .prepare('SELECT id FROM users WHERE username = ?')
    .bind(username)
    .first();
  if (existing) return new Response(JSON.stringify({ error: 'Username taken' }), { status: 409 });

  await env.link_tracker_db
    .prepare('UPDATE users SET username = ? WHERE id = ?')
    .bind(username, user.id)
    .run();

  return new Response(JSON.stringify({ ok: true, username }), { headers: { 'content-type': 'application/json' } });
}

export async function handleCreateLink(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (await isRateLimited(env, `create:${ip}`, 10, 60)) {
    return new Response(JSON.stringify({ error: 'Too many attempts. Try again shortly.' }), { status: 429 });
  }

  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const userRow = await env.link_tracker_db
    .prepare('SELECT username, plan_tier FROM users WHERE id = ?')
    .bind(user.id)
    .first<{ username: string | null; plan_tier: string }>();

  if (!userRow?.username) {
    return new Response(JSON.stringify({ error: 'Set a username before creating links' }), { status: 400 });
  }

  const body = await request.json<{ slug?: string; destination_url?: string; show_preview?: boolean }>().catch(() => null);
  const slug = body?.slug?.trim();
  const destinationUrl = body?.destination_url ? normalizeUrl(body.destination_url) : null;

  if (!slug || !destinationUrl || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return new Response(JSON.stringify({ error: 'Valid slug and destination_url required' }), { status: 400 });
  }

  if (userRow.plan_tier === 'free') {
    const { results } = await env.link_tracker_db
      .prepare('SELECT COUNT(*) as count FROM links WHERE user_id = ?')
      .bind(user.id)
      .all<{ count: number }>();
    if ((results[0]?.count ?? 0) >= 3) {
      return new Response(JSON.stringify({ error: 'Free tier limit reached (3 links). Delete one or upgrade.' }), { status: 403 });
    }
  }

  const existing = await env.link_tracker_db
    .prepare('SELECT id FROM links WHERE user_id = ? AND slug = ?')
    .bind(user.id, slug)
    .first();
  if (existing) return new Response(JSON.stringify({ error: 'You already have a link with this slug' }), { status: 409 });

  const id = crypto.randomUUID();
  const expiresAt = userRow.plan_tier === 'free' ? Date.now() + 7 * 24 * 60 * 60 * 1000 : null;

  await env.link_tracker_db
    .prepare('INSERT INTO links (id, user_id, slug, destination_url, created_at, show_preview, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, user.id, slug, destinationUrl, Date.now(), body?.show_preview ? 1 : 0, expiresAt)
    .run();

  return new Response(JSON.stringify({ ok: true, id, slug, username: userRow.username }), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
}

export async function handleUpdateLink(request: Request, env: Env, linkId: string): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const body = await request.json<{ destination_url?: string }>().catch(() => null);
  const destinationUrl = body?.destination_url ? normalizeUrl(body.destination_url) : null;
  if (!destinationUrl) {
    return new Response(JSON.stringify({ error: 'destination_url required' }), { status: 400 });
  }

  const result = await env.link_tracker_db
    .prepare('UPDATE links SET destination_url = ? WHERE id = ? AND user_id = ?')
    .bind(destinationUrl, linkId, user.id)
    .run();

  if (result.meta.changes === 0) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}

export async function handleDeleteLink(request: Request, env: Env, linkId: string): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const link = await env.link_tracker_db
    .prepare('SELECT id FROM links WHERE id = ? AND user_id = ?')
    .bind(linkId, user.id)
    .first();
  if (!link) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  await env.link_tracker_db.prepare('DELETE FROM click_events WHERE link_id = ?').bind(linkId).run();
  await env.link_tracker_db.prepare('DELETE FROM links WHERE id = ?').bind(linkId).run();

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}

export async function handleGetLinkSummary(request: Request, env: Env, linkId: string): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const link = await env.link_tracker_db
    .prepare('SELECT id, slug, destination_url FROM links WHERE id = ? AND user_id = ?')
    .bind(linkId, user.id)
    .first<{ id: string; slug: string; destination_url: string }>();
  if (!link) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  const { results } = await env.link_tracker_db
    .prepare(
      `SELECT timestamp, country, city, user_agent, ip_asn, ip_hash, bot_score, referrer, http_protocol, tls_version
       FROM click_events WHERE link_id = ? ORDER BY timestamp ASC`
    )
    .bind(linkId)
    .all<{
      timestamp: number; country: string | null; city: string | null;
      user_agent: string | null; ip_asn: string | null; ip_hash: string | null;
      bot_score: number | null; referrer: string | null; http_protocol: string | null; tls_version: string | null;
    }>();

  const clicks = results;
  const totalClicks = clicks.length;
  const uniqueVisitors = new Set(clicks.map(c => c.ip_hash).filter(Boolean)).size;
  const avgBotScore = totalClicks
    ? Math.round(clicks.reduce((sum, c) => sum + (c.bot_score ?? 0), 0) / totalClicks)
    : 0;
  const scoreBuckets = { high: 0, medium: 0, low: 0, critical: 0 };
  const protocolCounts: Record<string, number> = {};
  const tlsCounts: Record<string, number> = {};

  const countryCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};
  let vpnCount = 0;

  for (const c of clicks) {
    const s = c.bot_score ?? 0;
    if (s >= 70) scoreBuckets.high++; else if (s >= 40) scoreBuckets.medium++; else if (s >= 20) scoreBuckets.low++; else scoreBuckets.critical++;

    const country = c.country || 'Unknown';
    countryCounts[country] = (countryCounts[country] || 0) + 1;

    const p = c.http_protocol || 'Unknown';
    protocolCounts[p] = (protocolCounts[p] || 0) + 1;
    const t = c.tls_version || 'Unknown';
    tlsCounts[t] = (tlsCounts[t] || 0) + 1;

    const { browser, os } = parseUserAgent(c.user_agent || '');
    const deviceKey = `${browser} / ${os}`;
    deviceCounts[deviceKey] = (deviceCounts[deviceKey] || 0) + 1;

    let ref = 'Direct';
    if (c.referrer) {
      try { ref = new URL(c.referrer).hostname; } catch { ref = c.referrer; }
    }
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;

    const asOrg = (c.ip_asn || '').toLowerCase();
    if (DATACENTER_HINTS.some(h => asOrg.includes(h))) vpnCount++;
  }

  const trendMap: Record<string, number> = {};
  for (const c of clicks) {
    const day = new Date(c.timestamp).toISOString().slice(0, 10);
    trendMap[day] = (trendMap[day] || 0) + 1;
  }
  const trend = Object.entries(trendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({ day, count }));

  return new Response(JSON.stringify({
    slug: link.slug,
    destination_url: link.destination_url,
    total_clicks: totalClicks,
    unique_visitors: uniqueVisitors,
    avg_bot_score: avgBotScore,
    vpn_count: vpnCount,
    score_buckets: scoreBuckets,
    top_countries: toRankedList(countryCounts).slice(0, 8),
    protocol_breakdown: toRankedList(protocolCounts),
    tls_breakdown: toRankedList(tlsCounts),
    devices: toRankedList(deviceCounts).slice(0, 8),
    referrers: toRankedList(referrerCounts).slice(0, 8),
    trend,
  }), { headers: { 'content-type': 'application/json' } });
}

export async function handleGetLinkClicks(request: Request, env: Env, linkId: string): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const link = await env.link_tracker_db
    .prepare('SELECT id FROM links WHERE id = ? AND user_id = ?')
    .bind(linkId, user.id)
    .first();
  if (!link) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  const { results } = await env.link_tracker_db
    .prepare(
      `SELECT timestamp, country, city, user_agent, bot_score, referrer, ip_asn, ip_hash,
              os_version, is_in_app_browser, bot_score_reasons, colo, tls_version, http_protocol, raw_headers
       FROM click_events WHERE link_id = ? ORDER BY timestamp DESC LIMIT 100`
    )
    .bind(linkId)
    .all<any>();

  const chronological = [...results].sort((a, b) => a.timestamp - b.timestamp);
  const visitCountMap: Record<string, number> = {};
  const visitNumByKey: Record<string, number> = {};
  for (const c of chronological) {
    const key = c.ip_hash || 'unknown';
    visitCountMap[key] = (visitCountMap[key] || 0) + 1;
    visitNumByKey[`${key}:${c.timestamp}`] = visitCountMap[key];
  }

  const enriched = results.map(c => {
    const asOrg = c.ip_asn || 'Unknown';
    const isVpn = DATACENTER_HINTS.some(h => asOrg.toLowerCase().includes(h));
    const { browser, os, device } = parseUserAgent(c.user_agent || '');
    const visitNumber = visitNumByKey[`${c.ip_hash || 'unknown'}:${c.timestamp}`] || 1;

    return {
      timestamp: c.timestamp, country: c.country, city: c.city,
      isp: asOrg, is_vpn: isVpn, browser, os,
      os_version: c.os_version || null,
      device, is_in_app_browser: !!c.is_in_app_browser,
      bot_score: c.bot_score, referrer: c.referrer, visit_number: visitNumber,
      reasons: c.bot_score_reasons ? JSON.parse(c.bot_score_reasons) : [],
      colo: c.colo, tls_version: c.tls_version, http_protocol: c.http_protocol,
      raw_headers: c.raw_headers ? JSON.parse(c.raw_headers) : {},
    };
  });

  return new Response(JSON.stringify({ clicks: enriched }), { headers: { 'content-type': 'application/json' } });
}

export async function handleGetAnalytics(request: Request, env: Env): Promise<Response> {
  const user = await getUserFromRequest(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

  const { results: clicks } = await env.link_tracker_db
  .prepare(
    `SELECT click_events.bot_score, click_events.country, click_events.ip_asn, click_events.timestamp,
            click_events.user_agent, click_events.http_protocol, click_events.tls_version
     FROM click_events JOIN links ON click_events.link_id = links.id
     WHERE links.user_id = ?`
  )
    .bind(user.id)
    .all<{ bot_score: number | null; country: string | null; ip_asn: string | null; timestamp: number; user_agent: string | null; http_protocol: string | null; tls_version: string | null }>();

  const { results: linkRows } = await env.link_tracker_db
    .prepare('SELECT COUNT(*) as count FROM links WHERE user_id = ?')
    .bind(user.id)
    .all<{ count: number }>();

  const totalClicks = clicks.length;
  const avgBotScore = totalClicks ? Math.round(clicks.reduce((s, c) => s + (c.bot_score ?? 0), 0) / totalClicks) : 0;
  const datacenterHints = ['amazon', 'google cloud', 'microsoft azure', 'digitalocean', 'ovh', 'hetzner'];
  const vpnCount = clicks.filter(c => datacenterHints.some(h => (c.ip_asn || '').toLowerCase().includes(h))).length;
  const scoreBuckets = { high: 0, medium: 0, low: 0, critical: 0 };
  const protocolCounts: Record<string, number> = {};
  const tlsCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = {};

  for (const c of clicks) {
    const s = c.bot_score ?? 0;
    if (s >= 70) scoreBuckets.high++; else if (s >= 40) scoreBuckets.medium++; else if (s >= 20) scoreBuckets.low++; else scoreBuckets.critical++;

    const p = c.http_protocol || 'Unknown';
    protocolCounts[p] = (protocolCounts[p] || 0) + 1;
    const t = c.tls_version || 'Unknown';
    tlsCounts[t] = (tlsCounts[t] || 0) + 1;

    const { browser, os } = parseUserAgent(c.user_agent || '');
    const deviceKey = `${browser} / ${os}`;
    deviceCounts[deviceKey] = (deviceCounts[deviceKey] || 0) + 1;
  }

  const countryCounts: Record<string, number> = {};
  for (const c of clicks) {
    const k = c.country || 'Unknown';
    countryCounts[k] = (countryCounts[k] || 0) + 1;
  }
  const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([key, count]) => ({ key, count }));

  const trendMap: Record<string, number> = {};
  for (const c of clicks) {
    const day = new Date(c.timestamp).toISOString().slice(0, 10);
    trendMap[day] = (trendMap[day] || 0) + 1;
  }
  const trend = Object.entries(trendMap).sort(([a], [b]) => a.localeCompare(b)).map(([day, count]) => ({ day, count }));

  return new Response(JSON.stringify({
    total_links: linkRows[0]?.count ?? 0,
    total_clicks: totalClicks,
    avg_bot_score: avgBotScore,
    vpn_count: vpnCount,
    score_buckets: scoreBuckets,
    devices: toRankedList(deviceCounts),
    top_countries: topCountries,
    protocol_breakdown: toRankedList(protocolCounts),
    tls_breakdown: toRankedList(tlsCounts),
    trend,
  }), { headers: { 'content-type': 'application/json' } });
}