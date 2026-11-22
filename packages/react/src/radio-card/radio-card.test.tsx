import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { RadioGroup } from "../radio-group/radio-group";
import { RadioCard } from "./radio-card";

describe("RadioCard", () => {
  it("renders the label and description and selects the card on click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <RadioCard value="basic" label="Basic" description="For individuals" />
        <RadioCard value="pro" label="Pro" description="For teams" />
      </RadioGroup>,
    );
    expect(screen.getByText("For individuals")).toBeTruthy();
    await user.click(screen.getByText("Pro"));
    expect(onValueChange).toHaveBeenCalledWith("pro", expect.anything());
  });

  it("respects defaultValue on RadioGroup", () => {
    render(
      <RadioGroup defaultValue="pro">
        <RadioCard value="basic" label="Basic" />
        <RadioCard value="pro" label="Pro" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]?.getAttribute("aria-checked")).toBe("false");
    expect(radios[1]?.getAttribute("aria-checked")).toBe("true");
  });

  it("does not select when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup defaultValue="basic" onValueChange={onValueChange}>
        <RadioCard value="basic" label="Basic" />
        <RadioCard value="pro" label="Pro" disabled />
      </RadioGroup>,
    );
    await user.click(screen.getByText("Pro"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not select when parent RadioGroup is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup disabled onValueChange={onValueChange}>
        <RadioCard value="basic" label="Basic" description={0} />
        <RadioCard value="pro" label="Pro" />
      </RadioGroup>,
    );
    expect(screen.getByText("0")).toBeTruthy();
    await user.click(screen.getByText("Pro"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("forwards ref to the label element", () => {
    const ref = createRef<HTMLLabelElement>();
    render(
      <RadioGroup>
        <RadioCard ref={ref} value="basic" label="Basic" />
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <RadioGroup>
        <RadioCard value="basic" label="Basic" />
        <RadioCard value="pro" label="Pro" />
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
