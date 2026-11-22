import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders a native button by default", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", {
      name: "Save",
    }) as HTMLButtonElement;
    expect(button.tagName).toBe("BUTTON");
    expect(button.type).toBe("button");
  });

  it("composes styled buttons onto links", () => {
    const ref = createRef<HTMLAnchorElement>();
    const onClick = vi.fn();
    const onNavigate = vi.fn((event: React.MouseEvent) =>
      event.preventDefault(),
    );
    render(
      <Button
        className="outer"
        onClick={onClick}
        render={
          <a
            ref={ref}
            href="/settings"
            className="router"
            onClick={onNavigate}
          />
        }
      >
        Settings
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Settings" });
    expect(link).toBe(ref.current);
    expect(link.getAttribute("href")).toBe("/settings");
    expect(link.getAttribute("data-slot")).toBe("button");
    expect(link.className.split(" ")).toEqual(
      expect.arrayContaining([
        "outer",
        "router",
        expect.stringContaining("primary"),
      ]),
    );
    expect(link.hasAttribute("type")).toBe(false);
    link.click();
    expect(onClick).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it("blocks render-element click handlers while loading or disabled", () => {
    const onClick = vi.fn();
    const onNavigate = vi.fn();
    const { rerender } = render(
      <Button
        loading
        onAuxClick={onClick}
        onClick={onClick}
        render={
          <a href="/settings" onAuxClick={onNavigate} onClick={onNavigate} />
        }
      >
        Settings
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Settings" });
    expect(link.getAttribute("aria-busy")).toBe("true");
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(
      link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      ),
    ).toBe(false);
    expect(
      link.dispatchEvent(
        new MouseEvent("auxclick", {
          bubbles: true,
          cancelable: true,
          button: 1,
        }),
      ),
    ).toBe(false);

    rerender(
      <Button
        disabled
        onAuxClick={onClick}
        onClick={onClick}
        render={
          <a href="/settings" onAuxClick={onNavigate} onClick={onNavigate} />
        }
      >
        Settings
      </Button>,
    );
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(
      link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      ),
    ).toBe(false);
    expect(
      link.dispatchEvent(
        new MouseEvent("auxclick", {
          bubbles: true,
          cancelable: true,
          button: 1,
        }),
      ),
    ).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("preserves event handlers from both the wrapper and replacement", () => {
    const calls: string[] = [];
    const record = (source: string) => (event: React.SyntheticEvent) => {
      event.preventDefault();
      calls.push(`${source} ${event.type}`);
    };
    const outer = record("wrapper");
    const inner = record("replacement");
    render(
      <Button
        onFocus={outer}
        onKeyDown={outer}
        onClickCapture={outer}
        render={
          <a
            href="/settings"
            onFocus={inner}
            onKeyDown={inner}
            onClickCapture={inner}
          />
        }
      >
        Settings
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Settings" });
    fireEvent.focus(link);
    fireEvent.keyDown(link, { key: "Enter" });
    fireEvent.click(link);
    expect(calls).toEqual([
      "replacement focus",
      "wrapper focus",
      "replacement keydown",
      "wrapper keydown",
      "replacement click",
      "wrapper click",
    ]);
  });

  it("supports the primary, secondary, and danger variants", () => {
    const { rerender } = render(<Button variant="primary">Save</Button>);
    expect(screen.getByRole("button").className).toContain("primary");

    rerender(<Button variant="secondary">Save</Button>);
    expect(screen.getByRole("button").className).toContain("secondary");

    rerender(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button").className).toContain("danger");

    rerender(<Button variant="ghost">More</Button>);
    expect(screen.getByRole("button").className).toContain("ghost");
    expect(screen.getByRole("button").getAttribute("data-slot")).toBe("button");
  });

  it("supports small, medium, large, and icon sizes", () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole("button").className).toContain("small");

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole("button").className).toContain("medium");

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole("button").className).toContain("large");

    rerender(
      <Button size="icon" aria-label="Search">
        S
      </Button>,
    );
    expect(screen.getByRole("button").className).toContain("icon");
  });

  it("sets aria-busy and aria-disabled, keeps focus, and blocks activation while loading", () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading onClick={onClick}>
          Saving
        </Button>
      </form>,
    );
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.hasAttribute("data-loading")).toBe(true);
    expect(button.querySelector("[data-loading-indicator]")).not.toBeNull();

    button.focus();
    expect(document.activeElement).toBe(button);
    button.click();
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("forwards a ref to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards native button props and DOM escape hatches", () => {
    const onClick = vi.fn();
    render(
      <Button
        onClick={onClick}
        disabled
        data-testid="save-button"
        aria-label="Save changes"
      >
        Save
      </Button>,
    );
    const button = screen.getByTestId("save-button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-label")).toBe("Save changes");
  });

  it("respects an explicit type override", () => {
    render(<Button type="submit">Submit</Button>);
    expect((screen.getByRole("button") as HTMLButtonElement).type).toBe(
      "submit",
    );
  });

  it("renders identically on the server (SSR smoke test)", () => {
    const markup = renderToStaticMarkup(
      <Button variant="primary">Save</Button>,
    );
    expect(markup).toContain("<button");
    expect(markup).toContain("Save");
  });

  it("hydrates server-rendered markup without console errors (hydration smoke test)", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(
      <Button variant="primary">Save</Button>,
    );
    document.body.appendChild(container);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    try {
      hydrateRoot(container, <Button variant="primary">Save</Button>);
      expect(consoleError).not.toHaveBeenCalled();
      expect(container.querySelector("button")?.textContent).toBe("Save");
    } finally {
      consoleError.mockRestore();
      container.remove();
    }
  });
});
