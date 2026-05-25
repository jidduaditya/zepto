import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "./components/AppShell";
import { EntryScreen } from "./screens/EntryScreen";
import { SingScreen } from "./screens/SingScreen";
import { ResultScreen } from "./screens/ResultScreen";

type Screen = "entry" | "sing" | "result";

const pageTransition = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
  transition: { duration: 0.25, ease: "easeInOut" as const },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("entry");
  const [score, setScore] = useState(0);

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {screen === "entry" && (
          <motion.div key="entry" {...pageTransition} className="h-full">
            <EntryScreen onSing={() => setScreen("sing")} />
          </motion.div>
        )}

        {screen === "sing" && (
          <motion.div key="sing" {...pageTransition} className="h-full">
            <SingScreen
              onComplete={(s) => {
                setScore(s);
                setScreen("result");
              }}
              onBack={() => setScreen("entry")}
            />
          </motion.div>
        )}

        {screen === "result" && (
          <motion.div key="result" {...pageTransition} className="h-full">
            <ResultScreen
              score={score}
              onTryAgain={() => setScreen("sing")}
              onApply={() => setScreen("entry")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
