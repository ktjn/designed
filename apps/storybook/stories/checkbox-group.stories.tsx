import { Checkbox, CheckboxGroup } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof CheckboxGroup> = {
  title: "CheckboxGroup",
  component: CheckboxGroup,
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
  render: () => (
    <CheckboxGroup defaultValue={["apple"]}>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox value="apple" /> Apple
      </label>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox value="banana" /> Banana
      </label>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox value="cherry" /> Cherry
      </label>
    </CheckboxGroup>
  ),
};

export const SelectAllInteraction: Story = {
  render: () => (
    <CheckboxGroup defaultValue={["apple"]} allValues={["apple", "banana"]}>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox parent /> All fruits
      </label>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox value="apple" /> Apple
      </label>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox value="banana" /> Banana
      </label>
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByRole("checkbox", { name: "All fruits" });
    await expect(parent).toHaveAttribute("data-indeterminate");

    const banana = canvas.getByRole("checkbox", { name: "Banana" });
    await userEvent.click(banana);
    await expect(parent).toHaveAttribute("aria-checked", "true");

    await userEvent.click(parent);
    const apple = canvas.getByRole("checkbox", { name: "Apple" });
    await expect(apple).toHaveAttribute("aria-checked", "false");
    await expect(banana).toHaveAttribute("aria-checked", "false");
  },
};

export const Horizontal: Story = {
  render: () => (
    <CheckboxGroup orientation="horizontal" defaultValue={["apple"]}>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox value="apple" /> Apple
      </label>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox value="banana" /> Banana
      </label>
    </CheckboxGroup>
  ),
};
