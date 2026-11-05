export const THEME_COLORS = ["grape", "coral", "sun", "mint", "sky"] as const;
export type ThemeColor = (typeof THEME_COLORS)[number];

interface ColorClasses {
  /** Plain background swatch. */
  bg: string;
  /** Text that passes contrast in both themes. */
  text: string;
  /** Filled surface with readable text (badges, solid buttons without hover). */
  fill: string;
  /** Hover state for filled buttons. */
  fillHover: string;
  /** Bordered, transparent surface. */
  outline: string;
  /** Hover tint for outline/ghost surfaces. */
  tintHover: string;
  /** Soft tinted surface (badges, chips). */
  soft: string;
}

// Full class strings (no interpolation) so Tailwind can detect them.
// Grape is dark enough for white text; the other four need dark text to pass contrast.
export const COLOR_CLASSES: Record<ThemeColor, ColorClasses> = {
  grape: {
    bg: "bg-grape",
    text: "text-grape-ink dark:text-grape-glow",
    fill: "bg-grape text-white",
    fillHover: "hover:bg-grape-ink",
    outline: "border-grape text-grape-ink dark:border-grape-glow dark:text-grape-glow",
    tintHover: "hover:bg-grape/10 dark:hover:bg-grape/20",
    soft: "bg-grape/10 text-grape-ink dark:bg-grape/20 dark:text-grape-glow",
  },
  coral: {
    bg: "bg-coral",
    text: "text-coral-ink dark:text-coral-glow",
    fill: "bg-coral text-zinc-950",
    fillHover: "hover:bg-coral-glow",
    outline: "border-coral text-coral-ink dark:border-coral-glow dark:text-coral-glow",
    tintHover: "hover:bg-coral/10 dark:hover:bg-coral/20",
    soft: "bg-coral/10 text-coral-ink dark:bg-coral/20 dark:text-coral-glow",
  },
  sun: {
    bg: "bg-sun",
    text: "text-sun-ink dark:text-sun-glow",
    fill: "bg-sun text-zinc-950",
    fillHover: "hover:bg-sun-glow",
    outline: "border-sun text-sun-ink dark:border-sun-glow dark:text-sun-glow",
    tintHover: "hover:bg-sun/10 dark:hover:bg-sun/20",
    soft: "bg-sun/15 text-sun-ink dark:bg-sun/20 dark:text-sun-glow",
  },
  mint: {
    bg: "bg-mint",
    text: "text-mint-ink dark:text-mint-glow",
    fill: "bg-mint text-zinc-950",
    fillHover: "hover:bg-mint-glow",
    outline: "border-mint text-mint-ink dark:border-mint-glow dark:text-mint-glow",
    tintHover: "hover:bg-mint/10 dark:hover:bg-mint/20",
    soft: "bg-mint/15 text-mint-ink dark:bg-mint/20 dark:text-mint-glow",
  },
  sky: {
    bg: "bg-sky",
    text: "text-sky-ink dark:text-sky-glow",
    fill: "bg-sky text-zinc-950",
    fillHover: "hover:bg-sky-glow",
    outline: "border-sky text-sky-ink dark:border-sky-glow dark:text-sky-glow",
    tintHover: "hover:bg-sky/10 dark:hover:bg-sky/20",
    soft: "bg-sky/15 text-sky-ink dark:bg-sky/20 dark:text-sky-glow",
  },
};
