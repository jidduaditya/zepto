import type { DiscountTier } from "../lib/discounts";

interface ShareCardProps {
  score: number;
  tier: DiscountTier;
}

export function ShareCard({ score, tier }: ShareCardProps) {
  return (
    <div
      id="share-card"
      className="w-[320px] bg-gradient-to-br from-zepto-purple to-zepto-pink rounded-2xl p-6 text-white mx-auto"
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest opacity-70">
        Zepto Sing for Your Scoop
      </p>

      <div className="mt-4 flex items-center gap-5">
        <div className="text-[56px] font-bold leading-none">{score}</div>
        <div className="flex flex-col">
          <span className="text-[18px] font-bold">{tier.label}</span>
          <span className="text-[14px] opacity-80">
            {tier.discount}% off earned
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-[13px] opacity-80">
          I sang for my scoop. Can you beat {score}?
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[15px] font-bold tracking-tight">zepto</span>
        <span className="text-[11px] opacity-60">10-min delivery</span>
      </div>
    </div>
  );
}
