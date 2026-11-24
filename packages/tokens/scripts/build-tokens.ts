import StyleDictionary from "style-dictionary";
import type { TransformedToken } from "style-dictionary/types";

const PRIMITIVES = "src/primitives/*.json";
const SEMANTIC_BASE = "src/semantic/base.json";
const DARK = "src/semantic/dark.json";
const MORE = "src/semantic/contrast-more.json";
const DARK_MORE = "src/semantic/contrast-more-dark.json";
const EDITORIAL = "src/semantic/brand-editorial.json";
const DARK_EDITORIAL = "src/semantic/brand-editorial-dark.json";

const GENERATED_HEADER =
  "/**\n * Do not edit directly, this file was auto-generated.\n */\n\n";
const HEADER_PATTERN = /^\/\*\*[\s\S]*?\*\/\s*/;
const LAYER_DECLARATION =
  "@layer ds.tokens.base, ds.tokens.density, ds.tokens.scheme, ds.tokens.contrast, ds.tokens.brand, ds.components;\n\n";

const isFromFile = (fileName: string) => (token: TransformedToken) =>
  token.filePath.replace(/\\/g, "/").endsWith(fileName);

const tokenIdentifier = (token: TransformedToken) => token.path.join(".");

const isBaseCssToken = (token: TransformedToken) =>
  isFromFile("semantic/base.json")(token) ||
  isFromFile("primitives/font.json")(token) ||
  isFromFile("primitives/motion.json")(token);

const isBrandableToken = (token: TransformedToken) => {
  const id = tokenIdentifier(token);
  return (
    id === "color.background.selected" ||
    id === "color.border.focus" ||
    id.startsWith("color.action.") ||
    id.startsWith("font.family.") ||
    id.startsWith("radius.") ||
    id.startsWith("shadow.") ||
    id.startsWith("motion.")
  );
};

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
  composedBlocks?: string[];
}) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const outPath = path.join("dist/css", options.destination);
  const blocks = options.composedBlocks
    ? composedSheet(options.blocks, options.composedBlocks)
    : options.blocks;
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, wrapInLayer(options.layer, blocks.join("\n")));
}

const LIGHT_DARK_SUPPORT = "(color: light-dark(white, black))";
const SELECTED_ROLE = "ds-color-background-selected";
const FOCUS_ROLE = "ds-color-border-focus";
const SCHEME_SELECTED = "ds-scheme-selected";
const CONTRAST_FOCUS = "ds-contrast-focus";

function composedSheet(legacy: string[], composed: string[]): string[] {
  return [
    `@supports not ${LIGHT_DARK_SUPPORT} {\n${indentBlock(legacy.join("\n"))}\n}\n`,
    `@supports ${LIGHT_DARK_SUPPORT} {\n${indentBlock(composed.join("\n"))}\n}\n`,
  ];
}

function pairSchemeColors(
  light: TransformedToken[],
  dark: TransformedToken[],
  names: Set<string>,
): TransformedToken[] {
  const darkValues = new Map(dark.map((token) => [token.name, token.$value]));
  return light
    .filter((token) => names.has(token.name))
    .map((token) => {
      const darkValue = darkValues.get(token.name);
      if (darkValue === undefined || darkValue === token.$value) return token;
      if (token.$type !== "color") {
        throw new TypeError(
          `Scheme-dependent token ${token.name} must be a color`,
        );
      }
      return { ...token, $value: `light-dark(${token.$value}, ${darkValue})` };
    });
}

function changedTokenNames(
  tokens: TransformedToken[],
  files: string[],
): Set<string> {
  return new Set(
    tokens
      .filter((token) => files.some((file) => isFromFile(file)(token)))
      .map((token) => token.name),
  );
}

async function buildComposedThemes() {
  const [light, dark, lightMore, darkMore, lightEditorial, darkEditorial] =
    await Promise.all([
      getPlatformTokens([PRIMITIVES, SEMANTIC_BASE]),
      getPlatformTokens([PRIMITIVES, SEMANTIC_BASE, DARK]),
      getPlatformTokens([PRIMITIVES, SEMANTIC_BASE, MORE]),
      getPlatformTokens([PRIMITIVES, SEMANTIC_BASE, DARK, MORE, DARK_MORE]),
      getPlatformTokens([PRIMITIVES, SEMANTIC_BASE, EDITORIAL]),
      getPlatformTokens([
        PRIMITIVES,
        SEMANTIC_BASE,
        DARK,
        EDITORIAL,
        DARK_EDITORIAL,
      ]),
    ]);
  const schemeNames = changedTokenNames(dark, [DARK]);
  const contrastNames = changedTokenNames(darkMore, [MORE, DARK_MORE]);
  const editorialNames = changedTokenNames(darkEditorial, [
    EDITORIAL,
    DARK_EDITORIAL,
  ]);
  const scheme = pairSchemeColors(light, dark, schemeNames);
  const selected = scheme.find((token) => token.name === SELECTED_ROLE);
  const contrastDefault = pairSchemeColors(light, dark, contrastNames);
  const contrastMore = pairSchemeColors(lightMore, darkMore, contrastNames);
  const focusAlias = (tokens: TransformedToken[]) =>
    tokens.flatMap((token) =>
      token.name === FOCUS_ROLE
        ? [
            { ...token, name: CONTRAST_FOCUS },
            { ...token, $value: `var(--${CONTRAST_FOCUS})` },
          ]
        : [token],
    );
  const brandDefault = light
    .filter((token) => isBaseCssToken(token) && isBrandableToken(token))
    .map((token) => {
      const inherited =
        token.name === SELECTED_ROLE
          ? SCHEME_SELECTED
          : token.name === FOCUS_ROLE
            ? CONTRAST_FOCUS
            : undefined;
      return inherited
        ? { ...token, $value: `var(--${inherited}, ${token.$value})` }
        : token;
    });

  return {
    scheme: [
      formatBlock({
        tokens: selected
          ? [...scheme, { ...selected, name: SCHEME_SELECTED }]
          : scheme,
        selector: ":root",
      }),
      ":root { color-scheme: light; }\n",
      '@media (prefers-color-scheme: dark) {\n  :root:not([data-color-scheme="light"]) { color-scheme: dark; }\n}\n',
      '[data-color-scheme="light"] { color-scheme: light only !important; }\n',
      '[data-color-scheme="dark"] { color-scheme: dark only !important; }\n',
    ],
    contrast: [
      formatBlock({
        tokens: focusAlias(contrastMore),
        selector: ':root:not([data-contrast="default"])',
        media: "(prefers-contrast: more)",
      }),
      formatBlock({
        tokens: focusAlias(contrastMore),
        selector: '[data-contrast="more"]',
      }),
      formatBlock({
        tokens: focusAlias(contrastDefault),
        selector: '[data-contrast="default"]',
      }),
      `@scope ([data-brand]:not([data-brand="default"])) to ([data-brand]) {\n  :scope :is([data-contrast="default"], [data-contrast="more"]) {\n    --${FOCUS_ROLE}: inherit;\n  }\n}\n`,
    ],
    brandDefault: [
      formatBlock({ tokens: brandDefault, selector: '[data-brand="default"]' }),
    ],
    editorial: [
      formatBlock({
        tokens: pairSchemeColors(lightEditorial, darkEditorial, editorialNames),
        selector: '[data-brand="editorial"]',
      }),
    ],
  };
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

  const composed = await buildComposedThemes();

  await writeLayeredSheet({
    destination: "schemes/dark.css",
    layer: "ds.tokens.scheme",
    composedBlocks: composed.scheme,
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
    composedBlocks: composed.contrast,
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

  const baseValueTokens = (
    await getPlatformTokens([PRIMITIVES, SEMANTIC_BASE])
  ).filter((token) => isBaseCssToken(token) && isBrandableToken(token));
  const darkBrandableTokens = (
    await getPlatformTokens([
      PRIMITIVES,
      SEMANTIC_BASE,
      "src/semantic/dark.json",
    ])
  ).filter(
    (token) =>
      isFromFile("semantic/dark.json")(token) && isBrandableToken(token),
  );
  const darkBrandableNames = new Set(
    darkBrandableTokens.map((token) => token.name),
  );
  const lightBrandableResetTokens = baseValueTokens.filter((token) =>
    darkBrandableNames.has(token.name),
  );
  const contrastMoreBrandableTokens = (
    await getPlatformTokens([
      PRIMITIVES,
      SEMANTIC_BASE,
      "src/semantic/contrast-more.json",
    ])
  ).filter(
    (token) =>
      isFromFile("semantic/contrast-more.json")(token) &&
      isBrandableToken(token),
  );
  const contrastMoreDarkBrandableTokens = (
    await getPlatformTokens([
      PRIMITIVES,
      SEMANTIC_BASE,
      "src/semantic/contrast-more-dark.json",
    ])
  ).filter(
    (token) =>
      isFromFile("semantic/contrast-more-dark.json")(token) &&
      isBrandableToken(token),
  );

  await writeLayeredSheet({
    destination: "brands/default.css",
    layer: "ds.tokens.brand",
    composedBlocks: composed.brandDefault,
    blocks: [
      formatBlock({
        tokens: baseValueTokens,
        selector: '[data-brand="default"]',
      }),
      formatBlock({
        tokens: darkBrandableTokens,
        selector:
          ':root:not([data-color-scheme="light"])[data-brand="default"], :root:not([data-color-scheme="light"]) [data-brand="default"]:not([data-color-scheme="light"])',
        media: "(prefers-color-scheme: dark)",
      }),
      formatBlock({
        tokens: darkBrandableTokens,
        selector:
          '[data-brand="default"][data-color-scheme="dark"], [data-color-scheme="dark"] [data-brand="default"]:not([data-color-scheme="light"])',
      }),
      formatBlock({
        tokens: lightBrandableResetTokens,
        selector:
          '[data-brand="default"][data-color-scheme="light"], [data-color-scheme="light"] [data-brand="default"]:not([data-color-scheme="dark"])',
      }),
      formatBlock({
        tokens: contrastMoreBrandableTokens,
        selector:
          ':root:not([data-contrast="default"])[data-brand="default"], :root:not([data-contrast="default"]) [data-brand="default"]:not([data-contrast="default"])',
        media: "(prefers-contrast: more)",
      }),
      formatBlock({
        tokens: contrastMoreDarkBrandableTokens,
        selector:
          ':root:not([data-color-scheme="light"]):not([data-contrast="default"])[data-brand="default"], :root:not([data-color-scheme="light"]):not([data-contrast="default"]) [data-brand="default"]:not([data-color-scheme="light"]):not([data-contrast="default"])',
        media: "(prefers-color-scheme: dark) and (prefers-contrast: more)",
      }),
      formatBlock({
        tokens: contrastMoreDarkBrandableTokens,
        selector:
          '[data-color-scheme="dark"][data-brand="default"]:not([data-contrast="default"]), [data-color-scheme="dark"] [data-brand="default"]:not([data-color-scheme="light"]):not([data-contrast="default"])',
        media: "(prefers-contrast: more)",
      }),
      formatBlock({
        tokens: contrastMoreBrandableTokens,
        selector:
          '[data-brand="default"][data-contrast="more"], [data-contrast="more"] [data-brand="default"]:not([data-contrast="default"])',
      }),
      formatBlock({
        tokens: contrastMoreDarkBrandableTokens,
        selector:
          ':root:not([data-color-scheme="light"])[data-contrast="more"][data-brand="default"], :root:not([data-color-scheme="light"]) [data-contrast="more"] [data-brand="default"]:not([data-color-scheme="light"]):not([data-contrast="default"]), :root:not([data-color-scheme="light"]) [data-brand="default"][data-contrast="more"]:not([data-color-scheme="light"])',
        media: "(prefers-color-scheme: dark)",
      }),
      formatBlock({
        tokens: contrastMoreDarkBrandableTokens,
        selector:
          '[data-color-scheme="dark"][data-contrast="more"][data-brand="default"], [data-color-scheme="dark"] [data-brand="default"][data-contrast="more"]:not([data-color-scheme="light"]), [data-color-scheme="dark"][data-contrast="more"] [data-brand="default"]:not([data-color-scheme="light"]):not([data-contrast="default"])',
      }),
    ],
  });

  await writeLayeredSheet({
    destination: "brands/editorial.css",
    layer: "ds.tokens.brand",
    composedBlocks: composed.editorial,
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
