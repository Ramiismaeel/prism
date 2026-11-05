import type { ThemeColor } from "~/utils/themeColors";

export interface Feature {
  title: string;
  description: string;
  icon: string;
  color: ThemeColor;
}

export const features: Feature[] = [
  {
    title: "Spectrum Design",
    description: "Interfaces that split one idea into every color it contains, then put it back together beautifully.",
    icon: "lucide:palette",
    color: "grape",
  },
  {
    title: "Refraction Strategy",
    description: "We find the angle where your story catches the light, and aim everything at it.",
    icon: "lucide:compass",
    color: "coral",
  },
  {
    title: "Glow Branding",
    description: "Logos, voices and visual systems with a warm, unmistakable shine.",
    icon: "lucide:gem",
    color: "sun",
  },
  {
    title: "Motion Lab",
    description: "Springs, parallax and tiny surprises that make a product feel alive.",
    icon: "lucide:wand-sparkles",
    color: "mint",
  },
  {
    title: "Color Systems",
    description: "Accessible palettes and tokens that stay gorgeous in light and dark.",
    icon: "lucide:swatch-book",
    color: "sky",
  },
  {
    title: "Lightspeed Dev",
    description: "Fast, typed, tested front-ends. Lorem ipsum, but make it production-ready.",
    icon: "lucide:rocket",
    color: "grape",
  },
];
