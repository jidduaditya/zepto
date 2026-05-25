import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

interface OrderConfirmScreenProps {
  total: number;
  itemCount: number;
  onBackToHome: () => void;
}

const CONFETTI_COLORS = ["#10B981", "#9a16ca", "#F5A623", "#E8567F", "#3B82F6"];

export function OrderConfirmScreen({ total, itemCount, onBackToHome }: OrderConfirmScreenProps) {
  const orderId = useMemo(
    () => "ZPT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    []
  );
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = confettiRef.current;
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const piece = document.createElement("div");
      piece.style.position = "absolute";
      piece.style.width = Math.random() > 0.5 ? "8px" : "6px";
      piece.style.height = Math.random() > 0.5 ? "16px" : "6px";
      piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.left = Math.random() * 100 + "%";
      piece.style.top = "-10%";
      piece.style.opacity = "0";
      piece.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear ${Math.random() * 2}s 1`;
      if (Math.random() > 0.5) piece.style.borderRadius = "50%";
      container.appendChild(piece);
    }
    return () => { container.innerHTML = ""; };
  }, []);

  return (
    <div className="flex flex-col h-full relative">
      <div ref={confettiRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 relative z-10">
        {/* Success check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-price-green/10 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
            className="w-16 h-16 rounded-full bg-price-green flex items-center justify-center"
          >
            <span className="material-symbols-outlined fill text-white text-[36px]">check</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h1 className="font-heading text-[24px] font-extrabold text-on-surface mb-2">
            Order Placed!
          </h1>
          <p className="text-[14px] text-on-surface-variant leading-relaxed">
            Your {itemCount} ice cream{itemCount > 1 ? "s" : ""} will be at your door in 8 minutes
          </p>
        </motion.div>

        {/* Order details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full glass-card rounded-xl p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-[Inter] text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                Order ID
              </span>
              <span className="text-[15px] font-extrabold text-primary tracking-wider font-heading">
                {orderId}
              </span>
            </div>
            <div className="border-t border-outline-variant" />
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-on-surface-variant">Amount paid</span>
              <span className="text-[16px] font-extrabold text-on-surface">Rs {total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-on-surface-variant">Payment</span>
              <span className="text-[13px] font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-price-green">check_circle</span>
                Cash on Delivery
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-on-surface-variant">Delivery</span>
              <span className="text-[13px] font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                8 min
              </span>
            </div>
          </div>
        </motion.div>

        {/* Delivery animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-3 bg-primary/5 rounded-full px-5 py-3 border border-primary/10"
        >
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="material-symbols-outlined fill text-primary text-[24px]"
          >
            delivery_dining
          </motion.span>
          <span className="text-[13px] font-semibold text-primary">On its way to you</span>
        </motion.div>
      </div>

      {/* Bottom button */}
      <div className="px-4 pb-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          onClick={onBackToHome}
          className="w-full bg-primary text-on-primary font-bold text-[15px] py-3.5 rounded-full active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          Back to Home
        </motion.button>
      </div>
    </div>
  );
}
