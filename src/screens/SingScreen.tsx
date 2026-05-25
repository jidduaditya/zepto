import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PitchVisualizer } from "../components/PitchVisualizer";
import { detectPitch } from "../lib/pitch";
import { scoreSingingQuality } from "../lib/scoring";

type Phase = "ready" | "countdown" | "sing" | "analyzing";

interface SingScreenProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const SING_DURATION_MS = 6000;

export function SingScreen({ onComplete, onBack }: SingScreenProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [levels, setLevels] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(SING_DURATION_MS / 1000));

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pitchSamplesRef = useRef<number[]>([]);
  const stopRequestedRef = useRef(false);

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

      // Sing phase
      setPhase("sing");
      pitchSamplesRef.current = [];
      stopRequestedRef.current = false;
      const startTime = Date.now();

      while (Date.now() - startTime < SING_DURATION_MS && !stopRequestedRef.current) {
        const buffer = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buffer);

        const pitch = detectPitch(buffer, ctx.sampleRate);
        if (pitch > 0) {
          pitchSamplesRef.current.push(pitch);
        }

        const freqData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqData);
        const barLevels: number[] = [];
        const step = Math.floor(freqData.length / 12);
        for (let b = 0; b < 12; b++) {
          barLevels.push(freqData[b * step] / 255);
        }
        setLevels(barLevels);

        const remaining = Math.max(0, SING_DURATION_MS - (Date.now() - startTime));
        setSecondsLeft(Math.ceil(remaining / 1000));

        await new Promise((r) => setTimeout(r, 50));
      }

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
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed via-surface to-tertiary-fixed opacity-60 z-0" />

      {/* Close button */}
      <div className="relative z-10 flex justify-end p-4">
        <button
          onClick={() => {
            cleanup();
            onBack();
          }}
          className="h-10 w-10 rounded-full bg-surface-white shadow-sm flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pb-8">
        {/* Floating music notes */}
        {(phase === "sing" || phase === "ready") && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span className="material-symbols-outlined absolute left-[20%] top-[40%] text-primary opacity-50" style={{ animation: "float-up 3s linear infinite" }}>music_note</span>
            <span className="material-symbols-outlined absolute right-[25%] top-[30%] text-secondary opacity-40 text-2xl" style={{ animation: "float-up 3s linear infinite 1.5s" }}>music_note</span>
            <span className="material-symbols-outlined absolute left-[70%] top-[60%] text-tertiary opacity-60 text-xl" style={{ animation: "float-up 3s linear infinite 0.7s" }}>music_note</span>
          </div>
        )}

        {/* Title -- only show when not recording */}
        {phase !== "sing" && (
          <div className="text-center mb-6">
            <h1 className="font-heading text-[24px] font-extrabold text-on-surface italic leading-[30px]">
              {phase === "ready" && <>Sing: <span className="text-primary">"Ice Cream"</span></>}
              {phase === "countdown" && "Get Ready..."}
              {phase === "analyzing" && "Analyzing..."}
            </h1>
            <p className="text-[16px] text-on-surface-variant mt-2">
              {phase === "ready" && "Speak or sing what you're craving!"}
              {phase === "analyzing" && "Judging your melody..."}
            </p>
          </div>
        )}

        {/* Countdown overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <span className="text-[72px] font-extrabold text-primary font-heading">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mic button area */}
        {(phase === "ready" || phase === "sing") && (
          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            {/* Glow rings */}
            <div
              className="absolute inset-0 rounded-full border-2 border-primary-container opacity-20"
              style={{ animation: "pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite" }}
            />
            <div
              className="absolute inset-2 rounded-full border-2 border-primary opacity-40"
              style={{ animation: "pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite 0.5s" }}
            />
            {/* Central mic */}
            <div className="relative w-32 h-32 rounded-full bg-primary-container shadow-[0_0_40px_rgba(154,22,202,0.4)] flex items-center justify-center z-10">
              <span className="material-symbols-outlined fill text-on-primary-container text-6xl">mic</span>
            </div>
          </div>
        )}

        {/* Timer bar + seconds during singing */}
        {phase === "sing" && (
          <div className="w-full max-w-[260px] mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-on-surface-variant font-semibold">Recording...</span>
              <span className="text-[18px] font-extrabold text-primary font-heading">{secondsLeft}s</span>
            </div>
            <div className="h-[6px] bg-outline-variant rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: SING_DURATION_MS / 1000, ease: "linear" }}
              />
            </div>
          </div>
        )}

        {/* Stop button during singing */}
        {phase === "sing" && (
          <button
            onClick={() => { stopRequestedRef.current = true; }}
            className="mb-6 bg-secondary text-on-secondary font-heading text-[16px] font-bold px-8 py-3 rounded-full shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined fill text-[20px]">stop_circle</span>
            Done
          </button>
        )}

        {/* Waveform visualizer */}
        <div className="mb-8">
          <PitchVisualizer levels={levels} isActive={phase === "sing"} />
        </div>

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
              className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
            />
          </motion.div>
        )}

        {/* Sing Now button */}
        {phase === "ready" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xs"
          >
            <button
              onClick={startListening}
              className="w-full bg-primary text-on-primary font-heading text-[20px] font-bold py-4 rounded-full shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              Sing Now
              <span className="material-symbols-outlined fill">graphic_eq</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
