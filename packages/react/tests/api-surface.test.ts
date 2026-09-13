import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { collectApiSurface } from "../scripts/collect-api-surface";

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

describe("public API surface", () => {
  it("matches the committed api-report.d.ts baseline", async () => {
    const current = await collectApiSurface(path.join(packageRoot, "dist"));
    const baseline = await readFile(
      path.join(packageRoot, "api-report.d.ts"),
      "utf8",
    );
    expect(current).toBe(baseline);
  });
});
