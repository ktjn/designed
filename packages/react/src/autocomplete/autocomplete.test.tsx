import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field";
import { Autocomplete } from "./autocomplete";

describe("Autocomplete", () => {
  it("renders an accessible input wired to Field context", () => {
    render(
      <Field invalid>
        <Field.Label>Tag</Field.Label>
        <Autocomplete
          items={["react", "tokens", "icons"]}
          placeholder="Type a tag"
        />
        <Field.Error>Enter a tag.</Field.Error>
      </Field>,
    );
    const input = screen.getByRole("combobox", { name: "Tag" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Field>
        <Field.Label>Framework</Field.Label>
        <Autocomplete items={["React", "Vue", "Svelte"]} />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
