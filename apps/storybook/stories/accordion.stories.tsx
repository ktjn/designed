import { Accordion } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Accordion> = {
  title: "Accordion",
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion>
      <Accordion.Item value="a">
        <Accordion.Trigger>Section A</Accordion.Trigger>
        <Accordion.Panel>Content A</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Section B</Accordion.Trigger>
        <Accordion.Panel>Content B</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
};

export const ExpandInteraction: Story = {
  render: () => (
    <Accordion>
      <Accordion.Item value="a">
        <Accordion.Trigger>Section A</Accordion.Trigger>
        <Accordion.Panel>Content A</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Section B</Accordion.Trigger>
        <Accordion.Panel>Content B</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Section A" }));
    await expect(canvas.getByText("Content A")).toBeInTheDocument();
  },
};
