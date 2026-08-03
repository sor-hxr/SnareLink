function pageShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — SnareLink</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root { --bg:#0a0c10; --bg-panel:#12151b; --bg-elevated:#171b23; --border:#232733; --border-soft:#1a1e28; --fg:#c7cdd8; --fg-dim:#6b7280; --fg-bright:#f5f6f8; --accent:#5b7fff; --accent-dim:rgba(91,127,255,0.14); --good:#34d399; --good-dim:rgba(52,211,153,0.14); --danger:#f2555a; --danger-dim:rgba(242,85,90,0.14); --font-display:'Space Grotesk',sans-serif; --font-body:'Inter',sans-serif; --font-mono:'IBM Plex Mono',monospace; }
  body { background:var(--bg); color:var(--fg); font-family:var(--font-body); margin:0; padding:40px 20px; line-height:1.7; }
  .wrap { max-width:680px; margin:0 auto; }
  h1 { font-family:var(--font-display); color:var(--fg-bright); font-size:1.8rem; }
  h2 { font-family:var(--font-display); color:var(--fg-bright); font-size:1.1rem; margin-top:32px; }
  a { color:var(--accent); }
  .back { display:inline-block; margin-bottom:24px; color:var(--fg-dim); font-size:0.85rem; }
  p, li { color:var(--fg); font-size:0.92rem; }
  ul { padding-left:20px; }
  .hero-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; margin:20px 0 24px; }
  @media (max-width: 860px) { .hero-grid { grid-template-columns:1fr; gap:32px; } }
  .hero-eyebrow { font-family:var(--font-mono); font-size:0.72rem; color:var(--accent); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
  .hero-eyebrow-line { width:20px; height:1px; background:var(--accent); display:inline-block; }
  .hero-title { font-family:var(--font-display); font-weight:600; letter-spacing:-0.02em; font-size:clamp(2rem, 4vw, 2.9rem); line-height:1.1; margin:0 0 18px; color:var(--fg-bright); }
  .hero-title .line { display:block; overflow:hidden; }
  .hero-title .line span { display:inline-block; }
  .hero-accent { color:var(--accent); }
  .hero-sub { color:var(--fg-dim); font-size:1rem; line-height:1.6; max-width:440px; margin:0 0 20px; }
  .hero-features { display:flex; flex-direction:column; gap:10px; max-width:440px; }
  .hero-feature { display:flex; gap:10px; font-size:0.82rem; color:var(--fg-dim); }
  .hero-feature-icon { color:var(--accent); font-size:1.05rem; flex-shrink:0; }
  .hero-feature strong { color:var(--fg-bright); font-family:var(--font-display); font-weight:600; font-size:0.85rem; }
  .feed-panel { background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:14px; overflow:hidden; box-shadow:0 30px 70px rgba(0,0,0,0.4); }
  .feed-head { display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid var(--border-soft); background:var(--bg-elevated); }
  .feed-head-title { font-family:var(--font-mono); font-size:0.72rem; color:var(--fg-dim); text-transform:uppercase; letter-spacing:0.08em; display:flex; align-items:center; gap:8px; }
  .feed-dots { display:flex; gap:5px; }
  .feed-dots span { width:7px; height:7px; border-radius:50%; background:var(--border); }
  .feed-stat { font-family:var(--font-mono); font-size:0.72rem; color:var(--fg-dim); }
  .feed-stat b { color:var(--fg-bright); font-weight:500; }
  .feed-body { height:300px; overflow:hidden; position:relative; padding:6px 0; }
  .feed-row { display:flex; align-items:center; gap:10px; padding:9px 16px; font-family:var(--font-mono); font-size:0.78rem; border-bottom:1px solid var(--border-soft); }
  .feed-row .loc { color:var(--fg); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .feed-row .loc .ua { color:var(--fg-dim); margin-left:6px; }
  .feed-row .badge { font-size:0.68rem; padding:2px 8px; border-radius:20px; font-weight:500; flex-shrink:0; }
  .feed-row.real .badge { background:var(--good-dim); color:var(--good); }
  .feed-row.flagged { background:var(--danger-dim); }
  .feed-row.flagged .loc { color:var(--fg-dim); text-decoration:line-through; text-decoration-color:rgba(242,85,90,0.5); }
  .feed-row.flagged .badge { background:var(--danger-dim); color:var(--danger); border:1px solid rgba(242,85,90,0.3); }
  .feed-foot { padding:12px 16px; border-top:1px solid var(--border-soft); background:var(--bg-elevated); display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.72rem; color:var(--fg-dim); }
  .feed-foot .good-txt { color:var(--good); }
  .feed-foot .danger-txt { color:var(--danger); }
</style>
</head>
<body>
<div class="wrap">
<a class="back" href="/">‹ back to SnareLink</a>
${bodyHtml}
</div>
</body>
</html>`;
}

export function servePrivacy(): Response {
  return new Response(pageShell('Privacy Policy', `
<h1>Privacy Policy</h1>
<p>Last updated: ${new Date().toISOString().slice(0,10)}</p>
<p>SnareLink collects the minimum data needed to provide link tracking and bot-detection analytics.</p>
<h2>What we collect</h2>
<ul>
<li>Your email address, used only for login (magic links) and account identification.</li>
<li>For each click on your links: approximate location (country/city), device and browser type, referrer, and technical signals (TLS/HTTP version, hashed IP address) used to score click authenticity.</li>
<li>We store a one-way hash of visitor IP addresses, not the raw IP itself.</li>
</ul>
<h2>What we don't do</h2>
<ul>
<li>We don't sell or share your data with third parties for advertising.</li>
<li>We don't track visitors across sites outside of clicks on your SnareLink links.</li>
</ul>
<h2>Data retention</h2>
<p>Free-tier links and their click data are automatically deleted 7 days after creation. Paid-tier data is retained until you delete it.</p>
<h2>Your rights</h2>
<p>You can delete any link and its data at any time from your dashboard, or contact us to request full account deletion.</p>
`), { headers: { 'content-type': 'text/html' } });
}

export function serveTerms(): Response {
  return new Response(pageShell('Terms of Service', `
<h1>Terms of Service</h1>
<p>Last updated: ${new Date().toISOString().slice(0,10)}</p>
<h2>Acceptable use</h2>
<p>You may not use SnareLink to create links to phishing, malware, or other illegal or harmful content. Links reported for abuse may be disabled without notice.</p>
<h2>Free tier</h2>
<p>Free accounts are limited to 3 active links. Free-tier links expire and are permanently deleted 7 days after creation, along with their click data.</p>
<h2>Account termination</h2>
<p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
<h2>No warranty</h2>
<p>SnareLink is provided as-is, without warranty of uptime or accuracy of bot-detection scoring.</p>
`), { headers: { 'content-type': 'text/html' } });
}

export function serveAbout(): Response {
  return new Response(pageShell('About', `
<div class="hero-grid">
  <div class="hero-copy">
    <div class="hero-eyebrow"><span class="hero-eyebrow-line"></span>bot &amp; vpn detection built in</div>
    <h1 class="hero-title">
      <span class="line"><span>Know who's <span class="hero-accent">really</span></span></span>
      <span class="line"><span>clicking.</span></span>
    </h1>
    <p class="hero-sub">Every click gets scored the moment it happens — bots, VPNs, and click farms flagged automatically, so the numbers in your dashboard mean something.</p>
    <div class="hero-features">
      <div class="hero-feature"><span class="hero-feature-icon">◈</span><div><strong>Bot-aware scoring</strong><br>Every click gets a confidence score, with the exact signals behind it.</div></div>
      <div class="hero-feature"><span class="hero-feature-icon">◈</span><div><strong>Real geography &amp; device data</strong><br>Country, city, ISP, browser, OS — not just a raw click count.</div></div>
      <div class="hero-feature"><span class="hero-feature-icon">◈</span><div><strong>Your links, your name</strong><br>Claim a username, share clean branded links instantly.</div></div>
    </div>
  </div>

  <div class="feed-panel" id="feedPanel">
    <div class="feed-head">
      <div class="feed-head-title"><span class="feed-dots"><span></span><span></span><span></span></span>live click feed</div>
      <div class="feed-stat"><b id="feedTotal">0</b> today</div>
    </div>
    <div class="feed-body" id="feedBody"></div>
    <div class="feed-foot">
      <span><span class="good-txt" id="feedRealPct">—</span> real</span>
      <span><span class="danger-txt" id="feedFlaggedPct">—</span> flagged &amp; blocked</span>
    </div>
  </div>
</div>

<script>
(function () {
  const locations = [
    ['New York, US', 'Chrome / macOS'], ['London, UK', 'Safari / iOS'], ['Berlin, DE', 'Firefox / Windows'],
    ['Toronto, CA', 'Chrome / Android'], ['Sydney, AU', 'Safari / macOS'], ['Tokyo, JP', 'Chrome / Windows'],
    ['Sao Paulo, BR', 'Chrome / Android'], ['Paris, FR', 'Edge / Windows'], ['Singapore, SG', 'Safari / iOS'],
    ['Mumbai, IN', 'Chrome / Android'],
  ];
  const flaggedReasons = ['datacenter IP', 'headless UA', 'no referrer + rapid burst', 'known proxy exit node'];
  let total = 0, real = 0, flagged = 0;
  const MAX_ROWS = 7;

  function addFeedRow() {
    const feedBody = document.getElementById('feedBody');
    if (!feedBody) return;

    const isFlagged = Math.random() < 0.22;
    const [loc, ua] = locations[Math.floor(Math.random() * locations.length)];
    total++; isFlagged ? flagged++ : real++;

    const row = document.createElement('div');
    row.className = 'feed-row ' + (isFlagged ? 'flagged' : 'real');
    row.innerHTML = '<span class="loc">' + loc + '<span class="ua">' + ua + '</span></span>' +
      '<span class="badge">' + (isFlagged ? flaggedReasons[Math.floor(Math.random() * flaggedReasons.length)] : 'verified') + '</span>';
    feedBody.insertBefore(row, feedBody.firstChild);
    while (feedBody.children.length > MAX_ROWS) feedBody.removeChild(feedBody.lastChild);

    document.getElementById('feedTotal').textContent = total.toLocaleString();
    document.getElementById('feedRealPct').textContent = Math.round((real / total) * 100) + '%';
    document.getElementById('feedFlaggedPct').textContent = Math.round((flagged / total) * 100) + '%';
  }

  for (let i = 0; i < 5; i++) setTimeout(addFeedRow, i * 180);
  setInterval(addFeedRow, 1700);
})();
</script>
`), { headers: { 'content-type': 'text/html' } });
}

export function servePricing(): Response {
  return new Response(pageShell('Pricing', `
<h1>Pricing</h1>
<h2>Free</h2>
<ul>
<li>Up to 3 links</li>
<li>Links expire after 7 days</li>
<li>Full bot-detection scoring</li>
</ul>
<h2>Pro — coming soon</h2>
<ul>
<li>Unlimited links, no expiry</li>
<li>Extended click history</li>
<li>Priority support</li>
</ul>
<p>Paid plans aren't live yet — check back soon.</p>
`), { headers: { 'content-type': 'text/html' } });
}
