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

export const translations = {
  en: {
    overview: 'Overview',
    concierge: 'Concierge AI',
    onboarding: 'Onboarding',
    reservations: 'Reservations',
    availability: 'Availability',
    analytics: 'Analytics',
    settings: 'Settings',
    trialDay: 'Trial day 3',
    liveConcierge:
      'Your AI concierge is live and handling guest requests.',
  },

  it: {
    overview: 'Panoramica',
    concierge: 'Concierge AI',
    onboarding: 'Onboarding',
    reservations: 'Prenotazioni',
    availability: 'Disponibilità',
    analytics: 'Analytics',
    settings: 'Impostazioni',
    trialDay: 'Giorno di prova 3',
    liveConcierge:
      'Il tuo concierge AI è attivo e gestisce le richieste dei clienti.',
  },

  es: {
    overview: 'Resumen',
    concierge: 'Conserje AI',
    onboarding: 'Onboarding',
    reservations: 'Reservas',
    availability: 'Disponibilidad',
    analytics: 'Analíticas',
    settings: 'Configuración',
    trialDay: 'Día de prueba 3',
    liveConcierge:
      'Tu concierge AI está activo y gestionando solicitudes.',
  },

  fr: {
    overview: 'Vue générale',
    concierge: 'Concierge AI',
    onboarding: 'Onboarding',
    reservations: 'Réservations',
    availability: 'Disponibilité',
    analytics: 'Analytiques',
    settings: 'Paramètres',
    trialDay: 'Jour d’essai 3',
    liveConcierge:
      'Votre concierge AI est actif et gère les demandes clients.',
  },

  de: {
    overview: 'Übersicht',
    concierge: 'Concierge AI',
    onboarding: 'Onboarding',
    reservations: 'Reservierungen',
    availability: 'Verfügbarkeit',
    analytics: 'Analysen',
    settings: 'Einstellungen',
    trialDay: 'Testtag 3',
    liveConcierge:
      'Ihr AI-Concierge ist aktiv und bearbeitet Gästeanfragen.',
  },
} as const;