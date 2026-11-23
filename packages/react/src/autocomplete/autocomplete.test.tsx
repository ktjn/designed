import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { I18nProvider } from "../designed-provider/i18n-provider.js";
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

  it("applies the small size class", () => {
    render(<Autocomplete items={["react"]} size="small" aria-label="Tag" />);
    expect(screen.getByRole("combobox").className).toContain("small");
  });

  it("applies the large size class", () => {
    render(<Autocomplete items={["react"]} size="large" aria-label="Tag" />);
    expect(screen.getByRole("combobox").className).toContain("large");
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

  it("uses the empty message from I18nProvider but lets an explicit prop win", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <I18nProvider messages={{ empty: "Aucune suggestion" }}>
        <Autocomplete items={["react"]} aria-label="Tag" />
      </I18nProvider>,
    );
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(await screen.findByText("Aucune suggestion")).toBeTruthy();

    rerender(
      <I18nProvider messages={{ empty: "Aucune suggestion" }}>
        <Autocomplete
          items={["react"]}
          aria-label="Tag"
          emptyMessage="Nothing found"
        />
      </I18nProvider>,
    );
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(await screen.findByText("Nothing found")).toBeTruthy();
  });
});
