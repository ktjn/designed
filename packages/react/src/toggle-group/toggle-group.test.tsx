import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Toggle } from "../toggle/toggle";
import { ToggleGroup } from "./toggle-group";

describe("ToggleGroup", () => {
  it("manages single selection by default", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        aria-label="Text alignment"
        defaultValue={["left"]}
        onValueChange={onValueChange}
      >
        <Toggle value="left">Left</Toggle>
        <Toggle value="center">Center</Toggle>
        <Toggle value="right">Right</Toggle>
      </ToggleGroup>,
    );

    const left = screen.getByRole("button", { name: "Left" });
    const center = screen.getByRole("button", { name: "Center" });
    expect(left.getAttribute("aria-pressed")).toBe("true");
    expect(center.getAttribute("aria-pressed")).toBe("false");

    await user.click(center);
    expect(onValueChange).toHaveBeenCalledWith(["center"]);
    expect(left.getAttribute("aria-pressed")).toBe("false");
    expect(center.getAttribute("aria-pressed")).toBe("true");
  });

  it("supports multiple selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        aria-label="Text formatting"
        multiple
        defaultValue={["bold"]}
        onValueChange={onValueChange}
      >
        <Toggle value="bold">Bold</Toggle>
        <Toggle value="italic">Italic</Toggle>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Italic" }));
    expect(onValueChange).toHaveBeenCalledWith(["bold", "italic"]);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <ToggleGroup aria-label="View mode" defaultValue={["list"]}>
        <Toggle value="list">List</Toggle>
        <Toggle value="grid">Grid</Toggle>
      </ToggleGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
