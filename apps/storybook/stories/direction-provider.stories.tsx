import { DirectionProvider, Tabs } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof DirectionProvider> = {
  title: "DirectionProvider",
  component: DirectionProvider,
};

export default meta;
type Story = StoryObj<typeof DirectionProvider>;

export const RightToLeftTabs: Story = {
  render: () => (
    <DirectionProvider direction="rtl" lang="ar">
      <Tabs defaultValue="middle">
        <Tabs.List>
          <Tabs.Tab value="start">البداية</Tabs.Tab>
          <Tabs.Tab value="middle">الوسط</Tabs.Tab>
          <Tabs.Tab value="end">النهاية</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="start">محتوى البداية</Tabs.Panel>
        <Tabs.Panel value="middle">محتوى الوسط</Tabs.Panel>
        <Tabs.Panel value="end">محتوى النهاية</Tabs.Panel>
      </Tabs>
    </DirectionProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "الوسط" }));
    await userEvent.keyboard("{ArrowLeft}");
    await expect(canvas.getByRole("tab", { name: "النهاية" })).toHaveFocus();
  },
};
