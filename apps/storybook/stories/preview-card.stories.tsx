import { PreviewCard } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof PreviewCard> = {
  title: "PreviewCard",
  component: PreviewCard,
};

export default meta;
type Story = StoryObj<typeof PreviewCard>;

export const Default: Story = {
  render: () => (
    <p style={{ fontFamily: "var(--ds-font-family-base)" }}>
      Read the{" "}
      <PreviewCard>
        <PreviewCard.Trigger href="https://example.com" delay={0}>
          design token specification
        </PreviewCard.Trigger>
        <PreviewCard.Content>
          <strong>Design Tokens</strong>
          <p style={{ margin: "0.25rem 0 0" }}>
            W3C DTCG semantic tokens compiled to CSS custom properties.
          </p>
        </PreviewCard.Content>
      </PreviewCard>{" "}
      for theme details.
    </p>
  ),
};

export const HoverInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(
      canvas.getByRole("link", { name: "design token specification" }),
    );
    await expect(
      await within(document.body).findByText(
        /W3C DTCG semantic tokens compiled/,
      ),
    ).toBeInTheDocument();
  },
};
