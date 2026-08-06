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
<title>SnareLink</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0c10; --bg-panel: #12151b; --bg-elevated: #171b23; --bg-hover: #1b202a;
    --border: #232733; --border-soft: #1a1e28;
    --fg: #c7cdd8; --fg-dim: #6b7280; --fg-bright: #f5f6f8;
    --accent: #5b7fff; --accent-dim: rgba(91,127,255,0.14); --accent-line: rgba(91,127,255,0.35);
    --amber: #e8a33d; --amber-dim: rgba(232,163,61,0.14);
    --danger: #f2555a; --danger-dim: rgba(242,85,90,0.14);
    --good: #34d399; --good-dim: rgba(52,211,153,0.14);
    --radius: 10px;
    --font-display: 'Space Grotesk', system-ui, sans-serif;
    --font-body: 'Inter', system-ui, sans-serif;
    --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
  }
  * { box-sizing: border-box; }
  body { background: var(--bg); color: var(--fg); font-family: var(--font-body); margin: 0; min-height: 100vh; -webkit-font-smoothing: antialiased; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  h2 { font-family: var(--font-display); color: var(--fg-bright); font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin: 0; }

  .app-shell { display: flex; min-height: 100vh; }
  .sidenav { width: 200px; flex-shrink: 0; background: var(--bg-panel); border-right: 1px solid var(--border-soft); padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; position: sticky; top: 0; height: 100vh; }
  .sidenav .brand { display: flex; align-items: center; gap: 10px; padding: 8px 10px 20px; }
  .brand-mark { display: flex; align-items: flex-end; gap: 2px; height: 16px; }
  .brand-mark span { width: 4px; background: var(--accent); border-radius: 1px; display: block; }
  .brand-mark span:nth-child(1) { height: 6px; }
  .brand-mark span:nth-child(2) { height: 11px; }
  .brand-mark span:nth-child(3) { height: 16px; opacity: 0.55; }
  .brand-name { font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; color: var(--fg-bright); }
  .nav-item { background: transparent; border: none; color: var(--fg-dim); text-align: left; padding: 10px 12px; border-radius: 7px; font-size: 0.88rem; font-weight: 500; cursor: pointer; width: 100%; }
  .nav-item:hover { background: var(--bg-hover); color: var(--fg-bright); }
  .nav-item.active { background: var(--accent-dim); color: var(--accent); }
  .nav-spacer { flex: 1; }
  .app-main { flex: 1; padding: 32px 24px 64px; max-width: 900px; margin: 0 auto; width: 100%; }
  @media (max-width: 800px) {
    .app-shell { flex-direction: column; }
    .sidenav { width: 100%; height: auto; flex-direction: row; overflow-x: auto; position: static; padding: 10px 12px; }
    .nav-spacer { display: none; }
  }

  input, button, select {
    font-family: var(--font-body); background: var(--bg-elevated); color: var(--fg-bright);
    border: 1px solid var(--border); border-radius: 7px; padding: 11px 13px; font-size: 0.9rem;
  }
  input { width: 100%; margin-bottom: 10px; }
  input::placeholder { color: var(--fg-dim); }
  input:focus, button:focus { outline: none; border-color: var(--accent-line); box-shadow: 0 0 0 3px var(--accent-dim); }
  button { cursor: pointer; font-weight: 500; color: var(--fg-bright); background: var(--accent); border-color: var(--accent); }
  button:hover { background: #4a6bf0; border-color: #4a6bf0; }
  button.secondary { background: transparent; color: var(--fg); border-color: var(--border); }
  button.secondary:hover { background: var(--bg-hover); color: var(--fg-bright); }
  button.danger { background: transparent; color: var(--danger); border-color: rgba(242,85,90,0.35); }
  button.danger:hover { background: var(--danger-dim); border-color: var(--danger); }
  button.ghost { background: transparent; color: var(--fg-dim); border-color: transparent; padding: 6px 10px; font-size: 0.78rem; }
  button.ghost:hover { background: var(--bg-hover); color: var(--fg-bright); }

  .box { background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: var(--radius); padding: 20px; margin-bottom: 16px; }
  .box > h2 { margin-bottom: 14px; }
  #accountBox { background: transparent; border-style: dashed; }

  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid var(--border-soft); font-size: 0.85rem; }
  td { font-family: var(--font-mono); font-size: 0.8rem; color: var(--fg); }
  th { color: var(--fg-dim); text-transform: uppercase; font-size: 0.68rem; letter-spacing: 0.06em; font-weight: 500; font-family: var(--font-body); }
  th.num, td.num { text-align: right; }
  tr:last-child td { border-bottom: none; }
  tr.link-row { cursor: pointer; }
  tr.link-row:hover td { background: var(--bg-hover); }
  tr.vpn-row td:first-child { box-shadow: inset 3px 0 0 var(--amber); }
  td.dest-cell { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .msg { color: var(--fg-dim); font-size: 0.82rem; margin-top: 8px; }
  .msg.error { color: var(--danger); }
  #login, #dashboard, #detail, #usernamePrompt, #accountView, #analyticsView { display: none; }

  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 16px; }
  .stat-card { background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: var(--radius); padding: 16px; }
  .stat-card .val { font-family: var(--font-display); font-size: 1.7rem; font-weight: 600; color: var(--fg-bright); }
  .stat-card.warn .val { color: var(--amber); }
  .stat-card .lbl { font-size: 0.72rem; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 6px; }
  .gauge-track { height: 4px; background: var(--bg-elevated); border-radius: 2px; margin-top: 12px; overflow: hidden; }
  .gauge-fill { height: 100%; background: var(--accent); border-radius: 2px; }
  .stat-card.warn .gauge-fill { background: var(--amber); }

  .badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 500; }
  .badge.good { background: var(--good-dim); color: var(--good); }
  .badge.warn { background: var(--amber-dim); color: var(--amber); }
  .badge.bad { background: var(--danger-dim); color: var(--danger); }

  .ranked-list { list-style: none; padding: 0; margin: 0; }
  .ranked-list li { padding: 9px 0; border-bottom: 1px solid var(--border-soft); }
  .ranked-list li:last-child { border-bottom: none; }
  .rank-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; gap: 10px; }
  .rank-label { color: var(--fg); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rank-value { font-family: var(--font-mono); color: var(--fg-bright); font-size: 0.78rem; }
  .rank-pct { color: var(--fg-dim); }
  .rank-bar-track { height: 5px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden; }
  .rank-bar-fill { height: 100%; background: var(--accent); border-radius: 3px; }

  .panels-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 700px) { .panels-grid { grid-template-columns: 1fr; } }
  .chart-box { grid-column: 1 / -1; }
  .chart-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .chart-total { font-family: var(--font-mono); color: var(--fg-dim); font-size: 0.78rem; }
  .chart-wrap { position: relative; }
  .trend-svg { width: 100%; height: auto; overflow: visible; }
  .grid-line { stroke: var(--border-soft); stroke-width: 1; }
  .axis-label { fill: var(--fg-dim); font-size: 10px; font-family: var(--font-mono); }
  .trend-line { fill: none; stroke: var(--accent); stroke-width: 2; }
  .chart-dot { fill: var(--bg-panel); stroke: var(--accent); stroke-width: 2; opacity: 0; }
  .chart-dot.active { opacity: 1; }
  .chart-tooltip { position: absolute; pointer-events: none; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; font-size: 0.72rem; color: var(--fg-bright); white-space: nowrap; transform: translateY(-100%); }
  .chart-tooltip span { color: var(--fg-dim); }

  .score-cell { display: flex; align-items: center; gap: 8px; }
  .score-track { width: 46px; height: 5px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden; }
  .score-fill { height: 100%; border-radius: 3px; }
  .score-fill.good { background: var(--good); } .score-fill.warn { background: var(--amber); } .score-fill.bad { background: var(--danger); }
  .score-num { font-family: var(--font-mono); font-size: 0.78rem; width: 20px; text-align: right; }
  .score-num.good { color: var(--good); } .score-num.warn { color: var(--amber); } .score-num.bad { color: var(--danger); }

  .back-link { display: inline-flex; gap: 4px; margin-bottom: 14px; color: var(--fg-dim); font-size: 0.85rem; cursor: pointer; }
  .link-header { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .link-header .actions { display: flex; gap: 8px; }
  .link-header .slug { font-family: var(--font-display); font-weight: 600; color: var(--fg-bright); font-size: 1.2rem; }
  .link-header .dest { color: var(--fg-dim); font-size: 0.8rem; word-break: break-all; margin-top: 4px; font-family: var(--font-mono); }

  .empty { color: var(--fg-dim); text-align: center; padding: 36px; font-size: 0.85rem; }

  #login { position: relative; }
  #login::before {
    content: ''; position: fixed; inset: -20%; pointer-events: none; z-index: -1;
    background: radial-gradient(ellipse 60% 40% at 20% 10%, rgba(91,127,255,0.10), transparent 55%),
                radial-gradient(ellipse 50% 35% at 85% 30%, rgba(52,211,153,0.05), transparent 60%);
    animation: driftGlow 22s ease-in-out infinite alternate;
  }
  @keyframes driftGlow { from { transform: translate(0,0); } to { transform: translate(-3%, 2%); } }
  @media (prefers-reduced-motion: reduce) { #login::before { animation: none; } }

  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; margin: 0 0 40px; }
  @media (max-width: 860px) { .hero-grid { grid-template-columns: 1fr; gap: 32px; } }
  .hero-eyebrow {
    font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent);
    text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
    opacity: 0; animation: fadeUp 0.6s ease forwards; animation-delay: 0.05s;
  }
  .hero-eyebrow-line { width: 20px; height: 1px; background: var(--accent); display: inline-block; }
  .hero-title { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.02em; font-size: clamp(2rem, 4vw, 2.9rem); line-height: 1.1; margin: 0 0 18px; color: var(--fg-bright); }
  .hero-title .line { display: block; overflow: hidden; }
  .hero-title .line span { display: inline-block; opacity: 0; transform: translateY(110%); animation: lineUp 0.65s cubic-bezier(.2,.8,.2,1) forwards; }
  .hero-title .line:nth-child(1) span { animation-delay: 0.12s; }
  .hero-title .line:nth-child(2) span { animation-delay: 0.24s; }
  .hero-accent { color: var(--accent); }
  .hero-sub { color: var(--fg-dim); font-size: 1rem; line-height: 1.6; max-width: 440px; margin: 0 0 20px; opacity: 0; animation: fadeUp 0.6s ease forwards; animation-delay: 0.4s; }
  .hero-features { display: flex; flex-direction: column; gap: 10px; max-width: 440px; opacity: 0; animation: fadeUp 0.6s ease forwards; animation-delay: 0.5s; }
  .hero-feature { display: flex; gap: 10px; font-size: 0.82rem; color: var(--fg-dim); }
  .hero-feature-icon { color: var(--accent); font-size: 1.05rem; flex-shrink: 0; }
  .hero-feature strong { color: var(--fg-bright); font-family: var(--font-display); font-weight: 600; font-size: 0.85rem; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes lineUp { to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) {
    .hero-title .line span, .hero-eyebrow, .hero-sub, .hero-features { animation: none !important; opacity: 1 !important; transform: none !important; }
  }
  .feed-panel { background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 14px; overflow: hidden; box-shadow: 0 30px 70px rgba(0,0,0,0.4); opacity: 0; animation: fadeUp 0.7s ease forwards; animation-delay: 0.3s; }
  .feed-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; border-bottom: 1px solid var(--border-soft); background: var(--bg-elevated); }
  .feed-head-title { font-family: var(--font-mono); font-size: 0.72rem; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 8px; }
  .feed-dots { display: flex; gap: 5px; }
  .feed-dots span { width: 7px; height: 7px; border-radius: 50%; background: var(--border); }
  .feed-stat { font-family: var(--font-mono); font-size: 0.72rem; color: var(--fg-dim); }
  .feed-stat b { color: var(--fg-bright); font-weight: 500; }
  .feed-body { height: 300px; overflow: hidden; position: relative; padding: 6px 0; }
  .feed-row { display: flex; align-items: center; gap: 10px; padding: 9px 16px; font-family: var(--font-mono); font-size: 0.78rem; border-bottom: 1px solid var(--border-soft); animation: rowIn 0.4s ease forwards; }
  @keyframes rowIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .feed-row { animation: none; } }
  .feed-row .loc { color: var(--fg); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .feed-row .loc .ua { color: var(--fg-dim); margin-left: 6px; }
  .feed-row .badge { font-size: 0.68rem; padding: 2px 8px; border-radius: 20px; font-weight: 500; flex-shrink: 0; }
  .feed-row.real .badge { background: var(--good-dim); color: var(--good); }
  .feed-row.flagged { background: var(--danger-dim); }
  .feed-row.flagged .loc { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(242,85,90,0.5); }
  .feed-row.flagged .badge { background: var(--danger-dim); color: var(--danger); border: 1px solid rgba(242,85,90,0.3); }
  .feed-foot { padding: 12px 16px; border-top: 1px solid var(--border-soft); background: var(--bg-elevated); display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.72rem; color: var(--fg-dim); }
  .feed-foot .good-txt { color: var(--good); }
  .feed-foot .danger-txt { color: var(--danger); }

  .login-box { max-width: 380px; margin: 0 auto; text-align: center; }
  .login-box .brand { justify-content: center; margin-bottom: 20px; }
  .login-box p { color: var(--fg-dim); font-size: 0.88rem; margin: 0 0 18px; }

  .overlay { position: fixed; inset: 0; background: rgba(5,7,10,0.7); display: none; align-items: flex-start; justify-content: flex-end; z-index: 50; }
  .overlay.center { align-items: center; justify-content: center; }
  .panel { background: var(--bg-panel); border-left: 1px solid var(--border); width: 420px; max-width: 92vw; height: 100vh; overflow-y: auto; padding: 22px; }
  .overlay.center .panel { height: auto; max-height: 90vh; border-left: none; border: 1px solid var(--border); border-radius: 12px; }
  .panel-close { cursor: pointer; color: var(--fg-dim); float: right; }
  .panel-close:hover { color: var(--fg-bright); }
  .panel-section { margin-bottom: 20px; }
  .panel-section h3 { font-family: var(--font-display); font-size: 0.72rem; text-transform: uppercase; color: var(--fg-dim); margin: 0 0 8px; }
  .panel-row { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 5px 0; border-bottom: 1px solid var(--border-soft); }
  .panel-row .k { color: var(--fg-dim); }
  .panel-row .v { color: var(--fg-bright); font-family: var(--font-mono); text-align: right; }
  .reason-list { list-style: none; padding: 0; margin: 8px 0 0; }
  .reason-list li { font-size: 0.78rem; color: var(--fg-dim); padding: 3px 0; }
  .raw-toggle { color: var(--accent); font-size: 0.78rem; cursor: pointer; margin-top: 8px; }
  .raw-dump { display: none; background: var(--bg-elevated); border-radius: 6px; padding: 10px; margin-top: 8px; font-family: var(--font-mono); font-size: 0.7rem; color: var(--fg-dim); white-space: pre-wrap; word-break: break-all; max-height: 200px; overflow-y: auto; }

  .chat-fab { position: fixed; bottom: 24px; right: 24px; z-index: 40; width: 52px; height: 52px; border-radius: 50%; background: var(--accent); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(91,127,255,0.35); }
  .chat-fab svg { width: 24px; height: 24px; }
  .chat-panel { position: fixed; bottom: 24px; right: 24px; z-index: 50; width: 360px; max-width: calc(100vw - 32px); height: 520px; max-height: calc(100vh - 48px); background: var(--bg-panel); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 20px 50px rgba(0,0,0,0.45); display: flex; flex-direction: column; overflow: hidden; }
  .chat-header { display: flex; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border-soft); background: var(--bg-elevated); }
  .chat-header-title { display: flex; align-items: center; gap: 9px; }
  .chat-header-name { font-family: var(--font-display); font-weight: 600; font-size: 0.92rem; color: var(--fg-bright); }
  .chat-header-sub { font-size: 0.68rem; color: var(--fg-dim); font-family: var(--font-mono); text-transform: uppercase; }
  .chat-close { cursor: pointer; color: var(--fg-dim); font-size: 0.78rem; padding: 4px 8px; border-radius: 6px; }
  .chat-close:hover { background: var(--bg-hover); color: var(--fg-bright); }
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
  .chat-empty { color: var(--fg-dim); font-size: 0.8rem; text-align: center; margin: auto; padding: 0 12px; }
  .msg-bubble { max-width: 82%; padding: 9px 12px; border-radius: 12px; font-size: 0.85rem; line-height: 1.45; word-wrap: break-word; white-space: pre-wrap; }
  .msg-bubble.user { align-self: flex-end; background: var(--accent); color: #fff; border-bottom-right-radius: 3px; }
  .msg-bubble.assistant { align-self: flex-start; background: var(--bg-elevated); color: var(--fg); border: 1px solid var(--border-soft); border-bottom-left-radius: 3px; }
  .msg-bubble.error { align-self: flex-start; background: var(--danger-dim); color: var(--danger); }
  .chat-typing { align-self: flex-start; display: flex; gap: 4px; padding: 10px 13px; background: var(--bg-elevated); border: 1px solid var(--border-soft); border-radius: 12px; margin: 0 16px 12px; }
  .chat-typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--fg-dim); }
  .chat-input-row { display: flex; align-items: flex-end; gap: 8px; padding: 12px; border-top: 1px solid var(--border-soft); background: var(--bg-elevated); }
  #chatInput { flex: 1; resize: none; max-height: 100px; background: var(--bg-panel); border: 1px solid var(--border); border-radius: 9px; color: var(--fg-bright); font-size: 0.85rem; padding: 8px 10px; }
  .chat-send-btn { width: 34px; height: 34px; border-radius: 9px; border: none; cursor: pointer; background: var(--accent); display: flex; align-items: center; justify-content: center; }
  .chat-send-btn svg { width: 15px; height: 15px; }
  .chat-send-btn:disabled { opacity: 0.5; }

  .session-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-soft); font-size: 0.85rem; }
  .session-row:last-child { border-bottom: none; }
  .session-meta { color: var(--fg-dim); font-size: 0.75rem; font-family: var(--font-mono); }
  .badge-current { background: rgba(52,211,153,0.14); color: var(--good); font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; margin-left: 8px; }

  @media (max-width: 600px) {
    .app-main { padding: 16px 14px 48px; }
    table { display: block; overflow-x: auto; white-space: nowrap; }
    th, td { padding: 7px; font-size: 0.75rem; }
    .box { padding: 14px; }
    #linksTable thead { display: none; }
    #linksTable, #linksTable tbody, #linksTable tr, #linksTable td { display: block; width: 100%; white-space: normal; }
    #linksTable tr { background: var(--bg-elevated); border: 1px solid var(--border-soft); border-radius: var(--radius); margin-bottom: 10px; padding: 10px 12px; }
    #linksTable td { border: none; padding: 4px 0; max-width: none; }
    #linksTable td[data-label]::before { content: attr(data-label); display: block; font-size: 0.65rem; color: var(--fg-dim); text-transform: uppercase; margin-bottom: 2px; }
  }
</style>
</head>
<body>

<div id="initialLoading" style="text-align:center; padding:100px 20px; color:var(--fg-dim);"><img src="/icons/diamond-loader.gif" alt="" width="64" height="64" /></div>

<div class="app-shell">
  <nav class="sidenav" id="sideNav" style="display:none">
    <div class="brand"><span class="brand-mark"><span></span><span></span><span></span></span><span class="brand-name">SnareLink</span></div>
    <button class="nav-item active" data-view="links" onclick="switchView('links')">Manage Links</button>
    <button class="nav-item" data-view="analytics" onclick="switchView('analytics')">Analytics</button>
    <div class="nav-spacer"></div>
    <a href="/about" class="nav-item" style="display:block; text-decoration:none;">About</a>
    <button class="nav-item" data-view="account" onclick="switchView('account')">Account</button>
  </nav>

  <main class="app-main">
    <div id="login">
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
      <div class="box login-box">
        <div class="brand"><span class="brand-mark"><span></span><span></span><span></span></span><span class="brand-name">SnareLink</span></div>
        <p>Sign in to manage your links</p>
        <input type="email" id="email" placeholder="you@domain.com" />
        <button onclick="login()" style="width:100%">Send login link</button>
        <div id="loginMsg" class="msg"></div>
      </div>
    </div>

    <div id="usernamePrompt" class="box"><h2>Choose a username</h2><input id="usernameInput" placeholder="yourname" /><button onclick="claimUsername()">Claim</button><div id="usernameMsg" class="msg"></div></div>

    <div id="dashboard">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h1 style="font-family:var(--font-display); color:var(--fg-bright); font-size:1.3rem; margin:0;">Your links</h1>
        <button onclick="document.getElementById('createOverlay').style.display='flex'">+ Create Link</button>
      </div>
      <div id="freeTierMsg" class="msg" style="display:none; margin-bottom:12px;"></div>
      <div class="box">
        <table id="linksTable">
          <thead><tr><th>Slug</th><th>Destination</th><th class="num">Clicks</th><th>Created</th><th>Link</th></tr></thead>
          <tbody id="linksBody"></tbody>
        </table>
        <div id="linksEmpty" class="empty" style="display:none">No links yet — create your first one above.</div>
      </div>
    </div>

    <div id="detail">
      <div class="back-link" onclick="backToList()">‹ back to links</div>
      <div class="box">
        <div class="link-header">
          <div><div class="slug" id="detailSlug"></div><div class="dest" id="detailDest"></div></div>
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
        <div class="box"><h2>Bot score distribution</h2><ul class="ranked-list" id="scoreHistogram"></ul></div>
        <div class="box"><h2>Top locations</h2><ul class="ranked-list" id="countryList"></ul></div>
        <div class="box"><h2>Devices &amp; browsers</h2><div id="deviceDonut"></div></div>
        <div class="box"><h2>Referrers</h2><ul class="ranked-list" id="referrerList"></ul></div>
        <div class="box"><h2>Signal breakdown</h2><ul class="ranked-list" id="protocolList"></ul><ul class="ranked-list" id="tlsList" style="margin-top:14px"></ul></div>
      </div>
      <div class="box">
        <h2>Click log</h2>
        <table>
          <thead><tr><th>Time</th><th>Location</th><th>Browser/OS</th><th>ISP</th><th class="num">Visit</th><th class="num">Score</th></tr></thead>
          <tbody id="clicksBody"></tbody>
        </table>
      </div>
    </div>

    <div id="accountView">
      <h1 style="font-family:var(--font-display); color:var(--fg-bright); font-size:1.3rem; display:flex; align-items:center; gap:10px;"><img src="/icons/black-ai-agent-avatar-1.gif" alt="" width="32" height="32" style="border-radius:50%;" />Account &amp; Security</h1>
      <div class="box" id="accountBox">
        <h2>Account</h2>
        <div class="panel-row"><span class="k">Username</span><span class="v" id="acctUsername"></span></div>
        <div class="panel-row"><span class="k">Email</span><span class="v" id="acctEmail"></span></div>
        <div class="panel-row"><span class="k">Plan</span><span class="v" id="acctPlan"></span></div>
        <button class="secondary" onclick="startUsernameChange()" style="margin-top:10px">Change username</button>
        <div id="usernameChangeBox" style="display:none; margin-top:10px">
          <input id="newUsernameInput" placeholder="new-username" />
          <button onclick="saveUsernameChange()">Save</button>
          <div id="usernameChangeMsg" class="msg"></div>
        </div>
      </div>
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

    <div id="analyticsView">
      <h1 style="font-family:var(--font-display); color:var(--fg-bright); font-size:1.3rem;">Analytics</h1>
      <div class="stat-grid" id="analyticsStatGrid"></div>
      <div class="panels-grid">
        <div class="box chart-box"><div class="chart-head"><h2>Click trend</h2><span class="chart-total" id="analyticsTrendTotal"></span></div><div class="chart-wrap" id="analyticsTrendWrap"></div></div>
        <div class="box"><h2>Bot score distribution</h2><ul class="ranked-list" id="analyticsScoreHistogram"></ul></div>
        <div class="box"><h2>Top locations</h2><ul class="ranked-list" id="analyticsCountryList"></ul></div>
        <div class="box"><h2>Devices &amp; browsers</h2><div id="analyticsDeviceDonut"></div></div>
        <div class="box"><h2>Signal breakdown</h2><ul class="ranked-list" id="analyticsProtocolList"></ul><ul class="ranked-list" id="analyticsTlsList" style="margin-top:14px"></ul></div>
      </div>
    </div>
  </main>
</div>

<div class="overlay center" id="createOverlay" onclick="if(event.target===this)this.style.display='none'">
  <div class="panel">
    <span class="panel-close" onclick="document.getElementById('createOverlay').style.display='none'">✕ close</span>
    <h2 style="margin-bottom:14px;">Create link</h2>
    <input id="slug" placeholder="custom-slug" oninput="updateSlugPreview()" />
    <input id="destUrl" placeholder="https://destination-url.com" />
    <div id="slugPreview" style="font-family:var(--font-mono); font-size:0.78rem; color:var(--fg-dim); margin:-4px 0 10px;"></div>
    <label style="display:flex; align-items:center; gap:8px; margin: 4px 0 10px; font-size:0.85rem;">
      <input type="checkbox" id="showPreview" style="width:auto; margin:0" />
      <span>Show a preview page before redirecting</span>
    </label>
    <button onclick="createLink()" style="width:100%">Create</button>
    <div id="createMsg" class="msg"></div>
  </div>
</div>

<div class="overlay" id="clickOverlay" onclick="if(event.target===this)closeClickPanel()">
  <div class="panel"><span class="panel-close" onclick="closeClickPanel()">✕ close</span><div id="clickPanelBody"></div></div>
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

<button id="chatToggleBtn" class="chat-fab" onclick="toggleChat()" aria-label="Support chat">
  <img id="chatFabIcon" src="/icons/circular-icon-of-virtual-assistant.gif" alt="" style="width:34px; height:34px; border-radius:50%;" />
</button>
<div id="chatPanel" class="chat-panel" style="display:none">
  <div class="chat-header">
    <div class="chat-header-title"><img id="chatHeaderIcon" src="/icons/circular-icon-of-virtual-assistant.gif" alt="" style="width:26px; height:26px; border-radius:50%;" /><div><div class="chat-header-name">Support</div><div class="chat-header-sub">ask about snarelink</div></div></div>
    <span class="chat-close" onclick="toggleChat()">✕ close</span>
  </div>
  <div id="chatMessages" class="chat-messages">
    <img id="chatMascot" src="" alt="" style="display:none; width:72px; height:72px; margin:0 auto 8px;" />
    <div class="chat-empty" id="chatEmpty">Ask me anything about links, analytics, or your account.</div>
  </div>
  <div id="chatTyping" class="chat-typing" style="display:none"><span></span><span></span><span></span></div>
  <div class="chat-input-row">
    <textarea id="chatInput" rows="1" placeholder="Type a message..." onkeydown="handleChatKeydown(event)" oninput="autoGrowChatInput(this)"></textarea>
    <button id="chatSendBtn" class="chat-send-btn" onclick="sendChatMessage()">
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    </button>
  </div>
</div>

<script>
let currentLinkId = null, currentUsername = null, currentPlanTier = null, currentDeleteSlug = null;

function formatNumber(n) { return Number(n || 0).toLocaleString(); }

function updateSlugPreview() {
  const slug = document.getElementById('slug').value.trim();
  document.getElementById('slugPreview').innerHTML = slug ? 'will be: <strong style="color:var(--accent)">snarelink.me/' + (currentUsername || 'you') + '/' + slug + '</strong>' : '';
}

async function login() {
  const email = document.getElementById('email').value;
  const msg = document.getElementById('loginMsg');
  msg.textContent = 'sending...'; msg.className = 'msg';
  try {
    const res = await fetch('/api/login', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (res.ok) {
      msg.innerHTML = '<img src="/icons/3d-fluency-opened-envelope.gif" alt="" width="28" height="28" style="vertical-align:middle; margin-right:6px;" />' + data.message;
      msg.className = 'msg';
    } else {
      msg.textContent = data.error || 'failed';
      msg.className = 'msg error';
    }
  } catch (e) { msg.textContent = 'network error'; msg.className = 'msg error'; }
}

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));

async function createLink() {
  const slug = document.getElementById('slug').value;
  const destination_url = document.getElementById('destUrl').value;
  const show_preview = document.getElementById('showPreview').checked;
  const msg = document.getElementById('createMsg');
  try {
    const res = await fetch('/api/links', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ slug, destination_url, show_preview }) });
    const data = await res.json();
    msg.textContent = res.ok ? 'created: /' + data.slug : (data.error || 'failed');
    msg.className = res.ok ? 'msg' : 'msg error';
    if (res.ok) {
      document.getElementById('slug').value = ''; document.getElementById('destUrl').value = ''; updateSlugPreview();
      document.getElementById('createOverlay').style.display = 'none';
      loadLinks();
    }
  } catch (e) { msg.textContent = 'network error'; msg.className = 'msg error'; }
}

async function claimUsername() {
  const msg = document.getElementById('usernameMsg');
  try {
    const res = await fetch('/api/username', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ username: document.getElementById('usernameInput').value }) });
    const data = await res.json();
    if (res.ok) { msg.textContent = ''; await loadLinks(); } else { msg.textContent = data.error || 'failed'; msg.className = 'msg error'; }
  } catch (e) { msg.textContent = 'network error'; msg.className = 'msg error'; }
}

function startUsernameChange() { document.getElementById('usernameChangeBox').style.display = 'block'; }

async function saveUsernameChange() {
  const newUsername = document.getElementById('newUsernameInput').value.trim();
  const msg = document.getElementById('usernameChangeMsg');
  if (!confirm('Changing your username will break any links you already shared with the old one. Continue?')) return;
  try {
    const res = await fetch('/api/username', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ username: newUsername }) });
    const data = await res.json();
    if (res.ok) { msg.textContent = ''; document.getElementById('usernameChangeBox').style.display = 'none'; loadLinks(); }
    else { msg.textContent = data.error || 'failed'; msg.className = 'msg error'; }
  } catch (e) { msg.textContent = 'network error'; msg.className = 'msg error'; }
}

function switchView(view) {
  document.getElementById('dashboard').style.display = view === 'links' ? 'block' : 'none';
  document.getElementById('detail').style.display = 'none';
  document.getElementById('accountView').style.display = view === 'account' ? 'block' : 'none';
  document.getElementById('analyticsView').style.display = view === 'analytics' ? 'block' : 'none';
  document.querySelectorAll('.nav-item[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  const path = view === 'links' ? '/' : '/' + view;
  history.pushState({ view }, '', path);
  if (view === 'account') loadSessions();
  if (view === 'analytics') loadAnalytics();
}
window.addEventListener('popstate', (e) => switchView(e.state?.view || 'links'));

async function loadLinks() {
  const meRes = await fetch('/api/me');
  document.getElementById('initialLoading').style.display = 'none';

  if (!meRes.ok) {
    document.getElementById('sideNav').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('detail').style.display = 'none';
    document.getElementById('usernamePrompt').style.display = 'none';
    document.getElementById('accountView').style.display = 'none';
    return;
  }

  const me = await meRes.json();
  currentUsername = me.username; currentPlanTier = me.plan_tier;
  document.getElementById('login').style.display = 'none';
  document.getElementById('chatFabIcon').src = '/icons/chatbot-head-in-the-round-avatar.gif';
  document.getElementById('chatHeaderIcon').src = '/icons/chatbot-head-in-the-round-avatar.gif';

  if (!currentUsername) {
    document.getElementById('sideNav').style.display = 'none';
    document.getElementById('usernamePrompt').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    return;
  }

  document.getElementById('sideNav').style.display = 'flex';
  document.getElementById('usernamePrompt').style.display = 'none';

  const res = await fetch('/api/links');
  if (!res.ok) return;
  const data = await res.json();

  document.getElementById('acctUsername').textContent = me.username || '(not set)';
  document.getElementById('acctEmail').textContent = me.email || '';
  document.getElementById('acctPlan').textContent = me.plan_tier || 'free';

  const freeTierMsg = document.getElementById('freeTierMsg');
  if (data.plan_tier === 'free') { freeTierMsg.textContent = data.link_count + ' of 3 free links used'; freeTierMsg.style.display = 'block'; }
  else { freeTierMsg.style.display = 'none'; }

  const path = location.pathname;
  const initialView = path === '/account' ? 'account' : path === '/analytics' ? 'analytics' : 'links';
  switchView(initialView);

  currentLinks = data.links;
  renderLinksTable();
}
let currentLinks = [];

function renderLinksTable() {
  const body = document.getElementById('linksBody');
  body.innerHTML = '';
  document.getElementById('linksEmpty').style.display = currentLinks.length ? 'none' : 'block';
  for (const link of currentLinks) {
    const tr = document.createElement('tr');
    tr.className = 'link-row';
    const created = new Date(link.created_at).toLocaleDateString();
    const copyOnclick = "event.stopPropagation(); copyLink('" + (currentUsername || '') + "', '" + link.slug + "')";
    tr.innerHTML = '<td data-label="Slug">/' + link.slug + '</td>' +
      '<td class="dest-cell" data-label="Destination" title="' + link.destination_url + '">' + link.destination_url + '</td>' +
      '<td class="num" data-label="Clicks">' + formatNumber(link.total_clicks) + '</td>' +
      '<td data-label="Created">' + created + '</td>' +
      '<td><button class="ghost" onclick="' + copyOnclick + '">Copy</button></td>';
    tr.onclick = () => openDetail(link.id);
    body.appendChild(tr);
  }
}

function copyLink(username, slug) {
  const url = 'https://snarelink.me/' + username + '/' + slug;
  navigator.clipboard.writeText(url).then(() => alert('Copied: ' + url)).catch(() => prompt('Copy this link:', url));
}

function backToList() { switchView('links'); }
function scoreClass(score) { return score >= 70 ? 'good' : score >= 40 ? 'warn' : 'bad'; }
function scoreCell(score) {
  const s = score ?? 0, cls = scoreClass(s);
  return '<div class="score-cell"><div class="score-track"><div class="score-fill ' + cls + '" style="width:' + s + '%"></div></div><span class="score-num ' + cls + '">' + s + '</span></div>';
}

async function openDetail(linkId) {
  currentLinkId = linkId;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('accountView').style.display = 'none';
  document.getElementById('detail').style.display = 'block';
  document.getElementById('editBox').style.display = 'none';

  const [summaryRes, clicksRes] = await Promise.all([fetch('/api/links/' + linkId + '/summary'), fetch('/api/links/' + linkId + '/clicks')]);
  const summary = await summaryRes.json();
  const clicksData = await clicksRes.json();

  document.getElementById('detailSlug').textContent = currentUsername + '/' + summary.slug;
  document.getElementById('detailDest').textContent = summary.destination_url;

  const botScoreClass = summary.avg_bot_score >= 70 ? '' : 'warn';
  document.getElementById('statGrid').innerHTML =
    statCard(summary.total_clicks, 'Total clicks') + statCard(summary.unique_visitors, 'Unique visitors') +
    gaugeCard(summary.avg_bot_score, 'Avg bot score', 100, botScoreClass) +
    gaugeCard(summary.vpn_count, 'VPN/proxy clicks', Math.max(1, summary.total_clicks), summary.vpn_count > 0 ? 'warn' : '');

  renderTrend(summary.trend || []);
  renderScoreHistogram(summary.score_buckets, 'scoreHistogram');
  document.getElementById('countryList').innerHTML = rankedList(summary.top_countries);
  renderDonut(summary.devices, 'deviceDonut');
  document.getElementById('referrerList').innerHTML = rankedList(summary.referrers);
  document.getElementById('protocolList').innerHTML = rankedList(summary.protocol_breakdown);
  document.getElementById('tlsList').innerHTML = rankedList(summary.tls_breakdown);

  window.currentClicks = clicksData.clicks;
  document.getElementById('clicksBody').innerHTML = clicksData.clicks.map((c, i) => {
    const time = new Date(c.timestamp).toLocaleString();
    const loc = (c.city || '?') + ', ' + (c.country || '?');
    const vpnTag = c.is_vpn ? ' <span class="badge warn">VPN</span>' : '';
    const inAppTag = c.is_in_app_browser ? ' <span class="badge warn">IN-APP</span>' : '';
    return '<tr class="click-row ' + (c.is_vpn ? 'vpn-row' : '') + '" onclick="openClickPanel(' + i + ')"><td>' + time + '</td><td>' + loc + '</td><td>' + c.browser + ' / ' + c.os + (c.os_version ? ' ' + c.os_version : '') + inAppTag + '</td><td>' + c.isp + vpnTag + '</td><td class="num">#' + c.visit_number + '</td><td class="num">' + scoreCell(c.bot_score) + '</td></tr>';
  }).join('') || '<tr><td colspan="6" class="empty">No clicks yet.</td></tr>';
}

function statCard(val, label) { return '<div class="stat-card"><div class="val">' + formatNumber(val) + '</div><div class="lbl">' + label + '</div></div>'; }
function gaugeCard(val, label, max, extraClass) {
  const pct = Math.max(0, Math.min(100, (val / max) * 100));
  return '<div class="stat-card ' + (extraClass || '') + '"><div class="val">' + formatNumber(val) + '</div><div class="lbl">' + label + '</div><div class="gauge-track"><div class="gauge-fill" style="width:' + pct + '%"></div></div></div>';
}
function rankedList(items) {
  if (!items || !items.length) return '<li class="empty">no data</li>';
  const max = Math.max(...items.map(i => i.count)), total = items.reduce((s,i)=>s+i.count,0);
  return items.map(i => {
    const w = max > 0 ? (i.count / max) * 100 : 0, pct = total > 0 ? Math.round((i.count/total)*100) : 0;
    return '<li><div class="rank-row"><span class="rank-label">' + i.key + '</span><span class="rank-value">' + formatNumber(i.count) + ' <span class="rank-pct">' + pct + '%</span></span></div><div class="rank-bar-track"><div class="rank-bar-fill" style="width:' + w + '%"></div></div></li>';
  }).join('');
}

function renderTrend(trend, wrapId, totalId) {
  const wrap = document.getElementById(wrapId || 'trendChartWrap');
  const total = trend.reduce((s,t)=>s+t.count,0);
  document.getElementById(totalId || 'trendTotal').textContent = formatNumber(total) + ' total';
  if (!trend.length) { wrap.innerHTML = '<div class="empty">no data yet</div>'; return; }
  const W=640,H=200,padL=34,padR=10,padT=14,padB=26,innerW=W-padL-padR,innerH=H-padT-padB;
  const max = Math.max(1, ...trend.map(t=>t.count));
  const step = trend.length > 1 ? innerW/(trend.length-1) : 0;
  const points = trend.map((t,i)=>({x:padL+step*i, y:padT+innerH-(t.count/max)*innerH, day:t.day, count:t.count}));
  const linePath = points.map((p,i)=>(i===0?'M':'L')+p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ');
  const areaPath = linePath+' L'+points[points.length-1].x.toFixed(1)+','+(padT+innerH)+' L'+points[0].x.toFixed(1)+','+(padT+innerH)+' Z';
  const gridLines = [0,0.5,1].map(f=>{const y=padT+innerH*(1-f); return '<line x1="'+padL+'" y1="'+y+'" x2="'+(W-padR)+'" y2="'+y+'" class="grid-line"/><text x="'+(padL-8)+'" y="'+(y+3)+'" class="axis-label" text-anchor="end">'+Math.round(max*f)+'</text>';}).join('');
  const xIdxs = trend.length>1 ? [...new Set([0,Math.floor((trend.length-1)/2),trend.length-1])] : [0];
  const xLabels = xIdxs.map(i=>{const p=points[i],d=new Date(p.day),label=isNaN(d)?p.day:d.toLocaleDateString(undefined,{month:'short',day:'numeric'});return '<text x="'+p.x+'" y="'+(H-8)+'" class="axis-label" text-anchor="middle">'+label+'</text>';}).join('');
  const dots = points.map((p,i)=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="3.5" class="chart-dot" data-i="'+i+'"/>').join('');
  wrap.innerHTML = '<svg viewBox="0 0 '+W+' '+H+'" class="trend-svg" id="trendSvg" preserveAspectRatio="none"><defs><linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.35"/><stop offset="100%" style="stop-color:var(--accent);stop-opacity:0"/></linearGradient></defs>'+gridLines+'<path d="'+areaPath+'" fill="url(#trendGrad)" stroke="none"/><path d="'+linePath+'" class="trend-line"/>'+dots+xLabels+'<rect x="'+padL+'" y="0" width="'+innerW+'" height="'+H+'" fill="transparent" id="trendHitArea"/></svg><div class="chart-tooltip" id="trendTooltip" style="display:none"></div>';
  const svg=document.getElementById('trendSvg'), tooltip=document.getElementById('trendTooltip'), hitArea=document.getElementById('trendHitArea');
  hitArea.addEventListener('mousemove',(e)=>{
    const rect=svg.getBoundingClientRect(), mouseX=(e.clientX-rect.left)*(W/rect.width);
    let idx = step>0 ? Math.round((mouseX-padL)/step) : 0; idx=Math.max(0,Math.min(points.length-1,idx));
    const p=points[idx];
    svg.querySelectorAll('.chart-dot').forEach(d=>d.classList.remove('active'));
    svg.querySelector('.chart-dot[data-i="'+idx+'"]').classList.add('active');
    const d=new Date(p.day), dateLabel=isNaN(d)?p.day:d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
    tooltip.innerHTML='<strong>'+formatNumber(p.count)+'</strong> clicks<br><span>'+dateLabel+'</span>';
    tooltip.style.display='block';
    const cssX=p.x*(rect.width/W), cssY=p.y*(rect.height/H);
    tooltip.style.left=Math.min(rect.width-100,Math.max(0,cssX-50))+'px'; tooltip.style.top=Math.max(0,cssY-12)+'px';
  });
  hitArea.addEventListener('mouseleave',()=>{tooltip.style.display='none'; svg.querySelectorAll('.chart-dot').forEach(d=>d.classList.remove('active'));});
}

function renderScoreHistogram(buckets, targetId) {
  const total = buckets.high + buckets.medium + buckets.low + buckets.critical;
  const rows = [
    { label: 'Trusted (70-100)', count: buckets.high, color: 'var(--good)' },
    { label: 'Mixed (40-69)', count: buckets.medium, color: 'var(--amber)' },
    { label: 'Suspicious (20-39)', count: buckets.low, color: 'var(--danger)' },
    { label: 'Likely bot (0-19)', count: buckets.critical, color: '#8b3a3d' },
  ];
  const max = Math.max(1, ...rows.map(r => r.count));
  document.getElementById(targetId).innerHTML = total ? rows.map(r => {
    const w = (r.count / max) * 100;
    const pct = total ? Math.round((r.count / total) * 100) : 0;
    return '<li><div class="rank-row"><span class="rank-label">' + r.label + '</span><span class="rank-value">' + r.count + ' <span class="rank-pct">' + pct + '%</span></span></div>' +
      '<div class="rank-bar-track"><div class="rank-bar-fill" style="width:' + w + '%;background:' + r.color + '"></div></div></li>';
  }).join('') : '<li class="empty">no data</li>';
}

function renderDonut(items, targetId) {
  const el = document.getElementById(targetId);
  if (!items || !items.length) { el.innerHTML = '<div class="empty">no data</div>'; return; }
  const total = items.reduce((s, i) => s + i.count, 0);
  const colors = ['#5b7fff', '#34d399', '#e8a33d', '#f2555a', '#8b5cf6', '#06b6d4'];
  let angle = 0;
  const radius = 60, cx = 80, cy = 80, circumference = 2 * Math.PI * radius;
  const segments = items.slice(0, 6).map((item, i) => {
    const frac = item.count / total;
    const dash = frac * circumference;
    const seg = '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="' + colors[i % colors.length] + '" stroke-width="22" stroke-dasharray="' + dash + ' ' + circumference + '" stroke-dashoffset="' + (-angle * circumference / 360) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
    angle += frac * 360;
    return seg;
  }).join('');
  const legend = items.slice(0, 6).map((item, i) =>
    '<div style="display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--fg-dim);margin-bottom:4px;"><span style="width:9px;height:9px;border-radius:2px;background:' + colors[i % colors.length] + ';display:inline-block;"></span>' + item.key + ' (' + item.count + ')</div>'
  ).join('');
  el.innerHTML = '<div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;"><svg width="160" height="160" viewBox="0 0 160 160">' + segments + '</svg><div>' + legend + '</div></div>';
}

async function loadAnalytics() {
  const res = await fetch('/api/analytics');
  if (!res.ok) return;
  const data = await res.json();

  document.getElementById('analyticsStatGrid').innerHTML =
    statCard(data.total_links, 'Total links') +
    statCard(data.total_clicks, 'Total clicks') +
    gaugeCard(data.avg_bot_score, 'Avg bot score', 100, data.avg_bot_score < 70 ? 'warn' : '') +
    gaugeCard(data.vpn_count, 'VPN/proxy clicks', Math.max(1, data.total_clicks), data.vpn_count > 0 ? 'warn' : '');

  renderScoreHistogram(data.score_buckets, 'analyticsScoreHistogram');
  document.getElementById('analyticsCountryList').innerHTML = rankedList(data.top_countries);
  renderDonut(data.devices, 'analyticsDeviceDonut');
  document.getElementById('analyticsProtocolList').innerHTML = rankedList(data.protocol_breakdown);
  document.getElementById('analyticsTlsList').innerHTML = rankedList(data.tls_breakdown);
  renderTrend(data.trend || [], 'analyticsTrendWrap', 'analyticsTrendTotal');
}

function openClickPanel(index) {
  const c = window.currentClicks[index];
  const time = new Date(c.timestamp).toLocaleString();
  const cls = scoreClass(c.bot_score ?? 0);
  document.getElementById('clickPanelBody').innerHTML =
    '<div class="panel-section"><h3>Visit</h3><div class="panel-row"><span class="k">Time</span><span class="v">'+time+'</span></div><div class="panel-row"><span class="k">Visit #</span><span class="v">'+c.visit_number+'</span></div><div class="panel-row"><span class="k">Referrer</span><span class="v">'+(c.referrer||'Direct')+'</span></div></div>' +
    '<div class="panel-section"><h3>Location</h3><div class="panel-row"><span class="k">City/Country</span><span class="v">'+(c.city||'?')+', '+(c.country||'?')+'</span></div><div class="panel-row"><span class="k">ISP</span><span class="v">'+c.isp+'</span></div><div class="panel-row"><span class="k">VPN/Proxy</span><span class="v">'+(c.is_vpn?'<span class="badge warn">Yes</span>':'No')+'</span></div><div class="panel-row"><span class="k">Colo</span><span class="v">'+(c.colo||'—')+'</span></div></div>' +
    '<div class="panel-section"><h3>Device</h3><div class="panel-row"><span class="k">Browser</span><span class="v">'+c.browser+'</span></div><div class="panel-row"><span class="k">OS</span><span class="v">'+c.os+(c.os_version?' '+c.os_version:' (version unavailable)')+'</span></div><div class="panel-row"><span class="k">Device</span><span class="v">'+c.device+'</span></div><div class="panel-row"><span class="k">In-app browser</span><span class="v">'+(c.is_in_app_browser?'<span class="badge warn">Yes</span>':'No')+'</span></div></div>' +
    '<div class="panel-section"><h3>Security signal</h3><div class="panel-row"><span class="k">Bot score</span><span class="v score-num '+cls+'">'+c.bot_score+'</span></div><ul class="reason-list">'+c.reasons.map(r=>'<li>▸ '+r+'</li>').join('')+'</ul><div class="panel-row" style="margin-top:8px"><span class="k">HTTP / TLS</span><span class="v">'+(c.http_protocol||'—')+' / '+(c.tls_version||'—')+'</span></div></div>' +
    '<div class="panel-section"><div class="raw-toggle" onclick="toggleRawDump(this)">▸ raw headers</div><div class="raw-dump">'+escapeHtml(JSON.stringify(c.raw_headers,null,2))+'</div></div>';
  document.getElementById('clickOverlay').style.display = 'flex';
}
function closeClickPanel() { document.getElementById('clickOverlay').style.display = 'none'; }
function toggleRawDump(el) { const dump = el.nextElementSibling; dump.style.display = dump.style.display === 'block' ? 'none' : 'block'; }

function startEdit() { document.getElementById('editDestUrl').value = document.getElementById('detailDest').textContent; document.getElementById('editBox').style.display = 'block'; }
async function saveEdit() {
  const destination_url = document.getElementById('editDestUrl').value;
  const msg = document.getElementById('editMsg');
  try {
    const res = await fetch('/api/links/' + currentLinkId, { method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify({ destination_url }) });
    const data = await res.json();
    if (res.ok) openDetail(currentLinkId); else { msg.textContent = data.error; msg.className = 'msg error'; }
  } catch (e) { msg.textContent = 'network error'; msg.className = 'msg error'; }
}

async function confirmDelete() {
  currentDeleteSlug = document.getElementById('detailSlug').textContent.trim();
  document.getElementById('deleteConfirmText').textContent = 'Type ' + currentDeleteSlug + ' to confirm deletion';
  document.getElementById('deleteConfirmInput').value = '';
  document.getElementById('deleteConfirmMsg').textContent = '';
  document.getElementById('deleteOverlay').style.display = 'flex';
}
function hideDeleteOverlay() { document.getElementById('deleteOverlay').style.display = 'none'; }
async function executeDelete() {
  const typed = document.getElementById('deleteConfirmInput').value.trim();
  const msg = document.getElementById('deleteConfirmMsg');
  if (typed !== currentDeleteSlug) { msg.textContent = 'Slug did not match.'; msg.className = 'msg error'; return; }
  const res = await fetch('/api/links/' + currentLinkId, { method: 'DELETE' });
  if (res.ok) { hideDeleteOverlay(); switchView('links'); loadLinks(); } else { msg.textContent = 'Delete failed.'; msg.className = 'msg error'; }
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  return Math.floor(s/86400) + 'd ago';
}
function parseSessionUA(ua) {
  ua = (ua||'').toLowerCase();
  if (!ua) return 'Older session (pre-tracking)';
  let b='Unknown browser';
  if (ua.includes('edg/')) b='Edge'; else if (ua.includes('chrome/')) b='Chrome'; else if (ua.includes('firefox/')) b='Firefox'; else if (ua.includes('safari/')) b='Safari';
  let os='';
  if (ua.includes('windows')) os='Windows'; else if (ua.includes('android')) os='Android'; else if (ua.includes('iphone')||ua.includes('ipad')) os='iOS'; else if (ua.includes('mac os')) os='macOS'; else if (ua.includes('linux')) os='Linux';
  return b + (os ? ' · ' + os : '');
}
async function loadSessions() {
  const res = await fetch('/api/sessions');
  if (!res.ok) return;
  const data = await res.json();
  document.getElementById('sessionsList').innerHTML = data.sessions.map(s =>
    '<div class="session-row"><div>' + parseSessionUA(s.user_agent) + (s.is_current ? '<span class="badge-current">this device</span>' : '') +
    '<div class="session-meta">last active ' + timeAgo(s.last_seen || s.created_at) + '</div></div>' +
    (s.is_current ? '' : '<button class="danger" onclick="revokeOne(\\''+s.id+'\\')">Revoke</button>') + '</div>'
  ).join('');
}
async function revokeOne(id) { await fetch('/api/sessions/' + id, { method: 'DELETE' }); loadSessions(); }
async function revokeOthers() {
  await fetch('/api/sessions/revoke-all', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ include_current: false }) });
  document.getElementById('sessionMsg').textContent = 'Logged out of all other devices.';
  loadSessions();
}
async function revokeAll() {
  if (!confirm('This will log you out on this device too. Continue?')) return;
  await fetch('/api/sessions/revoke-all', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ include_current: true }) });
  window.location.href = '/';
}

let chatOpen = false, chatSending = false;
window.clientChatHistory = [];

const CHAT_MASCOT_POOL = [
  '/icons/3d-business-black-cute-robot-with-speech-bubble.gif',
  '/icons/3d-business-black-friendly-cute-robot.gif',
  '/icons/3d-business-black-gpt-robot-with-speech-bubble.gif',
  '/icons/3d-business-black-gpt-robot-with-speech-bubble-2.gif',
  '/icons/3d-business-chatbot-using-laptop.gif',
  '/icons/3d-business-cute-robot-with-speech-bubble.gif',
  '/icons/3d-business-friendly-cute-robot.gif',
  '/icons/3d-business-gpt-robot-with-speech-bubble.gif',
  '/icons/black-chatbot-using-laptop.gif',
  '/icons/black-cute-robot-running.gif',
  '/icons/black-cute-robot-standing.gif',
  '/icons/black-cute-robot-using-laptop.gif',
  '/icons/cute-robot-standing-1.gif',
  '/icons/3d-fluency-robot-1.gif',
];

function escapeHtml(str) { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }
function appendChatBubble(role, content) {
  const messages = document.getElementById('chatMessages');
  const empty = document.getElementById('chatEmpty');
  if (empty) empty.remove();
  const mascot = document.getElementById('chatMascot');
  if (mascot) mascot.style.display = 'none';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble ' + role;
  const text = escapeHtml(content).replace(/\\n/g, '<br>');
  bubble.innerHTML = role === 'error'
    ? '<img src="/icons/cracked-satellite-dish-no-connection-or-network-failure-problem.gif" alt="" style="width:20px; height:20px; vertical-align:middle; margin-right:6px;" />' + text
    : text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}
function setChatTyping(v) { document.getElementById('chatTyping').style.display = v ? 'flex' : 'none'; }
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatPanel').style.display = chatOpen ? 'flex' : 'none';
  if (chatOpen) {
    document.getElementById('chatInput').focus();
    const mascot = document.getElementById('chatMascot');
    if (mascot) {
      mascot.src = CHAT_MASCOT_POOL[Math.floor(Math.random() * CHAT_MASCOT_POOL.length)];
      mascot.style.display = 'block';
    }
  }
}
function handleChatKeydown(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }
function autoGrowChatInput(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 100) + 'px'; }

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message || chatSending) return;
  chatSending = true;
  document.getElementById('chatSendBtn').disabled = true;
  appendChatBubble('user', message);
  input.value = ''; input.style.height = 'auto';
  setChatTyping(true);
  try {
    const res = await fetch('/api/chat', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ message, history: window.clientChatHistory }) });
    const data = await res.json().catch(()=>null);
    setChatTyping(false);
    if (res.ok && data && data.reply) {
      appendChatBubble('assistant', data.reply);
      window.clientChatHistory.push({role:'user',content:message},{role:'assistant',content:data.reply});
      window.clientChatHistory = window.clientChatHistory.slice(-4);
    } else { appendChatBubble('error', (data && data.error) || 'Something went wrong.'); }
  } catch (e) { setChatTyping(false); appendChatBubble('error', 'Network error.'); }
  finally { chatSending = false; document.getElementById('chatSendBtn').disabled = false; }
}

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
    const loginEl = document.getElementById('login');
    if (!feedBody || !loginEl || loginEl.style.display === 'none') return;

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

loadLinks();
</script>
</body>
</html>`;