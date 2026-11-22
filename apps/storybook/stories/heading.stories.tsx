import { Heading, HeadingSection, Stack } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta: Meta<typeof Heading> = {
  title: "Heading",
  component: Heading,
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  render: () => (
    <Stack gap="sm">
      <Heading as="h1">Page title</Heading>
      <Heading as="h2">Section title</Heading>
      <Heading as="h3">Subsection title</Heading>
    </Stack>
  ),
};

export const ContextualLevelsInteraction: Story = {
  render: () => (
    <Stack gap="sm">
      <Heading>Top level</Heading>
      <HeadingSection>
        <Heading>Nested section</Heading>
        <HeadingSection>
          <Heading>Doubly nested section</Heading>
        </HeadingSection>
      </HeadingSection>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 2, name: "Top level" }),
    ).toBeTruthy();
    await expect(
      canvas.getByRole("heading", { level: 3, name: "Nested section" }),
    ).toBeTruthy();
    await expect(
      canvas.getByRole("heading", {
        level: 4,
        name: "Doubly nested section",
      }),
    ).toBeTruthy();
  },
};
