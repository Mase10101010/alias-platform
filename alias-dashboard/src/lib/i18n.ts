export type LanguageCode = 'en' | 'it' | 'es' | 'fr' | 'de';

export const languages: {
  code: LanguageCode;
  label: string;
  shortLabel: string;
}[] = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'it', label: 'Italiano', shortLabel: 'IT' },
  { code: 'es', label: 'Español', shortLabel: 'ES' },
  { code: 'fr', label: 'Français', shortLabel: 'FR' },
  { code: 'de', label: 'Deutsch', shortLabel: 'DE' },
];

export function detectDefaultLanguage(): LanguageCode {
  const saved = localStorage.getItem('alias_language') as LanguageCode | null;

  if (saved && languages.some((language) => language.code === saved)) {
    return saved;
  }

  const browserLanguage = navigator.language.toLowerCase();

  if (browserLanguage.startsWith('it')) return 'it';
  if (browserLanguage.startsWith('es')) return 'es';
  if (browserLanguage.startsWith('fr')) return 'fr';
  if (browserLanguage.startsWith('de')) return 'de';

  return 'en';
}

export function saveLanguage(language: LanguageCode) {
  localStorage.setItem('alias_language', language);
}