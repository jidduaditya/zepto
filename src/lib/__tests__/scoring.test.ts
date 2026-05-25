import { describe, it, expect } from "vitest";
import { computeNoteScore, computeOverallScore } from "../scoring";

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
