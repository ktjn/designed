import * as icons from "@ktjn/designed-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Icons",
};

export default meta;
type Story = StoryObj;

const iconEntries = Object.entries(icons).sort(([first], [second]) =>
  first.localeCompare(second),
);

export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
        gap: "0.75rem",
        fontFamily: "var(--ds-font-family-base)",
        fontSize: "var(--ds-font-size-100)",
        color: "var(--ds-color-foreground-default)",
      }}
    >
      {iconEntries.map(([name, Icon]) => (
        <div
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            border: "1px solid var(--ds-color-border-default)",
            borderRadius: "var(--ds-radius-control)",
          }}
        >
          <Icon aria-hidden style={{ width: "1rem", height: "1rem" }} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
