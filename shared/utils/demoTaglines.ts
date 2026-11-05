/**
 * Sample taglines for demo mode (no API key configured). Built from the idea with simple
 * templates, so the widget still shows something relevant. Deterministic for a given idea.
 */
const TEMPLATES: ((s: string) => string)[] = [
  (s) => `${cap(s)}, but brighter.`,
  (s) => `Bend the light on ${s}.`,
  (s) => `${cap(s)} in full color.`,
  (s) => `The rainbow way to do ${s}.`,
  (s) => `${cap(s)}: now with extra sparkle.`,
  (s) => `Small idea, big glow: ${s}.`,
  (s) => `Turn ${s} into something people smile at.`,
  (s) => `${cap(s)}, refracted.`,
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "A bakery that delivers rainbow croissants by drone" → "bakery". Short subjects read best. */
export function ideaSubject(idea: string): string {
  const cleaned = idea
    .trim()
    .replace(/[.!?]+$/, "")
    .replace(/^(an?|the|my|our)\s+/i, "");
  const head = cleaned.split(/\s+(?:that|which|who)\s+/i)[0] ?? cleaned;
  const words = head.split(/\s+/).slice(0, 5).join(" ");
  return words.toLowerCase() || "your idea";
}

export function demoTaglines(idea: string): [string, string, string] {
  const subject = ideaSubject(idea);
  // Simple string hash → stable starting template for this idea.
  let hash = 0;
  for (const ch of idea) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const pick = (offset: number) => TEMPLATES[(hash + offset * 3) % TEMPLATES.length]!(subject);
  return [pick(0), pick(1), pick(2)];
}
