import { Field, TimePicker } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, within } from "storybook/test";

const meta: Meta<typeof TimePicker> = {
  title: "TimePicker",
  component: TimePicker,
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: () => (
    <Field>
      <Field.Label>Start time</Field.Label>
      <TimePicker defaultValue="09:00" />
    </Field>
  ),
};

export const ChangeInteraction: Story = {
  render: () => (
    <Field>
      <Field.Label>Meeting time</Field.Label>
      <TimePicker min="09:00" max="17:00" step={900} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Meeting time") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "13:15" } });
    await expect(input.value).toBe("13:15");
  },
};
