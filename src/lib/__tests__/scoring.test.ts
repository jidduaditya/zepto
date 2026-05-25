import { describe, it, expect } from "vitest";
import {
  computeNoteScore,
  computeOverallScore,
  scoreSingingQuality,
} from "../scoring";

describe("computeNoteScore", () => {
  it("returns 100 for a perfect pitch match", () => {
    const score = computeNoteScore(261.63, 261.63);
    expect(score).toBe(100);
  });

  it("returns high score for pitch within 20 cents", () => {
    // 20 cents sharp of 261.63 Hz
    const sharpFreq = 261.63 * Math.pow(2, 20 / 1200);
    const score = computeNoteScore(sharpFreq, 261.63);
    expect(score).toBeGreaterThan(80);
  });

  it("returns moderate score for pitch within 50 cents", () => {
    // 50 cents sharp (quarter tone)
    const sharpFreq = 261.63 * Math.pow(2, 50 / 1200);
    const score = computeNoteScore(sharpFreq, 261.63);
    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThan(80);
  });

  it("returns low score for pitch off by a semitone (100 cents)", () => {
    // 100 cents = one semitone
    const sharpFreq = 261.63 * Math.pow(2, 100 / 1200);
    const score = computeNoteScore(sharpFreq, 261.63);
    expect(score).toBeLessThan(50);
  });

  it("returns 0 for no detected pitch (-1)", () => {
    const score = computeNoteScore(-1, 261.63);
    expect(score).toBe(0);
  });
});

describe("computeOverallScore", () => {
  it("averages note scores", () => {
    const score = computeOverallScore([100, 80]);
    expect(score).toBe(90);
  });

  it("rounds to nearest integer", () => {
    const score = computeOverallScore([100, 77]);
    expect(score).toBe(89);
  });

  it("returns 0 for empty array", () => {
    const score = computeOverallScore([]);
    expect(score).toBe(0);
  });
});

describe("scoreSingingQuality", () => {
  it("returns 0 for no samples", () => {
    expect(scoreSingingQuality([])).toBe(0);
  });

  it("returns 0 for all-negative samples", () => {
    expect(scoreSingingQuality([-1, -1, -1])).toBe(0);
  });

  it("scores high for stable singing with some melodic range", () => {
    // Simulate stable singing around 300 Hz with slight variation (natural vibrato)
    const samples: number[] = [];
    for (let i = 0; i < 50; i++) {
      // Alternate between two pitch regions (~300 Hz and ~350 Hz)
      samples.push(i < 25 ? 300 + Math.random() * 5 : 350 + Math.random() * 5);
    }
    const score = scoreSingingQuality(samples);
    expect(score).toBeGreaterThan(60);
  });

  it("scores lower for very few pitched samples (weak presence)", () => {
    const samples = [300, 305, 310]; // only 3 samples out of expected 50
    const score = scoreSingingQuality(samples);
    // Presence is low (3/50) but stability+range can still score well
    // Should be noticeably lower than a full-presence recording
    expect(score).toBeLessThan(70);
  });

  it("scores lower for monotone singing (no range)", () => {
    // 50 samples all at exactly 300 Hz
    const samples = new Array(50).fill(300);
    const score = scoreSingingQuality(samples);
    expect(score).toBeLessThan(75); // good presence + stability but no range
  });

  it("clamps between 0 and 100", () => {
    const samples: number[] = [];
    for (let i = 0; i < 100; i++) {
      samples.push(300 + Math.random() * 50);
    }
    const score = scoreSingingQuality(samples);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
