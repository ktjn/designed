import { readdirSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defineConfig } from "tsup";

function collectSourceFilesSync(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        /\.tsx?$/.test(entry.name) &&
        !entry.name.endsWith(".d.ts") &&
        !entry.name.includes(".test."),
    )
    .map((entry) =>
      path.join(entry.parentPath, entry.name).split(path.sep).join("/"),
    );
}

async function collectModuleCssFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".module.css"))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

export default defineConfig({
  entry: collectSourceFilesSync("src"),
  // No bundling: output mirrors src 1:1, one module per file. This keeps
  // per-component tree shaking trivial and keeps relative CSS Modules import
  // paths valid after build (see onSuccess below).
  bundle: false,
  format: ["esm"],
  dts: false,
  sourcemap: true,
  clean: true,
  async onSuccess() {
    // CSS Modules ship unprocessed: with bundle:false, esbuild never resolves
    // the `.module.css` import graph, so the compiled JS keeps the original
    // relative import untouched. Copying the raw source files to the same
    // relative path in dist makes that import resolvable again, and leaves
    // the consuming application's own bundler to generate scoped classnames
    // for it at its own build time.
    const cssFiles = await collectModuleCssFiles("src");
    await Promise.all(
      cssFiles.map(async (file) => {
        const source = await readFile(file, "utf8");
        const target = path.join("dist", path.relative("src", file));
        await mkdir(path.dirname(target), { recursive: true });
        const wrapped = `@layer ds.tokens.base, ds.tokens.density, ds.tokens.scheme, ds.tokens.contrast, ds.tokens.brand, ds.components;\n\n@layer ds.components {\n${source.trim()}\n}\n`;
        await writeFile(target, wrapped);
      }),
    );
  },
});
