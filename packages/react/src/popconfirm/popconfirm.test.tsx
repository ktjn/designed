import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../button/button";
import { Popconfirm, type PopconfirmConfirmVariant } from "./popconfirm";

describe("Popconfirm", () => {
  it("renders the trigger element without mounting the popup when closed", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <Popconfirm
        title="Delete item?"
        description="This action cannot be undone."
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        <Button variant="danger">Delete</Button>
      </Popconfirm>,
    );

    const trigger = screen.getByRole("button", { name: "Delete" });
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByText("Delete item?")).toBeNull();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("supports confirmVariant, controlled closed state, positioning props, and disabled trigger", () => {
    const ref = createRef<HTMLDivElement>();
    const variants: PopconfirmConfirmVariant[] = ["primary", "danger"];
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Popconfirm
        ref={ref}
        title="Archive project?"
        description={0}
        confirmLabel="Archive"
        cancelLabel="Keep"
        confirmVariant={variants[0]}
        open={false}
        defaultOpen={false}
        onOpenChange={onOpenChange}
        side="top"
        sideOffset={10}
        align="end"
        alignOffset={4}
        collisionPadding={12}
        className="custom-popconfirm"
      >
        <Button disabled>Archive</Button>
      </Popconfirm>,
    );

    const trigger = screen.getByRole("button", { name: "Archive" });
    expect((trigger as HTMLButtonElement).disabled).toBe(true);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(ref.current).toBeNull();

    rerender(
      <Popconfirm
        title="Delete project?"
        confirmVariant={variants[1]}
        defaultOpen={false}
      >
        <Button variant="danger">Delete project</Button>
      </Popconfirm>,
    );

    expect(screen.getByRole("button", { name: "Delete project" })).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("has no automatically detectable accessibility violations in closed state", async () => {
    const { container } = render(
      <div>
        <Popconfirm title="Publish changes?">
          <Button>Publish</Button>
        </Popconfirm>
        <Popconfirm
          title="Delete record?"
          description="Permanent removal."
          confirmVariant="danger"
        >
          <Button variant="danger">Delete</Button>
        </Popconfirm>
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
