import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../button/button";
import { Card } from "./card";

describe("Card", () => {
  it("renders header, title, description, content, and footer", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Workspace</Card.Title>
          <Card.Description>Manage team settings.</Card.Description>
        </Card.Header>
        <Card.Content>Body content</Card.Content>
        <Card.Footer>
          <Button>Save</Button>
        </Card.Footer>
      </Card>,
    );
    expect(
      screen.getByRole("heading", { name: "Workspace", level: 3 }),
    ).toBeTruthy();
    expect(screen.getByText("Manage team settings.")).toBeTruthy();
    expect(screen.getByText("Body content")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("renders the heading level supplied by the page", () => {
    render(<Card.Title as="h2">Workspace</Card.Title>);

    expect(
      screen.getByRole("heading", { name: "Workspace", level: 2 }),
    ).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Summary</Card.Title>
        </Card.Header>
        <Card.Content>Everything looks good.</Card.Content>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
