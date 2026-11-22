import { DescriptionList } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof DescriptionList> = {
  title: "DescriptionList",
  component: DescriptionList,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DescriptionList>;

export const Default: Story = {
  render: () => (
    <DescriptionList>
      <DescriptionList.Item term="Plan">Pro</DescriptionList.Item>
      <DescriptionList.Item term="Billing cycle">Annual</DescriptionList.Item>
      <DescriptionList.Item term="Seats">12 of 20 used</DescriptionList.Item>
      <DescriptionList.Item term="Contact">
        team@example.com
      </DescriptionList.Item>
    </DescriptionList>
  ),
};
