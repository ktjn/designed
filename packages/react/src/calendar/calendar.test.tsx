import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Calendar } from "./calendar";

describe("Calendar", () => {
  it("selects a date and emits an ISO YYYY-MM-DD string", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar defaultValue="2026-05-15" onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole("button", { name: /2026-05-20/ }));
    expect(onValueChange).toHaveBeenCalledWith("2026-05-20");
  });

  it("navigates months and respects min/max bounds", async () => {
    const user = userEvent.setup();
    render(
      <Calendar defaultValue="2026-05-15" min="2026-05-10" max="2026-05-20" />,
    );

    const beforeMin = screen.getByRole("button", {
      name: /2026-05-09/,
    }) as HTMLButtonElement;
    expect(beforeMin.disabled).toBe(true);

    await user.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByRole("button", { name: /2026-06-01/ })).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Calendar defaultValue="2026-05-15" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
