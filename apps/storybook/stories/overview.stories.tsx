import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  SearchIcon,
} from "@ktjn/designed-icons";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Dialog,
  Field,
  Grid,
  InputGroup,
  Kbd,
  Progress,
  Separator,
  Slider,
  Stack,
  Switch,
  Tabs,
  Tag,
} from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import styles from "./overview.module.css";

const meta: Meta = {
  title: "Overview",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

const installSnippet = `# .npmrc (GitHub token with read:packages)
@ktjn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}

# Install packages
pnpm add @ktjn/designed-tokens @ktjn/designed-react
pnpm add @ktjn/designed-icons`;

const usageSnippet = `import "@ktjn/designed-tokens/css/all.css";
import { Button, Dialog, Field, Input } from "@ktjn/designed-react";

export function ProfileDialog() {
  return (
    <Dialog>
      <Dialog.Trigger render={<Button variant="primary">Edit profile</Button>} />
      <Dialog.Content>
        <Dialog.Title>Profile</Dialog.Title>
        <Field>
          <Field.Label>Display name</Field.Label>
          <Input name="name" defaultValue="Ada Lovelace" />
        </Field>
        <Dialog.Close>Done</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
}`;

const tailwindSnippet = `/* Declare global layer order first */
@layer theme, base, ds, components, utilities;
@import "tailwindcss";
@import "@ktjn/designed-tokens/css/all.css";`;

function CodeSnippet({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={styles.codeWrap}>
      <pre className={styles.codeBlock}>
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className={styles.copyButton}
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        onClick={handleCopy}
      >
        {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
      </Button>
    </div>
  );
}

function OverviewPage() {
  const [brand, setBrand] = useState<"default" | "editorial">("default");
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const [density, setDensity] = useState<"default" | "compact">("default");
  const [contrast, setContrast] = useState<"default" | "more">("default");
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState(68);

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="overview-hero-title">
        <div className={styles.heroTop}>
          <div className={styles.brandLockup}>
            <span className={styles.brandMark} aria-hidden="true">
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <rect
                  x="3"
                  y="3"
                  width="14"
                  height="14"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="10" cy="10" r="2.5" fill="currentColor" />
              </svg>
            </span>
            <h1 id="overview-hero-title" className={styles.heroTitle}>
              Designed
            </h1>
          </div>
          <Stack direction="horizontal" gap="sm" wrap>
            <Badge variant="info">59 Components</Badge>
            <Badge variant="success">16 Icons</Badge>
            <Badge variant="neutral">WCAG 2.2 AA</Badge>
            <Badge variant="neutral">React 19</Badge>
          </Stack>
        </div>

        <p className={styles.heroLead}>
          Framework-independent DTCG design tokens, tree-shakeable monochrome
          SVG icons, and a client-side React 19 component library built on
          native HTML and Base UI with CSS Cascade Layers.
        </p>

        <div className={styles.heroActions}>
          <a
            href="https://github.com/ktjn/designed"
            target="_blank"
            rel="noreferrer"
            className={`${styles.actionLink} ${styles.actionPrimary}`}
          >
            GitHub Repository
            <ExternalLinkIcon aria-hidden width={14} height={14} />
          </a>
          <a
            href="./?path=/story/blocks--login-form"
            target="_top"
            className={`${styles.actionLink} ${styles.actionSecondary}`}
          >
            Explore Blocks
          </a>
          <a
            href="./?path=/story/tokens--specimen"
            target="_top"
            className={`${styles.actionLink} ${styles.actionSecondary}`}
          >
            Token Specimen
          </a>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="playground-heading">
        <div className={styles.sectionHeader}>
          <h2 id="playground-heading" className={styles.sectionTitle}>
            Interactive Theme Scope
          </h2>
          <p className={styles.sectionSubtitle}>
            Compose all four independent theme dimensions locally. Overlays
            portal to document.body while preserving the scoped theme even under
            overflow: hidden.
          </p>
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Brand</span>
            <ButtonGroup>
              <Button
                size="small"
                variant={brand === "default" ? "primary" : "secondary"}
                onClick={() => setBrand("default")}
              >
                Default
              </Button>
              <Button
                size="small"
                variant={brand === "editorial" ? "primary" : "secondary"}
                onClick={() => setBrand("editorial")}
              >
                Editorial
              </Button>
            </ButtonGroup>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Color scheme</span>
            <ButtonGroup>
              <Button
                size="small"
                variant={scheme === "light" ? "primary" : "secondary"}
                onClick={() => setScheme("light")}
              >
                Light
              </Button>
              <Button
                size="small"
                variant={scheme === "dark" ? "primary" : "secondary"}
                onClick={() => setScheme("dark")}
              >
                Dark
              </Button>
            </ButtonGroup>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Density</span>
            <ButtonGroup>
              <Button
                size="small"
                variant={density === "default" ? "primary" : "secondary"}
                onClick={() => setDensity("default")}
              >
                Default
              </Button>
              <Button
                size="small"
                variant={density === "compact" ? "primary" : "secondary"}
                onClick={() => setDensity("compact")}
              >
                Compact
              </Button>
            </ButtonGroup>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Contrast</span>
            <ButtonGroup>
              <Button
                size="small"
                variant={contrast === "default" ? "primary" : "secondary"}
                onClick={() => setContrast("default")}
              >
                Default
              </Button>
              <Button
                size="small"
                variant={contrast === "more" ? "primary" : "secondary"}
                onClick={() => setContrast("more")}
              >
                More
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <div
          className={styles.playgroundSurface}
          data-brand={brand}
          data-color-scheme={scheme}
          data-density={density}
          data-contrast={contrast}
        >
          <div className={styles.playgroundHeader}>
            <h3 className={styles.playgroundTitle}>Scoped Preview Surface</h3>
            <Stack direction="horizontal" gap="sm" wrap>
              <Tag variant="info">{brand}</Tag>
              <Tag variant="neutral">{scheme}</Tag>
              <Tag variant="success">{density}</Tag>
              {contrast === "more" ? (
                <Tag variant="warning">high contrast</Tag>
              ) : null}
            </Stack>
          </div>

          <div className={styles.playgroundGrid}>
            <Stack gap="md">
              <Field>
                <Field.Label>Quick search</Field.Label>
                <InputGroup>
                  <InputGroup.Addon>
                    <SearchIcon aria-hidden />
                  </InputGroup.Addon>
                  <InputGroup.Input placeholder="Filter components..." />
                  <InputGroup.Addon align="end">
                    <Kbd size="sm">Ctrl K</Kbd>
                  </InputGroup.Addon>
                </InputGroup>
              </Field>

              <div className={styles.switchRow}>
                <label
                  htmlFor="overview-notifications"
                  className={styles.switchLabel}
                >
                  Release notifications
                </label>
                <Switch
                  id="overview-notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </Stack>

            <Stack gap="md">
              <Progress label="Token coverage" value={volume} showValue />
              <Slider
                aria-label="Preview value"
                value={volume}
                onValueChange={(next) => {
                  if (typeof next === "number") setVolume(next);
                }}
              />
              <Stack direction="horizontal" gap="sm" wrap>
                <Dialog>
                  <Dialog.Trigger
                    render={
                      <Button variant="primary" size="small">
                        Scoped Dialog
                      </Button>
                    }
                  />
                  <Dialog.Content>
                    <Dialog.Title>Theme-scoped portal</Dialog.Title>
                    <Dialog.Description>
                      Portaled to document.body while inheriting the active
                      brand, scheme, density, and contrast from the preview
                      panel.
                    </Dialog.Description>
                    <Dialog.Close>Close</Dialog.Close>
                  </Dialog.Content>
                </Dialog>
                <Button variant="secondary" size="small">
                  Secondary
                </Button>
                <Button variant="ghost" size="small">
                  Ghost
                </Button>
              </Stack>
            </Stack>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="pillars-heading">
        <div className={styles.sectionHeader}>
          <h2 id="pillars-heading" className={styles.sectionTitle}>
            Architecture Highlights
          </h2>
          <p className={styles.sectionSubtitle}>
            Small, replaceable primitives backed by automated contracts.
          </p>
        </div>

        <Grid columns={2} gap="md">
          <Card className={styles.featureCard}>
            <Card.Header>
              <Card.Title>Zero-JS DTCG Tokens</Card.Title>
              <Card.Description>@ktjn/designed-tokens</Card.Description>
            </Card.Header>
            <Card.Content>
              <p className={styles.featureBody}>
                Compiled to CSS custom properties, JSON, and TypeScript types
                with ordered cascade sub-layers and nested scope resets.
              </p>
            </Card.Content>
          </Card>

          <Card className={styles.featureCard}>
            <Card.Header>
              <Card.Title>Native HTML + Base UI</Card.Title>
              <Card.Description>@ktjn/designed-react</Card.Description>
            </Card.Header>
            <Card.Content>
              <p className={styles.featureBody}>
                59 client-side React 19 components using ref-as-prop and normal
                DOM escape hatches. Base UI stays private with zero type leaks.
              </p>
            </Card.Content>
          </Card>

          <Card className={styles.featureCard}>
            <Card.Header>
              <Card.Title>Tailwind & Cascade Ready</Card.Title>
              <Card.Description>@layer ds.*</Card.Description>
            </Card.Header>
            <Card.Content>
              <p className={styles.featureBody}>
                All styles live inside @layer ds.* so unlayered CSS or Tailwind
                utilities override component styles cleanly without !important.
              </p>
            </Card.Content>
          </Card>

          <Card className={styles.featureCard}>
            <Card.Header>
              <Card.Title>Tested Contracts</Card.Title>
              <Card.Description>Chromium + axe + Tarballs</Card.Description>
            </Card.Header>
            <Card.Content>
              <p className={styles.featureBody}>
                Verified with 197 unit tests, 148 Chromium Storybook + axe
                checks, publint + attw, under-1 kB Button budget, and packed
                tarball builds.
              </p>
            </Card.Content>
          </Card>
        </Grid>
      </section>

      <Separator />

      <section className={styles.section} aria-labelledby="quickstart-heading">
        <div className={styles.sectionHeader}>
          <h2 id="quickstart-heading" className={styles.sectionTitle}>
            Quick Start
          </h2>
          <p className={styles.sectionSubtitle}>
            Client-side React 19 library requiring a CSS-Modules-aware bundler
            (Vite, webpack, Rollup, Parcel).
          </p>
        </div>

        <Tabs defaultValue="install">
          <Tabs.List>
            <Tabs.Tab value="install">Install</Tabs.Tab>
            <Tabs.Tab value="usage">Usage</Tabs.Tab>
            <Tabs.Tab value="tailwind">Tailwind CSS</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="install">
            <CodeSnippet code={installSnippet} label="install snippet" />
          </Tabs.Panel>
          <Tabs.Panel value="usage">
            <CodeSnippet code={usageSnippet} label="usage snippet" />
          </Tabs.Panel>
          <Tabs.Panel value="tailwind">
            <CodeSnippet code={tailwindSnippet} label="Tailwind snippet" />
          </Tabs.Panel>
        </Tabs>
      </section>
    </div>
  );
}

export const GettingStarted: Story = {
  render: () => <OverviewPage />,
};
