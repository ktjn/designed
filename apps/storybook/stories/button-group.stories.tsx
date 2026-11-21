import { MinusIcon, PlusIcon } from "@ktjn/design-icons";
import { Button, ButtonGroup, Stack } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ButtonGroup> = {
  title: "ButtonGroup",
  component: ButtonGroup,
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Horizontal: Story = {
  render: () => (
    <ButtonGroup aria-label="View mode">
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  ),
};

export const VerticalIcons: Story = {
  render: () => (
    <Stack align="start">
      <ButtonGroup orientation="vertical" aria-label="Zoom">
        <Button variant="secondary" size="icon" aria-label="Zoom in">
          <PlusIcon aria-hidden />
        </Button>
        <Button variant="secondary" size="icon" aria-label="Zoom out">
          <MinusIcon aria-hidden />
        </Button>
      </ButtonGroup>
    </Stack>
  ),
};
