import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "./switch";

describe("Switch", () => {
  it("renders as an accessible switch", () => {
    render(<Switch aria-label="Enable notifications" />);
    const control = screen.getByRole("switch", {
      name: "Enable notifications",
    });
    expect(control.getAttribute("aria-checked")).toBe("false");
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="Enable notifications"
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("toggles via keyboard when focused", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="Enable notifications"
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.tab();
    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Switch aria-label="Enable notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("positions the checked thumb with logical CSS rather than :dir()", async () => {
    const css = await readFile(
      path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "switch.module.css",
      ),
      "utf8",
    );
    expect(css).not.toContain(":dir(");
    expect(css).toMatch(
      /\.thumb\[data-checked\]\s*\{[^}]*(?:margin|inset)-inline-start:/,
    );
  });

  it("applies the small size class", () => {
    render(<Switch aria-label="Enable notifications" size="small" />);
    expect(screen.getByRole("switch").className).toContain("small");
  });

  it("applies the large size class", () => {
    render(<Switch aria-label="Enable notifications" size="large" />);
    expect(screen.getByRole("switch").className).toContain("large");
  });
});
