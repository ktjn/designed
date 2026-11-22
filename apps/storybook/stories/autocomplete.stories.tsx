import { Autocomplete, Field } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Autocomplete> = {
  title: "Autocomplete",
  component: Autocomplete,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const SUGGESTIONS = ["TypeScript", "JavaScript", "Rust", "Python", "Go"];

export const Default: Story = {
  render: () => (
    <Field>
      <Field.Label>Language</Field.Label>
      <Autocomplete items={SUGGESTIONS} placeholder="Search languages" />
    </Field>
  ),
};

export const FilterAndSelectInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "Language" });
    await userEvent.type(input, "Type");
    const option = await within(document.body).findByRole("option", {
      name: "TypeScript",
    });
    await userEvent.click(option);
    await expect(input).toHaveValue("TypeScript");
  },
};

const FRAMEWORKS = [
  { id: "react", label: "React", tagline: "UI library" },
  { id: "vue", label: "Vue", tagline: "Progressive framework" },
];

export const CustomItemRenderingInteraction: Story = {
  render: () => (
    <Field>
      <Field.Label>Framework</Field.Label>
      <Autocomplete
        items={FRAMEWORKS}
        itemToStringValue={(item) => item.id}
        renderItem={(item) => (
          <>
            <strong>{item.label}</strong>
            <span> &mdash; {item.tagline}</span>
          </>
        )}
        placeholder="Search frameworks"
      />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "Framework" });
    await userEvent.type(input, "Vue");
    const option = await within(document.body).findByRole("option", {
      name: /Vue/,
    });
    await expect(option).toHaveTextContent("Progressive framework");
    await userEvent.click(option);
    await expect(input).toHaveValue("vue");
  },
};

function AsyncAutocomplete() {
  const [results, setResults] = useState(["Loading..."]);
  return (
    <Field>
      <Field.Label>Search</Field.Label>
      <Autocomplete
        items={results}
        filter={null}
        onValueChange={(next) => {
          setResults(next ? [`${next} result A`, `${next} result B`] : []);
        }}
        placeholder="Search server results"
      />
    </Field>
  );
}

// Regression coverage: with `filter={null}` the component must not apply its
// own local filtering, so items swapped in by the consumer (simulating a
// server response) remain fully visible instead of being re-filtered away.
export const AsyncResultsInteraction: Story = {
  render: () => <AsyncAutocomplete />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "Search" });
    await userEvent.type(input, "db");
    await expect(
      await within(document.body).findByRole("option", {
        name: "db result A",
      }),
    ).toBeTruthy();
    await expect(within(document.body).getAllByRole("option")).toHaveLength(2);
  },
};
