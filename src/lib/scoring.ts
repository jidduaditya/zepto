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

/**
 * Score singing quality from raw pitch samples (no reference melody).
 * Evaluates three dimensions:
 * - Presence (40 pts): did they actually produce pitched sound?
 * - Stability (30 pts): how consistent/controlled was the pitch?
 * - Melodic range (30 pts): did they sing with variation (not monotone)?
 *
 * Returns 0-100.
 */
export function scoreSingingQuality(pitchSamples: number[]): number {
  const valid = pitchSamples.filter((p) => p > 0);
  if (valid.length === 0) return 0;

  // Presence: ratio of valid pitch frames to total expected (~50 samples for 2.5s at 20/s)
  const expectedSamples = 50;
  const presenceRatio = Math.min(1, valid.length / expectedSamples);
  const presenceScore = presenceRatio * 40;

  // Stability: lower coefficient of variation = more controlled singing
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  const variance =
    valid.reduce((a, b) => a + (b - mean) ** 2, 0) / valid.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean; // coefficient of variation
  // cv < 0.02 = very stable, cv > 0.3 = erratic
  const stabilityScore = Math.max(0, 30 * (1 - Math.min(1, cv / 0.3)));

  // Melodic range: reward having some pitch variation (singing, not droning)
  // but not too much (screaming). Sweet spot: 50-400 cents range
  const sortedValid = [...valid].sort((a, b) => a - b);
  const low = sortedValid[Math.floor(sortedValid.length * 0.1)];
  const high = sortedValid[Math.floor(sortedValid.length * 0.9)];
  const rangeCents = Math.abs(frequencyToCents(high, low));
  // 0 cents = monotone (0 pts), 50-400 cents = melodic (full pts), >600 = erratic (drops)
  let rangeScore = 0;
  if (rangeCents < 50) {
    rangeScore = (rangeCents / 50) * 30;
  } else if (rangeCents <= 400) {
    rangeScore = 30;
  } else {
    rangeScore = Math.max(0, 30 * (1 - (rangeCents - 400) / 200));
  }

  return Math.round(
    Math.max(0, Math.min(100, presenceScore + stabilityScore + rangeScore))
  );
}
