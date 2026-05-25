import { useState } from "react";

type Screen = "entry" | "sing" | "result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("entry");
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-zepto-surface">
      <div className="w-[390px] h-[844px] bg-zepto-bg rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col">
        <p className="p-8 text-zepto-text text-center">
          Screen: {screen}
        </p>
      </div>
    </div>
  );
}
