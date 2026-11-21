import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tag } from "./tag.js";

describe("Tag", () => {
  it("renders content and triggers onRemove when removable", () => {
    const onRemove = vi.fn();
    render(
      <Tag variant="info" onRemove={onRemove} removeLabel="Remove TypeScript">
        TypeScript
      </Tag>,
    );

    expect(screen.getByText("TypeScript")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Remove TypeScript" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("omits remove button when onRemove is not provided and has no axe violations", async () => {
    const { container } = render(<Tag variant="success">Verified</Tag>);

    expect(screen.queryByRole("button")).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });
});
