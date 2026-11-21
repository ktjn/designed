import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Collapsible } from "./collapsible.js";

describe("Collapsible", () => {
  it("toggles panel visibility and notifies onOpenChange", () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Show details</Collapsible.Trigger>
        <Collapsible.Panel>Extra information</Collapsible.Panel>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Show details" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("Extra information")).toBeNull();

    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Extra information")).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders open by default and has no axe violations", async () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <Collapsible.Trigger>Release notes</Collapsible.Trigger>
        <Collapsible.Panel>Added keyboard navigation.</Collapsible.Panel>
      </Collapsible>,
    );

    expect(screen.getByText("Added keyboard navigation.")).toBeTruthy();
    expect(await axe(container)).toHaveNoViolations();
  });
});
