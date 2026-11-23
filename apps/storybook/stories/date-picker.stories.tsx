import { DatePicker, Field } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { expectEventuallyRemoved } from "./utils/expect-removed";

const meta: Meta<typeof DatePicker> = {
  title: "DatePicker",
  component: DatePicker,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => (
    <Field>
      <Field.Label>Start date</Field.Label>
      <DatePicker defaultValue="2026-06-15" />
    </Field>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <DatePicker aria-label="Small" size="small" defaultValue="2026-06-15" />
      <DatePicker aria-label="Medium" size="medium" defaultValue="2026-06-15" />
      <DatePicker aria-label="Large" size="large" defaultValue="2026-06-15" />
    </div>
  ),
};

export const SelectFromPopover: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Choose date" }));
    const day22 = await within(document.body).findByRole("button", {
      name: /2026-06-22/,
    });
    await userEvent.click(day22);
    await expect(canvas.getByLabelText("Start date")).toHaveValue("2026-06-22");
  },
};

function isoDaysFromToday(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export const RangeModeInteraction: Story = {
  render: () => (
    <Field>
      <Field.Label>Trip dates</Field.Label>
      <DatePicker mode="range" />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Choose date" }));
    const startIso = isoDaysFromToday(1);
    const endIso = isoDaysFromToday(3);
    const start = await within(document.body).findByRole("button", {
      name: new RegExp(startIso),
    });
    await userEvent.click(start);
    const end = within(document.body).getByRole("button", {
      name: new RegExp(endIso),
    });
    await userEvent.click(end);
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("dialog"),
    );
    await expect(canvas.getByLabelText("Trip dates")).toHaveValue(
      `${startIso} – ${endIso}`,
    );
  },
};

export const LocalizedMonthLabelsInteraction: Story = {
  render: () => (
    <Field>
      <Field.Label>Startdatum</Field.Label>
      <DatePicker
        defaultValue="2026-06-15"
        locale="sv-SE"
        previousMonthLabel="Föregående månad"
        nextMonthLabel="Nästa månad"
      />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Choose date" }));
    await expect(
      await within(document.body).findByRole("button", {
        name: "Föregående månad",
      }),
    ).toBeTruthy();
    await expect(
      within(document.body).getByRole("button", { name: "Nästa månad" }),
    ).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("dialog"),
    );
  },
};

export const DisabledDatesInteraction: Story = {
  render: () => (
    <Field>
      <Field.Label>Appointment date</Field.Label>
      <DatePicker
        defaultValue="2026-06-15"
        isDateDisabled={(iso) => {
          const weekday = new Date(`${iso}T00:00:00Z`).getUTCDay();
          return weekday === 0 || weekday === 6;
        }}
      />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Choose date" }));
    // 2026-06-20 is a Saturday.
    const saturday = await within(document.body).findByRole("button", {
      name: /2026-06-20/,
    });
    await expect(saturday).toBeDisabled();
    await userEvent.keyboard("{Escape}");
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("dialog"),
    );
  },
};

export const CustomValidationMessageInteraction: Story = {
  render: () => (
    <Field>
      <Field.Label>Reservation date</Field.Label>
      <DatePicker
        min="2026-06-10"
        max="2026-06-20"
        formatValidationMessage={(kind, { min, max }) => {
          if (kind === "invalid") return "Ange ett giltigt datum.";
          if (kind === "min") return `Datumet måste vara efter ${min}.`;
          return `Datumet måste vara före ${max}.`;
        }}
      />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Reservation date" });
    await userEvent.type(input, "2026-06-25");
    await userEvent.tab();
    await expect(input).toHaveProperty(
      "validationMessage",
      "Datumet måste vara före 2026-06-20.",
    );
  },
};
