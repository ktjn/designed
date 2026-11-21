import { DatePicker, Field } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof DatePicker> = {
  title: "DatePicker",
  component: DatePicker,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => (
    <Field>
      <Field.Label>Start date</Field.Label>
      <DatePicker defaultValue="2026-06-15" />
    </Field>
  ),
};

export const SelectFromPopover: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Choose date" }));
    const day22 = await within(document.body).findByRole("button", {
      name: /2026-06-22/,
    });
    await userEvent.click(day22);
    await expect(canvas.getByLabelText("Start date")).toHaveValue("2026-06-22");
  },
};
