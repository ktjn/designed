import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../button/button.js";
import { ButtonGroup } from "./button-group.js";

describe("ButtonGroup", () => {
  it("renders an accessible group with orientation and data-slot", () => {
    render(
      <ButtonGroup orientation="vertical" aria-label="Zoom controls">
        <Button variant="secondary">Zoom in</Button>
        <Button variant="secondary">Zoom out</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole("group", { name: "Zoom controls" });
    expect(group.getAttribute("data-slot")).toBe("button-group");
    expect(group.getAttribute("data-orientation")).toBe("vertical");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ButtonGroup aria-label="Text alignment">
        <Button variant="secondary">Left</Button>
        <Button variant="secondary">Center</Button>
        <Button variant="secondary">Right</Button>
      </ButtonGroup>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
