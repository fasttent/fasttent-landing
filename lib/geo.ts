// Країни, де GDPR/ePrivacy юридично вимагає cookie-consent банер:
// ЄЕЗ (27 ЄС + IS, LI, NO) + Велика Британія (UK GDPR) + Швейцарія (nFADP).
const CONSENT_REQUIRED_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
]);

export function isConsentRequiredCountry(country: string | null | undefined): boolean {
  return !!country && CONSENT_REQUIRED_COUNTRIES.has(country.toUpperCase());
}
