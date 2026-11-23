import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ErrorBoundary } from "./error-boundary.js";

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("boom");
  }
  return <div>ok</div>;
}

function ResetKeysHarness() {
  const [shouldThrow, setShouldThrow] = useState(true);
  return (
    <div>
      <button type="button" onClick={() => setShouldThrow(false)}>
        fix
      </button>
      <ErrorBoundary resetKeys={[shouldThrow]}>
        <Bomb shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}

function RetryHarness() {
  const [shouldThrow, setShouldThrow] = useState(true);
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div>
          <p>message: {error.message}</p>
          <button
            type="button"
            onClick={() => {
              setShouldThrow(false);
              reset();
            }}
          >
            retry
          </button>
        </div>
      )}
    >
      <Bomb shouldThrow={shouldThrow} />
    </ErrorBoundary>
  );
}

describe("ErrorBoundary", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("ok")).toBeTruthy();
  });

  it("renders the default fallback with the error message when a child throws", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Something went wrong")).toBeTruthy();
    expect(screen.getByText("boom")).toBeTruthy();
  });

  it("renders a custom fallback node instead of the default", () => {
    render(
      <ErrorBoundary fallback={<div>custom fallback</div>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("custom fallback")).toBeTruthy();
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });

  it("calls a function fallback with error and reset, and recovers on retry", async () => {
    const user = userEvent.setup();
    render(<RetryHarness />);

    expect(screen.getByText("message: boom")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "retry" }));
    expect(screen.getByText("ok")).toBeTruthy();
  });

  it("calls onError with the thrown error", () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0]?.[0].message).toBe("boom");
  });

  it("automatically resets when resetKeys change", async () => {
    const user = userEvent.setup();
    render(<ResetKeysHarness />);
    expect(screen.getByText("Something went wrong")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "fix" }));
    expect(screen.getByText("ok")).toBeTruthy();
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });

  it("has no automatically detectable accessibility violations in the default fallback", async () => {
    const { container } = render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
