import { ColorPicker, Field } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof ColorPicker> = {
  title: "ColorPicker",
  component: ColorPicker,
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#2563eb",
  "#9333ea",
];

export const Default: Story = {
  render: () => <ColorPicker defaultValue="#2563eb" label="Accent color" />,
};

export const PresetPalette: Story = {
  render: () => (
    <ColorPicker
      defaultValue="#2563eb"
      label="Accent color"
      presets={PRESETS}
    />
  ),
};

export const WithField: Story = {
  render: () => (
    <Field>
      <Field.Label>Accent color</Field.Label>
      <ColorPicker
        defaultValue="#2563eb"
        label="Accent color"
        presets={PRESETS}
      />
      <Field.Description>
        Pick a preset or type a custom hex value.
      </Field.Description>
    </Field>
  ),
};

export const PresetKeyboardInteraction: Story = {
  ...PresetPalette,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Accent color" });

    await userEvent.click(trigger);
    const body = within(document.body);
    const radios = await body.findAllByRole("radio");
    await expect(radios[4]).toHaveAttribute("aria-checked", "true");

    radios[0]?.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(radios[1]).toHaveFocus();
    await expect(radios[1]).toHaveAttribute("aria-checked", "true");

    await userEvent.keyboard("{End}");
    await expect(radios[radios.length - 1]).toHaveFocus();
    await expect(radios[radios.length - 1]).toHaveAttribute(
      "aria-checked",
      "true",
    );
  },
};
