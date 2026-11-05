import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { GoogleGenAI } from "@google/genai";
import type { H3Event } from "h3";
import { z } from "zod";

/**
 * Shared AI access for the playground widgets: Claude (Haiku 5.5) if NUXT_ANTHROPIC_API_KEY is
 * set, else Gemini (flash-lite) if NUXT_GEMINI_API_KEY is set, else none (callers use demo mode).
 * Both providers return JSON validated against a Zod schema (structured outputs).
 */
export type AiProvider = "claude" | "gemini";

export function pickProvider(event: H3Event): { provider: AiProvider; apiKey: string } | undefined {
  const { anthropicApiKey, geminiApiKey } = useRuntimeConfig(event);
  if (anthropicApiKey) return { provider: "claude", apiKey: anthropicApiKey };
  if (geminiApiKey) return { provider: "gemini", apiKey: geminiApiKey };
  return undefined;
}

/** The provider declined the request (safety). Surfaced to the user as a 422. */
export const declined = () =>
  createError({ statusCode: 422, statusMessage: "Let's try a different idea, that one didn't work out." });

interface JsonRequest<T extends z.ZodType> {
  system: string;
  prompt: string;
  schema: T;
  maxTokens?: number;
}

let claude: Anthropic | undefined;
let gemini: GoogleGenAI | undefined;

// "-latest" alias: fast, cheap, free tier. (gemini-flash-latest was often overloaded / 503.)
const GEMINI_MODEL = "gemini-flash-lite-latest";

export async function generateJson<T extends z.ZodType>(
  { provider, apiKey }: { provider: AiProvider; apiKey: string },
  { system, prompt, schema, maxTokens = 1024 }: JsonRequest<T>,
): Promise<z.infer<T>> {
  if (provider === "claude") {
    claude ??= new Anthropic({ apiKey, maxRetries: 1, timeout: 15_000 });
    const response = await claude.messages.parse({
      model: "claude-haiku-5-5",
      max_tokens: maxTokens,
      // Small structured tasks: no thinking needed (allowed on Haiku 5.5 at effort high or below).
      thinking: { type: "disabled" },
      output_config: { effort: "low", format: zodOutputFormat(schema) },
      system,
      messages: [{ role: "user", content: prompt }],
    });
    if (response.stop_reason === "refusal") throw declined();
    if (response.parsed_output == null) throw new Error(`Claude returned no parsable output (${response.stop_reason})`);
    return response.parsed_output as z.infer<T>;
  }

  // The SDK defaults to 5 attempts with up to 60s backoff; keep a visitor's wait short instead.
  gemini ??= new GoogleGenAI({
    apiKey,
    httpOptions: { timeout: 10_000, retryOptions: { attempts: 2, initialDelay: 0.5, maxDelay: 2 } },
  });
  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: system,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(schema),
      maxOutputTokens: maxTokens,
    },
  });
  const finish = response.candidates?.[0]?.finishReason;
  if (response.promptFeedback?.blockReason || finish === "SAFETY" || finish === "PROHIBITED_CONTENT") throw declined();
  const parsed = schema.safeParse(JSON.parse(response.text ?? "null"));
  if (!parsed.success) throw new Error(`Gemini output failed validation: ${parsed.error.issues[0]?.message ?? "invalid"}`);
  return parsed.data;
}

/** Short, secret-free description of a provider failure for server logs. */
export function describeFailure(error: unknown): string {
  if (error instanceof Anthropic.APIError) return `Anthropic ${error.status ?? "?"} ${error.name}`;
  const e = error as { name?: string; status?: number; message?: string };
  return `${e.name ?? "Error"}${e.status ? ` ${e.status}` : ""}: ${String(e.message ?? "").slice(0, 120)}`;
}
