import { describe, it, expect } from "vitest";
import { getDiscountTier } from "../discounts";

describe("getDiscountTier", () => {
  it("returns Pitch Perfect tier for score 90-100", () => {
    const tier = getDiscountTier(95);
    expect(tier.label).toBe("Pitch Perfect");
    expect(tier.discount).toBe(20);
  });

  it("returns Sweet Voice tier for score 70-89", () => {
    const tier = getDiscountTier(75);
    expect(tier.label).toBe("Sweet Voice");
    expect(tier.discount).toBe(15);
  });

  it("returns Nice Try tier for score 50-69", () => {
    const tier = getDiscountTier(55);
    expect(tier.label).toBe("Nice Try");
    expect(tier.discount).toBe(10);
  });

  it("returns Keep Singing tier for score 0-49", () => {
    const tier = getDiscountTier(30);
    expect(tier.label).toBe("Keep Singing");
    expect(tier.discount).toBe(5);
  });

  it("handles boundary at 90", () => {
    expect(getDiscountTier(90).label).toBe("Pitch Perfect");
  });

  it("handles boundary at 70", () => {
    expect(getDiscountTier(70).label).toBe("Sweet Voice");
  });

  it("handles boundary at 50", () => {
    expect(getDiscountTier(50).label).toBe("Nice Try");
  });

  it("handles score of 0", () => {
    expect(getDiscountTier(0).discount).toBe(5);
  });

  it("clamps score of 100", () => {
    expect(getDiscountTier(100).label).toBe("Pitch Perfect");
  });
});
