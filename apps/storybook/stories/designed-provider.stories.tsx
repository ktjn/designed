import { CloseIcon } from "@ktjn/designed-icons";
import {
  DesignedProvider,
  useI18nMessage,
  useIconOverride,
} from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta: Meta<typeof DesignedProvider> = {
  title: "DesignedProvider",
  component: DesignedProvider,
};

export default meta;
type Story = StoryObj<typeof DesignedProvider>;

function StarIcon() {
  return (
    <svg
      data-testid="override-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 1l2.2 4.9 5.3.6-4 3.7 1.1 5.2L8 12.8l-4.6 2.6 1.1-5.2-4-3.7 5.3-.6z" />
    </svg>
  );
}

function IconDemo() {
  const Icon = useIconOverride("close", CloseIcon);
  return (
    <button type="button" aria-label="Close">
      <Icon aria-hidden />
    </button>
  );
}

function MessageDemo() {
  const label = useI18nMessage("dismiss", undefined, "Dismiss");
  return <span>{label}</span>;
}

export const Default: Story = {
  render: () => (
    <DesignedProvider>
      <IconDemo />
      <MessageDemo />
    </DesignedProvider>
  ),
};

export const IconOverride: Story = {
  render: () => (
    <DesignedProvider icons={{ close: StarIcon }}>
      <IconDemo />
    </DesignedProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("override-icon")).toBeInTheDocument();
  },
};

export const MessageOverride: Story = {
  render: () => (
    <DesignedProvider messages={{ dismiss: "Fermer" }}>
      <MessageDemo />
    </DesignedProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Fermer")).toBeInTheDocument();
  },
};

export const WithCspNonce: Story = {
  render: () => (
    <DesignedProvider cspNonce="demo-nonce-123">
      <IconDemo />
      <MessageDemo />
    </DesignedProvider>
  ),
};
