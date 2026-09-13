import { Popover } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectEventuallyRemoved } from "./utils/expect-removed";

const meta: Meta<typeof Popover> = {
  title: "Popover",
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>Info</Popover.Trigger>
      <Popover.Content>
        <Popover.Title>More info</Popover.Title>
        <Popover.Description>Extra details go here.</Popover.Description>
        <Popover.Close>Close</Popover.Close>
      </Popover.Content>
    </Popover>
  ),
};

export const OpenCloseInteraction: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>Info</Popover.Trigger>
      <Popover.Content>
        <Popover.Title>More info</Popover.Title>
        <Popover.Close>Close</Popover.Close>
      </Popover.Content>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Info" });
    await userEvent.click(trigger);
    const popup = await within(document.body).findByRole("dialog");
    await expect(popup).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("dialog"),
    );
    await expect(trigger).toHaveFocus();
  },
};
