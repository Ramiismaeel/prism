export interface Stat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const stats: Stat[] = [
  { value: 128, suffix: "+", label: "Projects shipped" },
  { value: 42, label: "Happy clients" },
  { value: 99.9, suffix: "%", decimals: 1, label: "Good-vibes uptime" },
  { value: 7, suffix: "M", label: "Pixels pushed daily" },
];
