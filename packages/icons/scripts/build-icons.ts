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
  const jsxMatch = rawTransform.match(/<svg\b[\s\S]*<\/svg>/);
  if (!jsxMatch) {
    throw new Error(`SVGR output for ${name} did not contain an <svg> element`);
  }
  const svgJsx = jsxMatch[0];
  if (!svgJsx.includes("{...props}")) {
    throw new Error(`SVGR output for ${name} did not contain {...props}`);
  }
  const renderedSvg = svgJsx.replace(
    "{...props}",
    "ref={ref} width={width ?? size} height={height ?? size} {...props}",
  );
  return `import type { IconProps } from "../types.js";

export function ${name}({ size, width, height, ref, ...props }: IconProps) {
  return ${renderedSvg};
}
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
      ref: false,
      titleProp: false,
      expandProps: "end",
    },
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
  const indexSource = `export type { IconProps } from "./types.js";\n${icons.map((icon) => `export { ${icon.name} } from "./generated/${icon.name}.js";`).join("\n")}\n`;
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
