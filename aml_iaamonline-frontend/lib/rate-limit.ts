import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client for rate limiting
// In production, you should use environment variables for Redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'redis://localhost:6379',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Create rate limiter instance
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1h'), // 3 requests per hour
  analytics: true,
  prefix: 'newsletter_subscription',
});

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

// Clean up fallback rate limiter every 10 minutes
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    fallbackRatelimit.cleanup();
  }, 10 * 60 * 1000);
}