import { Menu } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { expectEventuallyRemoved } from "./utils/expect-removed";

const meta: Meta<typeof Menu> = {
  title: "Menu",
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger>Options</Menu.Trigger>
      <Menu.Content>
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item disabled>Delete</Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const KeyboardNavigationInteraction: Story = {
  render: () => {
    const onEditClick = fn();
    return (
      <Menu>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item onClick={onEditClick}>Edit</Menu.Item>
          <Menu.Item disabled>Delete</Menu.Item>
        </Menu.Content>
      </Menu>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Options" });
    await userEvent.click(trigger);
    const menu = await within(document.body).findByRole("menu");
    await expect(within(menu).getAllByRole("menuitem")).toHaveLength(2);

    await userEvent.keyboard("{Escape}");
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("menu"),
    );
    await expect(trigger).toHaveFocus();
  },
};
