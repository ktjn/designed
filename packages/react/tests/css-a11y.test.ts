import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = path.join(
  path.dirname(path.dirname(fileURLToPath(import.meta.url))),
  "src",
);

async function collectCssModules(): Promise<string[]> {
  const entries = await readdir(srcDir, {
    withFileTypes: true,
    recursive: true,
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".module.css"))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
}

describe("CSS accessibility and RTL contracts", () => {
  it("defines @media (prefers-reduced-motion: reduce) in every stylesheet with transitions or animations", async () => {
    const files = await collectCssModules();
    const missing: string[] = [];

    for (const file of files) {
      const css = await readFile(file, "utf8");
      if (
        /(transition|animation)\s*:/.test(css) &&
        !css.includes("prefers-reduced-motion")
      ) {
        missing.push(path.relative(srcDir, file).replace(/\\/g, "/"));
      }
    }

    expect(missing).toEqual([]);
  });

  it("uses logical text-align instead of physical left/right across all stylesheets", async () => {
    const files = await collectCssModules();
    const violations: string[] = [];

    for (const file of files) {
      const css = await readFile(file, "utf8");
      if (/text-align\s*:\s*(left|right)\b/.test(css)) {
        violations.push(path.relative(srcDir, file).replace(/\\/g, "/"));
      }
    }

    expect(violations).toEqual([]);
  });

  it("reverses drawer horizontal slide offsets in RTL and disables iconClose transition under reduced motion", async () => {
    const drawerCss = await readFile(
      path.join(srcDir, "drawer/drawer.module.css"),
      "utf8",
    );
    expect(drawerCss).toContain(":dir(rtl)");

    const dialogCss = await readFile(
      path.join(srcDir, "dialog/dialog.module.css"),
      "utf8",
    );
    const reducedBlock = dialogCss.match(
      /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/,
    )?.[1];
    expect(reducedBlock).toContain(".iconClose");
  });
});
