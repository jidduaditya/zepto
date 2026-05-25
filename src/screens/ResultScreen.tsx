import { motion } from "framer-motion";
import { ScoreGauge } from "../components/ScoreGauge";
import { ShareCard } from "../components/ShareCard";
import { Button } from "../components/Button";
import { getDiscountTier } from "../lib/discounts";
import { useState } from "react";

interface ResultScreenProps {
  score: number;
  onTryAgain: () => void;
  onApply: () => void;
}

export function ResultScreen({ score, onTryAgain, onApply }: ResultScreenProps) {
  const tier = getDiscountTier(score);
  const [showShare, setShowShare] = useState(false);

  const gaugeColor =
    score >= 90
      ? "#0DC143"
      : score >= 70
        ? "#6C2BD9"
        : score >= 50
          ? "#F5A623"
          : "#E91E8C";

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3">
        <button
          onClick={onTryAgain}
          className="text-zepto-purple text-[15px] font-semibold"
        >
          Try Again
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-4 gap-4 overflow-y-auto pb-6">
        <ScoreGauge score={score} color={gaugeColor} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-[24px] font-bold text-zepto-text">
            {tier.label}
          </h2>
          <p className="text-[14px] text-zepto-text-secondary mt-1">
            {tier.message}
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
          className="bg-zepto-green rounded-2xl px-8 py-4 text-center"
        >
          <p className="text-white text-[32px] font-bold">
            {tier.discount}% OFF
          </p>
          <p className="text-white/80 text-[13px] mt-0.5">
            On your next ice cream order
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="w-full flex flex-col gap-3 mt-2"
        >
          <Button onClick={onApply} variant="primary" fullWidth>
            Apply to Cart
          </Button>

          <Button
            onClick={() => setShowShare(true)}
            variant="secondary"
            fullWidth
          >
            Challenge your friends
          </Button>
        </motion.div>

        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <p className="text-[12px] text-zepto-text-secondary text-center mb-3">
              Screenshot this and share on your story
            </p>
            <ShareCard score={score} tier={tier} />

            <p className="text-[12px] text-zepto-text-secondary text-center mt-4">
              {score >= 70
                ? "You crushed it. Let's see if your friends can keep up."
                : "Think your friends can do better? There's only one way to find out."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
