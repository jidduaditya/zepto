import { frequencyToCents } from "./pitch";

/**
 * Score a single detected pitch against a target frequency.
 * Returns 0-100. Perfect match = 100. Off by 100+ cents = 0.
 *
 * Scoring curve: cosine-based falloff from 100 (0 cents off) to 0 (100 cents off).
 * This gives a slightly gentler curve near the centre compared to linear,
 * so 20 cents off scores >80 and 50 cents off scores between 50 and 80.
 * 100 cents = one semitone. Anything beyond a semitone scores 0.
 */
export function computeNoteScore(
  detectedHz: number,
  targetHz: number
): number {
  if (detectedHz <= 0) return 0;

  const centsOff = Math.abs(frequencyToCents(detectedHz, targetHz));
  const maxCents = 100; // one semitone

  if (centsOff >= maxCents) return 0;

  // Cosine curve: cos(x * PI/2) maps 0->1 and 1->0, but stays above linear
  // in the [0,1] range, so 20 cents -> score > 80 and 50 cents -> score > 50
  const t = centsOff / maxCents;
  const score = 100 * Math.cos((t * Math.PI) / 2);
  return Math.round(score);
}

/**
 * Compute the overall score from an array of per-note scores.
 * Simple average, rounded to nearest integer.
 */
export function computeOverallScore(noteScores: number[]): number {
  if (noteScores.length === 0) return 0;
  const sum = noteScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / noteScores.length);
}
