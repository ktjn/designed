import { Tag } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Tag> = {
  title: "Tag",
  component: Tag,
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      <Tag variant="neutral">Neutral</Tag>
      <Tag variant="info">Info</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="danger">Danger</Tag>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Tag size="small">Small</Tag>
      <Tag size="medium">Medium</Tag>
      <Tag size="large">Large</Tag>
    </div>
  ),
};

function RemovableTagsDemo() {
  const [tags, setTags] = useState(["Design Tokens", "Accessibility", "React"]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          variant="info"
          removeLabel={`Remove ${tag}`}
          onRemove={() =>
            setTags((prev) => prev.filter((item) => item !== tag))
          }
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}

export const RemovableInteraction: Story = {
  render: () => <RemovableTagsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove Accessibility" }),
    );
    await expect(canvas.queryByText("Accessibility")).not.toBeInTheDocument();
  },
};
