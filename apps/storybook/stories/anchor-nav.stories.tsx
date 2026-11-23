import { AnchorNav } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof AnchorNav> = {
  title: "AnchorNav",
  component: AnchorNav,
};

export default meta;
type Story = StoryObj<typeof AnchorNav>;

function ScrollableDemo() {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <AnchorNav aria-label="On this page" style={{ flex: "0 0 12rem" }}>
        <AnchorNav.List>
          <AnchorNav.Item>
            <AnchorNav.Link href="#introduction">Introduction</AnchorNav.Link>
          </AnchorNav.Item>
          <AnchorNav.Item>
            <AnchorNav.Link href="#installation">Installation</AnchorNav.Link>
            <AnchorNav.List>
              <AnchorNav.Item>
                <AnchorNav.Link href="#npm">npm</AnchorNav.Link>
              </AnchorNav.Item>
              <AnchorNav.Item>
                <AnchorNav.Link href="#pnpm">pnpm</AnchorNav.Link>
              </AnchorNav.Item>
            </AnchorNav.List>
          </AnchorNav.Item>
          <AnchorNav.Item>
            <AnchorNav.Link href="#usage">Usage</AnchorNav.Link>
          </AnchorNav.Item>
          <AnchorNav.Item>
            <AnchorNav.Link href="#faq">FAQ</AnchorNav.Link>
          </AnchorNav.Item>
        </AnchorNav.List>
      </AnchorNav>
      <div style={{ flex: 1 }}>
        <section id="introduction" style={{ minHeight: "60vh" }}>
          <h2>Introduction</h2>
          <p>Overview of the library and its goals.</p>
        </section>
        <section id="installation" style={{ minHeight: "60vh" }}>
          <h2>Installation</h2>
          <section id="npm" style={{ minHeight: "40vh" }}>
            <h3>npm</h3>
            <p>Install via npm.</p>
          </section>
          <section id="pnpm" style={{ minHeight: "40vh" }}>
            <h3>pnpm</h3>
            <p>Install via pnpm.</p>
          </section>
        </section>
        <section id="usage" style={{ minHeight: "60vh" }}>
          <h2>Usage</h2>
          <p>How to use the library in your project.</p>
        </section>
        <section id="faq" style={{ minHeight: "60vh" }}>
          <h2>FAQ</h2>
          <p>Frequently asked questions.</p>
        </section>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <ScrollableDemo />,
};

export const LinkInteraction: Story = {
  render: () => <ScrollableDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const usageLink = canvas.getByRole("link", { name: "Usage" });

    await userEvent.click(usageLink);
    await expect(usageLink).toBeInTheDocument();
  },
};
