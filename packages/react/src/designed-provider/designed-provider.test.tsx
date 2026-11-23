import type { IconProps } from "@ktjn/designed-icons";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DesignedProvider } from "./designed-provider.js";
import { useI18nMessage, useLocale } from "./i18n-provider.js";
import { useIconOverride } from "./icon-provider.js";

function DefaultIcon(props: IconProps) {
  return <svg data-testid="default-icon" {...props} />;
}

function OverrideIcon(props: IconProps) {
  return <svg data-testid="override-icon" {...props} />;
}

function AllInOneConsumer() {
  const Icon = useIconOverride("close", DefaultIcon);
  const closeLabel = useI18nMessage("close", undefined, "Close");
  const locale = useLocale();
  return (
    <>
      <Icon aria-hidden />
      <span data-testid="label">{closeLabel}</span>
      <span data-testid="locale">{locale ?? "undefined"}</span>
    </>
  );
}

describe("DesignedProvider", () => {
  it("propagates icon overrides, message overrides, and locale to a descendant consuming all three hooks", () => {
    render(
      <DesignedProvider
        icons={{ close: OverrideIcon }}
        messages={{ close: "Fermer" }}
        locale="fr-FR"
      >
        <AllInOneConsumer />
      </DesignedProvider>,
    );

    expect(screen.getByTestId("override-icon")).toBeTruthy();
    expect(screen.getByTestId("label").textContent).toBe("Fermer");
    expect(screen.getByTestId("locale").textContent).toBe("fr-FR");
  });

  it("falls back to built-in defaults when no icons/messages/locale are supplied", () => {
    render(
      <DesignedProvider>
        <AllInOneConsumer />
      </DesignedProvider>,
    );

    expect(screen.getByTestId("default-icon")).toBeTruthy();
    expect(screen.getByTestId("label").textContent).toBe("Close");
    expect(screen.getByTestId("locale").textContent).toBe("undefined");
  });
});
