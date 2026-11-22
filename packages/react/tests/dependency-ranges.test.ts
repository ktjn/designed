import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

describe("dependency range contract", () => {
  it("declares a caret range for @base-ui/react so consumers can share a single copy", async () => {
    const manifest = JSON.parse(
      await readFile(path.join(packageRoot, "package.json"), "utf8"),
    ) as { dependencies?: Record<string, string> };

    const range = manifest.dependencies?.["@base-ui/react"];
    expect(range).toBeDefined();
    expect(range).toMatch(/^\^\d+\.\d+\.\d+$/);
  });
});
