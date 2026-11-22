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

  it("accepts object items with a custom renderItem and null filter", () => {
    const frameworks = [
      { id: "react", label: "React" },
      { id: "vue", label: "Vue" },
    ];
    render(
      <Field>
        <Field.Label>Framework</Field.Label>
        <Autocomplete
          items={frameworks}
          filter={null}
          itemToStringValue={(item) => item.id}
          renderItem={(item) => <em>{item.label}</em>}
        />
      </Field>,
    );
    expect(screen.getByRole("combobox", { name: "Framework" })).toBeTruthy();
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
