import { createContext, type ReactNode, useContext, useMemo } from "react";

export interface I18nMessages {
  close?: string;
  dismiss?: string;
  previousMonth?: string;
  nextMonth?: string;
  openCalendar?: string;
  empty?: string;
  remove?: string;
  getRemoveLabel?: (label: string) => string;
  locale?: string;
}

const I18nContext = createContext<I18nMessages>({});

export function useI18nMessages(): I18nMessages {
  return useContext(I18nContext);
}

export function I18nProvider({
  messages,
  children,
}: {
  messages: I18nMessages;
  children?: ReactNode;
}) {
  const parent = useI18nMessages();
  const merged = useMemo(
    () => ({ ...parent, ...messages }),
    [parent, messages],
  );

  return <I18nContext.Provider value={merged}>{children}</I18nContext.Provider>;
}

export function useI18nMessage<K extends keyof Omit<I18nMessages, "locale">>(
  key: K,
  explicitValue: I18nMessages[K] | undefined,
  builtInDefault: NonNullable<I18nMessages[K]>,
): NonNullable<I18nMessages[K]> {
  const messages = useI18nMessages();
  return explicitValue ?? messages[key] ?? builtInDefault;
}

export function useLocale(): string | undefined {
  return useI18nMessages().locale;
}
