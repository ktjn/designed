import { createHash } from "node:crypto";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement, createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { buildIcons } from "../scripts/build-icons.ts";
import type { IconProps } from "../src/index.ts";

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function hashGenerated(): Promise<string> {
  const hash = createHash("sha256");
  const dir = path.join(packageRoot, "src/generated");
  const files = (await readdir(dir)).sort();
  for (const file of files) {
    hash.update(file);
    hash.update(await readFile(path.join(dir, file)));
  }
  return hash.digest("hex");
}

beforeAll(async () => {
  await buildIcons();
});

describe("icon generation", () => {
  it("generates a typed component for every source SVG", async () => {
    const icons = await import("../src/index.ts");
    const expected = [
      "AlertCircleIcon",
      "AlertTriangleIcon",
      "ArrowDownIcon",
      "ArrowLeftIcon",
      "ArrowRightIcon",
      "ArrowUpIcon",
      "ChevronUpIcon",
      "DownloadIcon",
      "EditIcon",
      "EyeIcon",
      "EyeOffIcon",
      "FilterIcon",
      "GripVerticalIcon",
      "HomeIcon",
      "LockIcon",
      "LogOutIcon",
      "MenuIcon",
      "MoreHorizontalIcon",
      "RefreshIcon",
      "SortIcon",
      "UserIcon",
      "CalendarIcon",
      "CheckIcon",
      "ChevronDownIcon",
      "ChevronLeftIcon",
      "ChevronRightIcon",
      "CloseIcon",
      "CopyIcon",
      "ExternalLinkIcon",
      "InfoIcon",
      "MinusIcon",
      "PlusIcon",
      "SearchIcon",
      "SettingsIcon",
      "TrashIcon",
      "UploadIcon",
    ] as const;

    for (const name of expected) {
      expect(icons[name], `${name} should be exported`).toBeDefined();
      const markup = renderToStaticMarkup(createElement(icons[name]));
      expect(markup).toContain("currentColor");
      expect(markup).not.toMatch(/#[0-9a-f]{3,6}/i);
      const openingTag = markup.match(/^<svg[^>]*>/)?.[0] ?? "";
      expect(openingTag).not.toMatch(/\swidth="/);
      expect(openingTag).not.toMatch(/\sheight="/);
      expect(openingTag).toContain("viewBox");
    }
  });

  it("renders monochrome icons using currentColor, not a hard-coded color", async () => {
    const { CloseIcon } = await import("../src/index.ts");
    const markup = renderToStaticMarkup(createElement(CloseIcon));
    expect(markup).toContain("currentColor");
    expect(markup).not.toMatch(/#[0-9a-f]{3,6}/i);
  });

  it("does not hard-code width/height so icons scale via CSS", async () => {
    const { CloseIcon } = await import("../src/index.ts");
    const markup = renderToStaticMarkup(createElement(CloseIcon));
    expect(markup).not.toMatch(/\swidth="/);
    expect(markup).not.toMatch(/\sheight="/);
    expect(markup).toContain("viewBox");
  });

  it("emits React 19 function components accepting ref as a prop without forwardRef", async () => {
    const { CloseIcon } = await import("../src/index.ts");
    const generatedSource = await readFile(
      path.join(packageRoot, "src/generated/CloseIcon.tsx"),
      "utf8",
    );

    expect(typeof CloseIcon).toBe("function");
    expect(CloseIcon.displayName).toBe("CloseIcon");
    expect(generatedSource).not.toContain("forwardRef");

    const ref = createRef<SVGSVGElement>();
    const props: IconProps = { ref, size: 16 };
    const element = createElement(CloseIcon, props);
    expect(element.props.ref).toBe(ref);
  });

  it("supports the optional size prop while honoring explicit width and height overrides", async () => {
    const { CloseIcon } = await import("../src/index.ts");

    const numericSize = renderToStaticMarkup(
      createElement(CloseIcon, { size: 20 }),
    );
    expect(numericSize).toContain('width="20"');
    expect(numericSize).toContain('height="20"');
    expect(numericSize).not.toContain('size="');

    const stringSize = renderToStaticMarkup(
      createElement(CloseIcon, { size: "1.5rem" }),
    );
    expect(stringSize).toContain('width="1.5rem"');
    expect(stringSize).toContain('height="1.5rem"');

    const zeroSize = renderToStaticMarkup(
      createElement(CloseIcon, { size: 0 }),
    );
    expect(zeroSize).toContain('width="0"');
    expect(zeroSize).toContain('height="0"');

    const overridden = renderToStaticMarkup(
      createElement(CloseIcon, { size: 20, width: 24 }),
    );
    expect(overridden).toContain('width="24"');
    expect(overridden).toContain('height="20"');

    const overriddenBoth = renderToStaticMarkup(
      createElement(CloseIcon, { size: 20, width: 12, height: 18 }),
    );
    expect(overriddenBoth).toContain('width="12"');
    expect(overriddenBoth).toContain('height="18"');
  });

  it("supports aria-hidden for decorative usage without baking it in by default", async () => {
    const { CloseIcon } = await import("../src/index.ts");
    const decorative = renderToStaticMarkup(
      createElement(CloseIcon, { "aria-hidden": true }),
    );
    const bare = renderToStaticMarkup(createElement(CloseIcon));
    expect(decorative).toContain('aria-hidden="true"');
    expect(bare).not.toContain("aria-hidden");
  });

  it("produces deterministic output across repeated generation", async () => {
    const first = await hashGenerated();
    await buildIcons();
    const second = await hashGenerated();
    expect(second).toBe(first);
  });

  it("refuses to process an SVG containing a script element", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "icons-fixture-"));
    await writeFile(
      path.join(dir, "malicious.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
    );
    try {
      const { buildIconsFrom } = await import("../scripts/build-icons.ts");
      await expect(buildIconsFrom(dir, dir)).rejects.toThrow(/unsafe pattern/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("refuses to process an SVG containing an inline event handler", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "icons-fixture-"));
    await writeFile(
      path.join(dir, "malicious.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="1" height="1" /></svg>',
    );
    try {
      const { buildIconsFrom } = await import("../scripts/build-icons.ts");
      await expect(buildIconsFrom(dir, dir)).rejects.toThrow(/unsafe pattern/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
