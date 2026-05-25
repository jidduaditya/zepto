import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PitchVisualizer } from "../components/PitchVisualizer";
import { Button } from "../components/Button";
import { detectPitch } from "../lib/pitch";
import { scoreSingingQuality } from "../lib/scoring";

type Phase = "ready" | "countdown" | "sing" | "analyzing";

interface SingScreenProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const SING_DURATION_MS = 2500;

export function SingScreen({ onComplete, onBack }: SingScreenProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [levels, setLevels] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(SING_DURATION_MS);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pitchSamplesRef = useRef<number[]>([]);

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Countdown
      setPhase("countdown");
      setCountdown(3);
      await new Promise((r) => setTimeout(r, 800));
      setCountdown(2);
      await new Promise((r) => setTimeout(r, 800));
      setCountdown(1);
      await new Promise((r) => setTimeout(r, 800));
      setCountdown(null);

      // Sing phase -- just listen
      setPhase("sing");
      pitchSamplesRef.current = [];
      const startTime = Date.now();

      while (Date.now() - startTime < SING_DURATION_MS) {
        const buffer = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buffer);

        const pitch = detectPitch(buffer, ctx.sampleRate);
        if (pitch > 0) {
          pitchSamplesRef.current.push(pitch);
        }

        // Update visualizer
        const freqData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqData);
        const barLevels: number[] = [];
        const step = Math.floor(freqData.length / 20);
        for (let b = 0; b < 20; b++) {
          barLevels.push(freqData[b * step] / 255);
        }
        setLevels(barLevels);
        setTimeLeft(Math.max(0, SING_DURATION_MS - (Date.now() - startTime)));

        await new Promise((r) => setTimeout(r, 50));
      }

      // Analyze
      setPhase("analyzing");
      setLevels([]);

      const score = scoreSingingQuality(pitchSamplesRef.current);

      await new Promise((r) => setTimeout(r, 1200));

      cleanup();
      onComplete(score);
    } catch {
      cleanup();
      onComplete(Math.floor(Math.random() * 40) + 30);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <button
          onClick={() => {
            cleanup();
            onBack();
          }}
          className="text-zepto-purple text-[15px] font-semibold"
        >
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-[26px] font-bold text-zepto-text">
            Sing for Your Scoop
          </h2>
          <p className="text-[14px] text-zepto-text-secondary mt-1">
            {phase === "ready" && "Sing 'Ice Cream' to unlock your discount"}
            {phase === "countdown" && "Get ready..."}
            {phase === "sing" && "Sing 'Ice Cream' now!"}
            {phase === "analyzing" && "Analyzing your performance..."}
          </p>
        </div>

        {/* Countdown overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <span className="text-[72px] font-bold text-zepto-purple">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Word prompts during singing */}
        {phase === "sing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                backgroundColor: ["#6C2BD9", "#E91E8C", "#6C2BD9"],
              }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-20 h-20 rounded-full flex items-center justify-center"
            >
              <span className="text-[22px] font-bold text-white">Ice</span>
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                backgroundColor: ["#E91E8C", "#6C2BD9", "#E91E8C"],
              }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
              className="w-20 h-20 rounded-full flex items-center justify-center"
            >
              <span className="text-[22px] font-bold text-white">Cream</span>
            </motion.div>
          </motion.div>
        )}

        {/* Timer bar during singing */}
        {phase === "sing" && (
          <div className="w-full max-w-[260px] h-[6px] bg-zepto-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-zepto-purple rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: SING_DURATION_MS / 1000, ease: "linear" }}
            />
          </div>
        )}

        {/* Visualizer */}
        <PitchVisualizer levels={levels} isActive={phase === "sing"} />

        {/* Analyzing spinner */}
        {phase === "analyzing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-zepto-purple border-t-transparent rounded-full"
            />
            <p className="text-[13px] text-zepto-text-secondary">
              Judging your melody...
            </p>
          </motion.div>
        )}

        {/* Start button */}
        {phase === "ready" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button onClick={startListening} variant="primary">
              Start Singing
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
