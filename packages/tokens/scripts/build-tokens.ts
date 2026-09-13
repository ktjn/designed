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

export async function buildTokens() {
  await buildBase();

  await buildOverride({
    sourceFile: "src/semantic/dark.json",
    destination: "schemes/dark.css",
    selector: '[data-color-scheme="dark"]',
  });

  await buildOverride({
    sourceFile: "src/semantic/density-compact.json",
    destination: "densities/compact.css",
    selector: '[data-density="compact"]',
  });

  await buildOverride({
    sourceFile: "src/semantic/contrast-more.json",
    destination: "contrasts/more.css",
    selector: '[data-contrast="more"]',
  });

  // Brand dimension has only one value today; the default brand introduces
  // no overrides over base.css. The file exists so the dimension is
  // addressable the same way as scheme/density/contrast.
  const fs = await import("node:fs/promises");
  await fs.mkdir("dist/css/brands", { recursive: true });
  await fs.writeFile(
    "dist/css/brands/default.css",
    "/**\n * Do not edit directly, this file was auto-generated.\n * The default brand introduces no overrides over base.css.\n */\n",
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
