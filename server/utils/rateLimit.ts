import type { H3Event } from "h3";

const hits = new Map<string, number[]>();

/**
 * Tiny in-memory sliding-window rate limit per client IP (throws 429).
 * Fine for a single server instance; use a shared store (e.g. Redis) when scaling out.
 */
export function rateLimit(event: H3Event, { key, limit, windowMs }: { key: string; limit: number; windowMs: number }) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - recent[0]!)) / 1000);
    setResponseHeader(event, "Retry-After", retryAfter);
    throw createError({ statusCode: 429, statusMessage: "Too many requests. Please wait a moment and try again." });
  }

  recent.push(now);
  hits.set(id, recent);
  // Opportunistic cleanup so the map can't grow forever.
  if (hits.size > 5000) for (const [k, v] of hits) if (now - (v.at(-1) ?? 0) > windowMs) hits.delete(k);
}
