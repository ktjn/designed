import { Autocomplete, Field } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
