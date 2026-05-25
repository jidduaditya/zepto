import { motion } from "framer-motion";

interface PitchVisualizerProps {
  levels: number[]; // 0-1 amplitude values for each bar
  isActive: boolean;
}

const BAR_COUNT = 20;

export function PitchVisualizer({ levels, isActive }: PitchVisualizerProps) {
  const bars = levels.length > 0 ? levels : new Array(BAR_COUNT).fill(0.05);

  return (
    <div className="flex items-end justify-center gap-[3px] h-[80px]">
      {bars.slice(0, BAR_COUNT).map((level, i) => (
        <motion.div
          key={i}
          animate={{
            height: isActive ? Math.max(4, level * 80) : 4,
          }}
          transition={{ duration: 0.05 }}
          className="w-[10px] rounded-full"
          style={{
            backgroundColor: isActive ? "#6C2BD9" : "#E5E7EB",
          }}
        />
      ))}
    </div>
  );
}
