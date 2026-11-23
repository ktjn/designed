import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { I18nProvider, useI18nMessage, useLocale } from "./i18n-provider.js";

function CloseLabel({ explicit }: { explicit?: string }) {
  const label = useI18nMessage("close", explicit, "Close");
  return <span data-testid="close-label">{label}</span>;
}

function DismissLabel() {
  const label = useI18nMessage("dismiss", undefined, "Dismiss");
  return <span data-testid="dismiss-label">{label}</span>;
}

function Locale() {
  const locale = useLocale();
  return <span data-testid="locale">{locale ?? "undefined"}</span>;
}

describe("useI18nMessage", () => {
  it("renders the built-in default when no provider wraps the consumer", () => {
    render(<CloseLabel />);
    expect(screen.getByTestId("close-label").textContent).toBe("Close");
  });

  it("renders the provider's dictionary override", () => {
    render(
      <I18nProvider messages={{ close: "Fermer" }}>
        <CloseLabel />
      </I18nProvider>,
    );
    expect(screen.getByTestId("close-label").textContent).toBe("Fermer");
  });

  it("prefers the explicit per-instance value over the provider's dictionary", () => {
    render(
      <I18nProvider messages={{ close: "Fermer" }}>
        <CloseLabel explicit="Shut" />
      </I18nProvider>,
    );
    expect(screen.getByTestId("close-label").textContent).toBe("Shut");
  });

  it("lets a nested I18nProvider override a subset of keys while inheriting the rest from the ambient ancestor", () => {
    render(
      <I18nProvider messages={{ close: "Fermer", dismiss: "Ignorer" }}>
        <I18nProvider messages={{ close: "Zavřít" }}>
          <CloseLabel />
          <DismissLabel />
        </I18nProvider>
      </I18nProvider>,
    );
    expect(screen.getByTestId("close-label").textContent).toBe("Zavřít");
    expect(screen.getByTestId("dismiss-label").textContent).toBe("Ignorer");
  });
});

describe("useLocale", () => {
  it("returns undefined when no provider supplies a locale", () => {
    render(<Locale />);
    expect(screen.getByTestId("locale").textContent).toBe("undefined");
  });

  it("returns the locale supplied by I18nProvider", () => {
    render(
      <I18nProvider messages={{ locale: "fr-FR" }}>
        <Locale />
      </I18nProvider>,
    );
    expect(screen.getByTestId("locale").textContent).toBe("fr-FR");
  });
});
