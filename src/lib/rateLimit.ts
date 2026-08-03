export async function isRateLimited(env: any, key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const current = await env.RATE_LIMIT_KV.get(key);
  const count = current ? parseInt(current) : 0;
  if (count >= limit) return true;
  await env.RATE_LIMIT_KV.put(key, String(count + 1), { expirationTtl: windowSeconds });
  return false;
}