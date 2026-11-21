import { Field, OTPField } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof OTPField> = {
  title: "OTPField",
  component: OTPField,
};

export default meta;
type Story = StoryObj<typeof OTPField>;

export const Default: Story = {
  render: () => (
    <Field>
      <Field.Label>Verification code</Field.Label>
      <OTPField length={6} aria-label="Verification code" />
    </Field>
  ),
};

export const Masked: Story = {
  render: () => (
    <Field>
      <Field.Label>Security PIN</Field.Label>
      <OTPField length={4} mask defaultValue="1234" aria-label="Security PIN" />
    </Field>
  ),
};

export const TypeCodeInteraction: Story = {
  render: () => <OTPField length={4} aria-label="One-time code" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("textbox");
    const first = inputs[0];
    if (!first) {
      throw new Error("Expected OTP input");
    }
    await userEvent.click(first);
    await userEvent.keyboard("4821");
    await expect(inputs[0]).toHaveValue("4");
    await expect(inputs[3]).toHaveValue("1");
  },
};
