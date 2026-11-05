export interface Plan {
  id: string;
  name: string;
  tagline: string;
  /** Price per month, in dollars. */
  monthly: number;
  /** Price per month when billed yearly. */
  yearly: number;
  features: string[];
  highlighted?: boolean;
}

export const plans: Plan[] = [
  {
    id: "spark",
    name: "Spark",
    tagline: "For tiny ideas that want to glow.",
    monthly: 49,
    yearly: 39,
    features: ["1 design sprint / month", "Brand color palette", "Email support"],
  },
  {
    id: "prism",
    name: "Prism",
    tagline: "Our most popular full-spectrum plan.",
    monthly: 129,
    yearly: 103,
    features: ["Unlimited design requests", "Motion Lab add-on", "Design system starter", "Slack channel with the team"],
    highlighted: true,
  },
  {
    id: "supernova",
    name: "Supernova",
    tagline: "For teams who want the whole rainbow.",
    monthly: 299,
    yearly: 239,
    features: ["Dedicated studio squad", "Strategy workshops", "Full brand & product systems", "Priority everything"],
  },
];
