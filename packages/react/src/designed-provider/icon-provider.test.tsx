import type { IconProps } from "@ktjn/designed-icons";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconProvider, useIconOverride } from "./icon-provider.js";

function DefaultIcon(props: IconProps) {
  return <svg data-testid="default-icon" {...props} />;
}

function OverrideIcon(props: IconProps) {
  return <svg data-testid="override-icon" {...props} />;
}

function OuterOverrideIcon(props: IconProps) {
  return <svg data-testid="outer-override-icon" {...props} />;
}

function CloseConsumer() {
  const Icon = useIconOverride("close", DefaultIcon);
  return <Icon aria-hidden />;
}

function SearchConsumer() {
  const Icon = useIconOverride("search", DefaultIcon);
  return <Icon aria-hidden />;
}

describe("useIconOverride", () => {
  it("renders the built-in default when no provider wraps the consumer", () => {
    render(<CloseConsumer />);
    expect(screen.getByTestId("default-icon")).toBeTruthy();
  });

  it("renders the override from IconProvider", () => {
    render(
      <IconProvider overrides={{ close: OverrideIcon }}>
        <CloseConsumer />
      </IconProvider>,
    );
    expect(screen.getByTestId("override-icon")).toBeTruthy();
  });

  it("falls back to the passed default for a key not in the override map", () => {
    render(
      <IconProvider overrides={{ close: OverrideIcon }}>
        <SearchConsumer />
      </IconProvider>,
    );
    expect(screen.getByTestId("default-icon")).toBeTruthy();
  });

  it("lets a nested IconProvider override a subset of keys while inheriting the rest from the ambient ancestor", () => {
    render(
      <IconProvider
        overrides={{ close: OuterOverrideIcon, search: OuterOverrideIcon }}
      >
        <IconProvider overrides={{ close: OverrideIcon }}>
          <CloseConsumer />
          <SearchConsumer />
        </IconProvider>
      </IconProvider>,
    );
    expect(screen.getAllByTestId("override-icon")).toHaveLength(1);
    expect(screen.getAllByTestId("outer-override-icon")).toHaveLength(1);
  });
});
