import type { ThemeColor } from "~/utils/themeColors";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** Lorem Picsum seed. */
  photoSeed: string;
  color: ThemeColor;
  socials: { label: string; icon: string; href: string }[];
}

export const team: TeamMember[] = [
  {
    name: "Iris Vale",
    role: "Founder & Creative Director",
    bio: "Started Prism with a single crayon and an unreasonable amount of optimism. Still uses both daily.",
    photoSeed: "team-1",
    color: "grape",
    socials: [
      { label: "Dribbble", icon: "simple-icons:dribbble", href: "https://dribbble.com" },
      { label: "X", icon: "simple-icons:x", href: "https://x.com" },
    ],
  },
  {
    name: "Theo Marsh",
    role: "Head of Strategy",
    bio: "Finds the angle where your story catches the light. Lorem ipsum dolor sit amet, consectetur.",
    photoSeed: "team-2",
    color: "coral",
    socials: [
      { label: "GitHub", icon: "simple-icons:github", href: "https://github.com" },
      { label: "X", icon: "simple-icons:x", href: "https://x.com" },
    ],
  },
  {
    name: "Noor Haddad",
    role: "Brand Designer",
    bio: "Makes logos that glow in the dark (metaphorically). Collects vintage paint swatches.",
    photoSeed: "team-3",
    color: "sun",
    socials: [
      { label: "Dribbble", icon: "simple-icons:dribbble", href: "https://dribbble.com" },
      { label: "Instagram", icon: "simple-icons:instagram", href: "https://instagram.com" },
    ],
  },
  {
    name: "Felix Okafor",
    role: "Motion Lead",
    bio: "Believes every button deserves a spring. Sed do eiusmod tempor incididunt ut labore.",
    photoSeed: "team-4",
    color: "mint",
    socials: [
      { label: "GitHub", icon: "simple-icons:github", href: "https://github.com" },
      { label: "Dribbble", icon: "simple-icons:dribbble", href: "https://dribbble.com" },
    ],
  },
  {
    name: "Mei Tanaka",
    role: "Front-end Engineer",
    bio: "Turns gradients into type-safe components. Ships fast, tests faster, naps fastest.",
    photoSeed: "team-5",
    color: "sky",
    socials: [
      { label: "GitHub", icon: "simple-icons:github", href: "https://github.com" },
      { label: "X", icon: "simple-icons:x", href: "https://x.com" },
    ],
  },
  {
    name: "Sam Rivera",
    role: "Producer",
    bio: "Keeps the rainbow on schedule. Ut enim ad minim veniam, quis nostrud exercitation.",
    photoSeed: "team-6",
    color: "grape",
    socials: [
      { label: "Instagram", icon: "simple-icons:instagram", href: "https://instagram.com" },
      { label: "X", icon: "simple-icons:x", href: "https://x.com" },
    ],
  },
];
