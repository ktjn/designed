import { ContextMenu } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof ContextMenu> = {
  title: "ContextMenu",
  component: ContextMenu,
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenu.Trigger
        style={{
          padding: "2rem",
          border: "1px dashed var(--ds-color-border-control)",
          borderRadius: "var(--ds-radius-surface)",
          textAlign: "center",
          fontFamily: "var(--ds-font-family-base)",
        }}
      >
        Right-click anywhere in this area
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Copy</ContextMenu.Item>
        <ContextMenu.Item>Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  ),
};

export const OpenInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByText("Right-click anywhere in this area");
    await userEvent.pointer({ target, keys: "[MouseRight]" });
    const menu = await within(document.body).findByRole("menu");
    await expect(
      within(menu).getByRole("menuitem", { name: "Copy" }),
    ).toBeInTheDocument();
  },
};
