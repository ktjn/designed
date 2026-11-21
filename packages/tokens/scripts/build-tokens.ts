import StyleDictionary from "style-dictionary";
import type { TransformedToken } from "style-dictionary/types";

const PRIMITIVES = "src/primitives/*.json";
const SEMANTIC_BASE = "src/semantic/base.json";

const GENERATED_HEADER =
  "/**\n * Do not edit directly, this file was auto-generated.\n */\n\n";
const HEADER_PATTERN = /^\/\*\*[\s\S]*?\*\/\s*/;
const LAYER_DECLARATION =
  "@layer ds.tokens.base, ds.tokens.density, ds.tokens.scheme, ds.tokens.contrast, ds.tokens.brand, ds.components;\n\n";

const isFromFile = (fileName: string) => (token: TransformedToken) =>
  token.filePath.replace(/\\/g, "/").endsWith(fileName);

const isBaseCssToken = (token: TransformedToken) =>
  isFromFile("semantic/base.json")(token) ||
  isFromFile("primitives/font.json")(token);

const tokenIdentifier = (token: TransformedToken) => token.path.join(".");

function indentBlock(css: string): string {
  return css
    .trim()
    .split("\n")
    .map((line) => (line.length > 0 ? `  ${line}` : ""))
    .join("\n");
}

function wrapInLayer(layer: string, body: string): string {
  return `${GENERATED_HEADER}${LAYER_DECLARATION}@layer ${layer} {\n${indentBlock(body)}\n}\n`;
}

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

async function getPlatformTokens(sources: string[]) {
  const sd = new StyleDictionary({
    source: sources,
    log: { warnings: "disabled" },
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "ds",
      },
    },
  });
  await sd.hasInitialized;
  return (await sd.getPlatformTokens("css")).allTokens;
}

function formatBlock(options: {
  tokens: TransformedToken[];
  selector: string;
  media?: string;
}): string {
  const indent = options.media ? "    " : "  ";
  const lines = options.tokens
    .map((token) => `${indent}--${token.name}: ${token.$value};`)
    .join("\n");
  if (options.media) {
    return `@media ${options.media} {\n  ${options.selector} {\n${lines}\n  }\n}\n`;
  }
  return `${options.selector} {\n${lines}\n}\n`;
}

async function renderOverrideBlock(options: {
  sourceFile: string;
  selector: string;
  media?: string;
}): Promise<string> {
  const tokens = await getPlatformTokens([
    PRIMITIVES,
    SEMANTIC_BASE,
    options.sourceFile,
  ]);
  return formatBlock({
    tokens: tokens.filter(isFromFile(options.sourceFile)),
    selector: options.selector,
    media: options.media,
  });
}

async function renderResetBlock(options: {
  matchSourceFiles: string[];
  valueSources: string[];
  selector: string;
}): Promise<string> {
  const targetNames = new Set<string>();
  for (const file of options.matchSourceFiles) {
    const tokens = await getPlatformTokens([PRIMITIVES, SEMANTIC_BASE, file]);
    for (const token of tokens.filter(isFromFile(file))) {
      targetNames.add(token.name);
    }
  }
  const valueTokens = await getPlatformTokens(options.valueSources);
  const matching = valueTokens.filter((token) => targetNames.has(token.name));
  return formatBlock({ tokens: matching, selector: options.selector });
}

async function writeLayeredSheet(options: {
  destination: string;
  layer: string;
  blocks: string[];
}) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const outPath = path.join("dist/css", options.destination);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(
    outPath,
    wrapInLayer(options.layer, options.blocks.join("\n")),
  );
}

export async function buildTokens() {
  const fs = await import("node:fs/promises");

  await buildBase();
  const baseRaw = await fs.readFile("dist/css/base.css", "utf8");
  const baseBody = baseRaw.replace(HEADER_PATTERN, "").trim();
  await fs.writeFile(
    "dist/css/base.css",
    wrapInLayer("ds.tokens.base", baseBody),
  );

  await writeLayeredSheet({
    destination: "densities/compact.css",
    layer: "ds.tokens.density",
    blocks: [
      await renderResetBlock({
        matchSourceFiles: ["src/semantic/density-compact.json"],
        valueSources: [PRIMITIVES, SEMANTIC_BASE],
        selector: '[data-density="default"]',
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/density-compact.json",
        selector: '[data-density="compact"]',
      }),
    ],
  });

  await writeLayeredSheet({
    destination: "schemes/dark.css",
    layer: "ds.tokens.scheme",
    blocks: [
      await renderResetBlock({
        matchSourceFiles: ["src/semantic/dark.json"],
        valueSources: [PRIMITIVES, SEMANTIC_BASE],
        selector: '[data-color-scheme="light"]',
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/dark.json",
        selector: ':root:not([data-color-scheme="light"])',
        media: "(prefers-color-scheme: dark)",
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/dark.json",
        selector: '[data-color-scheme="dark"]',
      }),
    ],
  });

  await writeLayeredSheet({
    destination: "contrasts/more.css",
    layer: "ds.tokens.contrast",
    blocks: [
      await renderResetBlock({
        matchSourceFiles: [
          "src/semantic/contrast-more.json",
          "src/semantic/contrast-more-dark.json",
        ],
        valueSources: [PRIMITIVES, SEMANTIC_BASE],
        selector: '[data-contrast="default"]',
      }),
      await renderResetBlock({
        matchSourceFiles: [
          "src/semantic/contrast-more.json",
          "src/semantic/contrast-more-dark.json",
        ],
        valueSources: [PRIMITIVES, SEMANTIC_BASE, "src/semantic/dark.json"],
        selector: '[data-color-scheme="dark"][data-contrast="default"]',
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/contrast-more.json",
        selector: ':root:not([data-contrast="default"])',
        media: "(prefers-contrast: more)",
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/contrast-more-dark.json",
        selector: '[data-color-scheme="dark"]:not([data-contrast="default"])',
        media: "(prefers-contrast: more)",
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/contrast-more-dark.json",
        selector:
          ':root:not([data-color-scheme="light"]):not([data-contrast="default"])',
        media: "(prefers-color-scheme: dark) and (prefers-contrast: more)",
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/contrast-more.json",
        selector: '[data-contrast="more"]',
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/contrast-more-dark.json",
        selector:
          ':root:not([data-color-scheme="light"])[data-contrast="more"], :root:not([data-color-scheme="light"]) [data-contrast="more"]',
        media: "(prefers-color-scheme: dark)",
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/contrast-more-dark.json",
        selector: '[data-color-scheme="dark"][data-contrast="more"]',
      }),
    ],
  });

  await writeLayeredSheet({
    destination: "brands/default.css",
    layer: "ds.tokens.brand",
    blocks: [
      await renderResetBlock({
        matchSourceFiles: [
          "src/semantic/brand-editorial.json",
          "src/semantic/brand-editorial-dark.json",
        ],
        valueSources: [PRIMITIVES, SEMANTIC_BASE],
        selector: '[data-brand="default"]',
      }),
      await renderResetBlock({
        matchSourceFiles: ["src/semantic/brand-editorial-dark.json"],
        valueSources: [PRIMITIVES, SEMANTIC_BASE, "src/semantic/dark.json"],
        selector: '[data-brand="default"][data-color-scheme="dark"]',
      }),
    ],
  });

  await writeLayeredSheet({
    destination: "brands/editorial.css",
    layer: "ds.tokens.brand",
    blocks: [
      await renderOverrideBlock({
        sourceFile: "src/semantic/brand-editorial.json",
        selector: '[data-brand="editorial"]',
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/brand-editorial-dark.json",
        selector: '[data-brand="editorial"]:not([data-color-scheme="light"])',
        media: "(prefers-color-scheme: dark)",
      }),
      await renderOverrideBlock({
        sourceFile: "src/semantic/brand-editorial-dark.json",
        selector: '[data-brand="editorial"][data-color-scheme="dark"]',
      }),
    ],
  });

  const bundleFiles = [
    "dist/css/base.css",
    "dist/css/densities/compact.css",
    "dist/css/schemes/dark.css",
    "dist/css/contrasts/more.css",
    "dist/css/brands/default.css",
    "dist/css/brands/editorial.css",
  ];
  const stripPreamble = (raw: string) =>
    raw.replace(HEADER_PATTERN, "").replace(LAYER_DECLARATION, "").trim();
  const bundleParts = await Promise.all(
    bundleFiles.map(async (file) =>
      stripPreamble(await fs.readFile(file, "utf8")),
    ),
  );
  await fs.writeFile(
    "dist/css/all.css",
    `${GENERATED_HEADER}${LAYER_DECLARATION}${bundleParts.join("\n\n")}\n`,
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
