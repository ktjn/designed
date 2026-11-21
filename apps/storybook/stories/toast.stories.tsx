import { Button, Toast, useToast } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta = {
  title: "Toast",
};

export default meta;
type Story = StoryObj;

function ToastTrigger() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Changes saved",
          description: "Your settings were synced.",
          variant: "success",
        })
      }
    >
      Show toast
    </Button>
  );
}

export const Default: Story = {
  render: () => (
    <Toast.Provider>
      <ToastTrigger />
    </Toast.Provider>
  ),
};

export const ShowAndDismissInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Show toast" }));
    await expect(
      await within(document.body).findByText("Changes saved"),
    ).toBeInTheDocument();
    await userEvent.click(
      within(document.body).getByRole("button", { name: "Dismiss" }),
    );
  },
};
