export function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  const u = ua.toLowerCase();
  let browser = 'Unknown';
  if (u.includes('edg/')) browser = 'Edge';
  else if (u.includes('opr/') || u.includes('opera')) browser = 'Opera';
  else if (u.includes('samsungbrowser')) browser = 'Samsung Internet';
  else if (u.includes('crios')) browser = 'Chrome (iOS)';
  else if (u.includes('chrome/')) browser = 'Chrome';
  else if (u.includes('fxios')) browser = 'Firefox (iOS)';
  else if (u.includes('firefox/')) browser = 'Firefox';
  else if (u.includes('safari/') && !u.includes('chrome')) browser = 'Safari';

  let os = 'Unknown';
  if (u.includes('windows')) os = 'Windows';
  else if (u.includes('android')) os = 'Android';
  else if (u.includes('iphone') || u.includes('ipad')) os = 'iOS';
  else if (u.includes('mac os')) os = 'macOS';
  else if (u.includes('linux')) os = 'Linux';

  let device = 'Desktop';
  if (u.includes('mobile') || u.includes('android')) device = 'Mobile';
  if (u.includes('ipad') || u.includes('tablet')) device = 'Tablet';

  return { browser, os, device };
}

const IN_APP_TOKENS = ['fban', 'fbav', 'instagram', 'tiktok', 'twitter', 'line/', 'micromessenger', 'snapchat', 'pinterest'];

export function isInAppBrowser(ua: string): boolean {
  const u = ua.toLowerCase();
  return IN_APP_TOKENS.some(t => u.includes(t));
}

export function isChromiumBased(ua: string): boolean {
  const u = ua.toLowerCase();
  if (u.includes('crios') || u.includes('fxios') || (u.includes('safari') && !u.includes('chrome') && !u.includes('android'))) return false;
  return u.includes('chrome/') || u.includes('edg/') || u.includes('opr/') || u.includes('samsungbrowser');
}
