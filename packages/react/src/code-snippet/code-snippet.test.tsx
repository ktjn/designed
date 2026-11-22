import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CodeSnippet } from "./code-snippet";

describe("CodeSnippet", () => {
  it("renders inline code without a copy button by default", () => {
    render(<CodeSnippet>const x = 1;</CodeSnippet>);
    const code = screen.getByText("const x = 1;");
    expect(code.tagName).toBe("CODE");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders a block with a copy button that copies the code text", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    render(<CodeSnippet variant="block">npm install</CodeSnippet>);
    const button = screen.getByRole("button", { name: "Copy code" });
    await user.click(button);
    expect(writeText).toHaveBeenCalledWith("npm install");
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
  });

  it("omits the copy button when showCopyButton is false", () => {
    render(
      <CodeSnippet variant="block" showCopyButton={false}>
        no copy here
      </CodeSnippet>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <CodeSnippet variant="block">echo hello</CodeSnippet>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
