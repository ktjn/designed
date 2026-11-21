import { Stepper } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Stepper> = {
  title: "Stepper",
  component: Stepper,
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const STEPS = [
  { id: "account", label: "Account", description: "Email and password" },
  { id: "workspace", label: "Workspace", description: "Team and brand" },
  { id: "review", label: "Review", description: "Confirm and launch" },
];

export const Horizontal: Story = {
  render: () => (
    <Stepper steps={STEPS} currentStep={1} aria-label="Setup steps" />
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stepper
      steps={STEPS}
      currentStep={2}
      orientation="vertical"
      aria-label="Vertical setup steps"
    />
  ),
};
