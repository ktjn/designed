import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("renders as decorative with custom dimensions", () => {
    const { container } = render(
      <Skeleton variant="rectangular" width={200} height={32} />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.style.width).toBe("200px");
    expect(el.style.height).toBe("32px");
  });

  it("accepts string CSS dimensions", () => {
    const { container } = render(
      <Skeleton variant="circular" width="2.5rem" height="2.5rem" />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("2.5rem");
    expect(el.style.height).toBe("2.5rem");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
