import { render, screen } from "@testing-library/react";
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

  it("calls onError when the clipboard write rejects", async () => {
    const user = userEvent.setup();
    const error = new Error("denied");
    const writeText = vi.fn().mockRejectedValue(error);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    const onError = vi.fn();

    render(<CopyButton value="hello" onError={onError} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(error));
    expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<CopyButton value="hello" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
