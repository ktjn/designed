import { Combobox, Field } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
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

export const Invalid: Story = {
  render: () => (
    <Field invalid>
      <Field.Label>Plan</Field.Label>
      <Combobox items={items}>
        <Combobox.Input placeholder="Search plans" />
        <Combobox.Content />
      </Combobox>
      <Field.Error>Choose a plan to continue.</Field.Error>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox", { name: "Plan" });
    await expect(getComputedStyle(input).borderTopColor).toBe(
      "rgb(220, 38, 38)",
    );
  },
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

const itemsWithDisabled = [
  ...items,
  { value: "legacy", label: "Legacy", disabled: true },
];

export const DisabledItemInteraction: Story = {
  render: () => (
    <Combobox items={itemsWithDisabled}>
      <Combobox.Input placeholder="Search plans" />
      <Combobox.Content />
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search plans");
    await userEvent.click(input);
    const option = await within(document.body).findByRole("option", {
      name: "Legacy",
    });
    await expect(option).toHaveAttribute("aria-disabled", "true");
  },
};

export const MultipleSelectionInteraction: Story = {
  render: () => (
    <Combobox items={items} multiple defaultValue={["basic"]}>
      <Combobox.Input placeholder="Search plans" />
      <Combobox.Content />
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search plans");
    await userEvent.click(input);
    const proOption = await within(document.body).findByRole("option", {
      name: "Pro",
    });
    await userEvent.click(proOption);
    const basicOption = within(document.body).getByRole("option", {
      name: "Basic",
    });
    await expect(basicOption).toHaveAttribute("aria-selected", "true");
    await expect(proOption).toHaveAttribute("aria-selected", "true");
  },
};

export const CustomItemRenderingInteraction: Story = {
  render: () => (
    <Combobox items={items}>
      <Combobox.Input placeholder="Search plans" />
      <Combobox.Content
        renderItem={(item) => <strong>Plan: {item.label}</strong>}
      />
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search plans");
    await userEvent.click(input);
    await expect(
      await within(document.body).findByText("Plan: Basic"),
    ).toBeInTheDocument();
  },
};

function AsyncCombobox() {
  const [results, setResults] = useState(items);
  return (
    <Combobox
      items={results}
      filter={null}
      onInputValueChange={(query) => {
        setResults(
          query
            ? [{ value: `${query}-result`, label: `${query} result` }]
            : items,
        );
      }}
    >
      <Combobox.Input placeholder="Search plans" />
      <Combobox.Content />
    </Combobox>
  );
}

// Regression coverage: with `filter={null}` the component must not apply its
// own local filtering, so items swapped in by the consumer (simulating a
// server response) remain fully visible instead of being re-filtered away.
export const AsyncResultsInteraction: Story = {
  render: () => <AsyncCombobox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Search plans");
    await userEvent.type(input, "db");
    await expect(
      await within(document.body).findByRole("option", {
        name: "db result",
      }),
    ).toBeTruthy();
    await expect(within(document.body).getAllByRole("option")).toHaveLength(1);
  },
};
