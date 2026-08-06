export function serveAccountPage(): Response {
  return new Response(ACCOUNT_HTML, { headers: { 'content-type': 'text/html' } });
}

const ACCOUNT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Account — SnareLink</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root { --bg:#0a0c10; --bg-panel:#12151b; --bg-elevated:#171b23; --border:#232733; --border-soft:#1a1e28; --fg:#c7cdd8; --fg-dim:#6b7280; --fg-bright:#f5f6f8; --accent:#5b7fff; --danger:#f2555a; --danger-dim:rgba(242,85,90,0.14); --good:#34d399; }
  body { background:var(--bg); color:var(--fg); font-family:'Inter',sans-serif; margin:0; padding:32px 20px; }
  .wrap { max-width:640px; margin:0 auto; }
  .back { display:inline-block; margin-bottom:20px; color:var(--fg-dim); font-size:0.85rem; }
  h1 { font-family:'Space Grotesk',sans-serif; color:var(--fg-bright); font-size:1.4rem; }
  h2 { font-family:'Space Grotesk',sans-serif; color:var(--fg-bright); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.06em; }
  .box { background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:10px; padding:20px; margin-bottom:16px; }
  .session-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border-soft); font-size:0.85rem; }
  .session-row:last-child { border-bottom:none; }
  .session-meta { color:var(--fg-dim); font-size:0.75rem; font-family:'IBM Plex Mono',monospace; }
  .badge-current { background:rgba(52,211,153,0.14); color:var(--good); font-size:0.7rem; padding:2px 8px; border-radius:20px; margin-left:8px; }
  button { cursor:pointer; font-weight:500; color:var(--fg-bright); background:var(--accent); border:1px solid var(--accent); border-radius:7px; padding:8px 14px; font-size:0.82rem; }
  button.danger { background:transparent; color:var(--danger); border-color:rgba(242,85,90,0.35); }
  .msg { color:var(--fg-dim); font-size:0.8rem; margin-top:8px; }
</style>
</head>
<body>
<div class="wrap">
<a class="back" href="/">‹ back to dashboard</a>
<h1>Account &amp; Security</h1>

<div class="box">
  <h2>Active sessions</h2>
  <div id="sessionsList"></div>
  <div style="margin-top:14px; display:flex; gap:8px;">
    <button onclick="revokeOthers()">Log out other devices</button>
    <button class="danger" onclick="revokeAll()">Log out everywhere</button>
  </div>
  <div id="sessionMsg" class="msg"></div>
</div>
</div>

<script>
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  return Math.floor(s/86400) + 'd ago';
}

function parseUA(ua) {
  ua = (ua || '').toLowerCase();
  let b = 'Unknown browser';
  if (ua.includes('edg/')) b = 'Edge';
  else if (ua.includes('chrome/')) b = 'Chrome';
  else if (ua.includes('firefox/')) b = 'Firefox';
  else if (ua.includes('safari/')) b = 'Safari';
  let os = '';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  else if (ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  return b + (os ? ' · ' + os : '');
}

async function loadSessions() {
  const res = await fetch('/api/sessions');
  if (!res.ok) { window.location.href = '/'; return; }
  const data = await res.json();
  const list = document.getElementById('sessionsList');
  list.innerHTML = data.sessions.map(s =>
    '<div class="session-row"><div>' + parseUA(s.user_agent) +
    (s.is_current ? '<span class="badge-current">this device</span>' : '') +
    '<div class="session-meta">last active ' + timeAgo(s.last_seen) + '</div></div>' +
    (s.is_current ? '' : '<button class="danger" onclick="revokeOne(\\'' + s.id + '\\')">Revoke</button>') +
    '</div>'
  ).join('');
}

async function revokeOne(id) {
  await fetch('/api/sessions/' + id, { method: 'DELETE' });
  loadSessions();
}

async function revokeOthers() {
  const msg = document.getElementById('sessionMsg');
  await fetch('/api/sessions/revoke-all', {
    method: 'POST', headers: {'content-type':'application/json'},
    body: JSON.stringify({ include_current: false }),
  });
  msg.textContent = 'Logged out of all other devices.';
  loadSessions();
}

async function revokeAll() {
  if (!confirm('This will log you out on this device too. Continue?')) return;
  await fetch('/api/sessions/revoke-all', {
    method: 'POST', headers: {'content-type':'application/json'},
    body: JSON.stringify({ include_current: true }),
  });
  window.location.href = '/';
}

loadSessions();
</script>
</body>
</html>`;
