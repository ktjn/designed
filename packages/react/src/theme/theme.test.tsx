import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Theme, useTheme } from "./theme";

function ThemeValues() {
  const { brand, colorScheme, density, contrast } = useTheme();
  return <output>{[brand, colorScheme, density, contrast].join("/")}</output>;
}

describe("Theme", () => {
  it("overrides individual dimensions and inherits the rest", () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <Theme
        brand="custom"
        colorScheme="dark"
        density="compact"
        contrast="more"
      >
        <Theme ref={ref} colorScheme="light" density="default">
          <ThemeValues />
        </Theme>
      </Theme>,
    );

    expect(screen.getByText("custom/light/default/more")).toBeTruthy();
    expect(ref.current?.dataset).toMatchObject({
      slot: "theme",
      colorScheme: "light",
      density: "default",
    });
    expect(ref.current?.hasAttribute("data-brand")).toBe(false);
    expect(ref.current?.hasAttribute("data-contrast")).toBe(false);
    expect(ref.current?.parentElement?.dataset).toMatchObject({
      brand: "custom",
      colorScheme: "dark",
      density: "compact",
      contrast: "more",
    });

    rerender(
      <Theme brand="editorial">
        <Theme ref={ref}>
          <ThemeValues />
        </Theme>
      </Theme>,
    );

    expect(screen.getByText("editorial///")).toBeTruthy();
    expect(ref.current?.hasAttribute("data-color-scheme")).toBe(false);
    expect(ref.current?.hasAttribute("data-density")).toBe(false);
  });

  it("leaves unset dimensions to the surrounding DOM and CSS", () => {
    render(
      <div data-brand="editorial" data-contrast="more" data-testid="page">
        <Theme data-testid="scope">
          <ThemeValues />
        </Theme>
      </div>,
    );

    const scope = screen.getByTestId("scope");
    expect(screen.getByText("///")).toBeTruthy();
    expect(scope.closest("[data-brand]")).toBe(screen.getByTestId("page"));
    expect(scope.closest("[data-contrast]")).toBe(screen.getByTestId("page"));
    expect(scope.closest("[data-color-scheme]")).toBeNull();
    expect(scope.closest("[data-density]")).toBeNull();
  });
});
