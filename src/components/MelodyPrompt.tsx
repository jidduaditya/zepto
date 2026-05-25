import { motion } from "framer-motion";
import type { MelodyNote } from "../lib/melody";

interface MelodyPromptProps {
  melody: MelodyNote[];
  activeIndex: number; // -1 = none, 0 = first note, 1 = second note
  phase: "listen" | "sing" | "idle";
}

export function MelodyPrompt({ melody, activeIndex, phase }: MelodyPromptProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      {melody.map((note, i) => {
        const isActive = activeIndex === i;
        return (
          <div key={i} className="flex flex-col items-center gap-3">
            <motion.div
              animate={{
                scale: isActive ? 1.3 : 1,
                backgroundColor: isActive
                  ? phase === "listen"
                    ? "#6C2BD9"
                    : "#0DC143"
                  : "#E5E7EB",
              }}
              transition={{ duration: 0.2 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
            >
              <span
                className={`text-[20px] font-bold ${
                  isActive ? "text-white" : "text-zepto-text-secondary"
                }`}
              >
                {note.label}
              </span>
            </motion.div>
            <span className="text-[11px] text-zepto-text-secondary uppercase tracking-wide">
              {phase === "listen" && isActive
                ? "Listen..."
                : phase === "sing" && isActive
                  ? "Sing!"
                  : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
