import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "./select";

// See ../popover/popover.test.tsx: opening any Base UI floating-positioned
// popup hangs indefinitely under jsdom. Open/close, keyboard-navigation, and
// axe coverage for Select instead lives in Storybook interaction tests
// (apps/storybook/stories/select.stories.tsx).
describe("Select", () => {
  it("renders a closed trigger with a placeholder, without mounting the popup", () => {
    render(
      <Select>
        <Select.Trigger aria-label="Plan">
          <Select.Value placeholder="Choose a plan" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="basic">Basic</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select.Content>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toBeTruthy();
    expect(screen.getByText("Choose a plan")).toBeTruthy();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("renders the selected item's label via items, not its raw value", () => {
    // Regression test: without `items`, Select.Value renders the raw value
    // ("pro") instead of the item's display label ("Pro") -- found via a
    // real-browser Storybook interaction test, not caught by the closed-state
    // test above.
    render(
      <Select
        defaultValue="pro"
        items={[
          { value: "basic", label: "Basic" },
          { value: "pro", label: "Pro" },
        ]}
      >
        <Select.Trigger aria-label="Plan">
          <Select.Value placeholder="Choose a plan" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="basic">Basic</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select.Content>
      </Select>,
    );
    expect(screen.getByText("Pro")).toBeTruthy();
    expect(screen.queryByText("pro")).toBeNull();
  });
});
