import { Collapsible } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Collapsible> = {
  title: "Collapsible",
  component: Collapsible,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible>
      <Collapsible.Trigger>Show advanced options</Collapsible.Trigger>
      <Collapsible.Panel>
        Configure custom cache TTL, webhook retries, and telemetry sampling.
      </Collapsible.Panel>
    </Collapsible>
  ),
};

export const ToggleInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", {
      name: "Show advanced options",
    });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(
      canvas.getByText(/Configure custom cache TTL/),
    ).toBeInTheDocument();
  },
};
