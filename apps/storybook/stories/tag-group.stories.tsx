import { TagGroup } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof TagGroup> = {
  title: "TagGroup",
  component: TagGroup,
};

export default meta;
type Story = StoryObj<typeof TagGroup>;

function RemovableTagsDemo() {
  const [tags, setTags] = useState(["React", "TypeScript", "CSS"]);

  return (
    <TagGroup
      aria-label="Selected technologies"
      onRemove={(value) =>
        setTags((prev) => prev.filter((item) => item !== value))
      }
    >
      {tags.map((tag) => (
        <TagGroup.Item key={tag} value={tag}>
          {tag}
        </TagGroup.Item>
      ))}
    </TagGroup>
  );
}

export const Default: Story = {
  render: () => <RemovableTagsDemo />,
};

export const Variants: Story = {
  render: () => (
    <TagGroup aria-label="Status tags">
      <TagGroup.Item value="info" variant="info" removable={false}>
        Info
      </TagGroup.Item>
      <TagGroup.Item value="success" variant="success" removable={false}>
        Success
      </TagGroup.Item>
      <TagGroup.Item value="warning" variant="warning" removable={false}>
        Warning
      </TagGroup.Item>
      <TagGroup.Item value="danger" variant="danger" removable={false}>
        Danger
      </TagGroup.Item>
    </TagGroup>
  ),
};

export const RemovalInteraction: Story = {
  render: () => <RemovableTagsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const removeReact = canvas.getByRole("button", { name: "Remove React" });

    await userEvent.click(removeReact);
    await expect(
      canvas.queryByRole("button", { name: "Remove React" }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Remove TypeScript" }),
    ).toHaveFocus();
  },
};
