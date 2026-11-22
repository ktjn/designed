import { PasswordInput } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof PasswordInput> = {
  title: "PasswordInput",
  component: PasswordInput,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  render: () => <PasswordInput aria-label="Password" defaultValue="secret" />,
};

export const ToggleVisibilityInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
    await userEvent.click(
      canvas.getByRole("button", { name: "Show password" }),
    );
    expect(input.type).toBe("text");
  },
};
