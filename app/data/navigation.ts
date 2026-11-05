export interface NavLink {
  label: string;
  to: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Gallery", to: "/gallery" },
  { label: "Playground", to: "/playground" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

export const socialLinks = [
  { label: "GitHub", icon: "simple-icons:github", href: "https://github.com" },
  { label: "Dribbble", icon: "simple-icons:dribbble", href: "https://dribbble.com" },
  { label: "Instagram", icon: "simple-icons:instagram", href: "https://instagram.com" },
  { label: "X", icon: "simple-icons:x", href: "https://x.com" },
];

/** "/" matches only itself; other links also match nested routes (e.g. /blog/[slug]). */
export function isNavActive(to: string, path: string): boolean {
  return to === "/" ? path === "/" : path === to || path.startsWith(`${to}/`);
}
