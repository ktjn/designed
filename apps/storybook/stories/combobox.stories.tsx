import { Combobox } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Combobox> = {
  title: "Combobox",
  component: Combobox,
  // Combobox.Input is width: 100% by design (it fills whatever container a
  // consumer gives it), so with no width constraint here it stretches to
  // fill Storybook's full-bleed canvas -- correct per the component's
  // contract, but not representative of real usage, where a combobox is
  // typically placed in a form with a normal, bounded width.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const items = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

export const Default: Story = {
  render: () => (
    <Combobox items={items}>
      <Combobox.Input placeholder="Search plans" />
      <Combobox.Content />
    </Combobox>
  ),
};

export const TypeToOpenInteraction: Story = {
  render: () => (
    <Combobox items={items}>
      <Combobox.Input placeholder="Search plans" />
      <Combobox.Content />
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

// Regression coverage for a real bug: Base UI's filtering-as-you-type and
// its "no results" empty state are entirely driven by the `items` prop on
// the root. Before `items` was wired up, typing never narrowed the list and
// the empty message showed permanently regardless of matches.
export const FilterInteraction: Story = {
  render: () => (
    <Combobox items={items}>
      <Combobox.Input placeholder="Search plans" />
      <Combobox.Content />
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search plans");

    await userEvent.type(input, "pro");
    const listbox = await within(document.body).findByRole("listbox");
    const options = await within(listbox).findAllByRole("option");
    await expect(options).toHaveLength(1);
    await expect(options[0]).toHaveTextContent("Pro");

    await userEvent.clear(input);
    await userEvent.type(input, "zzz");
    await expect(
      await within(document.body).findByText("No results"),
    ).toBeInTheDocument();
  },
};
