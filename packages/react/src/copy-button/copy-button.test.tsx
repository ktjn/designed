import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CopyButton } from "./copy-button";

describe("CopyButton", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("copies the given string value and shows transient feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    const onCopy = vi.fn();

    render(<CopyButton value="hello" onCopy={onCopy} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("hello");
    expect(onCopy).toHaveBeenCalledWith("hello");
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();

    await vi.advanceTimersByTimeAsync(2000);
    expect(await screen.findByRole("button", { name: "Copy" })).toBeTruthy();
  });

  it("resolves a function value lazily at click time", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    const getValue = vi.fn(() => "lazy-value");

    render(<CopyButton value={getValue} />);
    expect(getValue).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("lazy-value");
  });

  it("shows and announces a failed copy and allows retry", async () => {
    const user = userEvent.setup();
    const error = new Error("denied");
    const writeText = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    const onError = vi.fn();

    render(<CopyButton value="hello" onError={onError} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(error));
    const retry = screen.getByRole("button", { name: "Copy failed" });
    expect(retry.getAttribute("data-state")).toBe("error");
    expect(screen.getByRole("status").textContent).toBe("Copy failed");

    await user.click(retry);
    const copied = screen.getByRole("button", { name: "Copied" });
    expect(copied.getAttribute("data-state")).toBe("copied");
    expect(screen.getByRole("status").textContent).toBe("Copied");
  });

  it("keeps the latest result when an earlier copy finishes late", async () => {
    const user = userEvent.setup();
    const error = new Error("denied");
    const firstCopy = new Promise<void>((_, reject) => {
      setTimeout(() => reject(error), 1000);
    });
    const writeText = vi
      .fn()
      .mockReturnValueOnce(firstCopy)
      .mockResolvedValueOnce(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    const onError = vi.fn();

    render(<CopyButton value="hello" onError={onError} />);
    const copy = screen.getByRole("button", { name: "Copy" });
    await user.click(copy);
    await user.click(copy);
    await act(() => vi.advanceTimersByTimeAsync(1000));

    expect(onError).toHaveBeenCalledWith(error);
    expect(screen.getByRole("status").textContent).toBe("Copied");
  });

  it("clears custom failure feedback after the configured duration", async () => {
    const user = userEvent.setup();
    const error = new Error("Value unavailable");
    const getValue = vi.fn(() => {
      throw error;
    });
    const onError = vi.fn();

    render(
      <CopyButton
        value={getValue}
        errorLabel="Try copying again"
        copiedDuration={1000}
        onError={onError}
        data-state="consumer-state"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(onError).toHaveBeenCalledWith(error);
    expect(screen.getByRole("status").textContent).toBe("Try copying again");

    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(screen.getByRole("status").textContent).toBe("");
    const copy = screen.getByRole("button", { name: "Copy" });
    expect(copy.getAttribute("data-state")).toBe("consumer-state");
  });

  it.each(["xs", "sm"] as const)(
    "uses an accessible icon-only control at size %s",
    async (size) => {
      const user = userEvent.setup();
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

      render(
        <CopyButton value="trace-123" label="Copy trace ID" size={size} />,
      );
      const button = screen.getByRole("button", { name: "Copy trace ID" });
      expect(button.textContent).toBe("");

      await user.click(button);
      expect(writeText).toHaveBeenCalledWith("trace-123");
      expect(screen.getByRole("button", { name: "Copied" })).toBe(button);
      expect(button.textContent).toBe("");
      expect(screen.getByRole("status").textContent).toBe("Copied");
    },
  );

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<CopyButton value="hello" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
