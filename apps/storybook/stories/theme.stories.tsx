import { Button, Stack, Theme, useTheme } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
