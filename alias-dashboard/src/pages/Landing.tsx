import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Globe2,
  LayoutDashboard,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Table2,
  Zap,
} from 'lucide-react';

import { AliasMark } from '@/components/Brand';
import { cyan } from '@/lib/data';
import { useEffect, useState } from 'react';
import {
  detectDefaultLanguage,
  languages,
  saveLanguage,
  type LanguageCode,
} from '@/lib/i18n';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};



const benefits = [];

type CurrencyCode =
  | 'EUR'
  | 'USD'
  | 'AUD'
  | 'GBP'
  | 'CAD'
  | 'CHF';

type CurrencyConfiguration = {
  code: CurrencyCode;
  label: string;
  amount: number;
  locale: string;
};

const CURRENCY_STORAGE_KEY =
  'alias_landing_currency';

const currencies: CurrencyConfiguration[] = [
  {
    code: 'EUR',
    label: 'EUR',
    amount: 99,
    locale: 'it-IT',
  },
  {
    code: 'USD',
    label: 'USD',
    amount: 109,
    locale: 'en-US',
  },
  {
    code: 'AUD',
    label: 'AUD',
    amount: 169,
    locale: 'en-AU',
  },
  {
    code: 'GBP',
    label: 'GBP',
    amount: 89,
    locale: 'en-GB',
  },
  {
    code: 'CAD',
    label: 'CAD',
    amount: 149,
    locale: 'en-CA',
  },
  {
    code: 'CHF',
    label: 'CHF',
    amount: 95,
    locale: 'de-CH',
  },
];

const currencyByCode = Object.fromEntries(
  currencies.map((currency) => [
    currency.code,
    currency,
  ]),
) as Record<
  CurrencyCode,
  CurrencyConfiguration
>;

function isCurrencyCode(
  value: string | null,
): value is CurrencyCode {
  return currencies.some(
    (currency) => currency.code === value,
  );
}

function detectDefaultCurrency(): CurrencyCode {
  const storedCurrency = localStorage.getItem(
    CURRENCY_STORAGE_KEY,
  );

  if (isCurrencyCode(storedCurrency)) {
    return storedCurrency;
  }

  const locale =
    navigator.languages?.[0] ??
    navigator.language ??
    'en-US';

  const region = locale
    .split('-')[1]
    ?.toUpperCase();

  const timezone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone;

  if (
    region === 'AU' ||
    timezone?.startsWith('Australia/')
  ) {
    return 'AUD';
  }

  if (region === 'US') {
    return 'USD';
  }

  if (region === 'GB') {
    return 'GBP';
  }

  if (region === 'CA') {
    return 'CAD';
  }

  if (
    region === 'CH' ||
    timezone === 'Europe/Zurich'
  ) {
    return 'CHF';
  }

  const euroRegions = new Set([
    'AT',
    'BE',
    'CY',
    'DE',
    'EE',
    'ES',
    'FI',
    'FR',
    'GR',
    'HR',
    'IE',
    'IT',
    'LT',
    'LU',
    'LV',
    'MT',
    'NL',
    'PT',
    'SI',
    'SK',
  ]);

  if (region && euroRegions.has(region)) {
    return 'EUR';
  }

  return 'EUR';
}

function formatCurrencyPrice(
  currency: CurrencyConfiguration,
) {
  return new Intl.NumberFormat(
    currency.locale,
    {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
    },
  ).format(currency.amount);
}

export function Landing() {
  const [language, setLanguage] = useState<LanguageCode>(
    detectDefaultLanguage(),
  );

  const [currencyCode, setCurrencyCode] =
    useState<CurrencyCode>(() =>
      detectDefaultCurrency(),
    );

  const currency =
    currencyByCode[currencyCode];

  const formattedPrice =
    formatCurrencyPrice(currency);

  useEffect(() => {
    localStorage.setItem(
      CURRENCY_STORAGE_KEY,
      currencyCode,
    );
  }, [currencyCode]);

  const landingText = {
    en: {
      login: 'Login',
      aiBenefits: [
        ['Save time', 'Automate repetitive requests'],
        ['Increase bookings', 'Capture demand 24/7'],
        ['Happy guests', 'Faster responses'],
      ],
      benefitsTitle: 'Everything you need',
      benefitsSubtitle: 'All in one place.',
      benefits: [
       'AI-powered reservation assistant',
       'Real-time availability management',
       'Public booking page',
       'QR code access for guests',
       'Reservation dashboard',
        'Multilingual support',
       'Direct email support',
       'Continuous improvements',
      ],
      footerTagline: "AI Reservations for Modern Restaurants",
      finalTitle: "Transform the way your restaurant manages reservations.",
      finalDescription:
        "Give your guests a better booking experience while your team stays in control.",
      startTrial: 'Start Free Trial',
      pricing: "Pricing",
      pricePeriod: "/month",
      unlimitedReservations: "Unlimited reservations",
      unlimitedGuests: "Unlimited guests",
      unlimitedConversations: "Unlimited AI conversations",
      emailSupport: "Direct email support",
      pricingFooter: "No setup fees. Cancel anytime.",
      badge: 'AI Reservations for Modern Restaurants',
      title: 'Never miss a reservation again',
      description:
        'Alias helps restaurants automate bookings, manage availability, and provide guests with a modern AI-powered reservation experience. All from a single workspace.',
      contact: 'Contact Us',
      noSetup: 'No setup fees',
      trial: '7-day free trial',
      cancel: 'Cancel anytime',
      liveAi: 'Live AI',
      overview: 'Overview',
      welcome: 'Welcome, Restaurant.',
      overviewDescription:
        'Live operational overview powered by Alias Concierge AI.',
      reservations: 'Reservations',
      confirmed: 'Confirmed',
      concierge: 'Concierge',
      live: 'Live',
      recentActivity: 'Recent activity',
      newReservation: 'New reservation',
      reservationConfirmed: 'Reservation confirmed',
      guestRequestCaptured: 'Guest request captured',
      table4: 'Table 4 · 08:30 PM',
      table2: 'Table 2 · 07:30 PM',
      aiLiveTitle: 'Your AI concierge is live',
      aiLiveDescription:
        'Guests can book, ask questions, and make requests 24/7.',
      whatAliasDoes: 'What Alias does',
      digitalFrontDesk: 'Your digital front desk, working for you.',
      steps: [
        {
            title: 'Create your account',
            text: 'Sign up with your email and create your restaurant workspace.',
        },
        {
            title: 'Start your free trial',
            text: 'Activate your 7-day trial and explore the complete platform.',
        },
        {
            title: 'Configure your restaurant',
            text: 'Set opening hours, tables, capacity and preferences.',
        },
        {
            title: 'Launch your AI concierge',
            text: 'Your AI assistant goes live and starts helping your guests.',
        },
      ],
      features: [
        {
            title: '24/7 Reservations',
            text: 'Let guests book at any time, even outside opening hours.',
        },
        {
            title: 'AI Concierge',
            text: 'A conversational assistant that handles bookings, questions and special requests.',
        },
        {
            title: 'Smart Table Management',
            text: 'Manage tables, capacity and availability from one clean workspace.',
        },
        {
            title: 'Restaurant Dashboard',
            text: 'Track reservations, guests and live activity in real time.',
        },
        {
            title: 'Multilingual Support',
            text: 'Communicate with guests in their preferred language.',
        },
        {
            title: 'You Stay in Control',
            text: 'Alias respects your opening hours, availability and restaurant rules.',
        },
        ],
      gettingStarted: 'Getting started',
      conversation: [
        "Hello! I'm your AI concierge. How can I assist you today?",
        "I need a table for 4 people this Friday around 7:30pm.",
        "Great news! I found availability for Friday at 7:30pm for 4 guests. Would you like me to confirm this table?",
        "Perfect, please book it!",
        "Done! Your table is booked. See you on Friday.",
      ],
      launchTitle: 'Launch your AI concierge in minutes.',
      aiSectionBadge: 'AI Concierge',
      liveConversation: 'Live conversation',
      aiSectionTitle: 'Real conversations. Real reservations.',
      aiSectionDescription:
        'Alias handles reservations, checks availability, answers guest questions and collects booking details while your team stays in complete control from the dashboard.',
    },
    it: {
      features: [
        {
            title: 'Prenotazioni 24/7',
            text: 'Permetti agli ospiti di prenotare in qualsiasi momento, anche fuori dall’orario di apertura.',
        },
        {
            title: 'AI Concierge',
            text: 'Un assistente AI che gestisce prenotazioni, domande e richieste speciali.',
        },
        {
            title: 'Gestione intelligente dei tavoli',
            text: "Gestisci tavoli, capienza e disponibilità da un'unica dashboard.",
        },
        {
            title: 'Dashboard del ristorante',
            text: 'Controlla prenotazioni, clienti e attività in tempo reale.',
        },
        {
            title: 'Supporto multilingua',
            text: 'Comunica con gli ospiti nella loro lingua.',
        },
        {
            title: 'Hai sempre il controllo',
            text: 'Alias rispetta orari, disponibilità e regole del tuo ristorante.',
        },
        ],
        steps: [
            {
                title: 'Crea il tuo account',
                text: 'Registrati con la tua email e crea il tuo spazio di lavoro.',
            },
            {
                title: 'Avvia la prova gratuita',
                text: 'Attiva la prova di 7 giorni ed esplora tutta la piattaforma.',
            },
            {
                title: 'Configura il ristorante',
                text: 'Imposta orari, tavoli, capienza e preferenze.',
            },
            {
                title: 'Lancia il tuo AI Concierge',
                text: 'Il tuo assistente AI entra in funzione e inizia ad aiutare i tuoi clienti.',
            },
        ],
      login: 'Accedi',
      pricing: "Prezzi",
      aiBenefits: [
        ['Risparmia tempo', 'Automatizza le richieste ripetitive'],
        ['Aumenta le prenotazioni', 'Raccogli domanda 24/7'],
        ['Ospiti più soddisfatti', 'Risposte più rapide'],
      ],
      benefitsTitle: 'Tutto ciò di cui hai bisogno',
      benefitsSubtitle: 'Tutto in un unico posto.',
      benefits: [
        'Assistente prenotazioni basato su AI',
        'Gestione disponibilità in tempo reale',
        'Pagina pubblica di prenotazione',
        'Accesso tramite QR code per gli ospiti',
        'Dashboard prenotazioni',
        'Supporto multilingua',
        'Supporto email diretto',
        'Miglioramenti continui',
      ],
      pricePeriod: "/mese",
      footerTagline: "Prenotazioni AI per ristoranti moderni",
      finalTitle: "Trasforma il modo in cui il tuo ristorante gestisce le prenotazioni.",
      finalDescription:
        "Offri ai tuoi ospiti un'esperienza di prenotazione migliore mantenendo sempre il pieno controllo.",
      unlimitedReservations: "Prenotazioni illimitate",
      unlimitedGuests: "Ospiti illimitati",
      unlimitedConversations: "Conversazioni AI illimitate",
      emailSupport: "Supporto via email",
      pricingFooter: "Nessun costo di setup. Cancella quando vuoi.",
      startTrial: 'Inizia la prova gratuita',
      conversation: [
        "Ciao! Sono il tuo AI Concierge. Come posso aiutarti oggi?",
        "Vorrei un tavolo per 4 persone questo venerdì verso le 19:30.",
        "Ottime notizie! Ho trovato disponibilità per venerdì alle 19:30 per 4 persone. Vuoi che confermi la prenotazione?",
        "Perfetto, prenotalo!",
        "Fatto! Il tuo tavolo è confermato. Ti aspettiamo venerdì.",
      ],
      liveConversation: 'Conversazione in tempo reale',
      badge: 'Prenotazioni AI per ristoranti moderni',
      title: 'Non perdere mai più una prenotazione',
      description:
        'Alias aiuta i ristoranti ad automatizzare le prenotazioni, gestire la disponibilità e offrire agli ospiti un’esperienza moderna basata sull’AI. Tutto da un unico spazio di lavoro.',
      contact: 'Contattaci',
      noSetup: 'Nessun costo di setup',
      trial: 'Prova gratuita di 7 giorni',
      cancel: 'Cancella quando vuoi',
      liveAi:'AI attiva',
      overview: 'Panoramica',
      welcome: 'Benvenuto, Ristorante.',
      overviewDescription:
        'Panoramica operativa in tempo reale alimentata da Alias Concierge AI.',
      reservations: 'Prenotazioni',
      confirmed: 'Confermate',
      concierge: 'Concierge',
      live: 'Attivo',
      recentActivity: 'Attività recenti',
      newReservation: 'Nuova prenotazione',
      reservationConfirmed: 'Prenotazione confermata',
      guestRequestCaptured: 'Richiesta cliente ricevuta',
      table4: 'Tavolo 4 · 20:30',
      table2: 'Tavolo 2 · 19:30',
      aiLiveTitle: 'Il tuo AI Concierge è attivo',
      aiLiveDescription:
        'Gli ospiti possono prenotare, fare domande e inviare richieste 24 ore su 24.',
      whatAliasDoes: 'Cosa fa Alias',
      digitalFrontDesk: 'La tua reception digitale, sempre al lavoro.',
      gettingStarted: 'Come iniziare',
      launchTitle: 'Lancia il tuo AI Concierge in pochi minuti.',
      aiSectionBadge: 'AI Concierge',
      aiSectionTitle: 'Conversazioni reali. Prenotazioni reali.',
      aiSectionDescription:
       'Alias gestisce prenotazioni, verifica la disponibilità, risponde alle domande degli ospiti e raccoglie tutti i dettagli della prenotazione, mentre il tuo team mantiene sempre il pieno controllo dalla dashboard.',
    },
    fr: {
      login: 'Connexion',
      startTrial: 'Essai gratuit',
      aiBenefits: [
        ['Gagnez du temps', 'Automatisez les demandes répétitives'],
        ['Augmentez les réservations', 'Captez la demande 24/7'],
        ['Clients satisfaits', 'Réponses plus rapides'],
      ],
      badge: 'Réservations IA pour restaurants modernes',
      title: 'Ne manquez plus jamais une réservation',
      description:
        'Alias aide les restaurants à automatiser les réservations, gérer les disponibilités et offrir aux clients une expérience moderne grâce à l’IA. Le tout depuis un seul espace de travail.',
      contact: 'Nous contacter',
      noSetup: 'Aucun frais d’installation',
      trial: 'Essai gratuit de 7 jours',
      cancel: 'Annulez à tout moment',
      liveAi: 'IA active',
      overview: 'Aperçu',
      welcome: 'Bienvenue, Restaurant.',
      overviewDescription:
        "Vue d'ensemble opérationnelle en temps réel alimentée par Alias Concierge AI.",
      reservations: 'Réservations',
      confirmed: 'Confirmées',
      liveConversation: 'Conversation en direct',
      concierge: 'Concierge',
      pricing: "Tarifs",
      pricePeriod: "/mois",
      unlimitedReservations: "Réservations illimitées",
      unlimitedGuests: "Clients illimités",
      unlimitedConversations: "Conversations IA illimitées",
      emailSupport: "Support par e-mail",
      benefitsTitle: 'Tout ce dont vous avez besoin',
      benefitsSubtitle: 'Tout en un seul endroit.',
      benefits: [
        'Assistant de réservation alimenté par l’IA',
        'Gestion des disponibilités en temps réel',
        'Page publique de réservation',
        'Accès par QR code pour les clients',
        'Tableau de bord des réservations',
        'Support multilingue',
        'Support par e-mail',
        'Améliorations continues',
      ],
      pricingFooter: "Aucun frais d'installation. Annulez à tout moment.",
      live: 'Actif',
      footerTagline: "Réservations IA pour restaurants modernes",
      conversation: [
        "Bonjour ! Je suis votre Concierge IA. Comment puis-je vous aider ?",
        "Je voudrais une table pour 4 personnes ce vendredi vers 19h30.",
        "Excellente nouvelle ! J'ai trouvé une disponibilité vendredi à 19h30 pour 4 personnes. Souhaitez-vous confirmer cette réservation ?",
        "Parfait, confirmez-la !",
        "C'est fait ! Votre table est réservée. À vendredi.",
      ],
      recentActivity: 'Activité récente',
      newReservation: 'Nouvelle réservation',
      reservationConfirmed: 'Réservation confirmée',
      guestRequestCaptured: 'Demande du client reçue',
      table4: 'Table 4 · 20:30',
      table2: 'Table 2 · 19:30',
      finalTitle: "Transformez la façon dont votre restaurant gère les réservations.",
      finalDescription:
        "Offrez à vos clients une meilleure expérience de réservation tout en gardant le contrôle.",
      aiLiveTitle: 'Votre Concierge IA est actif',
      aiLiveDescription:
        'Les clients peuvent réserver, poser des questions et faire des demandes 24h/24.',
      whatAliasDoes: 'Ce que fait Alias',
      steps: [
        {
            title: 'Créez votre compte',
            text: 'Inscrivez-vous avec votre email et créez votre espace restaurant.',
        },
        {
            title: 'Démarrez votre essai gratuit',
            text: 'Activez votre essai de 7 jours et découvrez toute la plateforme.',
        },
        {
            title: 'Configurez votre restaurant',
            text: 'Définissez les horaires, tables, capacités et préférences.',
        },
        {
            title: 'Lancez votre Concierge IA',
            text: 'Votre assistant IA est en ligne et commence à aider vos clients.',
        },
      ],
      digitalFrontDesk: 'Votre réception numérique, toujours active.',
      features: [
        { title: 'Réservations 24/7', text: 'Permettez aux clients de réserver à tout moment, même en dehors des horaires d’ouverture.' },
        { title: 'Concierge IA', text: 'Un assistant conversationnel qui gère les réservations, les questions et les demandes spéciales.' },
        { title: 'Gestion intelligente des tables', text: 'Gérez les tables, la capacité et les disponibilités depuis un seul espace clair.' },
        { title: 'Dashboard restaurant', text: 'Suivez les réservations, les clients et l’activité en temps réel.' },
        { title: 'Support multilingue', text: 'Communiquez avec les clients dans leur langue préférée.' },
        { title: 'Vous gardez le contrôle', text: 'Alias respecte vos horaires, vos disponibilités et les règles de votre restaurant.' },
      ],
      gettingStarted: 'Premiers pas',
      launchTitle: 'Lancez votre Concierge IA en quelques minutes.',
      aiSectionBadge: 'AI Concierge',
      aiSectionTitle: 'De vraies conversations. De vraies réservations.',
      aiSectionDescription:
        "Alias gère les réservations, vérifie les disponibilités, répond aux questions des clients et collecte les informations de réservation pendant que votre équipe garde le contrôle.",
    },
    es: {
      login: 'Iniciar sesión',
      startTrial: 'Prueba gratuita',
      badge: 'Reservas con IA para restaurantes modernos',
      title: 'No pierdas nunca más una reserva',
      description:
        'Alias ayuda a los restaurantes a automatizar reservas, gestionar disponibilidad y ofrecer a los clientes una experiencia moderna impulsada por IA. Todo desde un único espacio de trabajo.',
      contact: 'Contáctanos',
      noSetup: 'Sin costes de instalación',
      trial: 'Prueba gratuita de 7 días',
      cancel: 'Cancela cuando quieras',
      liveAi: 'IA activa',
      overview: 'Resumen',
      welcome: 'Bienvenido, Restaurante.',
      overviewDescription:
        'Resumen operativo en tiempo real impulsado por Alias Concierge AI.',
      reservations: 'Reservas',
      liveConversation: 'Conversación en vivo',
      confirmed: 'Confirmadas',
      concierge: 'Conserje',
      conversation: [
        "¡Hola! Soy tu AI Concierge. ¿Cómo puedo ayudarte?",
        "Quiero una mesa para 4 personas este viernes sobre las 19:30.",
        "¡Buenas noticias! He encontrado disponibilidad para el viernes a las 19:30 para 4 personas. ¿Quieres que confirme la reserva?",
        "Perfecto, ¡resérvala!",
        "¡Listo! Tu mesa está confirmada. Nos vemos el viernes.",
      ],
      live: 'Activo',
      recentActivity: 'Actividad reciente',
      benefitsTitle: 'Todo lo que necesitas',
      benefitsSubtitle: 'Todo en un solo lugar.',
      benefits: [
        'Asistente de reservas con IA',
        'Gestión de disponibilidad en tiempo real',
        'Página pública de reservas',
        'Acceso mediante código QR para los clientes',
        'Panel de reservas',
        'Soporte multilingüe',
        'Soporte por correo electrónico',
        'Mejoras continuas',
      ],
      newReservation: 'Nueva reserva',
      reservationConfirmed: 'Reserva confirmada',
      guestRequestCaptured: 'Solicitud del cliente recibida',
      table4: 'Mesa 4 · 20:30',
      table2: 'Mesa 2 · 19:30',
      pricing: "Precios",
      pricePeriod: "/mes",
      aiBenefits: [
        ['Ahorra tiempo', 'Automatiza solicitudes repetitivas'],
        ['Aumenta las reservas', 'Captura demanda 24/7'],
        ['Clientes satisfechos', 'Respuestas más rápidas'],
      ],
      footerTagline: "Reservas con IA para restaurantes modernos",
      finalTitle: "Transforma la forma en que tu restaurante gestiona las reservas.",
      finalDescription:
        "Ofrece a tus clientes una mejor experiencia de reserva mientras tu equipo mantiene el control.",
      unlimitedReservations: "Reservas ilimitadas",
      unlimitedGuests: "Clientes ilimitados",
      unlimitedConversations: "Conversaciones IA ilimitadas",
      emailSupport: "Soporte por correo electrónico",
      pricingFooter: "Sin costes de instalación. Cancela cuando quieras.",
      aiLiveTitle: 'Tu AI Concierge está activo',
      aiLiveDescription:
        'Los clientes pueden reservar, hacer preguntas y enviar solicitudes las 24 horas.',
      whatAliasDoes: 'Qué hace Alias',
      steps: [
        {
            title: 'Crea tu cuenta',
            text: 'Regístrate con tu correo y crea el espacio de trabajo de tu restaurante.',
        },
        {
            title: 'Comienza la prueba gratuita',
            text: 'Activa la prueba de 7 días y descubre toda la plataforma.',
        },
        {
            title: 'Configura tu restaurante',
            text: 'Define horarios, mesas, capacidad y preferencias.',
        },
        {
            title: 'Lanza tu AI Concierge',
            text: 'Tu asistente IA comienza a ayudar a tus clientes.',
        },
      ],
      digitalFrontDesk: 'Tu recepción digital, siempre trabajando.',
      features: [
        { title: 'Reservas 24/7', text: 'Permite que los clientes reserven en cualquier momento, incluso fuera del horario de apertura.' },
        { title: 'AI Concierge', text: 'Un asistente conversacional que gestiona reservas, preguntas y solicitudes especiales.' },
        { title: 'Gestión inteligente de mesas', text: 'Gestiona mesas, capacidad y disponibilidad desde un único espacio limpio.' },
        { title: 'Dashboard del restaurante', text: 'Controla reservas, clientes y actividad en tiempo real.' },
        { title: 'Soporte multilingüe', text: 'Comunícate con los clientes en su idioma preferido.' },
        { title: 'Mantienes el control', text: 'Alias respeta tus horarios, disponibilidad y reglas del restaurante.' },
      ],
      gettingStarted: 'Primeros pasos',
      launchTitle: 'Lanza tu AI Concierge en pocos minutos.',
      aiSectionBadge: 'AI Concierge',
      aiSectionTitle: 'Conversaciones reales. Reservas reales.',
      aiSectionDescription:
        'Alias gestiona reservas, comprueba la disponibilidad, responde a las preguntas de los clientes y recopila toda la información de la reserva mientras tu equipo mantiene el control.',
    },
    de: {
      login: 'Einloggen',
      startTrial: 'Kostenlos testen',
      liveConversation: 'Live-Konversation',
      badge: 'KI-Reservierungen für moderne Restaurants',
      title: 'Verpassen Sie nie wieder eine Reservierung',
      description:
        'Alias hilft Restaurants, Reservierungen zu automatisieren, Verfügbarkeiten zu verwalten und Gästen ein modernes KI-gestütztes Reservierungserlebnis zu bieten. Alles in einem Workspace.',
      contact: 'Kontakt',
      noSetup: 'Keine Einrichtungsgebühren',
      trial: '7 Tage kostenlos testen',
      cancel: 'Jederzeit kündbar',
      liveAi: 'KI aktiv',
      overview: 'Übersicht',
      welcome: 'Willkommen, Restaurant.',
      pricing: "Preise",
      pricePeriod: "/Monat",
      finalTitle: "Verändern Sie die Art und Weise, wie Ihr Restaurant Reservierungen verwaltet.",
      finalDescription:
        "Bieten Sie Ihren Gästen ein besseres Buchungserlebnis und behalten Sie gleichzeitig die volle Kontrolle.",
      unlimitedReservations: "Unbegrenzte Reservierungen",
      unlimitedGuests: "Unbegrenzte Gäste",
      unlimitedConversations: "Unbegrenzte KI-Gespräche",
      emailSupport: "E-Mail-Support",
      pricingFooter: "Keine Einrichtungsgebühren. Jederzeit kündbar.",
      overviewDescription:
        'Live-Übersicht über den Betrieb mit Alias Concierge AI.',
      reservations: 'Reservierungen',
      confirmed: 'Bestätigt',
      concierge: 'Concierge',
      live: 'Aktiv',
      aiBenefits: [
        ['Zeit sparen', 'Wiederkehrende Anfragen automatisieren'],
        ['Mehr Reservierungen', 'Nachfrage rund um die Uhr erfassen'],
        ['Zufriedene Gäste', 'Schnellere Antworten'],
      ],
      recentActivity: 'Letzte Aktivitäten',
      newReservation: 'Neue Reservierung',
      reservationConfirmed: 'Reservierung bestätigt',
      guestRequestCaptured: 'Gästeanfrage erhalten',
      table4: 'Tisch 4 · 20:30',
      table2: 'Tisch 2 · 19:30',
      benefitsTitle: 'Alles, was Sie brauchen',
      benefitsSubtitle: 'Alles an einem Ort.',
      benefits: [
        'KI-gestützter Reservierungsassistent',
        'Echtzeit-Verfügbarkeitsverwaltung',
        'Öffentliche Reservierungsseite',
        'QR-Code-Zugang für Gäste',
        'Reservierungs-Dashboard',
        'Mehrsprachiger Support',
        'E-Mail-Support',
        'Kontinuierliche Verbesserungen',
      ],
      aiLiveTitle: 'Ihr KI-Concierge ist aktiv',
      conversation: [
        "Hallo! Ich bin Ihr KI-Concierge. Wie kann ich Ihnen helfen?",
        "Ich hätte gern einen Tisch für 4 Personen diesen Freitag gegen 19:30 Uhr.",
        "Gute Nachrichten! Ich habe am Freitag um 19:30 Uhr einen Tisch für 4 Personen gefunden. Soll ich die Reservierung bestätigen?",
        "Perfekt, bitte reservieren!",
        "Erledigt! Ihr Tisch ist reserviert. Bis Freitag.",
      ],
      aiLiveDescription:
       'Gäste können rund um die Uhr reservieren, Fragen stellen und Anfragen senden.',
      whatAliasDoes: 'Was Alias macht',
      footerTagline: "KI-Reservierungen für moderne Restaurants",
      steps: [
        {
            title: 'Erstellen Sie Ihr Konto',
            text: 'Registrieren Sie sich und erstellen Sie Ihren Restaurant-Workspace.',
        },
        {
            title: 'Starten Sie die kostenlose Testversion',
            text: 'Aktivieren Sie die 7-tägige Testversion und entdecken Sie die Plattform.',
        },
        {
            title: 'Restaurant konfigurieren',
            text: 'Legen Sie Öffnungszeiten, Tische und Kapazitäten fest.',
        },
        {
            title: 'KI-Concierge starten',
            text: 'Ihr KI-Assistent geht live und unterstützt Ihre Gäste.',
         },
      ],
      digitalFrontDesk: 'Ihre digitale Rezeption, immer im Einsatz',
      features: [
        { title: 'Intelligente Tischverwaltung', text: 'Verwalten Sie Tische, Kapazität und Verfügbarkeit in einem klaren Workspace.' },
        { title: 'Reservierungen 24/7', text: 'Gäste können jederzeit reservieren, auch außerhalb der Öffnungszeiten.' },
        { title: 'KI-Concierge', text: 'Ein Gesprächsassistent, der Reservierungen, Fragen und Sonderwünsche verwaltet.' },
        { title: 'Restaurant-Dashboard', text: 'Verfolgen Sie Reservierungen, Gäste und Aktivitäten in Echtzeit.' },
        { title: 'Mehrsprachiger Support', text: 'Kommunizieren Sie mit Gästen in ihrer bevorzugten Sprache.' },
        { title: 'Sie behalten die Kontrolle', text: 'Alias respektiert Öffnungszeiten, Verfügbarkeiten und Restaurantregeln.' },
      ],
      gettingStarted: 'Erste Schritte',
      launchTitle: 'Starten Sie Ihren KI-Concierge in wenigen Minuten.',
      aiSectionBadge: 'KI-Concierge',
      aiSectionTitle: 'Echte Gespräche. Echte Reservierungen.',
      aiSectionDescription:
       'Alias verwaltet Reservierungen, prüft Verfügbarkeiten, beantwortet Gästefragen und sammelt alle Reservierungsdaten, während Ihr Team jederzeit die Kontrolle behält.',
    },
  }[language];
  function goToAuth() {
    window.location.href = '/auth';
  }

  return (
    <main className="grain min-h-screen overflow-hidden bg-ink text-white">
      <div
        className="fixed inset-0 -z-10 opacity-[.06]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(circle at 50% 20%, black, transparent 72%)',
        }}
      />

      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 40, 0],
          opacity: [0.16, 0.28, 0.16],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="fixed left-1/2 top-0 -z-10 h-[620px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `${cyan}22` }}
      />

      <motion.div
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 60, -30, 0],
          opacity: [0.06, 0.16, 0.06],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="fixed right-[-240px] top-[420px] -z-10 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: `${cyan}20` }}
      />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <AliasMark />

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(event) => {
                const nextLanguage = event.target.value as LanguageCode;
                setLanguage(nextLanguage);
                saveLanguage(nextLanguage);
            }}
            className="rounded-full border border-white/10 bg-white/[.03] px-3 py-2 text-xs uppercase tracking-[.18em] text-white/70 outline-none"
            >
            {languages.map((item) => (
                <option
                key={item.code}
                value={item.code}
                className="bg-[#050816]"
                >
                {item.shortLabel}
                </option>
            ))}
          </select>

          <select
            aria-label="Currency"
            value={currencyCode}
            onChange={(event) => {
              setCurrencyCode(
                event.target.value as CurrencyCode,
              );
            }}
            className="rounded-full border border-white/10 bg-white/[.03] px-3 py-2 text-xs uppercase tracking-[.14em] text-white/70 outline-none transition hover:border-white/20"
          >
            {currencies.map((item) => (
              <option
                key={item.code}
                value={item.code}
                className="bg-[#050816]"
              >
                {item.label}
              </option>
            ))}
          </select>
          <button
            onClick={goToAuth}
            className="hidden rounded-full border border-white/10 px-5 py-2 text-sm text-white/60 transition hover:border-white/20 hover:text-white sm:block"
          >
            {landingText.login}
          </button>

          <motion.button
            onClick={goToAuth}
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full px-5 py-2 text-sm font-medium text-black shadow-[0_0_35px_rgba(92,242,255,0.18)] transition hover:shadow-[0_0_55px_rgba(92,242,255,0.34)]"
            style={{ background: cyan }}
          >
            {landingText.startTrial}
          </motion.button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[82vh] max-w-7xl items-center gap-14 px-6 py-14 lg:grid-cols-[1fr_540px]">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs uppercase tracking-[.34em] text-white/35"
          >
            {landingText.badge}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="mt-8 max-w-4xl font-display text-5xl font-light leading-[1.02] tracking-[-.055em] text-white md:text-7xl"
          >
            {landingText.title}
            <span style={{ color: cyan }}>.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-white/55"
          >
            {landingText.description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <motion.button
              onClick={goToAuth}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-medium text-black shadow-[0_0_35px_rgba(92,242,255,0.18)] transition hover:shadow-[0_0_60px_rgba(92,242,255,0.38)]"
              style={{ background: cyan }}
            >
              {landingText.startTrial}
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </motion.button>

            <a
              href="mailto:hello@aliasconcierge.com"
              className="flex items-center justify-center rounded-full border border-white/10 px-7 py-4 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
            >
              {landingText.contact}
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap gap-5 text-sm text-white/40"
          >
            <span>{landingText.noSetup}</span>
            <span>•</span>
            <span>{landingText.trial}</span>
            <span>•</span>
            <span>{landingText.cancel}</span>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
          transition={{
            opacity: { duration: 0.8, delay: 0.15 },
            scale: { duration: 0.8, delay: 0.15 },
            y: {
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          className="glass relative rounded-[2rem] p-5 shadow-[0_0_80px_rgba(92,242,255,0.08)]"
        >
          <div
            className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl"
            style={{ background: `${cyan}28` }}
          />

          <div className="rounded-[1.5rem] border border-white/10 bg-[#050707]/85 p-5">
            <div className="mb-8 flex items-center justify-between">
              <AliasMark />
              <motion.span
                animate={{ opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="rounded-full px-3 py-1 text-xs font-medium text-black"
                style={{ background: cyan }}
              >
                {landingText.liveAi}
              </motion.span>
            </div>

            <p className="text-xs uppercase tracking-[.28em] text-white/35">
              {landingText.overview}
            </p>

            <h2 className="mt-3 font-display text-4xl font-light text-white">
              {landingText.welcome}
            </h2>

            <p className="mt-2 text-sm text-white/40">
              {landingText.overviewDescription}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                [landingText.reservations, '14'],
                [landingText.confirmed, '12'],
                [landingText.concierge, landingText.live],
              ].map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.12 }}
                  className="rounded-2xl border border-white/8 bg-white/[.035] p-4"
                >
                  <p className="break-words text-[10px] uppercase tracking-[.14em] text-white/35 sm:tracking-[.22em]">
                    {label}
                  </p>
                  <p className="mt-3 break-words font-display text-2xl text-white sm:text-3xl">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[.025] p-4">
              <p className="text-sm text-white/70">{landingText.recentActivity}</p>

              <div className="mt-4 space-y-3 text-sm text-white/45">
                {[
                  [landingText.newReservation, landingText.table4],
                  [landingText.reservationConfirmed, landingText.table2],
                  [landingText.guestRequestCaptured, 'AI Concierge'],
                ].map(([left, right], index) => (
                  <motion.div
                    key={left}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.9 + index * 0.25,
                      duration: 0.5,
                    }}
                    className="flex justify-between"
                  >
                    <span>{left}</span>
                    <span>{right}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[.025] p-4">
              <div className="flex items-start gap-3">
                <div
                  className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ background: `${cyan}18`, color: cyan }}
                >
                  <Sparkles size={17} />
                </div>

                <div>
                  <p className="text-sm text-white/75">
                    {landingText.aiLiveTitle}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/38">
                    {landingText.aiLiveDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[.34em] text-white/35">
            {landingText.whatAliasDoes}
          </p>

          <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
            {landingText.digitalFrontDesk}
          </h2>
        </motion.div>

        <motion.div
          key={`features-${language}`}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {landingText.features.map((feature, index) => {
            const icons = [
                Clock,
                MessageSquare,
                Table2,
                LayoutDashboard,
                Globe2,
                ShieldCheck,
            ];

            const Icon = icons[index];

            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="glass group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_0_45px_rgba(92,242,255,0.08)]"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 transition group-hover:scale-110"
                  style={{ color: cyan }}
                >
                  <Icon size={22} />
                </div>

                <h3 className="mt-6 text-lg font-medium text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-relaxed text-white/45">
                  {feature.text}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
          >
            <p className="text-xs uppercase tracking-[.34em] text-white/35">
              {landingText.gettingStarted}
            </p>

            <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
              {landingText.launchTitle}
            </h2>
          </motion.div>

          <motion.div
            key={`steps-${language}`}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid gap-4"
          >
            {landingText.steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="glass flex items-center gap-5 rounded-3xl p-5 transition hover:-translate-y-1 hover:border-white/15"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-medium text-black"
                  style={{ background: cyan }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div>
                  <p className="text-lg text-white/80">{step.title}</p>
                  <p className="mt-1 text-sm text-white/40">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>  
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75 }}
          className="glass overflow-hidden rounded-[2rem] p-8 md:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[.34em] text-white/35">
                {landingText.aiSectionBadge}
              </p>

              <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
                {landingText.aiSectionTitle}
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
                {landingText.aiSectionDescription}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {landingText.aiBenefits.map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/8 bg-white/[.025] p-4"
                  >
                    <p className="text-sm text-white/75">{title}</p>
                    <p className="mt-2 text-sm text-white/38">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="rounded-3xl border border-white/10 bg-[#050707]/80 p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[.24em] text-white/35">
                  {landingText.liveConversation}
                </p>
                <span className="flex items-center gap-2 text-xs text-white/45">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: cyan }}
                  />
                  {landingText.live}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="max-w-[85%] rounded-2xl bg-white/[.06] p-4 text-white/65">
                  {landingText.conversation[0]}
                </div>

                <div
                  className="ml-auto max-w-[85%] rounded-2xl p-4 text-black"
                  style={{ background: cyan }}
                >
                  {landingText.conversation[1]}
                </div>

                <div className="max-w-[90%] rounded-2xl bg-white/[.06] p-4 text-white/65">
                  {landingText.conversation[2]}
                </div>

                <div
                  className="ml-auto max-w-[85%] rounded-2xl p-4 text-black"
                  style={{ background: cyan }}
                >
                  {landingText.conversation[3]}
                </div>

                <div className="max-w-[90%] rounded-2xl bg-white/[.06] p-4 text-white/65">
                  {landingText.conversation[4]}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="glass rounded-[2rem] p-8 md:p-10"
          >
            <p className="text-xs uppercase tracking-[.34em] text-white/35">
              {landingText.benefitsTitle}
            </p>

            <h2 className="mt-5 font-display text-4xl font-light tracking-[-.03em] text-white md:text-5xl">
              {landingText.benefitsSubtitle}
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {landingText.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-black"
                    style={{ background: cyan }}
                  >
                    <Check size={14} />
                  </div>
                  <span className="text-white/55">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="glass rounded-[2rem] p-8 md:p-10"
          >
            <p className="text-xs uppercase tracking-[.34em] text-white/35">
              {landingText.pricing}
            </p>

            <div className="mt-6 flex items-center gap-3 text-white/60">
              <CalendarCheck size={22} style={{ color: cyan }} />
              <span>{landingText.trial}</span>
            </div>

            <div className="mt-8">
              <span
                className="font-display text-6xl font-light"
                style={{ color: cyan }}
              >
                {formattedPrice}
              </span>
              <span className="ml-2 text-white/40">{landingText.pricePeriod}</span>
            </div>

            <p className="mt-3 text-xs uppercase tracking-[.18em] text-white/30">
              Billed in {currency.code}
            </p>

            <ul className="mt-7 space-y-3 text-sm text-white/55">
              <li>✓ {landingText.unlimitedReservations}</li>
              <li>✓ {landingText.unlimitedGuests}</li>
              <li>✓ {landingText.unlimitedConversations}</li>
              <li>✓ {landingText.emailSupport}</li>
            </ul>

            <motion.button
              onClick={goToAuth}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 w-full rounded-full px-5 py-3 text-sm font-medium text-black shadow-[0_0_35px_rgba(92,242,255,0.18)] transition hover:shadow-[0_0_55px_rgba(92,242,255,0.34)]"
              style={{ background: cyan }}
            >
              {landingText.startTrial}
            </motion.button>

            <p className="mt-4 text-center text-xs text-white/35">
              {landingText.pricingFooter}
            </p>

            <p className="mt-2 text-center text-[11px] leading-relaxed text-white/25">
              Currency selection will also be used
              during checkout.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75 }}
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Zap className="mx-auto" size={36} style={{ color: cyan }} />
          </motion.div>

          <h2 className="mt-6 font-display text-4xl font-light tracking-[-.03em] text-white md:text-6xl">
            {landingText.finalTitle}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            {landingText.finalDescription}
          </p>

          <motion.button
            onClick={goToAuth}
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 rounded-full px-8 py-4 text-sm font-medium text-black shadow-[0_0_35px_rgba(92,242,255,0.18)] transition hover:shadow-[0_0_60px_rgba(92,242,255,0.38)]"
            style={{ background: cyan }}
          >
            {landingText.startTrial}
          </motion.button>
        </motion.div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
        <span>Alias Concierge</span>
        <span>{landingText.footerTagline}</span>

        <a
          href="mailto:hello@aliasconcierge.com"
          className="flex items-center gap-2 hover:text-white"
        >
          <Mail size={15} />
          hello@aliasconcierge.com
        </a>
      </footer>
    </main>
  );
}      