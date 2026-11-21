import StyleDictionary from "style-dictionary";
import type { TransformedToken } from "style-dictionary/types";

const PRIMITIVES = "src/primitives/*.json";
const SEMANTIC_BASE = "src/semantic/base.json";

const isFromFile = (fileName: string) => (token: TransformedToken) =>
  token.filePath.replace(/\\/g, "/").endsWith(fileName);

// Typography has no semantic indirection today (a single font family and a
// small fixed size/weight scale, none of which vary by theme override), so
// its primitives are exposed directly as CSS variables/types alongside the
// semantic/base.json tokens rather than duplicated behind semantic aliases.
const isBaseCssToken = (token: TransformedToken) =>
  isFromFile("semantic/base.json")(token) ||
  isFromFile("primitives/font.json")(token);

const tokenIdentifier = (token: TransformedToken) => token.path.join(".");

function registerTypesFormat() {
  return async ({
    dictionary,
  }: {
    dictionary: { allTokens: TransformedToken[] };
  }) => {
    const semanticTokens = dictionary.allTokens.filter(isBaseCssToken);
    const identifierUnion = semanticTokens
      .map((token) => `  | "${tokenIdentifier(token)}"`)
      .join("\n");
    const cssVarUnion = semanticTokens
      .map((token) => `  | "--${token.name}"`)
      .join("\n");

    return `/**
 * Do not edit directly, this file was auto-generated.
 */

export type TokenIdentifier =
${identifierUnion};

export type CssVariableName =
${cssVarUnion};

export declare const tokens: Record<TokenIdentifier, CssVariableName>;
`;
  };
}

async function buildBase() {
  const sd = new StyleDictionary({
    source: [PRIMITIVES, SEMANTIC_BASE],
    hooks: { formats: { "typescript/ds-tokens": registerTypesFormat() } },
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "ds",
        buildPath: "dist/css/",
        files: [
          {
            destination: "base.css",
            format: "css/variables",
            filter: isBaseCssToken,
            options: { selector: ":root" },
          },
        ],
      },
      json: {
        transformGroup: "js",
        buildPath: "dist/json/",
        files: [{ destination: "tokens.json", format: "json/nested" }],
      },
      types: {
        transformGroup: "css",
        prefix: "ds",
        buildPath: "dist/types/",
        files: [{ destination: "tokens.d.ts", format: "typescript/ds-tokens" }],
      },
    },
  });
  await sd.hasInitialized;
  await sd.buildAllPlatforms();
}

async function buildOverride(options: {
  sourceFile: string;
  destination: string;
  selector: string;
}) {
  const sd = new StyleDictionary({
    source: [PRIMITIVES, SEMANTIC_BASE, options.sourceFile],
    // Overrides intentionally redefine a subset of semantic/base.json tokens;
    // the collision is expected and filtered down to just the override file below.
    log: { warnings: "disabled" },
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "ds",
        buildPath: "dist/css/",
        files: [
          {
            destination: options.destination,
            format: "css/variables",
            filter: isFromFile(options.sourceFile),
            options: { selector: options.selector },
          },
        ],
      },
    },
  });
  await sd.hasInitialized;
  await sd.buildAllPlatforms();
}

async function renderOverrideBlock(options: {
  sourceFile: string;
  selector: string;
  media?: string;
}): Promise<string> {
  const sd = new StyleDictionary({
    source: [PRIMITIVES, SEMANTIC_BASE, options.sourceFile],
    log: { warnings: "disabled" },
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "ds",
      },
    },
  });
  await sd.hasInitialized;
  const dict = await sd.getPlatformTokens("css");
  const indent = options.media ? "    " : "  ";
  const lines = dict.allTokens
    .filter(isFromFile(options.sourceFile))
    .map((token) => `${indent}--${token.name}: ${token.$value};`)
    .join("\n");
  if (options.media) {
    return `@media ${options.media} {\n  ${options.selector} {\n${lines}\n  }\n}\n`;
  }
  return `${options.selector} {\n${lines}\n}\n`;
}

const GENERATED_HEADER =
  "/**\n * Do not edit directly, this file was auto-generated.\n */\n\n";
const HEADER_PATTERN = /^\/\*\*[\s\S]*?\*\/\s*/;
const LAYER_DECLARATION = "@layer ds.tokens, ds.components;\n\n";

function indentBlock(css: string): string {
  return css
    .trim()
    .split("\n")
    .map((line) => (line.length > 0 ? `  ${line}` : ""))
    .join("\n");
}

function wrapInTokensLayer(body: string): string {
  return `${GENERATED_HEADER}${LAYER_DECLARATION}@layer ds.tokens {\n${indentBlock(body)}\n}\n`;
}

async function wrapFileInTokensLayer(filePath: string) {
  const fs = await import("node:fs/promises");
  const raw = await fs.readFile(filePath, "utf8");
  const body = raw.replace(HEADER_PATTERN, "").trim();
  await fs.writeFile(filePath, wrapInTokensLayer(body));
}

async function buildCompositeOverride(options: {
  destination: string;
  blocks: Array<{ sourceFile: string; selector: string; media?: string }>;
}) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const rendered = await Promise.all(options.blocks.map(renderOverrideBlock));
  const outPath = path.join("dist/css", options.destination);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, wrapInTokensLayer(rendered.join("\n")));
}

export async function buildTokens() {
  await buildBase();
  await wrapFileInTokensLayer("dist/css/base.css");

  await buildCompositeOverride({
    destination: "schemes/dark.css",
    blocks: [
      {
        sourceFile: "src/semantic/dark.json",
        selector: ':root:not([data-color-scheme="light"])',
        media: "(prefers-color-scheme: dark)",
      },
      {
        sourceFile: "src/semantic/dark.json",
        selector: '[data-color-scheme="dark"]',
      },
    ],
  });

  await buildOverride({
    sourceFile: "src/semantic/density-compact.json",
    destination: "densities/compact.css",
    selector: '[data-density="compact"]',
  });
  await wrapFileInTokensLayer("dist/css/densities/compact.css");

  await buildCompositeOverride({
    destination: "contrasts/more.css",
    blocks: [
      {
        sourceFile: "src/semantic/contrast-more.json",
        selector: ':root:not([data-contrast="default"])',
        media: "(prefers-contrast: more)",
      },
      {
        sourceFile: "src/semantic/contrast-more-dark.json",
        selector: '[data-color-scheme="dark"]:not([data-contrast="default"])',
        media: "(prefers-contrast: more)",
      },
      {
        sourceFile: "src/semantic/contrast-more-dark.json",
        selector:
          ':root:not([data-color-scheme="light"]):not([data-contrast="default"])',
        media: "(prefers-color-scheme: dark) and (prefers-contrast: more)",
      },
      {
        sourceFile: "src/semantic/contrast-more.json",
        selector: '[data-contrast="more"]',
      },
      {
        sourceFile: "src/semantic/contrast-more-dark.json",
        selector:
          ':root:not([data-color-scheme="light"])[data-contrast="more"], :root:not([data-color-scheme="light"]) [data-contrast="more"]',
        media: "(prefers-color-scheme: dark)",
      },
      {
        sourceFile: "src/semantic/contrast-more-dark.json",
        selector: '[data-color-scheme="dark"][data-contrast="more"]',
      },
    ],
  });

  const fs = await import("node:fs/promises");
  await fs.mkdir("dist/css/brands", { recursive: true });
  await fs.writeFile(
    "dist/css/brands/default.css",
    "/**\n * Do not edit directly, this file was auto-generated.\n * The default brand introduces no overrides over base.css.\n */\n",
  );

  await buildCompositeOverride({
    destination: "brands/editorial.css",
    blocks: [
      {
        sourceFile: "src/semantic/brand-editorial.json",
        selector: '[data-brand="editorial"]',
      },
      {
        sourceFile: "src/semantic/brand-editorial-dark.json",
        selector: '[data-brand="editorial"][data-color-scheme="dark"]',
      },
    ],
  });

  const bundleFiles = [
    "dist/css/base.css",
    "dist/css/brands/editorial.css",
    "dist/css/schemes/dark.css",
    "dist/css/densities/compact.css",
    "dist/css/contrasts/more.css",
  ];
  const unwrapPattern =
    /^\/\*\*[\s\S]*?\*\/\s*@layer ds\.tokens, ds\.components;\s*@layer ds\.tokens \{\s*([\s\S]*?)\s*\}\s*$/;
  const bundleParts = await Promise.all(
    bundleFiles.map(async (file) => {
      const raw = await fs.readFile(file, "utf8");
      const match = unwrapPattern.exec(raw);
      return (match?.[1] ?? raw.replace(HEADER_PATTERN, "")).trim();
    }),
  );
  await fs.writeFile(
    "dist/css/all.css",
    `${GENERATED_HEADER}${LAYER_DECLARATION}@layer ds.tokens {\n${bundleParts.join("\n\n")}\n}\n`,
  );
}

const isCliInvocation =
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isCliInvocation) {
  buildTokens().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
