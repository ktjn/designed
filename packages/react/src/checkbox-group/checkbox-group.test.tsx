import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "../checkbox/checkbox";
import { Field } from "../field/field";
import { CheckboxGroup } from "./checkbox-group";

function SelectAll() {
  return (
    <CheckboxGroup defaultValue={["apple"]} allValues={["apple", "banana"]}>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox parent /> All fruits
      </label>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox value="apple" /> Apple
      </label>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
      <label>
        <Checkbox value="banana" /> Banana
      </label>
    </CheckboxGroup>
  );
}

describe("CheckboxGroup", () => {
  it("shares controlled value across member checkboxes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup value={["apple"]} onValueChange={onValueChange}>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
        <label>
          <Checkbox value="apple" /> Apple
        </label>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
        <label>
          <Checkbox value="banana" /> Banana
        </label>
      </CheckboxGroup>,
    );
    const [apple, banana] = screen.getAllByRole("checkbox");
    expect(apple).toHaveProperty("ariaChecked", "true");
    expect(banana).toHaveProperty("ariaChecked", "false");

    await user.click(banana as HTMLElement);
    expect(onValueChange).toHaveBeenCalledWith(
      ["apple", "banana"],
      expect.anything(),
    );
  });

  it("drives an indeterminate parent select-all checkbox via allValues", async () => {
    const user = userEvent.setup();
    render(<SelectAll />);
    const [parent, , banana] = screen.getAllByRole("checkbox");
    expect(parent?.hasAttribute("data-indeterminate")).toBe(true);

    await user.click(banana as HTMLElement);
    expect(parent?.hasAttribute("data-indeterminate")).toBe(false);
    expect(parent).toHaveProperty("ariaChecked", "true");
  });

  it("disables every member checkbox when disabled", () => {
    render(
      <CheckboxGroup disabled>
        <Checkbox value="apple" aria-label="Apple" />
        <Checkbox value="banana" aria-label="Banana" />
      </CheckboxGroup>,
    );
    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).toHaveProperty("ariaDisabled", "true");
    }
  });

  it("inherits disabled from Field context", () => {
    render(
      <Field disabled>
        <CheckboxGroup>
          <Checkbox value="apple" aria-label="Apple" />
        </CheckboxGroup>
      </Field>,
    );
    expect(screen.getByRole("checkbox")).toHaveProperty("ariaDisabled", "true");
  });

  it("applies the horizontal orientation as a data attribute", () => {
    render(
      <CheckboxGroup orientation="horizontal">
        <Checkbox value="apple" aria-label="Apple" />
      </CheckboxGroup>,
    );
    expect(
      screen.getByRole("checkbox").closest('[data-slot="checkbox-group"]'),
    ).toHaveProperty("dataset.orientation", "horizontal");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <CheckboxGroup>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
        <label>
          <Checkbox value="apple" /> Apple
        </label>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: BaseCheckbox.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test below. */}
        <label>
          <Checkbox value="banana" /> Banana
        </label>
      </CheckboxGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
