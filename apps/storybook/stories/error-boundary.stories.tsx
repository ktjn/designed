import { ErrorBoundary } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof ErrorBoundary> = {
  title: "ErrorBoundary",
  component: ErrorBoundary,
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Failed to load widget data.");
  }
  return <div>Widget loaded successfully.</div>;
}

function CaughtErrorDemo() {
  const [shouldThrow, setShouldThrow] = useState(true);
  return (
    <div>
      <button type="button" onClick={() => setShouldThrow(false)}>
        Fix the data source
      </button>
      <ErrorBoundary resetKeys={[shouldThrow]}>
        <Bomb shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ErrorBoundary>
      <div>Everything is fine.</div>
    </ErrorBoundary>
  ),
};

export const CaughtError: Story = {
  render: () => (
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Something went wrong")).toBeInTheDocument();
    await expect(
      canvas.getByText("Failed to load widget data."),
    ).toBeInTheDocument();

    const retryButton = canvas.getByRole("button", { name: "Try again" });
    await userEvent.click(retryButton);
    await expect(canvas.getByText("Something went wrong")).toBeInTheDocument();
  },
};

export const CustomFallback: Story = {
  render: () => (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div>
          <p>Custom fallback: {error.message}</p>
          <button type="button" onClick={reset}>
            Reset
          </button>
        </div>
      )}
    >
      <Bomb shouldThrow={true} />
    </ErrorBoundary>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Custom fallback: Failed to load widget data."),
    ).toBeInTheDocument();
  },
};

export const RecoverAfterFix: Story = {
  render: () => <CaughtErrorDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Something went wrong")).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Fix the data source" }),
    );
    await expect(
      canvas.getByText("Widget loaded successfully."),
    ).toBeInTheDocument();
  },
};
