import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { transform } from "@svgr/core";
import { optimize } from "svgo";

const SVG_DIR = "src/svg";
const OUT_DIR = "src/generated";

const DANGEROUS_PATTERNS = [
  /<script/i,
  /\son\w+\s*=/i,
  /xlink:href\s*=\s*["']https?:/i,
  /href\s*=\s*["']https?:/i,
  /<foreignObject/i,
];

function toPascalCase(fileName: string): string {
  return fileName
    .replace(/\.svg$/, "")
    .split(/[-_]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function assertSafe(source: string, file: string) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(source)) {
      throw new Error(
        `Refusing to process ${file}: matched unsafe pattern ${pattern}`,
      );
    }
  }
}

function toComponentSource(rawTransform: string, name: string): string {
  // svgr emits a ref-forwarding component as the default export named
  // "ForwardRef". Keep its output mostly untouched (avoids fragile string
  // surgery on generated JSX) and add a named alias + displayName matching
  // this repo's component convention.
  const withTypeOnlyRefImport = rawTransform.replace(
    'import { Ref, forwardRef } from "react";',
    'import type { Ref } from "react";\nimport { forwardRef } from "react";',
  );
  return `${withTypeOnlyRefImport.replace("export default ForwardRef;", "")}
export const ${name} = ForwardRef;
${name}.displayName = "${name}";
`;
}

async function buildIcon(
  file: string,
  svgDir: string,
  outDir: string,
): Promise<{ name: string; identifier: string }> {
  const source = await readFile(path.join(svgDir, file), "utf8");
  assertSafe(source, file);

  const optimized = optimize(source, {
    // preset-default already preserves viewBox by default in svgo v4.
    plugins: ["preset-default", "removeDimensions", "removeScripts"],
  });

  const identifier = toPascalCase(file);
  const componentName = `${identifier}Icon`;

  const rawTransform = await transform(
    optimized.data,
    {
      typescript: true,
      plugins: ["@svgr/plugin-jsx"],
      icon: false,
      ref: true,
      titleProp: false,
      expandProps: "end",
    },
    // Name the raw generated identifier "<Name>Impl" so it never collides
    // with the "export const <Name> = ForwardRef" alias added below.
    { componentName: `${componentName}Impl` },
  );

  const componentSource = toComponentSource(rawTransform, componentName);
  await writeFile(path.join(outDir, `${componentName}.tsx`), componentSource);

  return { name: componentName, identifier };
}

export async function buildIconsFrom(
  svgDir: string,
  outDir: string,
): Promise<Array<{ name: string; identifier: string }>> {
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(svgDir)).filter((file) => file.endsWith(".svg"));
  const icons = await Promise.all(
    files.map((file) => buildIcon(file, svgDir, outDir)),
  );
  icons.sort((a, b) => a.name.localeCompare(b.name));
  return icons;
}

export async function buildIcons() {
  const icons = await buildIconsFrom(SVG_DIR, OUT_DIR);
  const indexSource = `${icons.map((icon) => `export { ${icon.name} } from "./generated/${icon.name}.js";`).join("\n")}\n`;
  await writeFile("src/index.ts", indexSource);
  return icons;
}

const isCliInvocation =
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isCliInvocation) {
  buildIcons().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
