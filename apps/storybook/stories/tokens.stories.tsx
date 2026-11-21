import { Grid, Stack } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Tokens",
};

export default meta;
type Story = StoryObj;

const COLOR_SWATCHES = [
  { name: "background.default", varName: "--ds-color-background-default" },
  { name: "background.subtle", varName: "--ds-color-background-subtle" },
  { name: "background.muted", varName: "--ds-color-background-muted" },
  { name: "background.selected", varName: "--ds-color-background-selected" },
  { name: "foreground.default", varName: "--ds-color-foreground-default" },
  { name: "foreground.muted", varName: "--ds-color-foreground-muted" },
  { name: "border.default", varName: "--ds-color-border-default" },
  { name: "border.control", varName: "--ds-color-border-control" },
  { name: "border.focus", varName: "--ds-color-border-focus" },
  {
    name: "action.primary.default",
    varName: "--ds-color-action-primary-default",
  },
  { name: "action.primary.hover", varName: "--ds-color-action-primary-hover" },
  {
    name: "action.danger.default",
    varName: "--ds-color-action-danger-default",
  },
];

const STATUS_SWATCHES = [
  {
    name: "Info",
    bg: "--ds-color-status-info-background",
    fg: "--ds-color-status-info-foreground",
    border: "--ds-color-status-info-border",
  },
  {
    name: "Success",
    bg: "--ds-color-status-success-background",
    fg: "--ds-color-status-success-foreground",
    border: "--ds-color-status-success-border",
  },
  {
    name: "Warning",
    bg: "--ds-color-status-warning-background",
    fg: "--ds-color-status-warning-foreground",
    border: "--ds-color-status-warning-border",
  },
  {
    name: "Danger",
    bg: "--ds-color-status-danger-background",
    fg: "--ds-color-status-danger-foreground",
    border: "--ds-color-status-danger-border",
  },
];

const SPACING_TOKENS = [
  { name: "stack.sm", varName: "--ds-space-stack-sm" },
  { name: "stack.md", varName: "--ds-space-stack-md" },
  { name: "stack.lg", varName: "--ds-space-stack-lg" },
  { name: "control.block", varName: "--ds-space-control-block" },
  { name: "control.inline", varName: "--ds-space-control-inline" },
  { name: "surface", varName: "--ds-space-surface" },
];

export const Specimen: Story = {
  render: () => (
    <div
      style={{
        fontFamily: "var(--ds-font-family-base)",
        color: "var(--ds-color-foreground-default)",
        maxWidth: "56rem",
      }}
    >
      <Stack gap="lg">
        <div>
          <h1 style={{ margin: 0, fontSize: "var(--ds-font-size-300)" }}>
            Semantic Design Tokens
          </h1>
          <p
            style={{
              margin: "0.25rem 0 0",
              color: "var(--ds-color-foreground-muted)",
              fontSize: "var(--ds-font-size-100)",
            }}
          >
            Switch Brand, Color Scheme, Density, and Contrast in the toolbar to
            inspect live token resolution.
          </p>
        </div>

        <Stack gap="sm">
          <h2 style={{ margin: 0, fontSize: "var(--ds-font-size-200)" }}>
            Colors
          </h2>
          <Grid columns="auto" minItemWidth="11rem" gap="md">
            {COLOR_SWATCHES.map((swatch) => (
              <div
                key={swatch.varName}
                style={{
                  border: "1px solid var(--ds-color-border-default)",
                  borderRadius: "var(--ds-radius-surface)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    blockSize: "2.5rem",
                    background: `var(${swatch.varName})`,
                    borderBlockEnd: "1px solid var(--ds-color-border-default)",
                  }}
                />
                <div
                  style={{
                    padding: "0.5rem",
                    fontSize: "var(--ds-font-size-100)",
                  }}
                >
                  <div>{swatch.name}</div>
                  <code
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--ds-color-foreground-muted)",
                    }}
                  >
                    {swatch.varName}
                  </code>
                </div>
              </div>
            ))}
          </Grid>
        </Stack>

        <Stack gap="sm">
          <h2 style={{ margin: 0, fontSize: "var(--ds-font-size-200)" }}>
            Status Colors
          </h2>
          <Grid columns={4} gap="md">
            {STATUS_SWATCHES.map((status) => (
              <div
                key={status.name}
                style={{
                  padding: "0.75rem",
                  borderRadius: "var(--ds-radius-surface)",
                  background: `var(${status.bg})`,
                  color: `var(${status.fg})`,
                  border: `1px solid var(${status.border})`,
                  fontWeight: "var(--ds-font-weight-medium)",
                  fontSize: "var(--ds-font-size-100)",
                }}
              >
                {status.name}
              </div>
            ))}
          </Grid>
        </Stack>

        <Stack gap="sm">
          <h2 style={{ margin: 0, fontSize: "var(--ds-font-size-200)" }}>
            Spacing
          </h2>
          <Stack gap="sm">
            {SPACING_TOKENS.map((token) => (
              <Stack
                key={token.varName}
                direction="horizontal"
                align="center"
                gap="md"
              >
                <span
                  style={{
                    inlineSize: "8rem",
                    fontSize: "var(--ds-font-size-100)",
                  }}
                >
                  {token.name}
                </span>
                <div
                  style={{
                    inlineSize: `var(${token.varName})`,
                    blockSize: "0.75rem",
                    borderRadius: "var(--ds-radius-control)",
                    background: "var(--ds-color-action-primary-default)",
                  }}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack gap="sm">
          <h2 style={{ margin: 0, fontSize: "var(--ds-font-size-200)" }}>
            Typography & Elevation
          </h2>
          <Grid columns={2} gap="md">
            <div
              style={{
                padding: "var(--ds-space-surface)",
                borderRadius: "var(--ds-radius-surface)",
                border: "1px solid var(--ds-color-border-default)",
                boxShadow: "var(--ds-shadow-raised)",
              }}
            >
              <div style={{ fontSize: "var(--ds-font-size-300)" }}>
                Size 300 heading
              </div>
              <div style={{ fontSize: "var(--ds-font-size-200)" }}>
                Size 200 subheading
              </div>
              <div style={{ fontSize: "var(--ds-font-size-100)" }}>
                Size 100 body copy (raised shadow)
              </div>
            </div>
            <div
              style={{
                padding: "var(--ds-space-surface)",
                borderRadius: "var(--ds-radius-surface)",
                border: "1px solid var(--ds-color-border-default)",
                boxShadow: "var(--ds-shadow-overlay)",
              }}
            >
              <div
                style={{
                  fontSize: "var(--ds-font-size-200)",
                  fontWeight: "var(--ds-font-weight-bold)",
                }}
              >
                Overlay surface
              </div>
              <div
                style={{
                  fontSize: "var(--ds-font-size-100)",
                  color: "var(--ds-color-foreground-muted)",
                }}
              >
                Uses --ds-shadow-overlay and --ds-radius-surface
              </div>
            </div>
          </Grid>
        </Stack>
      </Stack>
    </div>
  ),
};
