import { TruncatedText } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof TruncatedText> = {
  title: "TruncatedText",
  component: TruncatedText,
};

export default meta;
type Story = StoryObj<typeof TruncatedText>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 160 }}>
      <TruncatedText>
        This is a long label that does not fit in the available space.
      </TruncatedText>
    </div>
  ),
};

export const TooltipOnOverflowInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText(
      "This is a long label that does not fit in the available space.",
    );
    await userEvent.hover(label);
    await expect(
      await within(document.body).findByRole("tooltip"),
    ).toBeTruthy();
  },
};

export const MultiLineClamp: Story = {
  render: () => (
    <div style={{ maxWidth: 160 }}>
      <TruncatedText lines={2}>
        This is a longer label that clamps after two lines instead of one,
        revealing the remainder via a tooltip when it overflows.
      </TruncatedText>
    </div>
  ),
};
