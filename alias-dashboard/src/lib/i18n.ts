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
    dashboard: 'Alias Dashboard',
    logout: 'Logout',
    publicWelcome: 'Welcome. I am the concierge for {restaurantName}. I can help you reserve a table, check availability, or share special requests with the team.',
    publicReserveTitle: 'Reserve your table with the restaurant’s concierge.',
    publicSecure: 'Your booking details are sent securely to the restaurant team.',
    publicPlaceholder: 'Example: table for 2 tomorrow at 8pm',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    publicLiveAI: 'Live AI',
    publicChecking: 'Alias is checking availability…',
    publicReservationConfirmed: 'Reservation confirmed',
    publicBookingRegistered: 'Your booking is now registered with {restaurantName}.',
    publicReservationId: 'Reservation ID',
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
    dashboard: 'Dashboard Alias',
    logout: 'Esci',
    publicWelcome: 'Benvenuto. Sono il concierge di {restaurantName}. Posso aiutarti a prenotare un tavolo, controllare la disponibilità o comunicare richieste speciali al team.',
    publicReserveTitle: 'Prenota il tuo tavolo con il concierge del ristorante.',
    publicSecure: 'I dati della tua prenotazione vengono inviati in modo sicuro al team del ristorante.',
    publicPlaceholder: 'Esempio: tavolo per 2 domani alle 20',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    publicLiveAI: 'AI live',
    publicChecking: 'Alias sta controllando la disponibilità…',
    publicReservationConfirmed: 'Prenotazione confermata',
    publicBookingRegistered: 'La tua prenotazione è ora registrata presso {restaurantName}.',
    publicReservationId: 'ID prenotazione',
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
    dashboard: 'Panel Alias',
    logout: 'Salir',
    publicWelcome: 'Bienvenido. Soy el concierge de {restaurantName}. Puedo ayudarte a reservar una mesa, comprobar disponibilidad o comunicar solicitudes especiales al equipo.',
    publicReserveTitle: 'Reserva tu mesa con el concierge del restaurante.',
    publicSecure: 'Los datos de tu reserva se envían de forma segura al equipo del restaurante.',
    publicPlaceholder: 'Ejemplo: mesa para 2 mañana a las 20:00',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    publicLiveAI: 'AI en vivo',
    publicChecking: 'Alias está comprobando la disponibilidad…',
    publicReservationConfirmed: 'Reserva confirmada',
    publicBookingRegistered: 'Tu reserva ya está registrada en {restaurantName}.',
    publicReservationId: 'ID de reserva',
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
    dashboard: 'Tableau de bord Alias',
    logout: 'Déconnexion',
    publicWelcome: 'Bienvenue. Je suis le concierge de {restaurantName}. Je peux vous aider à réserver une table, vérifier les disponibilités ou transmettre des demandes spéciales à l’équipe.',
    publicReserveTitle: 'Réservez votre table avec le concierge du restaurant.',
    publicSecure: 'Les détails de votre réservation sont envoyés de manière sécurisée à l’équipe du restaurant.',
    publicPlaceholder: 'Exemple : table pour 2 demain à 20h',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    publicLiveAI: 'AI en direct',
    publicChecking: 'Alias vérifie les disponibilités…',
    publicReservationConfirmed: 'Réservation confirmée',
    publicBookingRegistered: 'Votre réservation est maintenant enregistrée chez {restaurantName}.',
    publicReservationId: 'ID de réservation',
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
    dashboard: 'Alias Dashboard',
    logout: 'Abmelden',
    publicWelcome: 'Willkommen. Ich bin der Concierge von {restaurantName}. Ich kann Ihnen helfen, einen Tisch zu reservieren, Verfügbarkeiten zu prüfen oder Sonderwünsche an das Team weiterzugeben.',
    publicReserveTitle: 'Reservieren Sie Ihren Tisch mit dem Concierge des Restaurants.',
    publicSecure: 'Ihre Buchungsdaten werden sicher an das Restaurantteam gesendet.',
    publicPlaceholder: 'Beispiel: Tisch für 2 morgen um 20 Uhr',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    publicLiveAI: 'Live AI',
    publicChecking: 'Alias prüft die Verfügbarkeit…',
    publicReservationConfirmed: 'Reservierung bestätigt',
    publicBookingRegistered: 'Ihre Reservierung ist jetzt bei {restaurantName} registriert.',
    publicReservationId: 'Reservierungs-ID',
  },
} as const;