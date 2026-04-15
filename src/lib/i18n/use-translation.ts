import { useCallback, useContext } from 'react';
import { I18nContext, type Locale } from './context';
import en from './translations/en.json';
import zhTW from './translations/zh-TW.json';

type TranslationObject = Record<string, unknown>;

const translations: Record<Locale, TranslationObject> = {
  en,
  'zh-TW': zhTW,
};

/**
 * Resolve a dot-notated key against a nested object.
 * Returns the string value, or the key itself as fallback.
 */
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

export function useTranslation() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  const { locale, setLocale } = context;

  const t = useCallback(
    (key: string): string => resolve(translations[locale], key),
    [locale]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const parts = key.split('.');
      let current: unknown = translations[locale];
      for (const part of parts) {
        if (current === null || current === undefined || typeof current !== 'object') return [];
        current = (current as Record<string, unknown>)[part];
      }
      return Array.isArray(current) ? current as string[] : [];
    },
    [locale]
  );

  return { t, tArray, locale, setLocale };
}
