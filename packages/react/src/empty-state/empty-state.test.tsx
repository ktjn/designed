import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { EmptyState } from "./empty-state.js";

describe("EmptyState", () => {
  it("renders icon, title, description, and action", () => {
    render(
      <EmptyState
        icon={<span data-testid="empty-icon" aria-hidden="true" />}
        title="No projects yet"
        description="Create your first project to get started."
        action={<button type="button">Create project</button>}
      />,
    );

    expect(screen.getByTestId("empty-icon")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "No projects yet" }),
    ).toBeTruthy();
    expect(
      screen.getByText("Create your first project to get started."),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create project" })).toBeTruthy();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <EmptyState
        title="Nothing found"
        description="Try adjusting your search filters."
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
