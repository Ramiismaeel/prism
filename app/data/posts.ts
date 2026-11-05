import type { ThemeColor } from "~/utils/themeColors";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  /** Lorem Picsum seed for the cover image. */
  coverSeed: string;
  tags: string[];
  /** ISO date (YYYY-MM-DD). */
  date: string;
  author: string;
  body: string[];
}

/** Badge color per tag (unknown tags fall back to grape). */
export const TAG_COLOR: Record<string, ThemeColor> = {
  color: "coral",
  motion: "mint",
  "design systems": "grape",
  accessibility: "sky",
  branding: "sun",
  process: "grape",
};

export const posts: Post[] = [
  {
    slug: "how-we-pick-a-palette",
    title: "How we pick a palette that glows",
    excerpt: "Our five-step ritual for turning a mood board into colors that work in light mode, dark mode and real life.",
    coverSeed: "blog-1-cover",
    tags: ["color", "design systems"],
    date: "2026-10-28",
    author: "Noor Haddad",
    body: [
      "Every Prism project starts with a wall of screenshots, swatches and things that made someone smile. It's messy on purpose: a palette that only looks good on a clean artboard rarely survives contact with a real product.",
      "Step one is finding the hero color. We squint at the wall until one hue keeps jumping out, then we test it at every size, from a 2px focus ring to a full-bleed hero. If it still feels right at both extremes, it stays.",
      "Step two is building the supporting cast. We pick four companions that can share a page without fighting, and we check that each one has a darker 'ink' shade for text and a lighter 'glow' shade for dark mode.",
      "Step three is the contrast gauntlet. Every pairing gets measured, and anything under 4.5:1 for body text is out, no matter how pretty. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Step four is dark mode, designed from scratch rather than inverted. Colors that glow on white can turn muddy on near-black, so we tune them separately and test both side by side.",
      "Step five is living with it. We build three real screens with the palette and use them for a week. If nobody on the team gets tired of it, we ship it.",
    ],
  },
  {
    slug: "springs-not-easings",
    title: "Why we reach for springs, not easing curves",
    excerpt: "Springs make interfaces feel physical and interruptible. Here's how we tune them, and when we don't use them at all.",
    coverSeed: "blog-2-cover",
    tags: ["motion"],
    date: "2026-10-14",
    author: "Felix Okafor",
    body: [
      "An easing curve describes a journey with a fixed length. A spring describes a force. That difference matters the moment a user changes their mind halfway through an animation.",
      "With a spring, an interrupted animation simply redirects from wherever it is, keeping its velocity. With a duration-based tween, it either snaps or restarts, and both feel broken in a way people notice even if they can't name it.",
      "We tune springs with two numbers: stiffness for how eager the motion is, and damping for how much it settles versus wobbles. Most of our UI springs live between 260 and 420 stiffness with damping around 25 to 35.",
      "There are places springs don't belong. Progress bars, loading spinners and anything that represents real time should move linearly, because a bounce there would lie about what's happening.",
      "And when someone asks their device to reduce motion, every spring in our kit becomes an instant change. Delight should never come at the cost of comfort. Sed do eiusmod tempor incididunt ut labore et dolore.",
    ],
  },
  {
    slug: "dark-mode-is-a-design",
    title: "Dark mode is a design, not a filter",
    excerpt: "Inverting colors gives you a dark theme the way turning off the lights gives you a nightclub. A few rules we design by.",
    coverSeed: "blog-3-cover",
    tags: ["color", "accessibility"],
    date: "2026-09-30",
    author: "Mei Tanaka",
    body: [
      "The fastest way to make a bad dark mode is to flip every color. Shadows disappear, saturated accents start vibrating, and pure white text on pure black becomes tiring after a few paragraphs.",
      "We start dark surfaces at a near-black with a hint of the brand hue, never #000. Elevated surfaces get lighter instead of getting shadows, because shadows barely read on dark backgrounds.",
      "Accent colors usually need their own dark-mode shade. A violet that looks confident on white can look like a bruise on charcoal, so we lift its lightness until it glows again.",
      "Text gets the same treatment: slightly off-white for body copy, brighter for headings, and every pairing checked against WCAG contrast just like in light mode. Ut enim ad minim veniam, quis nostrud exercitation.",
      "Finally, we respect the system setting by default and remember the user's choice when they override it. A theme toggle that forgets you on reload is a tiny betrayal.",
    ],
  },
  {
    slug: "a-brand-in-a-week",
    title: "A brand in a week: our sprint, day by day",
    excerpt: "From kickoff to a full identity in five days. What happens each day, and why the whiteboard always ends up rainbow.",
    coverSeed: "blog-4-cover",
    tags: ["branding", "process"],
    date: "2026-09-12",
    author: "Iris Vale",
    body: [
      "Monday is for listening. We interview founders, customers and the person who answers support emails, because that last person usually knows the brand best.",
      "Tuesday is for wild ideas. Everyone sketches alone first, then we pin everything up and vote with colorful stickers. Quantity beats quality on Tuesday.",
      "Wednesday narrows things down to three directions. Each gets a name, a palette, a typeface pairing and one hero application, like a homepage header or a tote bag.",
      "Thursday is decision day. The client picks a direction, and we stress-test it: tiny favicon, giant billboard, dark mode, black-and-white fax. Lorem ipsum dolor sit amet.",
      "Friday we package everything into a living guideline, with tokens the developers can use on Monday. Then we celebrate, usually with something embarrassingly colorful.",
    ],
  },
  {
    slug: "designing-for-reduced-motion",
    title: "Designing for people who turn motion off",
    excerpt: "Reduced motion isn't 'no design'. How we build calm alternatives that still feel crafted.",
    // "blog-5-cover" resolves to the same Picsum photo as blog-2-cover.
    coverSeed: "blog-5-calm",
    tags: ["motion", "accessibility"],
    date: "2026-08-27",
    author: "Felix Okafor",
    body: [
      "For some people, parallax and sliding panels cause real discomfort: dizziness, nausea, headaches. The 'reduce motion' setting is how they tell us, and we take it seriously.",
      "Our rule is simple: when reduced motion is on, things still change, they just don't travel. Fades become instant, slides become cuts, and parallax layers sit still.",
      "Auto-playing content gets extra care. Carousels don't advance on their own, marquees stand still, and anything that does move can always be paused.",
      "The tricky part is server rendering: the server can't know the user's preference, so anything rendered must look the same until the page hydrates. We only switch to the calm version after mount.",
      "Done well, the reduced experience feels intentional rather than broken. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
  },
  {
    slug: "tokens-that-scale",
    title: "Design tokens that scale from one app to ten",
    excerpt: "How a handful of well-named tokens kept a growing product family consistent without a 200-page style guide.",
    coverSeed: "blog-6-cover",
    tags: ["design systems", "process"],
    date: "2026-08-05",
    author: "Theo Marsh",
    body: [
      "When a product family grows, inconsistency creeps in through a thousand tiny decisions: a slightly different gray here, a 13px gap there. Tokens are how we stop the creep.",
      "We name tokens by intent, not appearance. 'text-muted' survives a rebrand; 'gray-500' doesn't. The palette can change underneath while every screen keeps its meaning.",
      "We keep the set small. Five brand colors with ink and glow shades, a type scale of seven steps, and a spacing scale based on 4px. Anything outside the set needs a good story.",
      "Tokens live in code first, design tools second. When the source of truth is the CSS that ships, designers and developers can never drift apart. Duis aute irure dolor in reprehenderit.",
      "The result is a system people actually use, because using it is the easiest path. That's the whole trick: make the right thing the lazy thing.",
    ],
  },
];

/** Newest first. */
export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/** Posts sharing the most tags (ties: newest first), excluding the post itself. */
export function getRelated(post: Post, count = 3): Post[] {
  return sortedPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, shared: p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, count)
    .map(({ p }) => p);
}

/** Rough reading time at 200 words per minute. */
export const readingMinutes = (post: Post) =>
  Math.max(1, Math.round(post.body.join(" ").split(/\s+/).length / 200));

// UTC so server and client format the same date (no hydration mismatch across time zones).
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });
export const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));
