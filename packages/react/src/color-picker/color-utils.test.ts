import { describe, expect, it } from "vitest";
import { isValidColor, normalizeToHex } from "./color-utils.js";

describe("isValidColor", () => {
  it.each([
    "#f00",
    "#ff0000",
    "#ff0000aa",
    "rgb(255, 0, 0)",
    "rgba(255, 0, 0, 0.5)",
    "hsl(0, 100%, 50%)",
  ])("accepts %s", (value) => {
    expect(isValidColor(value)).toBe(true);
  });

  it.each(["", "not-a-color", "#ff00", "rgb(255, 0)", "red"])(
    "rejects %s",
    (value) => {
      expect(isValidColor(value)).toBe(false);
    },
  );
});

describe("normalizeToHex", () => {
  it("expands #rgb shorthand", () => {
    expect(normalizeToHex("#f00")).toBe("#ff0000");
  });

  it("lowercases #rrggbb and #rrggbbaa", () => {
    expect(normalizeToHex("#FF0000")).toBe("#ff0000");
    expect(normalizeToHex("#FF0000AA")).toBe("#ff0000aa");
  });

  it("converts rgb() to hex", () => {
    expect(normalizeToHex("rgb(255, 0, 0)")).toBe("#ff0000");
  });

  it("converts rgba() to hex with alpha", () => {
    expect(normalizeToHex("rgba(255, 0, 0, 1)")).toBe("#ff0000ff");
    expect(normalizeToHex("rgba(0, 0, 0, 0)")).toBe("#00000000");
  });

  it("converts hsl() to hex", () => {
    expect(normalizeToHex("hsl(0, 100%, 50%)")).toBe("#ff0000");
    expect(normalizeToHex("hsl(120, 100%, 50%)")).toBe("#00ff00");
    expect(normalizeToHex("hsl(240, 100%, 50%)")).toBe("#0000ff");
  });

  it("returns null for invalid input", () => {
    expect(normalizeToHex("not-a-color")).toBeNull();
  });
});
