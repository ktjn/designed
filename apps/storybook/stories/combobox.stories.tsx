import { Combobox } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Combobox> = {
  title: "Combobox",
  component: Combobox,
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: () => (
    <Combobox>
      <Combobox.Input placeholder="Search plans" />
      <Combobox.Content>
        <Combobox.Item value="basic">Basic</Combobox.Item>
        <Combobox.Item value="pro">Pro</Combobox.Item>
      </Combobox.Content>
    </Combobox>
  ),
};

export const TypeToOpenInteraction: Story = {
  render: () => (
    <Combobox>
      <Combobox.Input placeholder="Search plans" />
      <Combobox.Content>
        <Combobox.Item value="basic">Basic</Combobox.Item>
        <Combobox.Item value="pro">Pro</Combobox.Item>
      </Combobox.Content>
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search plans");
    await userEvent.click(input);
    const listbox = await within(document.body).findByRole("listbox");
    await expect(within(listbox).getAllByRole("option")).toHaveLength(2);
  },
};
