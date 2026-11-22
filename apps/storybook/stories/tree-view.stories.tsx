import { TreeView, type TreeViewNode } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof TreeView> = {
  title: "TreeView",
  component: TreeView,
};

export default meta;
type Story = StoryObj<typeof TreeView>;

const FILES: TreeViewNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "index", label: "index.ts" },
      {
        id: "components",
        label: "components",
        children: [{ id: "button", label: "button.tsx" }],
      },
    ],
  },
  { id: "readme", label: "README.md" },
  { id: "package", label: "package.json" },
];

export const Default: Story = {
  render: () => <TreeView items={FILES} aria-label="Project files" />,
};

export const ExpandAndSelectInteraction: Story = {
  render: () => <TreeView items={FILES} aria-label="Project files" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("src"));
    const indexItem = canvas.getByText("index.ts");
    await expect(indexItem).toBeTruthy();

    await userEvent.click(canvas.getByText("README.md"));
    await expect(
      canvas.getByText("README.md").closest('[role="treeitem"]'),
    ).toHaveAttribute("aria-selected", "true");
  },
};

export const LazyLoadingInteraction: Story = {
  render: () => (
    <TreeView
      items={[{ id: "remote", label: "Remote folder", hasChildren: true }]}
      onLoadChildren={() => {
        // In a real app this would fetch and then call onExpandedChange /
        // setState with the loaded children.
      }}
      aria-label="Remote files"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByText("Remote folder").closest('[role="treeitem"]');
    await userEvent.click(canvas.getByText("Remote folder"));
    await expect(item).toHaveAttribute("aria-expanded", "true");
  },
};
