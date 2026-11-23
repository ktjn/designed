import type { ReactNode } from "react";
import { CSPProvider } from "./csp-provider.js";
import { type I18nMessages, I18nProvider } from "./i18n-provider.js";
import { type IconOverrides, IconProvider } from "./icon-provider.js";

export interface DesignedProviderProps {
  icons?: IconOverrides;
  messages?: I18nMessages;
  locale?: string;
  cspNonce?: string;
  disableCspStyleElements?: boolean;
  children?: ReactNode;
}

export function DesignedProvider({
  icons,
  messages,
  locale,
  cspNonce,
  disableCspStyleElements,
  children,
}: DesignedProviderProps) {
  const resolvedMessages = locale ? { ...messages, locale } : (messages ?? {});

  return (
    <CSPProvider
      nonce={cspNonce}
      disableStyleElements={disableCspStyleElements}
    >
      <IconProvider overrides={icons ?? {}}>
        <I18nProvider messages={resolvedMessages}>{children}</I18nProvider>
      </IconProvider>
    </CSPProvider>
  );
}
