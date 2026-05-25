import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MelodyPrompt } from "../components/MelodyPrompt";
import { PitchVisualizer } from "../components/PitchVisualizer";
import { Button } from "../components/Button";
import { ICE_CREAM_MELODY, playMelody } from "../lib/melody";
import { detectPitch } from "../lib/pitch";
import { computeNoteScore, computeOverallScore } from "../lib/scoring";

type Phase = "ready" | "listen" | "sing" | "analyzing";

interface SingScreenProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function SingScreen({ onComplete, onBack }: SingScreenProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [activeNote, setActiveNote] = useState(-1);
  const [levels, setLevels] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const pitchSamplesRef = useRef<number[][]>([[], []]);

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
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

      // Phase 1: Play the reference melody
      setPhase("listen");
      setActiveNote(0);

      const melody = ICE_CREAM_MELODY;

      for (let i = 0; i < melody.length; i++) {
        setActiveNote(i);
        await playMelody(ctx, [melody[i]]);
        await new Promise((r) => setTimeout(r, 200));
      }
      setActiveNote(-1);

      // Brief pause, then countdown
      await new Promise((r) => setTimeout(r, 300));
      setCountdown(3);
      await new Promise((r) => setTimeout(r, 800));
      setCountdown(2);
      await new Promise((r) => setTimeout(r, 800));
      setCountdown(1);
      await new Promise((r) => setTimeout(r, 800));
      setCountdown(null);

      // Phase 2: User sings
      setPhase("sing");
      pitchSamplesRef.current = [[], []];

      for (let i = 0; i < melody.length; i++) {
        setActiveNote(i);
        const noteDuration = melody[i].duration * 1000;
        const startTime = Date.now();

        while (Date.now() - startTime < noteDuration) {
          const buffer = new Float32Array(analyser.fftSize);
          analyser.getFloatTimeDomainData(buffer);

          const pitch = detectPitch(buffer, ctx.sampleRate);
          if (pitch > 0) {
            pitchSamplesRef.current[i].push(pitch);
          }

          const freqData = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(freqData);
          const barLevels: number[] = [];
          const step = Math.floor(freqData.length / 20);
          for (let b = 0; b < 20; b++) {
            barLevels.push(freqData[b * step] / 255);
          }
          setLevels(barLevels);

          await new Promise((r) => setTimeout(r, 50));
        }
      }

      // Phase 3: Analyze
      setPhase("analyzing");
      setActiveNote(-1);
      setLevels([]);

      const noteScores = ICE_CREAM_MELODY.map((note, i) => {
        const samples = pitchSamplesRef.current[i];
        if (samples.length === 0) return 0;
        const sorted = [...samples].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        return computeNoteScore(median, note.frequency);
      });

      const overall = computeOverallScore(noteScores);

      await new Promise((r) => setTimeout(r, 1200));

      cleanup();
      onComplete(overall);
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
            {phase === "ready" && "Match the melody to unlock your discount"}
            {phase === "listen" && "Listen to the melody..."}
            {phase === "sing" && "Your turn! Sing it back"}
            {phase === "analyzing" && "Analyzing your performance..."}
          </p>
        </div>

        {/* Countdown overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
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

        {/* Melody prompt */}
        <MelodyPrompt
          melody={ICE_CREAM_MELODY}
          activeIndex={activeNote}
          phase={phase === "listen" ? "listen" : phase === "sing" ? "sing" : "idle"}
        />

        {/* Visualizer */}
        <PitchVisualizer
          levels={levels}
          isActive={phase === "sing"}
        />

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
