import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Link } from "./link";

describe("Link", () => {
  it("renders a native anchor", () => {
    render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/docs");
  });

  it("forwards a ref to the underlying anchor element", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link href="/docs" ref={ref}>
        Docs
      </Link>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("forwards DOM escape hatches", () => {
    render(
      <Link href="/docs" data-testid="docs-link" aria-label="Documentation">
        Docs
      </Link>,
    );
    expect(screen.getByTestId("docs-link").getAttribute("aria-label")).toBe(
      "Documentation",
    );
  });
});
