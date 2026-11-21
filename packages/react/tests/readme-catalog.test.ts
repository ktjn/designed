import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

describe("README component catalog", () => {
  it("lists every exported component from packages/react/src/index.ts with a Storybook link", async () => {
    const indexSource = await readFile(
      path.join(repoRoot, "packages/react/src/index.ts"),
      "utf8",
    );
    const readmeSource = await readFile(
      path.join(repoRoot, "README.md"),
      "utf8",
    );

    const exportedComponents: string[] = [];
    for (const match of indexSource.matchAll(/^export \{ ([^}]+) \} from /gm)) {
      const names = (match[1] ?? "")
        .split(",")
        .map((n) => n.trim())
        .filter((n) => /^[A-Z]/.test(n));
      exportedComponents.push(...names);
    }

    expect(exportedComponents.length).toBeGreaterThanOrEqual(59);

    const missing: string[] = [];
    for (const name of exportedComponents) {
      if (!readmeSource.includes(`[${name}](`)) {
        missing.push(name);
      }
    }

    expect(missing).toEqual([]);
  });
});
