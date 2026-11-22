import { Banner, Button } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Banner> = {
  title: "Banner",
  component: Banner,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    variant: "info",
    title: "Scheduled maintenance",
    children:
      "Services will be read-only on Sunday between 02:00 and 04:00 UTC.",
    action: (
      <Button variant="secondary" size="small">
        Status page
      </Button>
    ),
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Banner variant="info" title="New release available">
        Refresh the page to load the latest workspace improvements.
      </Banner>
      <Banner variant="success" title="Migration complete">
        All projects are now running on the updated infrastructure.
      </Banner>
      <Banner variant="warning" title="Storage almost full">
        You have used 90% of your workspace storage allocation.
      </Banner>
      <Banner variant="danger" title="Service disruption">
        Background sync is currently degraded. Our team is investigating.
      </Banner>
    </div>
  ),
};

function DismissibleBannerDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <Banner
      variant="info"
      title="Cookie preferences updated"
      onDismiss={() => setVisible(false)}
    >
      Your workspace privacy settings have been saved.
    </Banner>
  );
}

export const DismissibleInteraction: Story = {
  render: () => <DismissibleBannerDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Cookie preferences updated"),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(
      canvas.queryByText("Cookie preferences updated"),
    ).not.toBeInTheDocument();
  },
};
