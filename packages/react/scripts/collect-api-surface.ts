import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Concatenates every generated .d.ts file under dist/ (excluding .d.ts.map)
 * into one deterministic text blob representing the package's full public
 * type surface. Because this package builds with bundle:false (one module
 * per component), there is no single rolled-up declaration file the way
 * tsup's bundle mode would produce, so this stands in for that.
 */
export async function collectApiSurface(distDir: string): Promise<string> {
  const entries = await readdir(distDir, {
    withFileTypes: true,
    recursive: true,
  });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".d.ts"))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort((a, b) => a.localeCompare(b));

  const sections = await Promise.all(
    files.map(async (file) => {
      const relative = path.relative(distDir, file).split(path.sep).join("/");
      const content = await readFile(file, "utf8");
      return `// ---- ${relative} ----\n${content}`;
    }),
  );

  return `${sections.join("\n\n")}\n`;
}
