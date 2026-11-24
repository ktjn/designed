import {
  Alert,
  Button,
  Dialog,
  Field,
  Input,
  Link,
  Tabs,
  Theme,
} from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import styles from "./color-theme-comparison.module.css";

const meta = {
  title: "Tokens/Color Theme Comparison",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

const themes = [
  { brand: "default", scheme: "light", contrast: "default" },
  { brand: "default", scheme: "light", contrast: "more" },
  { brand: "default", scheme: "dark", contrast: "default" },
  { brand: "default", scheme: "dark", contrast: "more" },
  { brand: "editorial", scheme: "light", contrast: "default" },
  { brand: "editorial", scheme: "light", contrast: "more" },
  { brand: "editorial", scheme: "dark", contrast: "default" },
  { brand: "editorial", scheme: "dark", contrast: "more" },
] as const;

type ThemeChoice = (typeof themes)[number];

function themeValue({ brand, scheme, contrast }: ThemeChoice) {
  return `${brand}-${scheme}-${contrast}`;
}

function SettingsPanel({
  choice,
  candidate,
}: {
  choice: ThemeChoice;
  candidate: boolean;
}) {
  const heading = useId();
  const guide = useId();
  const [email, setEmail] = useState("ops team");
  const invalid = !email.includes("@");
  const { brand, scheme, contrast } = choice;
  const palette = candidate
    ? {
        "data-preview-brand": brand,
        "data-preview-scheme": scheme,
        "data-preview-contrast": contrast,
      }
    : {};

  return (
    <Theme
      brand={brand}
      colorScheme={scheme}
      contrast={contrast}
      className={
        candidate ? `${styles.panel} ${styles.candidate}` : styles.panel
      }
      {...palette}
    >
      <section aria-labelledby={heading}>
        <h2 id={heading}>
          {candidate ? "Candidate palette" : "Current palette"}
        </h2>
        <div className={styles.settings}>
          <h3>Workspace notifications</h3>
          <p className={styles.intro}>
            Decide where the operations team receives alerts.{" "}
            <Link href={`#${guide}`}>Read the notification guide</Link>
          </p>
          <Tabs defaultValue="delivery">
            <Tabs.List aria-label="Notification settings">
              <Tabs.Tab value="delivery">Delivery</Tabs.Tab>
              <Tabs.Tab value="schedule">Schedule</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="delivery" className={styles.delivery}>
              <Field invalid={invalid}>
                <Field.Label>Notification email</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {invalid ? (
                  <Field.Error>Enter a valid email address.</Field.Error>
                ) : (
                  <Field.Description>
                    Alerts are sent to this address.
                  </Field.Description>
                )}
              </Field>
            </Tabs.Panel>
            <Tabs.Panel value="schedule">
              Notifications follow the workspace time zone.
            </Tabs.Panel>
          </Tabs>
          <div id={guide}>
            <Alert variant="info" title="Shared settings">
              Changes apply to everyone in this workspace.
            </Alert>
          </div>
          <div className={styles.actions}>
            <Dialog>
              <Dialog.Trigger render={<Button />}>
                Review changes
              </Dialog.Trigger>
              <Dialog.Content
                className={candidate ? styles.candidate : undefined}
                {...palette}
              >
                <Dialog.Title>Review notification changes</Dialog.Title>
                <Dialog.Description>
                  This address will receive notifications for the whole
                  workspace.
                </Dialog.Description>
                <div className={styles.actions}>
                  <Dialog.Close>Back to settings</Dialog.Close>
                  <Dialog.Close
                    render={
                      <Button
                        variant="danger"
                        onClick={() => setEmail("ops team")}
                      />
                    }
                  >
                    Discard changes
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog>
            <Button variant="secondary" onClick={() => setEmail("ops team")}>
              Reset address
            </Button>
          </div>
        </div>
      </section>
    </Theme>
  );
}

function ColorThemeComparison() {
  const [theme, setTheme] = useState<ThemeChoice>(themes[0]);
  return (
    <main className={styles.board} data-preview-scheme={theme.scheme}>
      <header className={styles.header}>
        <div>
          <h1>Color theme comparison</h1>
          <p>Compare the same settings in both palettes.</p>
        </div>
        <label>
          Theme
          <select
            value={themeValue(theme)}
            onChange={(event) => {
              const value = event.target.value;
              setTheme(
                themes.find((choice) => themeValue(choice) === value) ??
                  themes[0],
              );
            }}
          >
            {themes.map((choice) => (
              <option key={themeValue(choice)} value={themeValue(choice)}>
                {choice.brand === "default" ? "Default" : "Editorial"}
                {" / "}
                {choice.scheme === "light" ? "Light" : "Dark"}
                {" / "}
                {choice.contrast === "default"
                  ? "Standard contrast"
                  : "More contrast"}
              </option>
            ))}
          </select>
        </label>
      </header>
      <div className={styles.comparison}>
        <SettingsPanel choice={theme} candidate={false} />
        <SettingsPanel choice={theme} candidate />
      </div>
    </main>
  );
}

function luminance(color: string) {
  const [, red, green, blue] =
    color.match(/^rgb\((\d+), (\d+), (\d+)\)$/) ?? [];
  if (!red || !green || !blue) {
    throw new Error(`Expected an opaque RGB color, received ${color}`);
  }
  const linear = (channel: string) => {
    const value = Number(channel) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
}

function contrastRatio(firstColor: string, secondColor: string) {
  const first = luminance(firstColor);
  const second = luminance(secondColor);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export const Comparison: StoryObj = {
  render: () => <ColorThemeComparison />,
};

export const ContrastChecks: StoryObj = {
  ...Comparison,
  tags: ["!dev"],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const picker = canvas.getByRole("combobox", { name: "Theme" });
    const candidate = within(
      canvas.getByRole("region", { name: "Candidate palette" }),
    );
    const current = within(
      canvas.getByRole("region", { name: "Current palette" }),
    );
    const link = candidate.getByRole("link");
    const review = candidate.getByRole("button", { name: "Review changes" });
    const reset = candidate.getByRole("button", { name: "Reset address" });
    const input = candidate.getByRole("textbox", {
      name: "Notification email",
    });
    const error = candidate.getByText("Enter a valid email address.");
    const fieldPanel = candidate.getByRole("tabpanel", { name: "Delivery" });
    const delivery = candidate.getByRole("tab", { name: "Delivery" });
    const schedule = candidate.getByRole("tab", { name: "Schedule" });
    const alert = candidate.getByText(
      "Changes apply to everyone in this workspace.",
    );
    const intro = candidate.getByText(
      "Decide where the operations team receives alerts.",
    );
    const panel = candidate.getByRole("heading", {
      name: "Workspace notifications",
    }).parentElement;
    const alertSurface = alert.closest('[data-slot="alert"]');
    if (!panel || !alertSurface)
      throw new Error("Palette fixture is missing surface elements");
    const body = within(canvasElement.ownerDocument.body);

    await step("Compare the two link roles", async () => {
      await expect(getComputedStyle(link).color).toBe("rgb(27, 70, 156)");
      await expect(getComputedStyle(current.getByRole("link")).color).not.toBe(
        getComputedStyle(link).color,
      );
    });

    for (const choice of themes) {
      await step(themeValue(choice), async () => {
        await userEvent.selectOptions(picker, themeValue(choice));
        await expect(picker).toHaveValue(themeValue(choice));
        const threshold = choice.contrast === "more" ? 7 : 4.5;
        const surface = getComputedStyle(panel).backgroundColor;
        const fieldSurface = getComputedStyle(fieldPanel).backgroundColor;
        await waitFor(async () => {
          for (const [role, element, background] of [
            ["link", link, surface],
            ["muted text", intro, surface],
            ["error", error, fieldSurface],
            ["input text", input, getComputedStyle(input).backgroundColor],
            ["unselected tab", schedule, surface],
            [
              "selected tab",
              delivery,
              getComputedStyle(delivery).backgroundColor,
            ],
          ] as const) {
            await expect(
              contrastRatio(getComputedStyle(element).color, background),
              `${themeValue(choice)} ${role}`,
            ).toBeGreaterThanOrEqual(threshold);
          }
          for (const button of [review, reset]) {
            const { color, backgroundColor } = getComputedStyle(button);
            await expect(
              contrastRatio(color, backgroundColor),
              button.textContent,
            ).toBeGreaterThanOrEqual(threshold);
          }
          const { borderColor: invalidBorder } = getComputedStyle(input);
          const { borderColor: secondaryBorder } = getComputedStyle(reset);
          await expect(
            contrastRatio(invalidBorder, fieldSurface),
            "invalid field boundary",
          ).toBeGreaterThanOrEqual(3);
          await expect(
            contrastRatio(secondaryBorder, surface),
            "secondary button boundary",
          ).toBeGreaterThanOrEqual(3);
          const { borderBottomColor, backgroundColor } =
            getComputedStyle(delivery);
          await expect(
            contrastRatio(borderBottomColor, backgroundColor),
            "selected tab underline",
          ).toBeGreaterThanOrEqual(3);
        });
        await expect(
          contrastRatio(
            getComputedStyle(alert).color,
            getComputedStyle(alertSurface).backgroundColor,
          ),
          "status text",
        ).toBeGreaterThanOrEqual(threshold);

        await userEvent.click(review);
        const dialog = await body.findByRole("dialog", {
          name: "Review notification changes",
        });
        await expect(panel.contains(dialog)).toBe(false);
        await expect(getComputedStyle(dialog).backgroundColor).toBe(surface);
        const description = within(dialog).getByText(
          "This address will receive notifications for the whole workspace.",
        );
        await expect(
          contrastRatio(getComputedStyle(description).color, surface),
          "dialog description",
        ).toBeGreaterThanOrEqual(threshold);
        const danger = within(dialog).getByRole("button", {
          name: "Discard changes",
        });
        const dangerStyle = getComputedStyle(danger);
        await expect(
          contrastRatio(dangerStyle.color, dangerStyle.backgroundColor),
        ).toBeGreaterThanOrEqual(threshold);
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(body.queryByRole("dialog")).not.toBeInTheDocument(),
        );
      });
    }

    await step("Keep selection and keyboard focus visible", async () => {
      await userEvent.click(delivery);
      await userEvent.keyboard("{ArrowRight}{Enter}");
      await expect(schedule).toHaveAttribute("aria-selected", "true");
      await expect(schedule).toHaveFocus();
      await waitFor(async () => {
        const {
          outlineColor,
          outlineStyle,
          borderBottomColor,
          backgroundColor,
        } = getComputedStyle(schedule);
        await expect(outlineStyle).toBe("solid");
        await expect(
          contrastRatio(outlineColor, backgroundColor),
        ).toBeGreaterThanOrEqual(3);
        await expect(
          contrastRatio(borderBottomColor, backgroundColor),
        ).toBeGreaterThanOrEqual(3);
      });
      await userEvent.click(delivery);
      await userEvent.selectOptions(picker, themeValue(themes[0]));
    });
  },
};
