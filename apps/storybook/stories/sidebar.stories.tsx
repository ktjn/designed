import { CalendarIcon, InfoIcon, SearchIcon } from "@ktjn/design-icons";
import { Card, Sidebar, Stack } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Sidebar> = {
  title: "Sidebar",
  component: Sidebar,
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <div style={{ border: "1px solid var(--ds-color-border-default)" }}>
      <Sidebar.Provider defaultOpen>
        <Sidebar aria-label="Workspace navigation">
          <Sidebar.Header>Acme Studio</Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
              <Sidebar.Item
                href="#overview"
                active
                icon={<InfoIcon aria-hidden />}
              >
                Overview
              </Sidebar.Item>
              <Sidebar.Item href="#search" icon={<SearchIcon aria-hidden />}>
                Search
              </Sidebar.Item>
              <Sidebar.Item
                href="#schedule"
                icon={<CalendarIcon aria-hidden />}
              >
                Schedule
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>Plan: Pro</Sidebar.Footer>
        </Sidebar>
        <Sidebar.Inset>
          <div style={{ padding: "1rem" }}>
            <Stack gap="md">
              <Stack direction="horizontal" align="center" gap="md">
                <Sidebar.Trigger />
                <strong>Workspace Dashboard</strong>
              </Stack>
              <Card>
                <Card.Header>
                  <Card.Title>Welcome back</Card.Title>
                  <Card.Description>
                    Collapse or expand the sidebar using the toggle button.
                  </Card.Description>
                </Card.Header>
              </Card>
            </Stack>
          </div>
        </Sidebar.Inset>
      </Sidebar.Provider>
    </div>
  ),
};

export const ToggleCollapseInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Toggle sidebar" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};
