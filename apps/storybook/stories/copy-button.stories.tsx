import { CopyButton } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof CopyButton> = {
  title: "CopyButton",
  component: CopyButton,
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  render: () => <CopyButton value="npm install @ktjn/designed-react" />,
};

async function checkCopyFeedback(
  canvasElement: HTMLElement,
  writeText: Clipboard["writeText"],
  message: string,
) {
  const canvas = within(canvasElement);
  const originalClipboard = navigator.clipboard;
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  try {
    await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
    await expect(canvas.getByRole("button", { name: message })).toBeVisible();
    await expect(canvas.getByRole("status")).toHaveTextContent(message);
  } finally {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    });
  }
}

export const CopyInteraction: Story = {
  ...Default,
  play: ({ canvasElement }) =>
    checkCopyFeedback(canvasElement, async () => {}, "Copied"),
};

export const CopyErrorInteraction: Story = {
  ...Default,
  play: ({ canvasElement }) =>
    checkCopyFeedback(
      canvasElement,
      async () => {
        throw new DOMException("Clipboard write denied", "NotAllowedError");
      },
      "Copy failed",
    ),
};

export const Compact: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", inlineSize: "12rem" }}>
      <span
        style={{
          flex: "0 1 100%",
          minInlineSize: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        Trace and service identifiers
      </span>
      <CopyButton value="trace-123" size="xs" label="Copy trace ID" />
      <CopyButton value="service-456" size="sm" label="Copy service ID" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const extraSmall = canvas.getByRole("button", { name: "Copy trace ID" });
    const small = canvas.getByRole("button", { name: "Copy service ID" });

    await expect(extraSmall).toHaveStyle({ width: "24px", height: "24px" });
    await expect(small).toHaveStyle({ width: "28px", height: "28px" });
    await expect(extraSmall.querySelector("svg")).toHaveStyle({
      width: "12px",
      height: "12px",
    });
    await expect(small.querySelector("svg")).toHaveStyle({
      width: "14px",
      height: "14px",
    });
  },
};
