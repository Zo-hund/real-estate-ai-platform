import { Redis } from '@upstash/redis';
import { apiConfig } from './api-integrations';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function rateLimit(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const key = `rate-limit:${ip}`;

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, apiConfig.rateLimit.windowMs / 1000);
  }

  const remaining = Math.max(0, apiConfig.rateLimit.max - current);

  return {
    success: current <= apiConfig.rateLimit.max,
    remaining,
    reset: await redis.ttl(key),
  };
}
