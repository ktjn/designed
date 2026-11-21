import { ScrollArea } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ScrollArea> = {
  title: "ScrollArea",
  component: ScrollArea,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const ITEMS = Array.from({ length: 16 }, (_, idx) => ({
  id: `entry-${idx + 1}`,
  text: `Release note entry ${idx + 1} — improved keyboard accessibility and token coverage.`,
}));

export const Default: Story = {
  render: () => (
    <ScrollArea maxHeight={180} aria-label="Release notes">
      <div
        style={{
          display: "grid",
          gap: "0.5rem",
          fontFamily: "var(--ds-font-family-base)",
          fontSize: "var(--ds-font-size-100)",
        }}
      >
        {ITEMS.map((item) => (
          <p key={item.id} style={{ margin: 0 }}>
            {item.text}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};
