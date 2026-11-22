import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field";
import { SearchInput } from "./search-input";

describe("SearchInput", () => {
  it("reports typed value and shows a clear button once there is text", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SearchInput aria-label="Search" onValueChange={onValueChange} />);

    const input = screen.getByRole("searchbox", { name: "Search" });
    expect(screen.queryByRole("button")).toBeNull();

    await user.type(input, "hello");
    expect(onValueChange).toHaveBeenLastCalledWith("hello");
    expect(screen.getByRole("button", { name: "Clear search" })).toBeTruthy();
  });

  it("clears the value when the clear button is clicked and calls onClear", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(
      <SearchInput
        aria-label="Search"
        defaultValue="hello"
        onClear={onClear}
      />,
    );
    const input = screen.getByRole("searchbox", {
      name: "Search",
    }) as HTMLInputElement;
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input.value).toBe("");
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("clears the value on Escape", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(
      <SearchInput
        aria-label="Search"
        defaultValue="hello"
        onClear={onClear}
      />,
    );
    const input = screen.getByRole("searchbox", {
      name: "Search",
    }) as HTMLInputElement;
    input.focus();
    await user.keyboard("{Escape}");
    expect(input.value).toBe("");
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("reflects invalid state from Field context", () => {
    render(
      <Field invalid>
        <Field.Label>Search</Field.Label>
        <SearchInput />
      </Field>,
    );
    expect(
      screen
        .getByRole("searchbox", { name: "Search" })
        .getAttribute("aria-invalid"),
    ).toBe("true");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <SearchInput aria-label="Search" defaultValue="hello" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
