import type { ThemeColor } from "~/utils/themeColors";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** Lorem Picsum seed for the avatar. */
  avatarSeed: string;
  color: ThemeColor;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Prism turned our beige brand into a full rainbow, and somehow it still feels grown-up. Conversions went up, and so did morale.",
    name: "Ada Lumen",
    role: "Founder, Lumen Labs",
    avatarSeed: "avatar-ada",
    color: "grape",
  },
  {
    quote: "The Motion Lab team made our onboarding feel like a toy you never want to put down. Lorem ipsum dolor sit amet.",
    name: "Kenji Halo",
    role: "Head of Product, Halo",
    avatarSeed: "avatar-kenji",
    color: "coral",
  },
  {
    quote: "Fast, thoughtful and wildly colorful. They shipped our design system in light and dark before we even asked.",
    name: "Priya Spectra",
    role: "Design Lead, Spectra",
    avatarSeed: "avatar-priya",
    color: "sun",
  },
  {
    quote: "Working with Prism felt like turning the lights on in a room we'd been fumbling around in for years.",
    name: "Mateo Beam",
    role: "CEO, Beam",
    avatarSeed: "avatar-mateo",
    color: "mint",
  },
  {
    quote: "Our new site loads in a blink and sparkles in every browser. Consectetur adipiscing elit, sed do eiusmod.",
    name: "Lena Refract",
    role: "CTO, Refract",
    avatarSeed: "avatar-lena",
    color: "sky",
  },
];
