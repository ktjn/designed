import { Resizable } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Resizable> = {
  title: "Resizable",
  component: Resizable,
};

export default meta;
type Story = StoryObj<typeof Resizable>;

const frameStyle = {
  blockSize: "16rem",
  border: "1px solid var(--ds-color-border-default)",
  borderRadius: "var(--ds-radius-surface)",
  overflow: "hidden",
};

const panelBodyStyle = {
  padding: "1rem",
};

export const Default: Story = {
  render: () => (
    <div style={frameStyle}>
      <Resizable>
        <Resizable.Panel defaultSize={40}>
          <div style={panelBodyStyle}>Sidebar panel</div>
        </Resizable.Panel>
        <Resizable.Handle withHandle aria-label="Resize sidebar" />
        <Resizable.Panel defaultSize={60}>
          <div style={panelBodyStyle}>Main content panel</div>
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={frameStyle}>
      <Resizable orientation="vertical">
        <Resizable.Panel defaultSize={50}>
          <div style={panelBodyStyle}>Editor pane</div>
        </Resizable.Panel>
        <Resizable.Handle withHandle aria-label="Resize editor and terminal" />
        <Resizable.Panel defaultSize={50}>
          <div style={panelBodyStyle}>Terminal pane</div>
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <div style={frameStyle}>
      <Resizable>
        <Resizable.Panel defaultSize={30} minSize={15} collapsible>
          <div style={panelBodyStyle}>Collapsible navigation</div>
        </Resizable.Panel>
        <Resizable.Handle withHandle aria-label="Resize navigation" />
        <Resizable.Panel defaultSize={70}>
          <div style={panelBodyStyle}>Document workspace</div>
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
};

export const KeyboardResizeInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separator = canvas.getByRole("separator", {
      name: "Resize sidebar",
    });
    const before = Number(separator.getAttribute("aria-valuenow"));
    separator.focus();
    await userEvent.keyboard("{ArrowRight}");
    const after = Number(separator.getAttribute("aria-valuenow"));
    await expect(after).toBeGreaterThan(before);
  },
};
