import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field.js";
import { InputGroup } from "./input-group.js";

describe("InputGroup", () => {
  it("integrates with Field, renders addons, and forwards input events", () => {
    const onChange = vi.fn();
    render(
      <Field invalid>
        <Field.Label>Website</Field.Label>
        <InputGroup>
          <InputGroup.Addon align="start">https://</InputGroup.Addon>
          <InputGroup.Input placeholder="example.com" onChange={onChange} />
          <InputGroup.Addon align="end">.dev</InputGroup.Addon>
        </InputGroup>
        <Field.Error>Enter a valid domain.</Field.Error>
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Website" });
    expect(input.getAttribute("data-slot")).toBe("input-group-input");
    expect(input.getAttribute("aria-invalid")).toBe("true");

    fireEvent.change(input, { target: { value: "ktjn" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText("https://").getAttribute("data-slot")).toBe(
      "input-group-addon",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Field>
        <Field.Label>Price</Field.Label>
        <InputGroup>
          <InputGroup.Addon>$</InputGroup.Addon>
          <InputGroup.Input type="number" defaultValue="49" />
          <InputGroup.Addon align="end">USD</InputGroup.Addon>
        </InputGroup>
      </Field>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
