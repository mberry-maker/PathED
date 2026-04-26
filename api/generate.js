import { Redis } from "@upstash/redis";

// Lazy singleton. Redis.fromEnv() reads UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN, which Vercel injects when the Upstash for Redis
// marketplace integration is connected. Without those vars getRedis() returns
// null and the rate-limit block falls through (see catch below).
let _redis = null;
function getRedis() {
  if (_redis) return _redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  _redis = Redis.fromEnv();
  return _redis;
}

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Model and token limits are set HERE on the server. The client never controls them.
const MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 4000;
const MAX_PROMPT_CHARS = 16000;   // ~4000 tokens of input — plenty for PathED prompts
const RATE_LIMIT = 8;             // requests per IP per hour
const RATE_WINDOW = 3600;         // 1 hour in seconds

// Domains allowed to call this endpoint.
// Add your custom domain here when you set one up in Vercel.
const ALLOWED_ORIGINS = [
  "https://accommodatedpathways.com",
  "https://www.accommodatedpathways.com",
  "https://pathed.accommodatedpathways.com",
  "https://tool.accommodatedpathways.com",
];

// ─── CORS HELPER ─────────────────────────────────────────────────────────────
function setCORSHeaders(req, res) {
  const origin = req.headers.origin;
  const isDev = process.env.NODE_ENV !== "production";

  // Allow exact matches or Vercel preview URLs (*.vercel.app) during development
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    isDev ||
    (origin && origin.endsWith(".vercel.app"));

  if (isAllowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ─── HANDLER ─────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  setCORSHeaders(req, res);

  // Handle preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  // Method check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Content-type check
  if (!req.headers["content-type"]?.includes("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json" });
  }

  // ── RATE LIMITING ──────────────────────────────────────────────────────────
  // IP from Vercel's forwarded header, fallback to socket address
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  try {
    const redis = getRedis();
    if (redis) {
      const rateKey = `pathed:rate:${ip}`;
      const count = await redis.incr(rateKey);
      if (count === 1) await redis.expire(rateKey, RATE_WINDOW);
      if (count > RATE_LIMIT) {
        return res.status(429).json({
          error: "Too many requests. Please wait a while before generating another profile.",
        });
      }
    }
  } catch (kvError) {
    // Redis failure should not block the user, log and continue.
    console.error("Rate limit check failed:", kvError?.message);
  }

  // ── SERVER-SIDE VALIDATION ─────────────────────────────────────────────────
  // Extract ONLY what we expect. The client never controls model or max_tokens.
  const body = req.body;

  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const messages = body.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages must be a non-empty array" });
  }

  const firstMessage = messages[0];
  if (!firstMessage || firstMessage.role !== "user" || typeof firstMessage.content !== "string") {
    return res.status(400).json({ error: "Invalid message format" });
  }

  const promptContent = firstMessage.content;

  if (promptContent.length > MAX_PROMPT_CHARS) {
    return res.status(400).json({ error: "Request too large" });
  }

  if (promptContent.trim().length === 0) {
    return res.status(400).json({ error: "Prompt cannot be empty" });
  }

  // ── SAFE ANTHROPIC REQUEST ─────────────────────────────────────────────────
  // We build the request body here. Model and token limits are never client-controlled.
  const safeBody = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [{ role: "user", content: promptContent }],
  };

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(safeBody),
    });

    const data = await response.json();

    // Don't leak raw Anthropic error details to the client
    if (!response.ok) {
      console.error("Anthropic API error:", response.status, data);
      return res.status(502).json({ error: "Could not generate profile. Please try again." });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error?.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
