import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a native textarea", () => {
    render(<Textarea aria-label="Bio" />);
    expect(screen.getByRole("textbox", { name: "Bio" }).tagName).toBe(
      "TEXTAREA",
    );
  });

  it("marks itself invalid via aria-invalid", () => {
    render(<Textarea aria-label="Bio" invalid />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("forwards a ref to the underlying textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Bio" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("applies the small size class", () => {
    render(<Textarea aria-label="Bio" size="small" />);
    expect(screen.getByRole("textbox").className).toContain("small");
  });

  it("applies the large size class", () => {
    render(<Textarea aria-label="Bio" size="large" />);
    expect(screen.getByRole("textbox").className).toContain("large");
  });
});
