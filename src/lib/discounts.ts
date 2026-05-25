export interface DiscountTier {
  label: string;
  discount: number; // percentage
  emoji: string;
  message: string;
}

const TIERS: { minScore: number; tier: DiscountTier }[] = [
  {
    minScore: 90,
    tier: {
      label: "Pitch Perfect",
      discount: 20,
      emoji: "star",
      message: "You nailed it. Your ice cream is basically free.",
    },
  },
  {
    minScore: 70,
    tier: {
      label: "Sweet Voice",
      discount: 15,
      emoji: "sparkle",
      message: "Smooth. Your scoop just got sweeter.",
    },
  },
  {
    minScore: 50,
    tier: {
      label: "Nice Try",
      discount: 10,
      emoji: "clap",
      message: "Not bad. Enough to earn a treat.",
    },
  },
  {
    minScore: 0,
    tier: {
      label: "Keep Singing",
      discount: 5,
      emoji: "mic",
      message: "Points for trying. Here's a little something.",
    },
  },
];

export function getDiscountTier(score: number): DiscountTier {
  const clamped = Math.max(0, Math.min(100, score));
  for (const { minScore, tier } of TIERS) {
    if (clamped >= minScore) return tier;
  }
  return TIERS[TIERS.length - 1].tier;
}
