import { Toolbar } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Toolbar> = {
  title: "Toolbar",
  component: Toolbar,
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  render: () => (
    <Toolbar aria-label="Text formatting">
      <Toolbar.Group>
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
        <Toolbar.Button>Underline</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Link href="https://example.com">Shortcuts</Toolbar.Link>
    </Toolbar>
  ),
};

export const KeyboardNavigation: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole("button", { name: "Bold" });
    bold.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Italic" })).toHaveFocus();
  },
};
