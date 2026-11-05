export interface Service {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  /** File name in public/illustrations (without .svg). */
  illustration: string;
  illustrationAlt: string;
}

export const services: Service[] = [
  {
    id: "design",
    label: "Spectrum Design",
    icon: "lucide:palette",
    title: "Interfaces in every color",
    description: "Product and web design that splits one idea into every color it contains, then puts it back together beautifully.",
    bullets: ["UX research & flows", "UI design systems", "Prototypes you can poke"],
    illustration: "services-design",
    illustrationAlt: "A designer arranging colorful interface cards",
  },
  {
    id: "strategy",
    label: "Refraction Strategy",
    icon: "lucide:compass",
    title: "Find your angle",
    description: "We find where your story catches the light, then aim everything at it. Lorem ipsum dolor sit amet.",
    bullets: ["Positioning workshops", "Audience mapping", "Launch roadmaps"],
    illustration: "services-strategy",
    illustrationAlt: "Two people planning around a glowing roadmap",
  },
  {
    id: "branding",
    label: "Glow Branding",
    icon: "lucide:gem",
    title: "Brands with a warm shine",
    description: "Logos, voice and visual systems that are unmistakably yours, in light mode and dark.",
    bullets: ["Logo & identity", "Color & type systems", "Brand guidelines"],
    illustration: "services-branding",
    illustrationAlt: "A logo sketch surrounded by color swatches",
  },
  {
    id: "motion",
    label: "Motion Lab",
    icon: "lucide:wand-sparkles",
    title: "Make it move",
    description: "Springs, parallax and tiny surprises that make a product feel alive, and respect reduced motion.",
    bullets: ["Interaction design", "Animated brand assets", "Motion guidelines"],
    illustration: "services-motion",
    illustrationAlt: "A character juggling animated shapes",
  },
];
