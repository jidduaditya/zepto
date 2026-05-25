import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "./components/AppShell";

type Screen = "entry" | "sing" | "result";

const pageTransition = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("entry");
  const [score, setScore] = useState(0);

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {screen === "entry" && (
          <motion.div key="entry" {...pageTransition} className="h-full">
            <div className="p-6">
              <p className="text-zepto-text">Entry Screen (Task 5)</p>
              <button
                className="mt-4 bg-zepto-purple text-white px-4 py-2 rounded-lg"
                onClick={() => setScreen("sing")}
              >
                Sing for Your Scoop
              </button>
            </div>
          </motion.div>
        )}

        {screen === "sing" && (
          <motion.div key="sing" {...pageTransition} className="h-full">
            <div className="p-6">
              <p className="text-zepto-text">Sing Screen (Task 6)</p>
              <button
                className="mt-4 bg-zepto-purple text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  setScore(78);
                  setScreen("result");
                }}
              >
                Simulate Score
              </button>
            </div>
          </motion.div>
        )}

        {screen === "result" && (
          <motion.div key="result" {...pageTransition} className="h-full">
            <div className="p-6">
              <p className="text-zepto-text">
                Result Screen (Task 7) - Score: {score}
              </p>
              <button
                className="mt-4 bg-zepto-purple text-white px-4 py-2 rounded-lg"
                onClick={() => setScreen("entry")}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
