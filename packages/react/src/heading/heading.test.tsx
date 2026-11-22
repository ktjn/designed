import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Heading, HeadingSection } from "./heading";

describe("Heading", () => {
  it("renders an h2 by default", () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });

  it("renders the element given via as", () => {
    render(<Heading as="h4">Title</Heading>);
    expect(screen.getByRole("heading", { level: 4 })).toBeTruthy();
  });

  it("increments the contextual level inside nested HeadingSection", () => {
    render(
      <>
        <Heading>Top</Heading>
        <HeadingSection>
          <Heading>Nested</Heading>
          <HeadingSection>
            <Heading>Doubly nested</Heading>
          </HeadingSection>
        </HeadingSection>
      </>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Top" })).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 3, name: "Nested" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 4, name: "Doubly nested" }),
    ).toBeTruthy();
  });

  it("lets an explicit as override the contextual level", () => {
    render(
      <HeadingSection>
        <Heading as="h1">Explicit</Heading>
      </HeadingSection>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Explicit" }),
    ).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <>
        <Heading>Page title</Heading>
        <HeadingSection>
          <Heading>Section title</Heading>
        </HeadingSection>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
