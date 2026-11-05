/**
 * Stable Lorem Picsum URL for a readable seed (PROJECT_PLAN.md rule 7).
 *
 * Use this instead of a template literal inside a template binding: vue-tsc 3.3 mangles
 * `` :src="`https://…${x}`" `` on components (the `//` becomes a comment start), which breaks
 * type-checking for the rest of the template.
 */
export function picsum(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
