import type { IconProps } from "@ktjn/designed-icons";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { I18nProvider } from "../designed-provider/i18n-provider.js";
import { IconProvider } from "../designed-provider/icon-provider.js";
import { Tag } from "./tag.js";

function CustomCloseIcon(props: IconProps) {
  return <svg data-testid="custom-icon" {...props} />;
}

describe("Tag", () => {
  it("renders the overridden close icon from IconProvider", () => {
    render(
      <IconProvider overrides={{ close: CustomCloseIcon }}>
        <Tag onRemove={() => {}} removeLabel="Remove">
          Overridden
        </Tag>
      </IconProvider>,
    );
    expect(screen.getByTestId("custom-icon")).toBeTruthy();
  });

  it("renders content and triggers onRemove when removable", () => {
    const onRemove = vi.fn();
    render(
      <Tag variant="info" onRemove={onRemove} removeLabel="Remove TypeScript">
        TypeScript
      </Tag>,
    );

    expect(screen.getByText("TypeScript")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Remove TypeScript" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("omits remove button when onRemove is not provided and has no axe violations", async () => {
    const { container } = render(<Tag variant="success">Verified</Tag>);

    expect(screen.queryByRole("button")).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("applies the small size class", () => {
    render(<Tag size="small">Small</Tag>);
    expect(
      screen.getByText("Small").closest('[data-slot="tag"]')?.className,
    ).toContain("small");
  });

  it("applies the large size class", () => {
    render(<Tag size="large">Large</Tag>);
    expect(
      screen.getByText("Large").closest('[data-slot="tag"]')?.className,
    ).toContain("large");
  });

  it("uses the remove label from I18nProvider but lets an explicit prop win", () => {
    const { rerender } = render(
      <I18nProvider messages={{ remove: "Supprimer" }}>
        <Tag onRemove={() => {}}>Overridden</Tag>
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Supprimer" })).toBeTruthy();

    rerender(
      <I18nProvider messages={{ remove: "Supprimer" }}>
        <Tag onRemove={() => {}} removeLabel="Delete">
          Overridden
        </Tag>
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
  });
});
