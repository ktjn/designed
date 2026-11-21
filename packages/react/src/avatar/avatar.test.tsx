import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("renders fallback initials when no image has loaded", () => {
    render(<Avatar alt="Ada Lovelace" fallback="AL" />);
    expect(screen.getByText("AL")).toBeTruthy();
  });

  it("supports small, medium, and large sizes", () => {
    render(
      <div>
        <Avatar alt="Small user" fallback="SM" size="small" />
        <Avatar alt="Medium user" fallback="MD" size="medium" />
        <Avatar alt="Large user" fallback="LG" size="large" />
      </div>,
    );
    expect(screen.getByText("SM")).toBeTruthy();
    expect(screen.getByText("MD")).toBeTruthy();
    expect(screen.getByText("LG")).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Avatar alt="Grace Hopper" fallback="GH" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
