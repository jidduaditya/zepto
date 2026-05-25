import { describe, it, expect } from "vitest";
import { detectPitch } from "../pitch";

function generateSineWave(
  frequency: number,
  sampleRate: number,
  duration: number
): Float32Array {
  const length = Math.floor(sampleRate * duration);
  const buffer = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = Math.sin(2 * Math.PI * frequency * (i / sampleRate));
  }
  return buffer;
}

describe("detectPitch", () => {
  const sampleRate = 44100;

  it("detects A4 (440 Hz) from a pure sine wave", () => {
    const buffer = generateSineWave(440, sampleRate, 0.1);
    const result = detectPitch(buffer, sampleRate);
    expect(result).toBeGreaterThan(430);
    expect(result).toBeLessThan(450);
  });

  it("detects C4 (261.63 Hz) from a pure sine wave", () => {
    const buffer = generateSineWave(261.63, sampleRate, 0.1);
    const result = detectPitch(buffer, sampleRate);
    expect(result).toBeGreaterThan(255);
    expect(result).toBeLessThan(268);
  });

  it("detects E4 (329.63 Hz) from a pure sine wave", () => {
    const buffer = generateSineWave(329.63, sampleRate, 0.1);
    const result = detectPitch(buffer, sampleRate);
    expect(result).toBeGreaterThan(323);
    expect(result).toBeLessThan(336);
  });

  it("returns -1 for silence", () => {
    const buffer = new Float32Array(4096).fill(0);
    const result = detectPitch(buffer, sampleRate);
    expect(result).toBe(-1);
  });

  it("returns -1 for very quiet signal", () => {
    const buffer = new Float32Array(4096);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.sin(2 * Math.PI * 440 * (i / sampleRate)) * 0.005;
    }
    const result = detectPitch(buffer, sampleRate);
    expect(result).toBe(-1);
  });
});
