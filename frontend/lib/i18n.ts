import en from "@/messages/en.json";
import id from "@/messages/id.json";

export const dictionaries = {
  id,
  en,
} as const;

export type Locale = keyof typeof dictionaries;

export const defaultLocale: Locale = "id";

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
