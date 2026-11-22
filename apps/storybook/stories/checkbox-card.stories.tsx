import { CheckboxCard, CheckboxGroup } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof CheckboxCard> = {
  title: "CheckboxCard",
  component: CheckboxCard,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CheckboxCard>;

export const Default: Story = {
  render: () => (
    <CheckboxGroup aria-label="Notification channels" defaultValue={["email"]}>
      <CheckboxCard
        value="email"
        label="Email"
        description="Receive daily summaries and account updates."
      />
      <CheckboxCard
        value="sms"
        label="SMS"
        description="Get instant alerts for critical incidents."
      />
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <CheckboxGroup aria-label="Notification channels" defaultValue={["email"]}>
      <CheckboxCard
        value="email"
        label="Email"
        description="Required for billing receipts."
        disabled
      />
      <CheckboxCard
        value="sms"
        label="SMS"
        description="Unavailable on your current plan."
        disabled
      />
    </CheckboxGroup>
  ),
};

export const ToggleInteraction: Story = {
  render: () => (
    <CheckboxGroup aria-label="Notification channels" defaultValue={["email"]}>
      <CheckboxCard
        value="email"
        label="Email"
        description="Receive daily summaries."
      />
      <CheckboxCard value="sms" label="SMS" description="Get instant alerts." />
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const smsCheckbox = canvas.getByRole("checkbox", { name: /SMS/ });
    await expect(smsCheckbox).toHaveAttribute("aria-checked", "false");
    await userEvent.click(canvas.getByText("SMS"));
    await expect(smsCheckbox).toHaveAttribute("aria-checked", "true");
  },
};
