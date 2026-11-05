import { z } from "zod";

/**
 * "Recipes" for the AI component generator. The AI never writes code: it fills in one of these
 * shapes, the server validates it with Zod, and the playground renders it with Prism's own
 * components (SpecRenderer). Anything outside these shapes is rejected.
 * Shared by server/api/component.post.ts and the playground.
 */

export const SPEC_COLORS = ["grape", "coral", "sun", "mint", "sky"] as const;
export const SPEC_ICONS = [
  "sparkles", "heart", "star", "rocket", "palette", "bell", "moon", "sun", "check", "zap",
  "gem", "magnet", "music", "camera", "mail", "settings", "download", "arrow-right", "shopping-cart", "gift",
  "flame", "leaf", "coffee", "user", "lock", "play", "info", "thumbs-up", "smile", "wand-sparkles",
] as const;

const color = z.enum(SPEC_COLORS);
const icon = z.enum(SPEC_ICONS);
const short = z.string().min(1).max(40);
const text = z.string().min(1).max(220);

export const componentSpec = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("button"),
    label: short,
    variant: z.enum(["solid", "outline", "ghost"]),
    color,
    size: z.enum(["sm", "md", "lg"]),
    icon: icon.optional(),
    /** Pulled toward the cursor (MagneticButton). */
    magnetic: z.boolean(),
  }),
  z.object({ type: z.literal("toggle"), label: short, color, checked: z.boolean() }),
  z.object({
    type: z.literal("badge"),
    label: short,
    color,
    variant: z.enum(["soft", "solid", "outline"]),
    dot: z.boolean(),
    icon: icon.optional(),
  }),
  z.object({
    type: z.literal("card"),
    title: short,
    body: text,
    accent: color,
    icon: icon.optional(),
    /** Lifts on hover. */
    interactive: z.boolean(),
  }),
  z.object({ type: z.literal("tilt-card"), title: short, subtitle: short, from: color, to: color, icon: icon.optional() }),
  z.object({ type: z.literal("tooltip"), buttonLabel: short, text: z.string().min(1).max(80), placement: z.enum(["top", "bottom", "left", "right"]) }),
  z.object({
    type: z.literal("tabs"),
    tabs: z.array(z.object({ label: short, content: text })).min(2).max(4),
  }),
  z.object({
    type: z.literal("accordion"),
    items: z.array(z.object({ title: z.string().min(1).max(80), content: text })).min(2).max(5),
  }),
  z.object({ type: z.literal("marquee"), items: z.array(short).min(3).max(8), speed: z.enum(["slow", "normal", "fast"]) }),
  z.object({
    type: z.literal("stat"),
    value: z.number().min(0).max(1e9),
    label: short,
    prefix: z.string().max(3).optional(),
    suffix: z.string().max(3).optional(),
    decimals: z.number().int().min(0).max(2),
  }),
  z.object({ type: z.literal("split-text"), text: z.string().min(1).max(60), by: z.enum(["word", "char"]), color }),
  z.object({ type: z.literal("modal"), buttonLabel: short, title: short, body: text, color }),
  z.object({
    type: z.literal("toast"),
    buttonLabel: short,
    toastType: z.enum(["success", "info", "warning", "error"]),
    title: short,
    description: z.string().max(100),
  }),
]);

/** What the AI returns: one component plus a one-line, friendly summary. */
export const componentRecipe = z.object({
  summary: z.string().min(1).max(160),
  component: componentSpec,
});

export type ComponentSpec = z.infer<typeof componentSpec>;
export type ComponentRecipe = z.infer<typeof componentRecipe>;
export type ComponentType = ComponentSpec["type"];

export const COMPONENT_TYPES = componentSpec.options.map((o) => o.shape.type.value) as ComponentType[];

export const PROMPT_MIN = 3;
export const PROMPT_MAX = 200;
