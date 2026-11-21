import { Tabs } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Tabs> = {
  title: "Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="password">Password</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="account">Account settings</Tabs.Panel>
      <Tabs.Panel value="password">Password settings</Tabs.Panel>
    </Tabs>
  ),
};

export const SwitchInteraction: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="password">Password</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="account">Account settings</Tabs.Panel>
      <Tabs.Panel value="password">Password settings</Tabs.Panel>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Password" }));
    await expect(canvas.getByText("Password settings")).toBeInTheDocument();
  },
};
