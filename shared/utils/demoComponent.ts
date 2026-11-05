import type { ComponentRecipe, ComponentSpec } from "./componentSpec";

type Color = "grape" | "coral" | "sun" | "mint" | "sky";

/**
 * Demo mode for the component generator (no API key, or the provider failed): a simple keyword
 * matcher that still turns "make a mint toggle for dark mode" into a sensible recipe.
 */
const COLOR_WORDS: [RegExp, Color][] = [
  [/\b(purple|violet|grape|lavender)\b/i, "grape"],
  [/\b(red|pink|coral|rose)\b/i, "coral"],
  [/\b(yellow|orange|gold|sun|amber)\b/i, "sun"],
  [/\b(green|mint|emerald|teal)\b/i, "mint"],
  [/\b(blue|sky|cyan|navy)\b/i, "sky"],
];

const quoted = (prompt: string) => /["“'‘]([^"”'’]{1,40})["”'’]/.exec(prompt)?.[1];
const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/** "a toggle for dark mode" → "Dark mode"; falls back to `fallback`. */
function topic(prompt: string, fallback: string): string {
  const m = /\b(?:for|about|called|named|saying|says|labell?ed)\s+(.{2,40}?)(?:[.,!?]|$)/i.exec(prompt);
  const raw = quoted(prompt) ?? m?.[1]?.replace(/^(the|a|an|my|our)\s+/i, "");
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : fallback;
}

export function demoRecipe(prompt: string): ComponentRecipe {
  const color: Color = COLOR_WORDS.find(([re]) => re.test(prompt))?.[1] ?? "grape";
  const p = prompt.toLowerCase();
  const has = (...words: string[]) => words.some((w) => p.includes(w));
  let component: ComponentSpec;

  if (has("toggle", "switch")) {
    component = { type: "toggle", label: topic(prompt, "Enable sparkles"), color, checked: false };
  } else if (has("tab")) {
    const t = topic(prompt, "Prism");
    component = { type: "tabs", tabs: [
      { label: "Overview", content: `Everything you need to know about ${t}, in one glance.` },
      { label: "Details", content: `The finer points of ${t}, explained without the jargon.` },
      { label: "FAQ", content: `Quick answers to the questions people ask most about ${t}.` },
    ] };
  } else if (has("accordion", "faq", "question")) {
    const t = topic(prompt, "Prism");
    component = { type: "accordion", items: [
      { title: `What is ${t}?`, content: `${t} is a bright idea we'd love to tell you more about.` },
      { title: "How do I get started?", content: "Pick an option, press the big button, and enjoy the glow." },
      { title: "Can I change my mind later?", content: "Of course. Everything here is flexible and friendly." },
    ] };
  } else if (has("marquee", "ticker", "scrolling", "logos")) {
    component = { type: "marquee", items: ["Lumen", "Spectra", "Halo", "Refract", "Beam"], speed: "normal" };
  } else if (has("counter", "count", "stat", "number", "metric")) {
    component = { type: "stat", value: 1280, label: topic(prompt, "Happy customers"), suffix: "+", decimals: 0 };
  } else if (has("modal", "dialog", "popup", "pop-up")) {
    component = { type: "modal", buttonLabel: "Open", title: topic(prompt, "Hello there"), body: "A friendly dialog with a springy entrance. Press Escape or click outside to close it.", color };
  } else if (has("toast", "notification", "alert", "snackbar")) {
    component = { type: "toast", buttonLabel: "Show notification", toastType: "success", title: topic(prompt, "All done!"), description: "Your change was saved." };
  } else if (has("tooltip", "hint")) {
    component = { type: "tooltip", buttonLabel: "Hover me", text: topic(prompt, "Here's a helpful hint"), placement: "top" };
  } else if (has("badge", "tag", "chip", "pill", "label")) {
    component = { type: "badge", label: topic(prompt, "New"), color, variant: "soft", dot: true };
  } else if (has("tilt", "3d")) {
    component = { type: "tilt-card", title: topic(prompt, "Glow Branding"), subtitle: "Tilt me around", from: color, to: color === "coral" ? "sun" : "coral", icon: "gem" };
  } else if (has("card")) {
    component = { type: "card", title: topic(prompt, "Bright idea"), body: "A calm surface for content, with a colored accent and a little lift on hover.", accent: color, icon: "sparkles", interactive: true };
  } else if (has("headline", "heading", "title", "text")) {
    component = { type: "split-text", text: titleCase(topic(prompt, "We bend light into ideas")), by: "word", color };
  } else {
    // Default: a button (the most common request).
    component = { type: "button", label: topic(prompt, "Click me"), variant: "solid", color, size: "lg", icon: "sparkles", magnetic: has("magnet", "follow", "cursor") };
  }

  return { summary: `Sample ${component.type.replace("-", " ")} picked from your keywords.`, component };
}
