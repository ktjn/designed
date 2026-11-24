import { Button, Dialog, Stack, Theme, useTheme } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Theme> = {
  title: "Theme",
  component: Theme,
};

export default meta;
type Story = StoryObj<typeof Theme>;

const surface = {
  backgroundColor: "var(--ds-color-background-default)",
  color: "var(--ds-color-foreground-default)",
  padding: "var(--ds-space-surface)",
};

function ScopeSettings() {
  const { brand, colorScheme, density } = useTheme();
  return (
    <span>
      {brand}, {colorScheme}, {density}
    </span>
  );
}

export const NestedScopes: Story = {
  render: () => (
    <Theme
      brand="editorial"
      colorScheme="dark"
      density="compact"
      style={surface}
    >
      <Stack gap="md">
        <ScopeSettings />
        <Button>Save changes</Button>
        <Theme colorScheme="light" style={surface}>
          <Stack gap="sm">
            <ScopeSettings />
            <Button>Save changes</Button>
          </Stack>
        </Theme>
      </Stack>
    </Theme>
  ),
};

const sampleStyle = {
  backgroundColor: "var(--ds-color-background-selected)",
  color: "var(--ds-color-foreground-muted)",
  border: "1px solid var(--ds-color-border-control)",
  outlineColor: "var(--ds-color-border-focus)",
  padding: "var(--ds-space-stack-md)",
};

function paintedColors(element: HTMLElement) {
  const style = getComputedStyle(element);
  return [
    style.backgroundColor,
    style.color,
    style.borderTopColor,
    style.outlineColor,
  ];
}

export const ScopeComposition: Story = {
  render: () => (
    <Stack gap="md">
      <Theme brand="editorial" colorScheme="dark" contrast="more">
        <div style={sampleStyle} data-testid="dark-more-reference">
          Editorial dark with more contrast
        </div>
      </Theme>
      <Theme brand="editorial" colorScheme="dark" contrast="default">
        <div style={sampleStyle} data-testid="dark-default-reference">
          Editorial dark with default contrast
        </div>
      </Theme>
      <Theme brand="editorial" colorScheme="light" contrast="more">
        <div style={sampleStyle} data-testid="light-more-reference">
          Editorial light with more contrast
        </div>
      </Theme>
      <div data-color-scheme="dark">
        <Theme contrast="more">
          <Theme brand="editorial">
            <div style={sampleStyle} data-testid="nested-dark-more">
              Inherited dark scheme and more contrast
            </div>
            <div data-contrast="default">
              <div style={sampleStyle} data-testid="nested-dark-default">
                Reset to default contrast
              </div>
            </div>
            <Theme colorScheme="light">
              <div style={sampleStyle} data-testid="nested-light-more">
                Reset to light scheme
              </div>
              <Dialog>
                <Dialog.Trigger>Check dialog colors</Dialog.Trigger>
                <Dialog.Content style={sampleStyle}>
                  <Dialog.Title>Scoped dialog</Dialog.Title>
                  <Dialog.Description>
                    This overlay should use the trigger’s effective theme.
                  </Dialog.Description>
                  <Dialog.Close>Back to theme samples</Dialog.Close>
                </Dialog.Content>
              </Dialog>
            </Theme>
          </Theme>
        </Theme>
      </div>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const variant of ["dark-more", "dark-default", "light-more"]) {
      await expect(
        paintedColors(canvas.getByTestId(`nested-${variant}`)),
      ).toEqual(paintedColors(canvas.getByTestId(`${variant}-reference`)));
    }

    await userEvent.click(
      canvas.getByRole("button", { name: "Check dialog colors" }),
    );
    const dialog = await within(document.body).findByRole("dialog", {
      name: "Scoped dialog",
    });
    await expect(paintedColors(dialog)).toEqual(
      paintedColors(canvas.getByTestId("light-more-reference")),
    );
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Back to theme samples" }),
    );
  },
};

export const CustomBrand: Story = {
  render: () => (
    <Theme brand="theme-story-custom">
      <style>{`
        @layer ds.tokens.brand {
          [data-brand="theme-story-custom"] {
            --ds-color-action-primary-default: #0f766e;
            --ds-color-border-focus: #0f766e;
            --ds-color-background-selected: #26443d;
          }
        }
      `}</style>
      <Theme colorScheme="dark" contrast="more" style={surface}>
        <Button style={{ outlineColor: "var(--ds-color-border-focus)" }}>
          Save changes
        </Button>
        <div style={sampleStyle} data-testid="custom-selection">
          Custom selection
        </div>
        <Theme brand="default">
          <div style={sampleStyle} data-testid="default-selection">
            Default selection
          </div>
        </Theme>
      </Theme>
    </Theme>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const style = getComputedStyle(
      canvas.getByRole("button", { name: "Save changes" }),
    );
    await expect(style.backgroundColor).toBe("rgb(15, 118, 110)");
    await expect(style.outlineColor).toBe("rgb(15, 118, 110)");
    await expect(
      getComputedStyle(canvas.getByTestId("custom-selection")).backgroundColor,
    ).toBe("rgb(38, 68, 61)");
    await expect(
      getComputedStyle(canvas.getByTestId("default-selection")).backgroundColor,
    ).toBe("rgb(39, 39, 42)");
  },
};

export const ExplicitScheme: Story = {
  render: () => (
    <Stack gap="md">
      <style>{`
        @layer ds {
          [data-preference-probe] { color-scheme: light dark; }
        }
      `}</style>
      <Theme colorScheme="light" data-preference-probe="" style={surface}>
        Explicit light
      </Theme>
      <Theme colorScheme="dark" data-preference-probe="" style={surface}>
        Explicit dark
      </Theme>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      getComputedStyle(canvas.getByText("Explicit light")).backgroundColor,
    ).toBe("rgb(255, 255, 255)");
    await expect(
      getComputedStyle(canvas.getByText("Explicit dark")).backgroundColor,
    ).toBe("rgb(0, 0, 0)");
  },
};
