import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label: string;
}

export function ScoreGauge({ score, label }: ScoreGaugeProps) {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-8 border-primary-container bg-surface-white shadow-[0_0_30px_rgba(154,22,202,0.3)]" />

      {/* Spinning dashed ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-4 border-dashed border-primary opacity-50"
      />

      {/* Score content */}
      <div className="flex flex-col items-center z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="font-heading text-[32px] font-extrabold text-primary tracking-tighter leading-[40px]"
        >
          {score}%
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-heading text-[20px] font-bold text-secondary-container mt-1"
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}
