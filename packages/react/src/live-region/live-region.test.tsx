import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { LiveRegion } from "./live-region";

describe("LiveRegion", () => {
  it("keeps a polite region mounted before and during status updates", () => {
    const { rerender } = render(<LiveRegion />);
    const region = screen.getByRole("status");

    expect(region.textContent).toBe("");
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(region.getAttribute("aria-atomic")).toBe("true");

    rerender(<LiveRegion>8 results found</LiveRegion>);
    expect(screen.getByRole("status")).toBe(region);
    expect(region.textContent).toBe("8 results found");

    rerender(<LiveRegion>3 results found</LiveRegion>);
    expect(screen.getByRole("status")).toBe(region);
    expect(region.textContent).toBe("3 results found");
  });

  it("supports assertive partial announcements and forwards the ref", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <LiveRegion
        id="save-status"
        ref={ref}
        politeness="assertive"
        atomic={false}
      >
        Connection lost
      </LiveRegion>,
    );
    const region = screen.getByRole("status");

    expect(region.getAttribute("aria-live")).toBe("assertive");
    expect(region.getAttribute("aria-atomic")).toBe("false");
    expect(region.getAttribute("data-slot")).toBe("live-region");
    expect(region.id).toBe("save-status");
    expect(ref.current).toBe(region);
  });
});
