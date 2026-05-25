import { motion } from "framer-motion";

interface PitchVisualizerProps {
  levels: number[];
  isActive: boolean;
}

const BAR_COUNT = 12;
const BAR_COLORS = [
  "#7800a0", "#e31657", "#7800a0", "#6a5a74",
  "#9a16ca", "#e31657", "#7800a0", "#6a5a74",
  "#9a16ca", "#e31657", "#7800a0", "#9a16ca",
];

export function PitchVisualizer({ levels, isActive }: PitchVisualizerProps) {
  const bars = levels.length > 0 ? levels : new Array(BAR_COUNT).fill(0.05);

  return (
    <div className="flex items-end justify-center h-16 gap-1 w-full max-w-xs">
      {bars.slice(0, BAR_COUNT).map((level, i) => (
        <motion.div
          key={i}
          animate={{
            height: isActive ? Math.max(4, level * 64) : 4,
          }}
          transition={{ duration: 0.05 }}
          className="w-1.5 rounded-full origin-bottom"
          style={{
            backgroundColor: isActive ? BAR_COLORS[i % BAR_COLORS.length] : "#d3c1d5",
            animationDelay: isActive ? undefined : `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
