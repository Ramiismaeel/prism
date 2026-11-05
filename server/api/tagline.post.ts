import { z } from "zod";
import { demoTaglines } from "#shared/utils/demoTaglines";
import { IDEA_MAX, IDEA_MIN } from "#shared/utils/tagline";

const Body = z.object({ idea: z.string().trim().min(IDEA_MIN).max(IDEA_MAX) });

/**
 * POST /api/tagline { idea } → { taglines, provider, demo, fallbackFrom? }
 *
 * Provider order: Claude (NUXT_ANTHROPIC_API_KEY) → Gemini (NUXT_GEMINI_API_KEY) → demo.
 * Keys stay on the server (runtimeConfig). If the provider is busy, slow, rate-limited or
 * misconfigured, the visitor gets clearly-labelled sample taglines instead of an error, and
 * the reason is logged here. Only a safety decline (422) and bad input (400) surface as errors.
 */
export default defineEventHandler(async (event) => {
  rateLimit(event, { key: "tagline", limit: 8, windowMs: 60_000 });

  const parsed = Body.safeParse(await readBody(event).catch(() => undefined));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: `Describe your idea in ${IDEA_MIN}–${IDEA_MAX} characters.` });
  }
  const idea = parsed.data.idea;

  const { anthropicApiKey, geminiApiKey } = useRuntimeConfig(event);
  const provider: TaglineProvider | undefined = anthropicApiKey ? "claude" : geminiApiKey ? "gemini" : undefined;
  if (!provider) return { taglines: demoTaglines(idea), provider: "demo" as const, demo: true };

  try {
    const taglines =
      provider === "claude" ? await claudeTaglines(anthropicApiKey, idea) : await geminiTaglines(geminiApiKey, idea);
    return { taglines, provider, demo: false };
  } catch (error) {
    if (isError(error)) throw error; // our own 422 (safety decline)
    console.error(`[tagline] ${provider} failed, serving samples: ${describeFailure(error)}`);
    return { taglines: demoTaglines(idea), provider: "demo" as const, demo: true, fallbackFrom: provider };
  }
});
