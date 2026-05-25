/**
 * Detect the fundamental frequency of an audio buffer using autocorrelation.
 * Returns the frequency in Hz, or -1 if no pitch is detected.
 */
export function detectPitch(
  buffer: Float32Array,
  sampleRate: number,
  minRms: number = 0.01
): number {
  const SIZE = buffer.length;

  // Check if signal is loud enough
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < minRms) return -1;

  // Trim leading/trailing quiet samples to improve detection
  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) >= threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) >= threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  const trimmed = buffer.slice(r1, r2);
  const trimmedSize = trimmed.length;
  if (trimmedSize < 2) return -1;

  // Autocorrelation
  const correlation = new Float32Array(trimmedSize);
  for (let lag = 0; lag < trimmedSize; lag++) {
    let sum = 0;
    for (let i = 0; i < trimmedSize - lag; i++) {
      sum += trimmed[i] * trimmed[i + lag];
    }
    correlation[lag] = sum;
  }

  // Find first dip (skip the initial peak at lag=0)
  let dip = 0;
  while (dip < trimmedSize - 1 && correlation[dip] > correlation[dip + 1]) {
    dip++;
  }

  // Find the highest peak after the dip
  let maxVal = -1;
  let maxPos = -1;
  for (let i = dip; i < trimmedSize; i++) {
    if (correlation[i] > maxVal) {
      maxVal = correlation[i];
      maxPos = i;
    }
  }

  if (maxPos === -1 || maxPos === 0) return -1;

  // Parabolic interpolation for sub-sample accuracy
  const prev = correlation[maxPos - 1] ?? 0;
  const curr = correlation[maxPos];
  const next = correlation[maxPos + 1] ?? 0;
  const a = (prev + next - 2 * curr) / 2;
  let refinedPos = maxPos;
  if (a !== 0) {
    const b = (next - prev) / 2;
    refinedPos = maxPos - b / (2 * a);
  }

  return sampleRate / refinedPos;
}

/**
 * Convert frequency to cents relative to a reference frequency.
 * Cents = 1200 * log2(f / ref)
 */
export function frequencyToCents(frequency: number, reference: number): number {
  if (frequency <= 0 || reference <= 0) return 0;
  return 1200 * Math.log2(frequency / reference);
}
