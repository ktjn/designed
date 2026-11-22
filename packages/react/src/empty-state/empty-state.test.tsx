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

  it("renders optional children after built-in slots and applies slot classNames and data-slots", () => {
    const { container } = render(
      <EmptyState
        icon={<span aria-hidden="true">*</span>}
        title="No results"
        description="Adjust your query."
        action={<button type="button">Reset</button>}
        classNames={{
          icon: "custom-icon",
          title: "custom-title",
          description: "custom-description",
          action: "custom-action",
        }}
      >
        <div data-testid="metadata-chips">Tag A · Tag B</div>
      </EmptyState>,
    );

    const root = container.querySelector('[data-slot="empty-state"]');
    expect(
      root?.querySelector('[data-slot="empty-state-icon"]')?.className,
    ).toContain("custom-icon");
    expect(
      root?.querySelector('[data-slot="empty-state-title"]')?.className,
    ).toContain("custom-title");
    expect(
      root?.querySelector('[data-slot="empty-state-description"]')?.className,
    ).toContain("custom-description");
    expect(
      root?.querySelector('[data-slot="empty-state-action"]')?.className,
    ).toContain("custom-action");

    const childrenEl = screen.getByTestId("metadata-chips");
    expect(root?.lastElementChild).toBe(childrenEl);
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
