import type { ThemeColor } from "~/utils/themeColors";

export interface Milestone {
  year: number;
  title: string;
  text: string;
  color: ThemeColor;
}

export const timeline: Milestone[] = [
  { year: 2019, title: "A spark in a garage", text: "Two friends, one projector and a crayon box. Prism's first client was a lemonade stand.", color: "grape" },
  { year: 2020, title: "First rainbow shipped", text: "Our first full brand system went live. Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "coral" },
  { year: 2022, title: "The Motion Lab opens", text: "We started obsessing over springs and parallax, and never stopped.", color: "sun" },
  { year: 2024, title: "42 happy teams", text: "From startups to museums. Sed do eiusmod tempor incididunt ut labore et dolore.", color: "mint" },
  { year: 2026, title: "Brighter than ever", text: "A bigger studio, the same box of crayons, and a lot more light to bend.", color: "sky" },
];

export interface Value {
  title: string;
  text: string;
  icon: string;
  color: ThemeColor;
}

export const values: Value[] = [
  { title: "Curiosity first", text: "Every project starts with questions, not answers. We poke at ideas until they sparkle.", icon: "lucide:search", color: "grape" },
  { title: "Joy is a feature", text: "Delight isn't decoration. Tiny moments of fun make products people love to use.", icon: "lucide:party-popper", color: "coral" },
  { title: "Light for everyone", text: "Accessible by default: real contrast, keyboard paths and calm modes for calm minds.", icon: "lucide:accessibility", color: "mint" },
];
