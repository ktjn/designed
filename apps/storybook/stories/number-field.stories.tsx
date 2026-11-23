import { Field, NumberField } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof NumberField> = {
  title: "NumberField",
  component: NumberField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
  render: () => (
    <Field>
      <Field.Label>Seats</Field.Label>
      <NumberField defaultValue={3} min={1} max={20} />
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field invalid>
      <Field.Label>Seats</Field.Label>
      <NumberField defaultValue={1} min={1} max={20} />
      <Field.Error>Minimum 2 seats required.</Field.Error>
    </Field>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <NumberField aria-label="Small" size="small" defaultValue={3} />
      <NumberField aria-label="Medium" size="medium" defaultValue={3} />
      <NumberField aria-label="Large" size="large" defaultValue={3} />
    </div>
  ),
};

export const StepInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Increase" }));
    await expect(canvas.getByRole("textbox", { name: "Seats" })).toHaveValue(
      "4",
    );
  },
};
