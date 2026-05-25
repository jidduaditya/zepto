import { motion } from "framer-motion";
import { ScoreGauge } from "../components/ScoreGauge";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/Button";
import { getDiscountTier } from "../lib/discounts";
import { ICE_CREAM_PRODUCTS, type Product } from "../lib/products";
import { useState, useMemo, useEffect, useRef } from "react";
import { playRevealChime } from "../lib/sounds";

interface ResultScreenProps {
  score: number;
  onTryAgain: () => void;
  onApply: () => void;
  getQuantity: (name: string) => number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (name: string) => void;
}

const RESULT_PRODUCTS = ICE_CREAM_PRODUCTS.slice(0, 4);

function generateCode(discount: number): string {
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SING${discount}${suffix}`;
}

// Confetti colors from Stitch
const CONFETTI_COLORS = ["#9a16ca", "#e31657", "#edb1ff", "#f0dbfb", "#10B981"];

export function ResultScreen({ score, onTryAgain, onApply, getQuantity, onAddToCart, onRemoveFromCart }: ResultScreenProps) {
  const tier = getDiscountTier(score);
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => generateCode(tier.discount), [tier.discount]);
  const confettiRef = useRef<HTMLDivElement>(null);

  // Play chime + generate confetti on mount
  useEffect(() => {
    playRevealChime();
    const container = confettiRef.current;
    if (!container) return;
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement("div");
      piece.style.position = "absolute";
      piece.style.width = Math.random() > 0.5 ? "10px" : "8px";
      piece.style.height = Math.random() > 0.5 ? "20px" : "8px";
      piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.left = Math.random() * 100 + "%";
      piece.style.top = "-10%";
      piece.style.opacity = "0";
      piece.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear ${Math.random() * 3}s infinite`;
      if (Math.random() > 0.5) {
        piece.style.borderRadius = "50%";
      }
      container.appendChild(piece);
    }
    return () => {
      container.innerHTML = "";
    };
  }, []);

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
      instagram: "",
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

  // Compute sub-scores for display
  const pitchScore = Math.min(100, Math.round(score * 1.03));
  const melodyScore = Math.min(100, Math.round(score * 0.97));

  return (
    <div className="h-full flex flex-col relative overflow-x-hidden">
      {/* Confetti */}
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />

      {/* Close/back button */}
      <header className="relative z-50 flex items-center justify-between px-4 py-2">
        <button
          onClick={onTryAgain}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-white/80 backdrop-blur-sm border border-outline-variant shadow-sm text-on-surface hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 pt-2 gap-6 overflow-y-auto pb-8 relative z-10">
        {/* Score gauge */}
        <ScoreGauge score={score} label={tier.label} />

        {/* Rank badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="bg-primary-container/10 px-4 py-2 rounded-full border border-primary-container/30"
        >
          <p className="text-[16px] text-primary font-bold flex items-center gap-2">
            <span className="material-symbols-outlined fill text-primary text-[20px]">star</span>
            {tier.message}
            <span className="material-symbols-outlined fill text-primary text-[20px]">star</span>
          </p>
        </motion.div>

        {/* Progress bars */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="w-full grid grid-cols-1 gap-3"
        >
          <div className="glass-card rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[16px] font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">mic</span>
                Pitch
              </span>
              <span className="text-[14px] text-on-surface-variant font-bold">{pitchScore}/100</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden border border-outline-variant/30">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${pitchScore}%` }}
                transition={{ delay: 1.4, duration: 0.8 }}
              />
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[16px] font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">music_note</span>
                Melody
              </span>
              <span className="text-[14px] text-on-surface-variant font-bold">{melodyScore}/100</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden border border-outline-variant/30">
              <motion.div
                className="bg-secondary-container h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${melodyScore}%` }}
                transition={{ delay: 1.6, duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Reward card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="w-full bg-gradient-to-br from-primary-container to-primary rounded-xl p-5 text-white shadow-lg relative"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
              <span className="material-symbols-outlined fill text-[24px] text-primary">redeem</span>
            </div>
            <h3 className="text-[18px] font-bold mb-1">Sweet Victory!</h3>
            <p className="text-[28px] font-extrabold leading-tight">{tier.discount}% OFF</p>
            <p className="text-[13px] text-white/90 mt-1">On your next ice cream order</p>
          </div>
        </motion.div>

        {/* Discount code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="w-full"
        >
          <div className="glass-card rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-[Inter] text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                Your code
              </p>
              <p className="text-[20px] font-extrabold text-primary tracking-wider mt-0.5 font-heading">
                {code}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="bg-primary text-on-primary text-[13px] font-bold px-4 py-2 rounded-full active:bg-surface-tint transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="w-full flex flex-col gap-3"
        >
          <Button onClick={onApply} variant="primary" fullWidth>
            Claim Discount
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Button>
        </motion.div>

        {/* Share section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="w-full"
        >
          <p className="font-[Inter] text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Share with friends
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleShare("whatsapp")}
              className="flex-1 bg-[#25D366] text-white text-[13px] font-bold py-2.5 rounded-full active:opacity-80 transition-opacity flex items-center justify-center gap-1.5"
            >
              WhatsApp
            </button>
            <button
              onClick={() => handleShare("instagram")}
              className="flex-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-[13px] font-bold py-2.5 rounded-full active:opacity-80 transition-opacity"
            >
              Instagram
            </button>
            <button
              onClick={() => handleShare("x")}
              className="flex-1 bg-[#0F1419] text-white text-[13px] font-bold py-2.5 rounded-full active:opacity-80 transition-opacity"
            >
              X
            </button>
          </div>
        </motion.div>

        {/* Ice cream products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
          className="w-full"
        >
          <h2 className="font-heading text-[20px] font-bold text-on-surface mb-3">
            Pick your scoop
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {RESULT_PRODUCTS.map((product) => (
              <ProductCard
                key={product.name}
                {...product}
                quantity={getQuantity(product.name)}
                onAdd={() => onAddToCart(product)}
                onRemove={() => onRemoveFromCart(product.name)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
