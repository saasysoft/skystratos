'use client';

import {
  createContext,
  useState,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import en from './translations/en.json';
import zhTW from './translations/zh-TW.json';

export type Locale = 'en' | 'zh-TW';

type TranslationObject = Record<string, unknown>;

const translations: Record<Locale, TranslationObject> = {
  en,
  'zh-TW': zhTW,
};

function resolve(obj: TranslationObject, key: string): string {
  const parts = key.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : key;
}

interface I18nContextValue {
  locale: Locale;
  setLocale: Dispatch<SetStateAction<Locale>>;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback(
    (key: string): string => resolve(translations[locale], key),
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
