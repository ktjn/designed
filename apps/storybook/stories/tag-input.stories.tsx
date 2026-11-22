import { Field, TagInput } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof TagInput> = {
  title: "TagInput",
  component: TagInput,
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: () => (
    <TagInput aria-label="Tags" defaultValue={["react", "typescript"]} />
  ),
};

export const WithSuggestions: Story = {
  render: () => (
    <TagInput
      aria-label="Skills"
      defaultValue={["react"]}
      suggestions={["typescript", "javascript", "css", "html", "graphql"]}
    />
  ),
};

export const WithField: Story = {
  render: () => (
    <Field>
      <Field.Label>Email recipients</Field.Label>
      <TagInput
        defaultValue={["ada@example.com"]}
        delimiters={[",", " "]}
        maxTags={5}
      />
      <Field.Description>
        Press Enter, comma, or space to add a recipient.
      </Field.Description>
    </Field>
  ),
};

export const TagCreationInteraction: Story = {
  render: () => <TagInput aria-label="Tags" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Tags" });

    await userEvent.type(input, "react{Enter}");
    await expect(canvas.getByText("react")).toBeInTheDocument();

    await userEvent.type(input, "typescript,");
    await expect(canvas.getByText("typescript")).toBeInTheDocument();

    await userEvent.keyboard("{Backspace}");
    await expect(canvas.queryByText("typescript")).not.toBeInTheDocument();
  },
};
