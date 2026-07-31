export function serveDashboard(): Response {
  return new Response(DASHBOARD_HTML, { headers: { 'content-type': 'text/html' } });
}

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0a0c10">
<link rel="apple-touch-icon" href="/icon-192.png">
<title>SnareLink</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0c10;
    --bg-panel: #12151b;
    --bg-elevated: #171b23;
    --bg-hover: #1b202a;
    --border: #232733;
    --border-soft: #1a1e28;
    --fg: #c7cdd8;
    --fg-dim: #6b7280;
    --fg-bright: #f5f6f8;
    --accent: #5b7fff;
    --accent-dim: rgba(91, 127, 255, 0.14);
    --accent-line: rgba(91, 127, 255, 0.35);
    --amber: #e8a33d;
    --amber-dim: rgba(232, 163, 61, 0.14);
    --danger: #f2555a;
    --danger-dim: rgba(242, 85, 90, 0.14);
    --good: #34d399;
    --good-dim: rgba(52, 211, 153, 0.14);
    --radius: 10px;
    --font-display: 'Space Grotesk', system-ui, sans-serif;
    --font-body: 'Inter', system-ui, sans-serif;
    --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
  }
  * { box-sizing: border-box; }
  body {
    background: var(--bg);
    background-image: radial-gradient(circle at 15% 0%, rgba(91,127,255,0.06), transparent 45%);
    color: var(--fg);
    font-family: var(--font-body);
    margin: 0;
    padding: 32px 24px 64px;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  .container { max-width: 960px; margin: 0 auto; }

  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand-mark { display: flex; align-items: flex-end; gap: 2px; height: 16px; }
  .brand-mark span { width: 4px; background: var(--accent); border-radius: 1px; display: block; }
  .brand-mark span:nth-child(1) { height: 6px; }
  .brand-mark span:nth-child(2) { height: 11px; }
  .brand-mark span:nth-child(3) { height: 16px; opacity: 0.55; }
  .brand-name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.15rem;
    color: var(--fg-bright);
    letter-spacing: -0.01em;
  }
  .live-pill {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.72rem; color: var(--fg-dim);
    text-transform: uppercase; letter-spacing: 0.08em;
    font-family: var(--font-mono);
  }
  .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--good); box-shadow: 0 0 0 0 rgba(52,211,153,0.6); animation: pulse 2s infinite; }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(52,211,153,0.5); }
    70% { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
    100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
  }

  h2 {
    font-family: var(--font-display);
    color: var(--fg-bright);
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0;
  }

  input, button, select {
    font-family: var(--font-body);
    background: var(--bg-elevated);
    color: var(--fg-bright);
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 11px 13px;
    font-size: 0.9rem;
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  input { width: 100%; margin-bottom: 10px; }
  input::placeholder { color: var(--fg-dim); }
  input:focus, button:focus, select:focus {
    outline: none; border-color: var(--accent-line);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }
  button {
    cursor: pointer;
    font-weight: 500;
    color: var(--fg-bright);
    background: var(--accent);
    border-color: var(--accent);
    letter-spacing: 0.01em;
  }
  button:hover { background: #4a6bf0; border-color: #4a6bf0; }
  button.secondary { background: transparent; color: var(--fg); border-color: var(--border); }
  button.secondary:hover { background: var(--bg-hover); color: var(--fg-bright); }
  button.danger { background: transparent; color: var(--danger); border-color: rgba(242,85,90,0.35); }
  button.danger:hover { background: var(--danger-dim); border-color: var(--danger); }

  .box {
    background: var(--bg-panel);
    border: 1px solid var(--border-soft);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 16px;
  }
  .box > h2 { margin-bottom: 14px; }

  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid var(--border-soft); font-size: 0.85rem; }
  td { font-family: var(--font-mono); font-size: 0.8rem; color: var(--fg); }
  th { color: var(--fg-dim); text-transform: uppercase; font-size: 0.68rem; letter-spacing: 0.06em; font-weight: 500; font-family: var(--font-body); }
  th.num, td.num { text-align: right; }
  td.num { font-variant-numeric: tabular-nums; }
  tr:last-child td { border-bottom: none; }
  tr.link-row { cursor: pointer; }
  tr.link-row:hover td { background: var(--bg-hover); }
  tr.vpn-row td:first-child { box-shadow: inset 3px 0 0 var(--amber); }
  .msg { color: var(--fg-dim); font-size: 0.82rem; margin-top: 8px; }
  .msg.error { color: var(--danger); }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  #dashboard, #detail { display: none; }

  /* stat cards */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 16px; }
  .stat-card { background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: var(--radius); padding: 16px; }
  .stat-card .val { font-family: var(--font-display); font-size: 1.7rem; font-weight: 600; color: var(--fg-bright); font-variant-numeric: tabular-nums; }
  .stat-card.warn .val { color: var(--amber); }
  .stat-card .lbl { font-size: 0.72rem; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 6px; }
  .gauge-track { height: 4px; background: var(--bg-elevated); border-radius: 2px; margin-top: 12px; overflow: hidden; }
  .gauge-fill { height: 100%; background: var(--accent); border-radius: 2px; }
  .stat-card.warn .gauge-fill { background: var(--amber); }

  .badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 500; }
  .badge.good { background: var(--good-dim); color: var(--good); }
  .badge.warn { background: var(--amber-dim); color: var(--amber); }
  .badge.bad { background: var(--danger-dim); color: var(--danger); }

  /* proportional ranked bar lists */
  .ranked-list { list-style: none; padding: 0; margin: 0; }
  .ranked-list li { padding: 9px 0; border-bottom: 1px solid var(--border-soft); }
  .ranked-list li:last-child { border-bottom: none; }
  .rank-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.85rem; margin-bottom: 6px; gap: 10px; }
  .rank-label { color: var(--fg); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rank-value { font-family: var(--font-mono); color: var(--fg-bright); font-size: 0.78rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .rank-pct { color: var(--fg-dim); }
  .rank-bar-track { height: 5px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden; }
  .rank-bar-fill { height: 100%; background: var(--accent); border-radius: 3px; }

  .panels-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 700px) { .panels-grid { grid-template-columns: 1fr; } }

  /* trend chart */
  .chart-box { grid-column: 1 / -1; }
  .chart-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .chart-total { font-family: var(--font-mono); color: var(--fg-dim); font-size: 0.78rem; }
  .chart-wrap { position: relative; }
  .trend-svg { width: 100%; height: auto; overflow: visible; }
  .grid-line { stroke: var(--border-soft); stroke-width: 1; }
  .axis-label { fill: var(--fg-dim); font-size: 10px; font-family: var(--font-mono); }
  .trend-line { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
  .chart-dot { fill: var(--bg-panel); stroke: var(--accent); stroke-width: 2; opacity: 0; transition: opacity 0.1s ease; }
  .chart-dot.active { opacity: 1; }
  .chart-tooltip {
    position: absolute; pointer-events: none; background: var(--bg-elevated);
    border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px;
    font-size: 0.72rem; line-height: 1.4; color: var(--fg-bright); white-space: nowrap;
    box-shadow: 0 4px 14px rgba(0,0,0,0.35); transform: translateY(-100%);
  }
  .chart-tooltip span { color: var(--fg-dim); }

  /* score cell (click log) */
  .score-cell { display: flex; align-items: center; gap: 8px; }
  .score-track { width: 46px; height: 5px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden; }
  .score-fill { height: 100%; border-radius: 3px; }
  .score-fill.good { background: var(--good); }
  .score-fill.warn { background: var(--amber); }
  .score-fill.bad { background: var(--danger); }
  .score-num { font-family: var(--font-mono); font-size: 0.78rem; width: 20px; text-align: right; font-variant-numeric: tabular-nums; }
  .score-num.good { color: var(--good); }
  .score-num.warn { color: var(--amber); }
  .score-num.bad { color: var(--danger); }

  .back-link { display: inline-flex; align-items: center; gap: 4px; margin-bottom: 14px; color: var(--fg-dim); font-size: 0.85rem; cursor: pointer; }
  .back-link:hover { color: var(--fg-bright); text-decoration: none; }
  .link-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; }
  .link-header .actions { display: flex; gap: 8px; }
  .link-header .slug { font-family: var(--font-display); font-weight: 600; color: var(--fg-bright); font-size: 1.2rem; }
  .link-header .dest { color: var(--fg-dim); font-size: 0.8rem; word-break: break-all; margin-top: 4px; font-family: var(--font-mono); }

  .empty { color: var(--fg-dim); text-align: center; padding: 36px; font-size: 0.85rem; }

  .login-box { max-width: 380px; margin: 80px auto 0; text-align: center; }
  .login-box .brand { justify-content: center; margin-bottom: 20px; }
  .login-box p { color: var(--fg-dim); font-size: 0.88rem; margin: 0 0 18px; }

  @media (max-width: 600px) {
    body { padding: 16px 14px 48px; }
    .brand-name { font-size: 1.05rem; }
    input, button { font-size: 0.85rem; }
    table { display: block; overflow-x: auto; white-space: nowrap; }
    th, td { padding: 7px; font-size: 0.75rem; }
    .box { padding: 14px; }
  }

  .click-row { cursor: pointer; }
  .click-row:hover td { background: var(--bg-hover); }
  .overlay { position: fixed; inset: 0; background: rgba(5,7,10,0.7); display: none; align-items: flex-start; justify-content: flex-end; z-index: 50; }
  .panel { background: var(--bg-panel); border-left: 1px solid var(--border); width: 420px; max-width: 92vw; height: 100vh; overflow-y: auto; padding: 22px; }
  .panel-close { cursor: pointer; color: var(--fg-dim); float: right; }
  .panel-close:hover { color: var(--fg-bright); }
  .panel-section { margin-bottom: 20px; }
  .panel-section h3 { font-family: var(--font-display); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--fg-dim); margin: 0 0 8px; }
  .panel-row { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 5px 0; border-bottom: 1px solid var(--border-soft); }
  .panel-row:last-child { border-bottom: none; }
  .panel-row .k { color: var(--fg-dim); }
  .panel-row .v { color: var(--fg-bright); font-family: var(--font-mono); text-align: right; }
  .reason-list { list-style: none; padding: 0; margin: 8px 0 0; }
  .reason-list li { font-size: 0.78rem; color: var(--fg-dim); padding: 3px 0; }
  .raw-toggle { color: var(--accent); font-size: 0.78rem; cursor: pointer; margin-top: 8px; }
  .raw-dump { display: none; background: var(--bg-elevated); border-radius: 6px; padding: 10px; margin-top: 8px; font-family: var(--font-mono); font-size: 0.7rem; color: var(--fg-dim); white-space: pre-wrap; word-break: break-all; max-height: 200px; overflow-y: auto; }
</style>
</head>
<body>
<div class="container">
  <div class="topbar">
    <div class="brand">
      <span class="brand-mark"><span></span><span></span><span></span></span>
      <span class="brand-name">SnareLink</span>
    </div>
    <div class="live-pill"><span class="live-dot"></span>tracking</div>
  </div>

  <div id="login">
    <div class="box login-box">
      <div class="brand"><span class="brand-mark"><span></span><span></span><span></span></span><span class="brand-name">SnareLink</span></div>
      <p>Sign in to manage your links</p>
      <input type="email" id="email" placeholder="you@domain.com" />
      <button onclick="login()" style="width:100%">Send login link</button>
      <div id="loginMsg" class="msg"></div>
    </div>
  </div>

  <div id="usernamePrompt" class="box" style="display:none"><h2>Choose a username</h2><input id="usernameInput" placeholder="yourname" /><button onclick="claimUsername()">Claim</button><div id="usernameMsg" class="msg"></div></div>

  <div id="dashboard">
    <div class="box">
      <h2>Create link</h2>
      <div id="freeTierMsg" class="msg" style="display:none"></div>
      <div style="margin-top:14px">
        <input id="slug" placeholder="custom-slug" />
        <input id="destUrl" placeholder="https://destination-url.com" />
        <label style="display:flex; align-items:center; gap:8px; margin: 4px 0 10px; font-size:0.85rem; color: var(--fg);">
          <input type="checkbox" id="showPreview" style="width:auto; margin:0" />
          <span>Show a preview page before redirecting</span>
        </label>
        <button onclick="createLink()">Create</button>
        <div id="createMsg" class="msg"></div>
      </div>
    </div>

    <div class="box">
      <h2>Your links</h2>
      <table id="linksTable">
        <thead><tr><th>Slug</th><th>Destination</th><th class="num">Clicks</th><th>Created</th><th>Link</th></tr></thead>
        <tbody id="linksBody"></tbody>
      </table>
      <div id="linksEmpty" class="empty" style="display:none">No links yet — create one above.</div>
    </div>
  </div>

  <div id="detail">
    <div class="back-link" onclick="backToList()">‹ back to links</div>
    <div class="box">
      <div class="link-header">
        <div>
          <div class="slug" id="detailSlug"></div>
          <div class="dest" id="detailDest"></div>
        </div>
        <div class="actions">
          <button class="secondary" onclick="startEdit()">Edit</button>
          <button class="danger" onclick="confirmDelete()">Delete</button>
        </div>
      </div>
      <div id="editBox" style="display:none; margin-top:14px;">
        <input id="editDestUrl" placeholder="new destination URL" />
        <button onclick="saveEdit()">Save</button>
        <div id="editMsg" class="msg"></div>
      </div>
    </div>

    <div class="stat-grid" id="statGrid"></div>

    <div class="panels-grid">
      <div class="box chart-box">
        <div class="chart-head"><h2>Click trend</h2><span class="chart-total" id="trendTotal"></span></div>
        <div class="chart-wrap" id="trendChartWrap"></div>
      </div>
      <div class="box"><h2>Top locations</h2><ul class="ranked-list" id="countryList"></ul></div>
      <div class="box"><h2>Devices & browsers</h2><ul class="ranked-list" id="deviceList"></ul></div>
      <div class="box"><h2>Referrers</h2><ul class="ranked-list" id="referrerList"></ul></div>
    </div>

    <div class="box">
      <h2>Click log</h2>
      <table>
        <thead><tr><th>Time</th><th>Location</th><th>Browser/OS</th><th>ISP</th><th class="num">Visit</th><th class="num">Score</th></tr></thead>
        <tbody id="clicksBody"></tbody>
      </table>
    </div>
  </div>

  <div class="overlay" id="clickOverlay" onclick="if(event.target===this)closeClickPanel()">
    <div class="panel">
      <span class="panel-close" onclick="closeClickPanel()">✕ close</span>
      <div id="clickPanelBody"></div>
    </div>
  </div>

  <div class="overlay" id="deleteOverlay" onclick="if(event.target===this)hideDeleteOverlay()">
    <div class="panel">
      <span class="panel-close" onclick="hideDeleteOverlay()">✕ close</span>
      <div class="panel-section">
        <h3>Delete link</h3>
        <div id="deleteConfirmText" style="margin-bottom:10px; color:var(--fg-bright); font-size:0.85rem;"></div>
        <input id="deleteConfirmInput" placeholder="Type the slug to confirm deletion" />
        <div id="deleteConfirmMsg" class="msg"></div>
        <div style="display:flex; gap:8px; margin-top:12px;">
          <button class="secondary" onclick="hideDeleteOverlay()">Cancel</button>
          <button class="danger" onclick="executeDelete()">Delete</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let currentLinkId = null;
let currentUsername = null;
let currentPlanTier = null;
let currentLinkCount = 0;
let currentDeleteSlug = null;

function formatNumber(n) { return Number(n || 0).toLocaleString(); }

async function login() {
  const email = document.getElementById('email').value;
  const msg = document.getElementById('loginMsg');
  msg.textContent = 'sending...';
  msg.className = 'msg';
  try {
    const res = await fetch('/api/login', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    msg.textContent = res.ok ? data.message : (data.error || 'failed');
    msg.className = res.ok ? 'msg' : 'msg error';
  } catch (e) { msg.textContent = 'network error'; msg.className = 'msg error'; }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

async function createLink() {
  const slug = document.getElementById('slug').value;
  const destination_url = document.getElementById('destUrl').value;
  const show_preview = document.getElementById('showPreview').checked;
  const msg = document.getElementById('createMsg');
  try {
    const res = await fetch('/api/links', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug, destination_url, show_preview }),
    });
    const data = await res.json();
    msg.textContent = res.ok ? 'created: /' + data.slug : (data.error || 'failed');
    msg.className = res.ok ? 'msg' : 'msg error';
    if (res.ok) { document.getElementById('slug').value = ''; document.getElementById('destUrl').value = ''; loadLinks(); }
  } catch (e) { msg.textContent = 'network error'; msg.className = 'msg error'; }
}

async function claimUsername() {
  const usernameInput = document.getElementById('usernameInput');
  const msg = document.getElementById('usernameMsg');
  try {
    const res = await fetch('/api/username', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: usernameInput.value }),
    });
    const data = await res.json();
    if (res.ok) {
      msg.textContent = '';
      msg.className = 'msg';
      await loadLinks();
    } else {
      msg.textContent = data.error || 'failed';
      msg.className = 'msg error';
    }
  } catch (e) {
    msg.textContent = 'network error';
    msg.className = 'msg error';
  }
}

async function loadLinks() {
  const meRes = await fetch('/api/me');
  if (!meRes.ok) {
    currentUsername = null;
    currentPlanTier = null;
    currentLinkCount = 0;
    document.getElementById('login').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('detail').style.display = 'none';
    document.getElementById('usernamePrompt').style.display = 'none';
    return;
  }

  const me = await meRes.json();
  currentUsername = me.username;
  currentPlanTier = me.plan_tier;

  document.getElementById('login').style.display = 'none';

  if (!currentUsername) {
    document.getElementById('usernamePrompt').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('detail').style.display = 'none';
    document.getElementById('usernameMsg').textContent = '';
    document.getElementById('usernameMsg').className = 'msg';
    document.getElementById('freeTierMsg').style.display = 'none';
    return;
  }

  const res = await fetch('/api/links');
  if (!res.ok) {
    currentLinkCount = 0;
    document.getElementById('login').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('detail').style.display = 'none';
    document.getElementById('usernamePrompt').style.display = 'none';
    return;
  }

  const data = await res.json();
  currentLinkCount = data.link_count || 0;

  document.getElementById('usernamePrompt').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('detail').style.display = 'none';

  const freeTierMsg = document.getElementById('freeTierMsg');
  if (data.plan_tier === 'free') {
    freeTierMsg.textContent = data.link_count + ' of 3 free links used';
    freeTierMsg.style.display = 'block';
  } else {
    freeTierMsg.textContent = '';
    freeTierMsg.style.display = 'none';
  }

  const body = document.getElementById('linksBody');
  body.innerHTML = '';
  document.getElementById('linksEmpty').style.display = data.links.length ? 'none' : 'block';

  for (const link of data.links) {
    const tr = document.createElement('tr');
    tr.className = 'link-row';
    const created = new Date(link.created_at).toLocaleDateString();
    const copyOnclick = "event.stopPropagation(); copyLink('" + (currentUsername || '') + "', '" + link.slug + "')";
    tr.innerHTML = '<td>/' + link.slug + '</td><td>' + link.destination_url.slice(0, 40) +
      '</td><td class="num">' + formatNumber(link.total_clicks) + '</td><td>' + created + '</td>' +
      '<td><button onclick="' + copyOnclick + '">Copy</button></td>';
    tr.onclick = () => openDetail(link.id);
    body.appendChild(tr);
  }
}

function copyLink(username, slug) {
  const url = 'https://snarelink.me/' + username + '/' + slug;
  navigator.clipboard.writeText(url).then(() => {
    alert('Copied: ' + url);
  }).catch(() => {
    prompt('Copy this link:', url);
  });
}

function backToList() { loadLinks(); }

function scoreClass(score) { return score >= 70 ? 'good' : score >= 40 ? 'warn' : 'bad'; }

function scoreCell(score) {
  const s = score ?? 0;
  const cls = scoreClass(s);
  return '<div class="score-cell"><div class="score-track"><div class="score-fill ' + cls + '" style="width:' + s + '%"></div></div>' +
    '<span class="score-num ' + cls + '">' + s + '</span></div>';
}

async function openDetail(linkId) {
  currentLinkId = linkId;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('detail').style.display = 'block';
  document.getElementById('editBox').style.display = 'none';

  const [summaryRes, clicksRes] = await Promise.all([
    fetch('/api/links/' + linkId + '/summary'),
    fetch('/api/links/' + linkId + '/clicks'),
  ]);
  const summary = await summaryRes.json();
  const clicksData = await clicksRes.json();

  document.getElementById('detailSlug').textContent = currentUsername + '/' + summary.slug;
  document.getElementById('detailDest').textContent = summary.destination_url;

  const botScoreClass = summary.avg_bot_score >= 70 ? '' : 'warn';
  document.getElementById('statGrid').innerHTML =
    statCard(summary.total_clicks, 'Total clicks') +
    statCard(summary.unique_visitors, 'Unique visitors') +
    gaugeCard(summary.avg_bot_score, 'Avg bot score', 100, botScoreClass) +
    gaugeCard(summary.vpn_count, 'VPN/proxy clicks', Math.max(1, summary.total_clicks), summary.vpn_count > 0 ? 'warn' : '');

  renderTrend(summary.trend || []);

  document.getElementById('countryList').innerHTML = rankedList(summary.top_countries);
  document.getElementById('deviceList').innerHTML = rankedList(summary.devices);
  document.getElementById('referrerList').innerHTML = rankedList(summary.referrers);

  window.currentClicks = clicksData.clicks;
  const clicksBody = document.getElementById('clicksBody');
  clicksBody.innerHTML = clicksData.clicks.map((c, i) => {
    const time = new Date(c.timestamp).toLocaleString();
    const loc = (c.city || '?') + ', ' + (c.country || '?');
    const vpnTag = c.is_vpn ? ' <span class="badge warn">VPN</span>' : '';
    const inAppTag = c.is_in_app_browser ? ' <span class="badge warn">IN-APP</span>' : '';
    return '<tr class="click-row ' + (c.is_vpn ? 'vpn-row' : '') + '" onclick="openClickPanel(' + i + ')"><td>' + time + '</td><td>' + loc + '</td><td>' + c.browser + ' / ' + c.os + (c.os_version ? ' ' + c.os_version : '') + inAppTag + '</td>' +
      '<td>' + c.isp + vpnTag + '</td><td class="num">#' + c.visit_number + '</td><td class="num">' + scoreCell(c.bot_score) + '</td></tr>';
  }).join('') || '<tr><td colspan="6" class="empty">no clicks yet</td></tr>';
}

function statCard(val, label, extraClass) {
  return '<div class="stat-card ' + (extraClass || '') + '"><div class="val">' + formatNumber(val) + '</div><div class="lbl">' + label + '</div></div>';
}

function gaugeCard(val, label, max, extraClass) {
  const pct = Math.max(0, Math.min(100, (val / max) * 100));
  return '<div class="stat-card ' + (extraClass || '') + '">' +
    '<div class="val">' + formatNumber(val) + '</div><div class="lbl">' + label + '</div>' +
    '<div class="gauge-track"><div class="gauge-fill" style="width:' + pct + '%"></div></div></div>';
}

function rankedList(items) {
  if (!items || !items.length) return '<li class="empty">no data</li>';
  const max = Math.max(...items.map(i => i.count));
  const total = items.reduce((s, i) => s + i.count, 0);
  return items.map(i => {
    const w = max > 0 ? (i.count / max) * 100 : 0;
    const pct = total > 0 ? Math.round((i.count / total) * 100) : 0;
    return '<li>' +
      '<div class="rank-row"><span class="rank-label">' + i.key + '</span>' +
      '<span class="rank-value">' + formatNumber(i.count) + ' <span class="rank-pct">' + pct + '%</span></span></div>' +
      '<div class="rank-bar-track"><div class="rank-bar-fill" style="width:' + w + '%"></div></div>' +
      '</li>';
  }).join('');
}

function renderTrend(trend) {
  const wrap = document.getElementById('trendChartWrap');
  const total = trend.reduce((s, t) => s + t.count, 0);
  document.getElementById('trendTotal').textContent = formatNumber(total) + ' total';

  if (!trend.length) { wrap.innerHTML = '<div class="empty">no data yet</div>'; return; }

  const W = 640, H = 200, padL = 34, padR = 10, padT = 14, padB = 26;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const max = Math.max(1, ...trend.map(t => t.count));
  const step = trend.length > 1 ? innerW / (trend.length - 1) : 0;
  const points = trend.map((t, i) => ({
    x: padL + step * i,
    y: padT + innerH - (t.count / max) * innerH,
    day: t.day, count: t.count,
  }));

  const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
  const areaPath = linePath +
    ' L' + points[points.length - 1].x.toFixed(1) + ',' + (padT + innerH) +
    ' L' + points[0].x.toFixed(1) + ',' + (padT + innerH) + ' Z';

  const gridLines = [0, 0.5, 1].map(f => {
    const y = padT + innerH * (1 - f);
    return '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" class="grid-line"/>' +
      '<text x="' + (padL - 8) + '" y="' + (y + 3) + '" class="axis-label" text-anchor="end">' + Math.round(max * f) + '</text>';
  }).join('');

  const xIdxs = trend.length > 1 ? [...new Set([0, Math.floor((trend.length - 1) / 2), trend.length - 1])] : [0];
  const xLabels = xIdxs.map(i => {
    const p = points[i];
    const d = new Date(p.day);
    const label = isNaN(d) ? p.day : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return '<text x="' + p.x + '" y="' + (H - 8) + '" class="axis-label" text-anchor="middle">' + label + '</text>';
  }).join('');

  const dots = points.map((p, i) => '<circle cx="' + p.x + '" cy="' + p.y + '" r="3.5" class="chart-dot" data-i="' + i + '"/>').join('');

  wrap.innerHTML =
    '<svg viewBox="0 0 ' + W + ' ' + H + '" class="trend-svg" id="trendSvg" preserveAspectRatio="none">' +
    '<defs><linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.35"/>' +
    '<stop offset="100%" style="stop-color:var(--accent);stop-opacity:0"/>' +
    '</linearGradient></defs>' +
    gridLines +
    '<path d="' + areaPath + '" fill="url(#trendGrad)" stroke="none"/>' +
    '<path d="' + linePath + '" class="trend-line"/>' +
    dots + xLabels +
    '<rect x="' + padL + '" y="0" width="' + innerW + '" height="' + H + '" fill="transparent" id="trendHitArea"/>' +
    '</svg><div class="chart-tooltip" id="trendTooltip" style="display:none"></div>';

  const svg = document.getElementById('trendSvg');
  const tooltip = document.getElementById('trendTooltip');
  const hitArea = document.getElementById('trendHitArea');

  hitArea.addEventListener('mousemove', (e) => {
    const rect = svg.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (W / rect.width);
    let idx = step > 0 ? Math.round((mouseX - padL) / step) : 0;
    idx = Math.max(0, Math.min(points.length - 1, idx));
    const p = points[idx];
    svg.querySelectorAll('.chart-dot').forEach(d => d.classList.remove('active'));
    svg.querySelector('.chart-dot[data-i="' + idx + '"]').classList.add('active');
    const d = new Date(p.day);
    const dateLabel = isNaN(d) ? p.day : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    tooltip.innerHTML = '<strong>' + formatNumber(p.count) + '</strong> clicks<br><span>' + dateLabel + '</span>';
    tooltip.style.display = 'block';
    const cssX = p.x * (rect.width / W);
    const cssY = p.y * (rect.height / H);
    tooltip.style.left = Math.min(rect.width - 100, Math.max(0, cssX - 50)) + 'px';
    tooltip.style.top = Math.max(0, cssY - 12) + 'px';
  });
  hitArea.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    svg.querySelectorAll('.chart-dot').forEach(d => d.classList.remove('active'));
  });
}

function openClickPanel(index) {
  const c = window.currentClicks[index];
  const time = new Date(c.timestamp).toLocaleString();
  const cls = scoreClass(c.bot_score ?? 0);

  document.getElementById('clickPanelBody').innerHTML =
    '<div class="panel-section"><h3>Visit</h3>' +
      '<div class="panel-row"><span class="k">Time</span><span class="v">' + time + '</span></div>' +
      '<div class="panel-row"><span class="k">Visit #</span><span class="v">' + c.visit_number + '</span></div>' +
      '<div class="panel-row"><span class="k">Referrer</span><span class="v">' + (c.referrer || 'Direct') + '</span></div>' +
    '</div>' +
    '<div class="panel-section"><h3>Location</h3>' +
      '<div class="panel-row"><span class="k">City/Country</span><span class="v">' + (c.city || '?') + ', ' + (c.country || '?') + '</span></div>' +
      '<div class="panel-row"><span class="k">ISP</span><span class="v">' + c.isp + '</span></div>' +
      '<div class="panel-row"><span class="k">VPN/Proxy</span><span class="v">' + (c.is_vpn ? '<span class="badge warn">Yes</span>' : 'No') + '</span></div>' +
      '<div class="panel-row"><span class="k">Colo</span><span class="v">' + (c.colo || '—') + '</span></div>' +
    '</div>' +
    '<div class="panel-section"><h3>Device</h3>' +
      '<div class="panel-row"><span class="k">Browser</span><span class="v">' + c.browser + '</span></div>' +
      '<div class="panel-row"><span class="k">OS</span><span class="v">' + c.os + (c.os_version ? ' ' + c.os_version : ' (version unavailable)') + '</span></div>' +
      '<div class="panel-row"><span class="k">Device</span><span class="v">' + c.device + '</span></div>' +
      '<div class="panel-row"><span class="k">In-app browser</span><span class="v">' + (c.is_in_app_browser ? '<span class="badge warn">Yes</span>' : 'No') + '</span></div>' +
    '</div>' +
    '<div class="panel-section"><h3>Security signal</h3>' +
      '<div class="panel-row"><span class="k">Bot score</span><span class="v score-num ' + cls + '">' + c.bot_score + '</span></div>' +
      '<ul class="reason-list">' + c.reasons.map(r => '<li>▸ ' + r + '</li>').join('') + '</ul>' +
      '<div class="panel-row" style="margin-top:8px"><span class="k">HTTP / TLS</span><span class="v">' + (c.http_protocol || '—') + ' / ' + (c.tls_version || '—') + '</span></div>' +
    '</div>' +
    '<div class="panel-section"><div class="raw-toggle" onclick="toggleRawDump(this)">▸ raw headers</div>' +
      '<div class="raw-dump">' + JSON.stringify(c.raw_headers, null, 2) + '</div>' +
    '</div>';

  document.getElementById('clickOverlay').style.display = 'flex';
}

function closeClickPanel() {
  document.getElementById('clickOverlay').style.display = 'none';
}

function toggleRawDump(el) {
  const dump = el.nextElementSibling;
  dump.style.display = dump.style.display === 'block' ? 'none' : 'block';
}

function startEdit() {
  document.getElementById('editDestUrl').value = document.getElementById('detailDest').textContent;
  document.getElementById('editBox').style.display = 'block';
}

async function saveEdit() {
  const destination_url = document.getElementById('editDestUrl').value;
  const msg = document.getElementById('editMsg');
  try {
    const res = await fetch('/api/links/' + currentLinkId, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ destination_url }),
    });
    const data = await res.json();
    if (res.ok) { openDetail(currentLinkId); } else { msg.textContent = data.error; msg.className = 'msg error'; }
  } catch (e) { msg.textContent = 'network error'; msg.className = 'msg error'; }
}

async function confirmDelete() {
  currentDeleteSlug = document.getElementById('detailSlug').textContent.trim();
  document.getElementById('deleteConfirmText').textContent = 'Type ' + currentDeleteSlug + ' to confirm deletion';
  document.getElementById('deleteConfirmInput').value = '';
  document.getElementById('deleteConfirmMsg').textContent = '';
  document.getElementById('deleteConfirmMsg').className = 'msg';
  document.getElementById('deleteOverlay').style.display = 'flex';
}

function hideDeleteOverlay() {
  document.getElementById('deleteOverlay').style.display = 'none';
  document.getElementById('deleteConfirmMsg').textContent = '';
  document.getElementById('deleteConfirmMsg').className = 'msg';
}

async function executeDelete() {
  const typed = document.getElementById('deleteConfirmInput').value.trim();
  const msg = document.getElementById('deleteConfirmMsg');
  if (typed !== currentDeleteSlug) {
    msg.textContent = 'Slug did not match.';
    msg.className = 'msg error';
    return;
  }

  const res = await fetch('/api/links/' + currentLinkId, { method: 'DELETE' });
  if (res.ok) {
    hideDeleteOverlay();
    loadLinks();
  } else {
    msg.textContent = 'Delete failed.';
    msg.className = 'msg error';
  }
}

loadLinks();
</script>
</body>
</html>`;