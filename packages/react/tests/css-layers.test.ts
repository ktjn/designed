import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const distDir = path.join(
  path.dirname(path.dirname(fileURLToPath(import.meta.url))),
  "dist",
);

describe("CSS cascade layers", () => {
  it("wraps every built component CSS Module in @layer ds.components", async () => {
    const entries = await readdir(distDir, {
      withFileTypes: true,
      recursive: true,
    });
    const cssFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".module.css"))
      .map((entry) => path.join(entry.parentPath, entry.name))
      .sort();

    expect(cssFiles.length).toBeGreaterThan(50);

    for (const file of cssFiles) {
      const css = await readFile(file, "utf8");
      const rel = path.relative(distDir, file).replace(/\\/g, "/");
      expect(css, `${rel} should declare layer order`).toContain(
        "@layer ds.tokens.base, ds.tokens.density, ds.tokens.scheme, ds.tokens.contrast, ds.tokens.brand, ds.components;",
      );
      expect(
        css,
        `${rel} should wrap styles in @layer ds.components`,
      ).toContain("@layer ds.components {");
    }
  });
});
