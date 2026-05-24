import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const upstashRatelimit = upstashUrl && upstashToken
  ? new Ratelimit({
      redis: new Redis({ url: upstashUrl, token: upstashToken }),
      limiter: Ratelimit.slidingWindow(3, '1h'),
      analytics: true,
      prefix: 'newsletter_subscription',
    })
  : null;

// Alternative in-memory rate limiter for development (if Redis not available)
class SimpleRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxAttempts = 3;
  private readonly windowMs = 60 * 60 * 1000; // 1 hour

  async limit(identifier: string) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts || now >= userAttempts.resetTime) {
      // Reset window
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return {
        success: true,
        limit: this.maxAttempts,
        remaining: this.maxAttempts - 1,
        reset: now + this.windowMs
      };
    }

    if (userAttempts.count >= this.maxAttempts) {
      return {
        success: false,
        limit: this.maxAttempts,
        remaining: 0,
        reset: userAttempts.resetTime
      };
    }

    userAttempts.count++;
    return {
      success: true,
      limit: this.maxAttempts,
      remaining: this.maxAttempts - userAttempts.count,
      reset: userAttempts.resetTime
    };
  }

  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.attempts.entries()) {
      if (now >= value.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

// Fallback rate limiter for development
export const fallbackRatelimit = new SimpleRateLimiter();

// Export Upstash if configured, otherwise fall back to in-memory limiter
export const ratelimit = upstashRatelimit ?? fallbackRatelimit;

// Clean up fallback rate limiter every 10 minutes
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    fallbackRatelimit.cleanup();
  }, 10 * 60 * 1000);
}