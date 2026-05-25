export interface MelodyNote {
  label: string;
  frequency: number; // Hz
  duration: number; // seconds
}

/**
 * The reference melody for "Ice Cream".
 * Two notes: C4 for "Ice", E4 for "Cream".
 * Simple ascending major third -- easy to sing, easy to detect.
 */
export const ICE_CREAM_MELODY: MelodyNote[] = [
  { label: "Ice", frequency: 261.63, duration: 0.8 },
  { label: "Cream", frequency: 329.63, duration: 1.0 },
];

/**
 * Play the reference melody through the speakers using OscillatorNode.
 * Returns a promise that resolves when playback finishes.
 */
export async function playMelody(
  ctx: AudioContext,
  melody: MelodyNote[]
): Promise<void> {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.3;
  gainNode.connect(ctx.destination);

  let offset = 0;
  for (const note of melody) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = note.frequency;
    osc.connect(gainNode);
    osc.start(ctx.currentTime + offset);

    // Smooth fade out to avoid clicks
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.3, ctx.currentTime + offset);
    noteGain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + offset + note.duration
    );
    osc.disconnect();
    osc.connect(noteGain);
    noteGain.connect(ctx.destination);

    osc.stop(ctx.currentTime + offset + note.duration);
    offset += note.duration + 0.1; // 100ms gap between notes
  }

  return new Promise((resolve) => {
    setTimeout(resolve, offset * 1000);
  });
}
