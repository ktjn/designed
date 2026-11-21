import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("announces loading status with a default label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status").textContent).toContain("Loading");
  });

  it("supports custom labels and sizes", () => {
    render(<Spinner size="large" label="Saving changes" />);
    expect(screen.getByRole("status").textContent).toContain("Saving changes");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Spinner label="Loading results" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
