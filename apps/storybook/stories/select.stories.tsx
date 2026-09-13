import { Select } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { expectEventuallyRemoved } from "./utils/expect-removed";

const meta: Meta<typeof Select> = {
  title: "Select",
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

const items = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

export const Default: Story = {
  render: () => (
    <Select items={items}>
      <Select.Trigger>
        <Select.Value placeholder="Choose a plan" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="basic">Basic</Select.Item>
        <Select.Item value="pro">Pro</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const SelectInteraction: Story = {
  render: () => {
    const onValueChange = fn();
    return (
      <Select items={items} onValueChange={onValueChange}>
        <Select.Trigger>
          <Select.Value placeholder="Choose a plan" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="basic">Basic</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select.Content>
      </Select>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);
    const listbox = await within(document.body).findByRole("listbox");
    await userEvent.click(within(listbox).getByText("Pro"));
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("listbox"),
    );
    // items={items} makes Select.Value render the item's label ("Pro"), not
    // the raw value ("pro") -- verified after a real bug where the trigger
    // showed the raw value with no items map supplied.
    await expect(canvas.getByText("Pro")).toBeInTheDocument();
  },
};
