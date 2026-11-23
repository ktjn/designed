import { Tabs, type TabsSize } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Tabs> = {
  title: "Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

function TabsDemo({ size }: { size?: TabsSize }) {
  return (
    <Tabs defaultValue="account">
      <Tabs.List>
        <Tabs.Tab value="account" size={size}>
          Account
        </Tabs.Tab>
        <Tabs.Tab value="password" size={size}>
          Password
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="account">Account settings</Tabs.Panel>
      <Tabs.Panel value="password">Password settings</Tabs.Panel>
    </Tabs>
  );
}

export const Default: Story = {
  render: () => <TabsDemo />,
};

export const SwitchInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Password" }));
    await expect(canvas.getByText("Password settings")).toBeInTheDocument();
  },
};

export const Compact: Story = {
  render: () => <TabsDemo size="small" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const account = canvas.getByRole("tab", { name: "Account" });
    await expect(getComputedStyle(account).fontSize).toBe("11px");
    await expect(account.getBoundingClientRect().height).toBe(28);
    account.focus();
    await userEvent.keyboard("{ArrowRight}{Enter}");
    await expect(canvas.getByRole("tab", { name: "Password" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(
      await canvas.findByRole("tabpanel", { name: "Password" }),
    ).toHaveTextContent("Password settings");
  },
};
