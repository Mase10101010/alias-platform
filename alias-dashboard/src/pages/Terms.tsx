import { useState } from 'react';
import {
  detectDefaultLanguage,
  languages,
  saveLanguage,
  translations,
  type LanguageCode,
} from '@/lib/i18n';

const termsContent = {
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: June 2026',
    p1: 'Alias provides AI-powered concierge and reservation management services for businesses.',
    p2: 'Users are responsible for the accuracy of information entered into the platform.',
    p3: 'Alias may update features, pricing, and services over time.',
  },
  it: {
    title: 'Termini di Servizio',
    updated: 'Ultimo aggiornamento: giugno 2026',
    p1: 'Alias fornisce servizi di concierge AI e gestione prenotazioni per attività commerciali.',
    p2: 'Gli utenti sono responsabili dell’accuratezza delle informazioni inserite nella piattaforma.',
    p3: 'Alias può aggiornare funzionalità, prezzi e servizi nel tempo.',
  },
  es: {
    title: 'Términos de Servicio',
    updated: 'Última actualización: junio de 2026',
    p1: 'Alias proporciona servicios de concierge con IA y gestión de reservas para empresas.',
    p2: 'Los usuarios son responsables de la exactitud de la información introducida en la plataforma.',
    p3: 'Alias puede actualizar funciones, precios y servicios con el tiempo.',
  },
  fr: {
    title: "Conditions d'Utilisation",
    updated: 'Dernière mise à jour : juin 2026',
    p1: 'Alias fournit des services de concierge IA et de gestion des réservations pour les entreprises.',
    p2: 'Les utilisateurs sont responsables de l’exactitude des informations saisies dans la plateforme.',
    p3: 'Alias peut mettre à jour ses fonctionnalités, ses tarifs et ses services au fil du temps.',
  },
  de: {
    title: 'Nutzungsbedingungen',
    updated: 'Zuletzt aktualisiert: Juni 2026',
    p1: 'Alias bietet KI-gestützte Concierge- und Reservierungsdienste für Unternehmen an.',
    p2: 'Benutzer sind für die Richtigkeit der in die Plattform eingegebenen Informationen verantwortlich.',
    p3: 'Alias kann Funktionen, Preise und Dienstleistungen im Laufe der Zeit aktualisieren.',
  },
};

export function Terms() {

  const [language, setLanguage] = useState<LanguageCode>(
    detectDefaultLanguage(),
  );
  const content = termsContent[language];
  
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-white">
      <div className="mb-10 flex justify-end">
        <select
            value={language}
            onChange={(event) => {
            const nextLanguage = event.target.value as LanguageCode;
            setLanguage(nextLanguage);
            saveLanguage(nextLanguage);
            }}
            className="rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-xs uppercase tracking-[.18em] text-white outline-none"
        >
            {languages.map((item) => (
            <option
                key={item.code}
                value={item.code}
                style={{ backgroundColor: '#111827', color: 'white' }}
            >
                {item.shortLabel}
            </option>
            ))}
        </select>
        </div>
      <h1 className="mb-8 text-4xl font-light">
        {content.title}
      </h1>

      <p className="mb-4 text-white/70">
        {content.updated}
      </p>

      <p className="text-white/70 leading-8">
        {content.p1}
      </p>

      <p className="mt-6 text-white/70 leading-8">
        {content.p2}
      </p>

      <p className="mt-6 text-white/70 leading-8">
        {content.p3}
      </p>
    </div>
  );
}