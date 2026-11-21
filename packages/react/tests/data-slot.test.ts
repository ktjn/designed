import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = path.join(
  path.dirname(path.dirname(fileURLToPath(import.meta.url))),
  "src",
);

describe("data-slot contract", () => {
  it("defines data-slot attributes on every component source file", async () => {
    const entries = await readdir(srcDir, {
      withFileTypes: true,
      recursive: true,
    });
    const componentFiles = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.endsWith(".tsx") &&
          !entry.name.endsWith(".test.tsx"),
      )
      .map((entry) => path.join(entry.parentPath, entry.name))
      .sort();

    expect(componentFiles.length).toBeGreaterThan(50);

    const missing: string[] = [];
    for (const file of componentFiles) {
      const source = await readFile(file, "utf8");
      if (!source.includes('data-slot="')) {
        missing.push(path.relative(srcDir, file).replace(/\\/g, "/"));
      }
    }

    expect(missing).toEqual([]);
  });
});
