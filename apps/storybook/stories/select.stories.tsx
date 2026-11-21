import { Field, Select } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { expectEventuallyRemoved } from "./utils/expect-removed";

const meta: Meta<typeof Select> = {
  title: "Select",
  component: Select,
  // Select.Trigger is width: 100% by design; constrain the canvas so the
  // story reflects realistic usage instead of stretching full-bleed.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

const items = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

export const Default: Story = {
  render: () => (
    <Select items={items}>
      {/* aria-label is required: a combobox's accessible name comes from a
          label mechanism, not its content (the content is the current
          *value*, not a label) -- same reason native <select> needs an
          associated <label>. Found via a real-browser axe check flagging
          "Buttons must have discernible text" even though the trigger
          visibly showed placeholder text. */}
      <Select.Trigger aria-label="Plan">
        <Select.Value placeholder="Choose a plan" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="basic">Basic</Select.Item>
        <Select.Item value="pro">Pro</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field invalid>
      <Field.Label>Plan</Field.Label>
      <Select items={items}>
        <Select.Trigger>
          <Select.Value placeholder="Choose a plan" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="basic">Basic</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select.Content>
      </Select>
      <Field.Error>Choose a plan to continue.</Field.Error>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", {
      name: "Plan",
    });
    await expect(getComputedStyle(trigger).borderTopColor).toBe(
      "rgb(220, 38, 38)",
    );
  },
};

export const SelectInteraction: Story = {
  render: () => {
    const onValueChange = fn();
    return (
      <Select items={items} onValueChange={onValueChange}>
        <Select.Trigger aria-label="Plan">
          <Select.Value placeholder="Choose a plan" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="basic">Basic</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select.Content>
      </Select>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);
    const listbox = await within(document.body).findByRole("listbox");
    await userEvent.click(within(listbox).getByText("Pro"));
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("listbox"),
    );
    // items={items} makes Select.Value render the item's label ("Pro"), not
    // the raw value ("pro") -- verified after a real bug where the trigger
    // showed the raw value with no items map supplied.
    await expect(canvas.getByText("Pro")).toBeInTheDocument();
    await userEvent.click(trigger);
    const selected = await within(document.body).findByRole("option", {
      selected: true,
    });
    await userEvent.hover(selected);
    await expect(selected).toHaveAttribute("data-highlighted");
    await expect(getComputedStyle(selected).outlineStyle).toBe("solid");
    await userEvent.keyboard("{Escape}");
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("listbox"),
    );
  },
};

export const ScopedDarkThemeInteraction: Story = {
  render: () => (
    <div
      data-color-scheme="dark"
      data-testid="dark-panel"
      style={{
        padding: "1rem",
        overflow: "hidden",
        transform: "translateZ(0)",
        background: "var(--ds-color-background-default)",
        color: "var(--ds-color-foreground-default)",
      }}
    >
      <Select items={items} defaultValue="pro">
        <Select.Trigger aria-label="Dark panel plan">
          <Select.Value placeholder="Choose a plan" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="basic">Basic</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select.Content>
      </Select>
      <div
        data-color-scheme="light"
        data-testid="nested-light-panel"
        style={{
          marginTop: "0.75rem",
          padding: "0.75rem",
          background: "var(--ds-color-background-default)",
          color: "var(--ds-color-foreground-default)",
        }}
      >
        Nested light surface
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByTestId("dark-panel");
    const nestedLight = canvas.getByTestId("nested-light-panel");
    await expect(getComputedStyle(nestedLight).backgroundColor).toBe(
      "rgb(255, 255, 255)",
    );
    const trigger = canvas.getByRole("combobox", { name: "Dark panel plan" });
    await userEvent.click(trigger);
    const popup = (await within(document.body).findByRole("listbox")).closest(
      '[data-slot="select-content"]',
    ) as HTMLElement;
    await expect(panel.contains(popup)).toBe(false);
    await expect(getComputedStyle(popup).backgroundColor).toBe(
      getComputedStyle(panel).backgroundColor,
    );
    await userEvent.keyboard("{Escape}");
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("listbox"),
    );
  },
};
