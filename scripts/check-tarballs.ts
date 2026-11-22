import { execFileSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

interface PackageSpec {
  dir: string;
  name: string;
}

const packages: PackageSpec[] = [
  { dir: "packages/tokens", name: "@ktjn/designed-tokens" },
  { dir: "packages/icons", name: "@ktjn/designed-icons" },
  { dir: "packages/react", name: "@ktjn/designed-react" },
];

function run(
  command: string,
  args: string[],
  options: { cwd?: string; stdio?: "inherit" } = {},
): string {
  // shell: true is only needed on Windows to resolve pnpm/npm/npx's .cmd
  // shims; every argument here is a hardcoded string or a path this script
  // generated itself (tmpdir, package versions), never external/untrusted
  // input, so the usual shell-injection concern doesn't apply. Linux CI
  // never takes this branch.
  return execFileSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
    ...options,
  });
}

async function main() {
  const scratchDir = await mkdtemp(path.join(tmpdir(), "check-tarballs-"));
  const tarballPaths: Record<string, string> = {};

  try {
    // Pack every publishable package. `pnpm pack` rewrites `workspace:*`
    // dependencies (e.g. @ktjn/designed-react -> @ktjn/designed-icons) to a
    // resolvable version range in the packed package.json, which is why the
    // scratch install below needs local tarball paths for those siblings
    // rather than a real registry.
    for (const pkg of packages) {
      const output = run("pnpm", ["pack", "--pack-destination", scratchDir], {
        cwd: path.join(repoRoot, pkg.dir),
      }).trim();
      const tarballFile = output.split("\n").pop()?.trim();
      if (!tarballFile) {
        throw new Error(`pnpm pack produced no tarball path for ${pkg.name}`);
      }
      tarballPaths[pkg.name] = tarballFile;
      console.log(`packed ${pkg.name} -> ${tarballFile}`);
    }

    // Install all three tarballs together into a plain (non-workspace) npm
    // project, so cross-package resolution happens exactly the way it would
    // for a real external consumer, not via pnpm's workspace symlinks.
    await writeFile(
      path.join(scratchDir, "package.json"),
      JSON.stringify(
        {
          name: "tarball-consumer",
          version: "0.0.0",
          private: true,
          type: "module",
        },
        null,
        2,
      ),
    );
    run(
      "npm",
      [
        "install",
        "--no-audit",
        "--no-fund",
        "--silent",
        tarballPaths["@ktjn/designed-tokens"] ?? "",
        tarballPaths["@ktjn/designed-icons"] ?? "",
        tarballPaths["@ktjn/designed-react"] ?? "",
        "react@19.3.1",
        "react-dom@19.3.1",
        "vite@8.3.8",
        "@vitejs/plugin-react@6.3.0",
      ],
      { cwd: scratchDir, stdio: "inherit" },
    );

    // Tokens: no JS runtime, verify the CSS/JSON build outputs actually
    // landed in the installed package.
    const tokensBaseCss = await readFile(
      path.join(
        scratchDir,
        "node_modules/@ktjn/designed-tokens/dist/css/base.css",
      ),
      "utf8",
    );
    if (!tokensBaseCss.includes("--ds-color-background-default")) {
      throw new Error(
        "@ktjn/designed-tokens tarball is missing expected CSS custom properties",
      );
    }
    console.log(
      "@ktjn/designed-tokens tarball: CSS output present and correct",
    );

    // React + Icons: components import their own CSS Modules unprocessed
    // (see README "Styling" section), which plain Node cannot load -- a
    // documented consumer requirement, not a defect. Verifying via Vite
    // (a real bundler) is what actually matches the documented contract,
    // the same way examples/react does via workspace links instead of
    // tarballs.
    await writeFile(
      path.join(scratchDir, "vite.config.js"),
      `import react from "@vitejs/plugin-react";\nimport { defineConfig } from "vite";\nexport default defineConfig({ plugins: [react()] });\n`,
    );
    await writeFile(
      path.join(scratchDir, "index.html"),
      `<!doctype html><html><body><div id="root"></div><script type="module" src="/main.jsx"></script></body></html>`,
    );
    await writeFile(
      path.join(scratchDir, "main.jsx"),
      `import "@ktjn/designed-tokens/css/all.css";
import { Button } from "@ktjn/designed-react";
import { CloseIcon } from "@ktjn/designed-icons";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(
  createElement(Button, { variant: "primary" }, "Save", createElement(CloseIcon, { "aria-hidden": true })),
);
`,
    );
    run("npx", ["vite", "build"], { cwd: scratchDir, stdio: "inherit" });
    const assetsDir = path.join(scratchDir, "dist/assets");
    const jsFile = (await readdir(assetsDir)).find((file) =>
      file.endsWith(".js"),
    );
    if (!jsFile) {
      throw new Error("Vite build produced no JS asset");
    }
    const builtJs = await readFile(path.join(assetsDir, jsFile), "utf8");
    if (!builtJs.includes("Save")) {
      throw new Error(
        "Vite build output does not contain expected Button text",
      );
    }
    console.log(
      "@ktjn/designed-react + @ktjn/designed-icons tarballs: Vite build succeeds and resolves CSS Modules",
    );

    const mixedDir = path.join(scratchDir, "mixed-tokens-consumer");
    const patchedTokensDir = path.join(scratchDir, "patched-tokens");
    const tokensDistSrc = path.join(repoRoot, "packages/tokens");
    await writeFile(
      path.join(scratchDir, "package-mixed.json"),
      JSON.stringify(
        {
          name: "mixed-version-consumer",
          version: "0.0.0",
          private: true,
          type: "module",
        },
        null,
        2,
      ),
    );
    const { cp, mkdir } = await import("node:fs/promises");
    await mkdir(patchedTokensDir, { recursive: true });
    await cp(
      path.join(tokensDistSrc, "dist"),
      path.join(patchedTokensDir, "dist"),
      { recursive: true },
    );
    const tokensManifest = JSON.parse(
      await readFile(path.join(tokensDistSrc, "package.json"), "utf8"),
    ) as { version: string };
    const [major = "0", minor = "0", patch = "0"] =
      tokensManifest.version.split(".");
    const bumpedVersion = `${major}.${minor}.${Number(patch) + 1}`;
    await writeFile(
      path.join(patchedTokensDir, "package.json"),
      JSON.stringify({ ...tokensManifest, version: bumpedVersion }, null, 2),
    );
    const patchedTarball = run(
      "pnpm",
      ["pack", "--pack-destination", scratchDir],
      { cwd: patchedTokensDir },
    )
      .trim()
      .split("\n")
      .pop()
      ?.trim();
    if (!patchedTarball) {
      throw new Error("Failed to pack patched @ktjn/designed-tokens tarball");
    }
    await mkdir(mixedDir, { recursive: true });
    await cp(
      path.join(scratchDir, "package-mixed.json"),
      path.join(mixedDir, "package.json"),
    );
    run(
      "npm",
      [
        "install",
        "--no-audit",
        "--no-fund",
        "--silent",
        patchedTarball,
        tarballPaths["@ktjn/designed-icons"] ?? "",
        tarballPaths["@ktjn/designed-react"] ?? "",
        "react@19.3.1",
        "react-dom@19.3.1",
      ],
      { cwd: mixedDir, stdio: "inherit" },
    );
    console.log(
      `@ktjn/designed-react accepts independent @ktjn/designed-tokens patch (${bumpedVersion}) without peer conflicts`,
    );

    const sharedBaseUiDir = path.join(scratchDir, "shared-base-ui-consumer");
    await mkdir(sharedBaseUiDir, { recursive: true });
    await writeFile(
      path.join(sharedBaseUiDir, "package.json"),
      JSON.stringify(
        {
          name: "shared-base-ui-consumer",
          version: "0.0.0",
          private: true,
          type: "module",
        },
        null,
        2,
      ),
    );
    run(
      "npm",
      [
        "install",
        "--no-audit",
        "--no-fund",
        "--silent",
        tarballPaths["@ktjn/designed-tokens"] ?? "",
        tarballPaths["@ktjn/designed-icons"] ?? "",
        tarballPaths["@ktjn/designed-react"] ?? "",
        "@base-ui/react@^1.9.0",
        "react@19.3.1",
        "react-dom@19.3.1",
      ],
      { cwd: sharedBaseUiDir, stdio: "inherit" },
    );
    const { access } = await import("node:fs/promises");
    let hasNestedBaseUi = false;
    try {
      await access(
        path.join(
          sharedBaseUiDir,
          "node_modules/@ktjn/designed-react/node_modules/@base-ui/react",
        ),
      );
      hasNestedBaseUi = true;
    } catch {
      hasNestedBaseUi = false;
    }
    if (hasNestedBaseUi) {
      throw new Error(
        "Expected a single deduplicated @base-ui/react installation when consumer also declares @base-ui/react@^1.9.0",
      );
    }
    console.log(
      "@ktjn/designed-react shares a single @base-ui/react installation with direct consumer dependency",
    );

    console.log("\nAll packed tarballs install and work correctly.");
  } finally {
    await rm(scratchDir, { recursive: true, force: true });
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
