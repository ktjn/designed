import { render, screen } from "@testing-library/react";
import { createRef } from "react";
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

  it("composes a labeled section with an eyebrow and forwards its ref", () => {
    const sectionRef = createRef<HTMLElement>();
    const defaultRef = createRef<HTMLDivElement>();

    render(
      <>
        <Card as="section" ref={sectionRef} aria-labelledby="workspace-title">
          <Card.Header>
            <span>Settings</span>
            <Card.Title id="workspace-title">Workspace</Card.Title>
          </Card.Header>
        </Card>
        <Card ref={defaultRef}>Default card</Card>
      </>,
    );
    const section = screen.getByRole("region", { name: "Workspace" });
    expect(section.tagName).toBe("SECTION");
    expect(section).toBe(sectionRef.current);
    expect(screen.getByText("Settings").nextElementSibling?.id).toBe(
      "workspace-title",
    );
    expect(defaultRef.current?.tagName).toBe("DIV");
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
