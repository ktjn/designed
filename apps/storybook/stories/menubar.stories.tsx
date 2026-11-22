import { Menu, Menubar } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Menubar> = {
  title: "Menubar",
  component: Menubar,
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <Menu>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>New</Menu.Item>
          <Menu.Item>Open</Menu.Item>
        </Menu.Content>
      </Menu>
      <Menu>
        <Menu.Trigger>Edit</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Undo</Menu.Item>
          <Menu.Item>Redo</Menu.Item>
        </Menu.Content>
      </Menu>
    </Menubar>
  ),
};

export const OpenMenuInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("menuitem", { name: "File" }));
    await expect(
      await within(document.body).findByRole("menuitem", { name: "New" }),
    ).toBeTruthy();
    await userEvent.keyboard("{ArrowRight}");
    await expect(
      await within(document.body).findByRole("menuitem", { name: "Undo" }),
    ).toBeTruthy();
  },
};
