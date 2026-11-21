import { Alert, Badge, Button, Card, Separator } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Overview",
};

export default meta;
type Story = StoryObj;

const npmrcSnippet = `@ktjn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}`;

const installSnippet = `pnpm add @ktjn/design-tokens @ktjn/design-react
pnpm add @ktjn/design-icons

import "@ktjn/design-tokens/css/all.css";`;

const themeSnippet = `<html data-brand="default" data-color-scheme="light" data-density="default" data-contrast="default">`;

export const GettingStarted: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "1.25rem",
        maxWidth: "48rem",
        fontFamily: "var(--ds-font-family-base)",
        color: "var(--ds-color-foreground-default)",
      }}
    >
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>@ktjn Design System</h1>
          <Badge variant="info">59 components</Badge>
          <Badge variant="success">16 icons</Badge>
        </div>
        <p
          style={{
            margin: 0,
            color: "var(--ds-color-foreground-muted)",
            fontSize: "var(--ds-font-size-100)",
          }}
        >
          Framework-independent design tokens, monochrome SVG icons, and an
          accessible React component library backed by native HTML and Base UI.
        </p>
      </div>

      <Alert variant="info" title="Theme toolbar">
        Use the Storybook toolbar above to compose Brand (Default / Editorial),
        Color scheme (Light / Dark), Density (Default / Compact), and Contrast
        (Default / More) live.
      </Alert>

      <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Quick start</h2>

      <Card>
        <Card.Header>
          <Card.Title>1. Configure GitHub Packages (.npmrc)</Card.Title>
          <Card.Description>
            Requires a GitHub token with the read:packages scope.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <pre
            style={{
              margin: 0,
              padding: "0.75rem",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              borderRadius: "var(--ds-radius-control)",
              background: "var(--ds-color-background-subtle)",
              border: "1px solid var(--ds-color-border-default)",
            }}
          >
            <code>{npmrcSnippet}</code>
          </pre>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>2. Install and import tokens</Card.Title>
          <Card.Description>
            Client-side React 19 library requiring a CSS-Modules-aware bundler
            (Vite, webpack, Rollup, Parcel).
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <pre
              style={{
                margin: 0,
                padding: "0.75rem",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                borderRadius: "var(--ds-radius-control)",
                background: "var(--ds-color-background-subtle)",
                border: "1px solid var(--ds-color-border-default)",
              }}
            >
              <code>{installSnippet}</code>
            </pre>
            <Separator />
            <pre
              style={{
                margin: 0,
                padding: "0.75rem",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                borderRadius: "var(--ds-radius-control)",
                background: "var(--ds-color-background-subtle)",
                border: "1px solid var(--ds-color-border-default)",
              }}
            >
              <code>{themeSnippet}</code>
            </pre>
          </div>
        </Card.Content>
        <Card.Footer>
          <Button variant="secondary" size="small">
            Secondary
          </Button>
          <Button variant="primary" size="small">
            Primary
          </Button>
        </Card.Footer>
      </Card>
    </div>
  ),
};
