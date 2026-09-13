import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders a native input", () => {
    render(<Input aria-label="Email" />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input.tagName).toBe("INPUT");
  });

  it("marks itself invalid via aria-invalid", () => {
    render(<Input aria-label="Email" invalid />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("forwards a ref to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("supports native form submission via name/value", () => {
    render(<Input aria-label="Email" name="email" defaultValue="a@b.com" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.name).toBe("email");
    expect(input.value).toBe("a@b.com");
  });
});
