import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Accordion } from "./accordion";

function BasicAccordion() {
  return (
    <Accordion>
      <Accordion.Item value="a">
        <Accordion.Trigger>Section A</Accordion.Trigger>
        <Accordion.Panel>Content A</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Section B</Accordion.Trigger>
        <Accordion.Panel>Content B</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("renders headings with buttons that control visibility of their panel", () => {
    render(<BasicAccordion />);
    expect(screen.getByRole("heading", { name: "Section A" })).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: "Section A" })
        .getAttribute("aria-expanded"),
    ).toBe("false");
  });

  it("expands a panel on trigger click", async () => {
    const user = userEvent.setup();
    render(<BasicAccordion />);
    await user.click(screen.getByRole("button", { name: "Section A" }));
    expect(
      screen
        .getByRole("button", { name: "Section A" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    expect(screen.getByText("Content A")).toBeTruthy();
  });

  it("closes the previously open item by default (single-open accordion)", async () => {
    const user = userEvent.setup();
    render(<BasicAccordion />);
    await user.click(screen.getByRole("button", { name: "Section A" }));
    await user.click(screen.getByRole("button", { name: "Section B" }));
    expect(
      screen
        .getByRole("button", { name: "Section A" })
        .getAttribute("aria-expanded"),
    ).toBe("false");
    expect(
      screen
        .getByRole("button", { name: "Section B" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("allows multiple items open independently when multiple is set", async () => {
    const user = userEvent.setup();
    render(
      <Accordion multiple>
        <Accordion.Item value="a">
          <Accordion.Trigger>Section A</Accordion.Trigger>
          <Accordion.Panel>Content A</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger>Section B</Accordion.Trigger>
          <Accordion.Panel>Content B</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );
    await user.click(screen.getByRole("button", { name: "Section A" }));
    await user.click(screen.getByRole("button", { name: "Section B" }));
    expect(
      screen
        .getByRole("button", { name: "Section A" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    expect(
      screen
        .getByRole("button", { name: "Section B" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("toggles via keyboard activation (Enter)", async () => {
    const user = userEvent.setup();
    render(<BasicAccordion />);
    screen.getByRole("button", { name: "Section A" }).focus();
    await user.keyboard("{Enter}");
    expect(
      screen
        .getByRole("button", { name: "Section A" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("exposes the vertical orientation as a data attribute", () => {
    const { container } = render(
      <Accordion orientation="vertical">
        <Accordion.Item value="a">
          <Accordion.Trigger>Section A</Accordion.Trigger>
          <Accordion.Panel>Content A</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );
    expect(
      container.querySelector('[data-orientation="vertical"]'),
    ).toBeTruthy();
  });

  it("keeps a collapsed panel's DOM mounted when keepMounted is set", () => {
    render(
      <Accordion>
        <Accordion.Item value="a">
          <Accordion.Trigger>Section A</Accordion.Trigger>
          <Accordion.Panel keepMounted>Content A</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByText("Content A")).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<BasicAccordion />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
