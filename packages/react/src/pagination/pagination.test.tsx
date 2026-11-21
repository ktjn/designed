import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("marks current page and fires onPageChange for page, next, and previous", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "2" }).getAttribute("aria-current"),
    ).toBe("page");

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(onPageChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole("button", { name: "5" }));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("disables previous on page 1 and next on last page, and shows ellipsis for large ranges", () => {
    const { rerender } = render(
      <Pagination page={1} totalPages={10} onPageChange={vi.fn()} />,
    );
    expect(
      (screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(screen.getByText("…")).toBeTruthy();

    rerender(<Pagination page={10} totalPages={10} onPageChange={vi.fn()} />);
    expect(
      (screen.getByRole("button", { name: "Next" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Pagination page={4} totalPages={9} onPageChange={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
