import { Toggle, ToggleGroup } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof ToggleGroup> = {
  title: "ToggleGroup",
  component: ToggleGroup,
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Single: Story = {
  render: () => (
    <ToggleGroup aria-label="Alignment" defaultValue={["left"]}>
      <Toggle value="left">Left</Toggle>
      <Toggle value="center">Center</Toggle>
      <Toggle value="right">Right</Toggle>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup
      aria-label="Formatting"
      multiple
      defaultValue={["bold", "italic"]}
    >
      <Toggle value="bold">Bold</Toggle>
      <Toggle value="italic">Italic</Toggle>
      <Toggle value="underline">Underline</Toggle>
    </ToggleGroup>
  ),
};

export const SelectionInteraction: Story = {
  ...Single,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const center = canvas.getByRole("button", { name: "Center" });
    await userEvent.click(center);
    await expect(center).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  },
};
