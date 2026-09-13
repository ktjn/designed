import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import { beforeAll, describe, expect, it } from "vitest";
import { buildTokens } from "../scripts/build-tokens.ts";

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(packageRoot, "dist");

async function hashDir(dir: string): Promise<string> {
  const hash = createHash("sha256");
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
  for (const file of files) {
    hash.update(path.relative(dir, file));
    hash.update(await readFile(file));
  }
  return hash.digest("hex");
}

beforeAll(async () => {
  await buildTokens();
});

describe("token build", () => {
  it("produces the documented output layout", async () => {
    await expect(
      readFile(path.join(distDir, "css/base.css"), "utf8"),
    ).resolves.toContain(":root");
    await expect(
      readFile(path.join(distDir, "css/schemes/dark.css"), "utf8"),
    ).resolves.toContain('[data-color-scheme="dark"]');
    await expect(
      readFile(path.join(distDir, "css/densities/compact.css"), "utf8"),
    ).resolves.toContain('[data-density="compact"]');
    await expect(
      readFile(path.join(distDir, "css/contrasts/more.css"), "utf8"),
    ).resolves.toContain('[data-contrast="more"]');
    await expect(
      readFile(path.join(distDir, "css/brands/default.css"), "utf8"),
    ).resolves.toContain("auto-generated");
    await expect(
      readFile(path.join(distDir, "json/tokens.json"), "utf8"),
    ).resolves.toBeTruthy();
    await expect(
      readFile(path.join(distDir, "types/tokens.d.ts"), "utf8"),
    ).resolves.toContain("export type TokenIdentifier");
  });

  it("does not emit primitive tokens as public CSS custom properties", async () => {
    const base = await readFile(path.join(distDir, "css/base.css"), "utf8");
    expect(base).not.toMatch(/--ds-color-neutral-/);
    expect(base).not.toMatch(/--ds-color-blue-/);
    expect(base).toContain("--ds-color-action-primary-default");
  });

  it("resolves aliases to concrete values rather than leaving references unresolved", async () => {
    const base = await readFile(path.join(distDir, "css/base.css"), "utf8");
    expect(base).not.toContain("{color.");
    expect(base).toContain("--ds-color-action-primary-default: #3b82f6;");
  });

  it("theme overrides only redefine the tokens that change for that dimension", async () => {
    const dark = await readFile(
      path.join(distDir, "css/schemes/dark.css"),
      "utf8",
    );
    // space/radius tokens are unaffected by color scheme and must not appear here.
    expect(dark).not.toContain("--ds-space-control");
    expect(dark).not.toContain("--ds-radius-control");
  });

  it("produces deterministic output across repeated builds", async () => {
    const firstHash = await hashDir(distDir);
    await buildTokens();
    const secondHash = await hashDir(distDir);
    expect(secondHash).toBe(firstHash);
  });

  it("matches the committed public token API snapshot", async () => {
    const current = JSON.parse(
      await readFile(path.join(distDir, "json/tokens.json"), "utf8"),
    );
    const snapshot = JSON.parse(
      await readFile(path.join(packageRoot, "token-api.json"), "utf8"),
    );
    expect(current).toEqual(snapshot);
  });
});

describe("token validation", () => {
  it("rejects an unresolved token reference", async () => {
    const sd = new StyleDictionary({
      source: ["tests/fixtures/unresolved.json"],
      log: { verbosity: "silent" },
      platforms: {
        css: {
          transformGroup: "css",
          buildPath: "dist/fixture-check/",
          files: [{ destination: "unresolved.css", format: "css/variables" }],
        },
      },
    });
    await expect(async () => {
      await sd.hasInitialized;
      await sd.buildAllPlatforms();
    }).rejects.toThrow();
  });

  it("rejects a reference cycle", async () => {
    const sd = new StyleDictionary({
      source: ["tests/fixtures/cycle-a.json", "tests/fixtures/cycle-b.json"],
      log: { verbosity: "silent" },
      platforms: {
        css: {
          transformGroup: "css",
          buildPath: "dist/fixture-check/",
          files: [{ destination: "cycle.css", format: "css/variables" }],
        },
      },
    });
    await expect(async () => {
      await sd.hasInitialized;
      await sd.buildAllPlatforms();
    }).rejects.toThrow();
  });
});

describe("token naming", () => {
  it("does not bake scheme/density/contrast names into semantic token identifiers", async () => {
    const dtsSource = await readFile(
      path.join(distDir, "types/tokens.d.ts"),
      "utf8",
    );
    const identifiers = [...dtsSource.matchAll(/"([a-z.]+)"/g)]
      .map((match) => match[1])
      .filter((identifier) => identifier !== undefined);
    const bannedSegments = ["dark", "light", "compact", "more"];
    for (const identifier of identifiers) {
      const segments = identifier.split(".");
      for (const banned of bannedSegments) {
        expect(
          segments,
          `token "${identifier}" must not encode "${banned}" in its name`,
        ).not.toContain(banned);
      }
    }
  });
});
