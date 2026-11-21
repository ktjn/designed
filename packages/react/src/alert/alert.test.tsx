import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Alert } from "./alert";

describe("Alert", () => {
  it("renders title and description with status role for info/success", () => {
    render(
      <Alert variant="info" title="Heads up">
        Changes take effect immediately.
      </Alert>,
    );
    const region = screen.getByRole("status");
    expect(region.textContent).toContain("Heads up");
    expect(region.textContent).toContain("Changes take effect immediately.");
  });

  it("uses alert role for warning and danger variants", () => {
    const { rerender } = render(
      <Alert variant="warning">Check your input.</Alert>,
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "Check your input.",
    );

    rerender(<Alert variant="danger">Save failed.</Alert>);
    expect(screen.getByRole("alert").textContent).toContain("Save failed.");
  });

  it("allows overriding the ARIA role", () => {
    render(
      <Alert variant="info" role="alert">
        Important notice
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Alert variant="success" title="Saved">
        Profile updated.
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
