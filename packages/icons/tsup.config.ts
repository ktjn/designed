import { readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "tsup";

function collectSourceFilesSync(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        /\.tsx?$/.test(entry.name) &&
        !entry.name.endsWith(".d.ts"),
    )
    .map((entry) =>
      path.join(entry.parentPath, entry.name).split(path.sep).join("/"),
    );
}

export default defineConfig({
  entry: collectSourceFilesSync("src"),
  // No bundling: each icon ships as its own module so consumers only pay
  // for the icons they actually import (icon-level tree shaking).
  bundle: false,
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
});
