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
      readFile(path.join(distDir, "css/brands/editorial.css"), "utf8"),
    ).resolves.toContain('[data-brand="editorial"]');
    const allCss = await readFile(path.join(distDir, "css/all.css"), "utf8");
    expect(allCss).toContain(":root");
    expect(allCss).toContain('[data-brand="editorial"]');
    expect(allCss).toContain('[data-color-scheme="dark"]');
    expect(allCss).toContain('[data-density="compact"]');
    expect(allCss).toContain('[data-contrast="more"]');
    expect(allCss.indexOf(":root")).toBeLessThan(
      allCss.indexOf('[data-color-scheme="dark"]'),
    );
    expect(allCss.indexOf('[data-color-scheme="dark"]')).toBeLessThan(
      allCss.indexOf('[data-contrast="more"]'),
    );
    const layerHeader =
      "@layer ds.tokens.base, ds.tokens.density, ds.tokens.scheme, ds.tokens.contrast, ds.tokens.brand, ds.components;";
    for (const [file, layer] of [
      ["css/base.css", "ds.tokens.base"],
      ["css/densities/compact.css", "ds.tokens.density"],
      ["css/schemes/dark.css", "ds.tokens.scheme"],
      ["css/contrasts/more.css", "ds.tokens.contrast"],
      ["css/brands/default.css", "ds.tokens.brand"],
      ["css/brands/editorial.css", "ds.tokens.brand"],
    ] as const) {
      const content = await readFile(path.join(distDir, file), "utf8");
      expect(content, `${file} should declare layer order`).toContain(
        layerHeader,
      );
      expect(content, `${file} should wrap rules in @layer ${layer}`).toContain(
        `@layer ${layer} {`,
      );
    }
    expect(allCss).toContain(layerHeader);
    expect(allCss).toContain('[data-color-scheme="light"]');
    expect(allCss).toContain('[data-density="default"]');
    expect(allCss).toContain('[data-contrast="default"]');
    expect(allCss).toContain('[data-brand="default"]');
    const darkCssCheck = await readFile(
      path.join(distDir, "css/schemes/dark.css"),
      "utf8",
    );
    expect(darkCssCheck).not.toContain("--ds-color-border-focus");
    const editorialCssCheck = await readFile(
      path.join(distDir, "css/brands/editorial.css"),
      "utf8",
    );
    expect(editorialCssCheck).toContain("@media (prefers-color-scheme: dark)");
    await expect(
      readFile(path.join(distDir, "json/tokens.json"), "utf8"),
    ).resolves.toBeTruthy();
    await expect(
      readFile(path.join(distDir, "types/tokens.d.ts"), "utf8"),
    ).resolves.toContain("export type TokenIdentifier");
  });

  it("emits only type-level exports in tokens.d.ts because ./types has no JS runtime", async () => {
    const dts = await readFile(path.join(distDir, "types/tokens.d.ts"), "utf8");
    expect(dts).toContain("export type TokenIdentifier =");
    expect(dts).toContain("export type CssVariableName =");
    expect(dts).not.toMatch(
      /\bexport\s+declare\s+(const|let|var|function|class)\b/,
    );
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
    expect(base).toContain("--ds-color-action-primary-default: #2563eb;");
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

function parseCssVariables(
  css: string,
  selector: string,
): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  if (!match?.[1]) return {};
  const vars: Record<string, string> = {};
  for (const [, name, value] of match[1].matchAll(
    /(--[a-z0-9-]+)\s*:\s*([^;]+);/g,
  )) {
    if (name && value) vars[name] = value.trim();
  }
  return vars;
}

function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => {
    const srgb = Number.parseInt(clean.slice(offset, offset + 2), 16) / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return (
    0.2126 * (channels[0] ?? 0) +
    0.7152 * (channels[1] ?? 0) +
    0.0722 * (channels[2] ?? 0)
  );
}

function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("theme composition and WCAG AA contrast", () => {
  it("provides semantic status tokens and satisfies >= 4.5:1 contrast in light, dark, and high-contrast modes", async () => {
    const baseCss = await readFile(path.join(distDir, "css/base.css"), "utf8");
    const darkCss = await readFile(
      path.join(distDir, "css/schemes/dark.css"),
      "utf8",
    );
    const moreCss = await readFile(
      path.join(distDir, "css/contrasts/more.css"),
      "utf8",
    );
    const editorialCss = await readFile(
      path.join(distDir, "css/brands/editorial.css"),
      "utf8",
    );

    const light = parseCssVariables(baseCss, ":root");
    const dark = {
      ...light,
      ...parseCssVariables(darkCss, '[data-color-scheme="dark"]'),
    };
    const lightMore = {
      ...light,
      ...parseCssVariables(moreCss, '[data-contrast="more"]'),
    };
    const darkMore = {
      ...dark,
      ...parseCssVariables(moreCss, '[data-contrast="more"]'),
      ...parseCssVariables(
        moreCss,
        '[data-color-scheme="dark"][data-contrast="more"]',
      ),
    };
    const editorial = {
      ...light,
      ...parseCssVariables(editorialCss, '[data-brand="editorial"]'),
    };

    for (const [themeName, vars] of [
      ["light", light],
      ["dark", dark],
      ["light+more", lightMore],
      ["dark+more", darkMore],
    ] as const) {
      expect(
        contrastRatio(
          vars["--ds-color-foreground-muted"] ?? "",
          vars["--ds-color-background-default"] ?? "",
        ),
        `${themeName} muted foreground vs default background`,
      ).toBeGreaterThanOrEqual(4.5);

      for (const status of ["info", "success", "warning", "danger"] as const) {
        const fg = vars[`--ds-color-status-${status}-foreground`];
        const bg = vars[`--ds-color-status-${status}-background`];
        const border = vars[`--ds-color-status-${status}-border`];
        expect(fg, `${themeName} status.${status}.foreground`).toBeDefined();
        expect(bg, `${themeName} status.${status}.background`).toBeDefined();
        expect(border, `${themeName} status.${status}.border`).toBeDefined();
        expect(
          contrastRatio(fg ?? "", bg ?? ""),
          `${themeName} status.${status} foreground vs background`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }

    expect(
      contrastRatio(
        editorial["--ds-color-action-primary-foreground"] ?? "",
        editorial["--ds-color-action-primary-default"] ?? "",
      ),
      "editorial primary button contrast",
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("supports platform preference media queries overridable by explicit attributes", async () => {
    const darkCss = await readFile(
      path.join(distDir, "css/schemes/dark.css"),
      "utf8",
    );
    const moreCss = await readFile(
      path.join(distDir, "css/contrasts/more.css"),
      "utf8",
    );

    expect(darkCss).toContain("@media (prefers-color-scheme: dark)");
    expect(darkCss).toContain(':root:not([data-color-scheme="light"])');
    expect(moreCss).toContain("@media (prefers-contrast: more)");
    expect(moreCss).toContain(':root:not([data-contrast="default"])');

    const osDarkExplicitMoreMatch = moreCss.match(
      /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-color-scheme="light"\]\)\[data-contrast="more"\][^{]*\{([\s\S]*?)\}\s*\}/,
    );
    expect(
      osDarkExplicitMoreMatch?.[1],
      "OS dark mode + explicit data-contrast=more should emit dark high-contrast overrides",
    ).toBeTruthy();

    const baseCss = await readFile(path.join(distDir, "css/base.css"), "utf8");
    const darkBase = {
      ...parseCssVariables(baseCss, ":root"),
      ...parseCssVariables(darkCss, '[data-color-scheme="dark"]'),
    };
    const darkExplicitMoreVars: Record<string, string> = { ...darkBase };
    for (const [, name, value] of (osDarkExplicitMoreMatch?.[1] ?? "").matchAll(
      /(--[a-z0-9-]+)\s*:\s*([^;]+);/g,
    )) {
      if (name && value) darkExplicitMoreVars[name] = value.trim();
    }
    expect(
      contrastRatio(
        darkExplicitMoreVars["--ds-color-foreground-muted"] ?? "",
        darkExplicitMoreVars["--ds-color-background-default"] ?? "",
      ),
      "OS dark + explicit data-contrast=more muted foreground contrast",
    ).toBeGreaterThanOrEqual(4.5);
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
