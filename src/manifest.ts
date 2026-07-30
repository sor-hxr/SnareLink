export function serveManifest(): Response {
  const manifest = {
    name: 'SnareLink',
    short_name: 'SnareLink',
    description: 'Link tracking with real-time bot detection',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0c10',
    theme_color: '#0a0c10',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { 'content-type': 'application/manifest+json' },
  });
}
