import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Input } from "../input/input";
import { Fieldset } from "./fieldset";

describe("Fieldset", () => {
  it("groups controls under a semantic legend", () => {
    render(
      <Fieldset>
        <Fieldset.Legend>Billing details</Fieldset.Legend>
        <Input aria-label="Company" />
      </Fieldset>,
    );
    expect(screen.getByRole("group", { name: "Billing details" })).toBeTruthy();
  });

  it("propagates disabled state to child controls", () => {
    render(
      <Fieldset disabled>
        <Fieldset.Legend>Locked section</Fieldset.Legend>
        <Input aria-label="Account ID" />
      </Fieldset>,
    );
    const group = screen.getByRole("group", { name: "Locked section" });
    const input = screen.getByRole("textbox", { name: "Account ID" });
    expect((group as HTMLFieldSetElement).disabled).toBe(true);
    expect(input.matches(":disabled")).toBe(true);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Fieldset>
        <Fieldset.Legend>Contact</Fieldset.Legend>
        <Input aria-label="Email" />
      </Fieldset>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
