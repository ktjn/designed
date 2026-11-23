import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Combobox } from "./combobox";

// See ../popover/popover.test.tsx: opening any Base UI floating-positioned
// popup hangs indefinitely under jsdom. Open/close, filtering, and axe
// coverage for Combobox instead lives in Storybook interaction tests
// (apps/storybook/stories/combobox.stories.tsx).
describe("Combobox", () => {
  it("renders a closed input without mounting the popup", () => {
    render(
      <Combobox
        items={[
          { value: "basic", label: "Basic" },
          { value: "pro", label: "Pro" },
        ]}
      >
        <Combobox.Input placeholder="Search plans" />
        <Combobox.Content />
      </Combobox>,
    );
    expect(screen.getByPlaceholderText("Search plans")).toBeTruthy();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("accepts disabled items, a null filter, and multiple selection without mounting the popup", () => {
    render(
      <Combobox
        multiple
        defaultValue={["basic"]}
        filter={null}
        items={[
          { value: "basic", label: "Basic" },
          { value: "pro", label: "Pro" },
          { value: "enterprise", label: "Enterprise", disabled: true },
        ]}
      >
        <Combobox.Input placeholder="Search plans" />
        <Combobox.Content
          renderItem={(item) => <strong>{item.label}</strong>}
        />
      </Combobox>,
    );
    expect(screen.getByPlaceholderText("Search plans")).toBeTruthy();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("applies the small size class to the input", () => {
    render(
      <Combobox items={[{ value: "basic", label: "Basic" }]}>
        <Combobox.Input placeholder="Search plans" size="small" />
        <Combobox.Content />
      </Combobox>,
    );
    expect(screen.getByPlaceholderText("Search plans").className).toContain(
      "small",
    );
  });

  it("applies the large size class to the input", () => {
    render(
      <Combobox items={[{ value: "basic", label: "Basic" }]}>
        <Combobox.Input placeholder="Search plans" size="large" />
        <Combobox.Content />
      </Combobox>,
    );
    expect(screen.getByPlaceholderText("Search plans").className).toContain(
      "large",
    );
  });
});
