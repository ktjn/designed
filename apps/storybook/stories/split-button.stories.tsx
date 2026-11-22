import { Menu, SplitButton } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta: Meta<typeof SplitButton> = {
  title: "SplitButton",
  component: SplitButton,
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

export const Default: Story = {
  render: () => (
    <SplitButton
      menu={
        <>
          <Menu.Item>Save as draft</Menu.Item>
          <Menu.Item>Save and close</Menu.Item>
        </>
      }
    >
      Save
    </SplitButton>
  ),
};

export const OpenMenuInteraction: Story = {
  render: () => {
    const onPrimaryClick = fn();
    return (
      <SplitButton
        onClick={onPrimaryClick}
        menu={<Menu.Item>Save as draft</Menu.Item>}
      >
        Save
      </SplitButton>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "More actions" }));
    await expect(
      await within(document.body).findByRole("menuitem", {
        name: "Save as draft",
      }),
    ).toBeTruthy();
  },
};
