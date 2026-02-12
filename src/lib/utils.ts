/**
 * Pure utility functions safe for client components.
 */

export function getLocalizedValue(
  obj: { en: string; pt: string },
  locale: string
): string {
  return locale === "pt" ? obj.pt : obj.en;
}
