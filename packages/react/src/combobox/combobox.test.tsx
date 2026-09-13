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
});
