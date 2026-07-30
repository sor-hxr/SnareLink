export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface BotScoreResult { score: number; reasons: string[]; }

export function computeBotScore(request: Request): BotScoreResult {
  const cf = request.cf as any;
  const ua = request.headers.get('user-agent') || '';
  const uaLower = ua.toLowerCase();
  const asOrg = (cf?.asOrganization as string) || '';
  const acceptLang = request.headers.get('accept-language') || '';
  const httpProtocol = (cf?.httpProtocol as string) || '';

  let score = 100;
  const reasons: string[] = [];

  const knownScanners = [
    'microsoft', 'msexchange', 'exchangeonline', 'safelinks', 'atp-',
    'barracuda', 'mimecast', 'proofpoint', 'symantec', 'trendmicro',
    'google', 'googleimageproxy',
  ];
  if (knownScanners.some(s => uaLower.includes(s)) || uaLower.includes('bot') || uaLower.includes('crawler')) {
    score -= 50;
    reasons.push('Known scanner/crawler user-agent (-50)');
  }

  const datacenterHints = ['amazon', 'google cloud', 'microsoft azure', 'digitalocean', 'ovh', 'hetzner'];
  if (datacenterHints.some(d => asOrg.toLowerCase().includes(d))) {
    score -= 25;
    reasons.push('Datacenter/hosting ASN (-25)');
  }

  if (request.method === 'HEAD') {
    score -= 15;
    reasons.push('HEAD request method (-15)');
  }

  if (!acceptLang) {
    score -= 15;
    reasons.push('Missing Accept-Language header (-15)');
  }

  if (httpProtocol === 'HTTP/1.1') {
    score -= 10;
    reasons.push('Legacy HTTP/1.1 protocol (-10)');
  }

  if (!request.headers.get('sec-ch-ua')) {
    score -= 10;
    reasons.push('Missing sec-ch-ua client hint (-10)');
  }

  if (!reasons.length) reasons.push('No suspicious signals detected');

  return { score: Math.max(0, Math.min(100, score)), reasons };
}
