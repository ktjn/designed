import { Menu } from "@ktjn/designed-react";
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

export const SubmenuAndLinkItemInteraction: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger>File</Menu.Trigger>
      <Menu.Content>
        <Menu.LinkItem href="/docs">Documentation</Menu.LinkItem>
        <Menu.Submenu>
          <Menu.SubmenuTrigger>Export as</Menu.SubmenuTrigger>
          <Menu.Content>
            <Menu.Item>PNG</Menu.Item>
            <Menu.Item>SVG</Menu.Item>
          </Menu.Content>
        </Menu.Submenu>
      </Menu.Content>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "File" }));
    const menu = await within(document.body).findByRole("menu");
    await expect(
      within(menu).getByRole("menuitem", { name: "Documentation" }),
    ).toHaveAttribute("href", "/docs");
    await userEvent.click(
      within(menu).getByRole("menuitem", { name: "Export as" }),
    );
    await expect(
      await within(document.body).findByRole("menuitem", { name: "SVG" }),
    ).toBeTruthy();
  },
};

export const RichItemsInteraction: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger>View</Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>Panels</Menu.GroupLabel>
          <Menu.CheckboxItem defaultChecked>
            Sidebar <Menu.Shortcut>⌘B</Menu.Shortcut>
          </Menu.CheckboxItem>
          <Menu.CheckboxItem>Status bar</Menu.CheckboxItem>
        </Menu.Group>
        <Menu.Separator />
        <Menu.RadioGroup defaultValue="comfortable">
          <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
          <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "View" }));
    const menu = await within(document.body).findByRole("menu");
    const sidebarItem = within(menu).getByRole("menuitemcheckbox", {
      name: /Sidebar/,
    });
    await expect(sidebarItem).toHaveAttribute("aria-checked", "true");
    const compactRadio = within(menu).getByRole("menuitemradio", {
      name: "Compact",
    });
    await expect(compactRadio).toHaveAttribute("aria-checked", "false");
  },
};
