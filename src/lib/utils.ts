/**
 * Pure utility functions safe for client components.
 */

export function getLocalizedValue(
  obj: Record<string, string> | undefined,
  locale: string,
  defaultLocale = "en"
): string {
  if (!obj) return "";
  // prefer exact locale, then defaultLocale, then any available value
  if (locale && obj[locale]) return obj[locale];
  if (defaultLocale && obj[defaultLocale]) return obj[defaultLocale];
  const first = Object.values(obj).find(v => !!v);
  return first ?? "";
}
