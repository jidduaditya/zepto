import { motion } from "framer-motion";
import { ScoreGauge } from "../components/ScoreGauge";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/Button";
import { getDiscountTier } from "../lib/discounts";
import { useState, useMemo } from "react";

interface ResultScreenProps {
  score: number;
  onTryAgain: () => void;
  onApply: () => void;
}

const ICE_CREAM_PRODUCTS = [
  {
    name: "Belgian Chocolate Tub",
    brand: "Kwality Wall's",
    price: 249,
    weight: "700 ml",
    imageColor: "#4A2C2A",
  },
  {
    name: "Butterscotch Bliss",
    brand: "Amul",
    price: 175,
    weight: "500 ml",
    imageColor: "#D4A843",
  },
  {
    name: "Mango Dolly",
    brand: "Mother Dairy",
    price: 40,
    weight: "60 ml",
    imageColor: "#F5A623",
  },
  {
    name: "Vanilla Cup",
    brand: "Havmor",
    price: 30,
    weight: "80 ml",
    imageColor: "#FAF0DC",
  },
];

function generateCode(discount: number): string {
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SING${discount}${suffix}`;
}

export function ResultScreen({ score, onTryAgain, onApply }: ResultScreenProps) {
  const tier = getDiscountTier(score);
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => generateCode(tier.discount), [tier.discount]);

  const gaugeColor =
    score >= 90
      ? "#0DC143"
      : score >= 70
        ? "#6C2BD9"
        : score >= 50
          ? "#F5A623"
          : "#E91E8C";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareText = `I scored ${score} on Zepto's Sing for Your Scoop and got ${tier.discount}% off! Can you beat me? Use code ${code}`;

  const handleShare = (platform: string) => {
    const encoded = encodeURIComponent(shareText);
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encoded}`,
      x: `https://x.com/intent/tweet?text=${encoded}`,
      instagram: "", // Instagram doesn't have a share URL; copy to clipboard instead
    };

    if (platform === "instagram") {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    const url = urls[platform];
    if (url) window.open(url, "_blank");
  };

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

      <div className="flex-1 flex flex-col items-center px-4 pt-2 gap-4 overflow-y-auto pb-6">
        {/* Score gauge */}
        <ScoreGauge score={score} color={gaugeColor} />

        {/* Tier label */}
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

        {/* Discount badge */}
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

        {/* Discount code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="w-full"
        >
          <div className="bg-zepto-purple-light rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-zepto-text-secondary uppercase tracking-wide">
                Your code
              </p>
              <p className="text-[20px] font-bold text-zepto-purple tracking-wider mt-0.5">
                {code}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="bg-zepto-purple text-white text-[13px] font-semibold px-4 py-2 rounded-lg active:bg-zepto-purple-dark transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </motion.div>

        {/* Share on socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="w-full"
        >
          <p className="text-[13px] font-semibold text-zepto-text mb-2">
            Share with friends
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleShare("whatsapp")}
              className="flex-1 bg-[#25D366] text-white text-[13px] font-semibold py-2.5 rounded-xl active:opacity-80 transition-opacity"
            >
              WhatsApp
            </button>
            <button
              onClick={() => handleShare("instagram")}
              className="flex-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-[13px] font-semibold py-2.5 rounded-xl active:opacity-80 transition-opacity"
            >
              Instagram
            </button>
            <button
              onClick={() => handleShare("x")}
              className="flex-1 bg-[#0F1419] text-white text-[13px] font-semibold py-2.5 rounded-xl active:opacity-80 transition-opacity"
            >
              X
            </button>
          </div>
        </motion.div>

        {/* Apply to cart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="w-full"
        >
          <Button onClick={onApply} variant="primary" fullWidth>
            Apply {tier.discount}% Off to Cart
          </Button>
        </motion.div>

        {/* Ice cream options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 }}
          className="w-full"
        >
          <p className="text-[15px] font-bold text-zepto-text mb-3">
            Pick your scoop
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ICE_CREAM_PRODUCTS.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
