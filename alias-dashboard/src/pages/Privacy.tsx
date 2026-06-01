import { useState } from 'react';
import {
  detectDefaultLanguage,
  languages,
  saveLanguage,
  translations,
  type LanguageCode,
} from '@/lib/i18n';

const privacyContent = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: June 2026',
    p1: 'Alias collects and processes information required to provide restaurant concierge and reservation services.',
    p2: 'Information may include account details, reservation data, restaurant settings, and customer communications.',
    p3: 'Alias does not sell personal data to third parties.',
  },
  it: {
    title: 'Privacy Policy',
    updated: 'Ultimo aggiornamento: giugno 2026',
    p1: 'Alias raccoglie e tratta le informazioni necessarie per fornire servizi di concierge e gestione prenotazioni per ristoranti.',
    p2: 'Le informazioni possono includere dati dell’account, dati di prenotazione, impostazioni del ristorante e comunicazioni con i clienti.',
    p3: 'Alias non vende dati personali a terze parti.',
  },
  es: {
    title: 'Política de Privacidad',
    updated: 'Última actualización: junio de 2026',
    p1: 'Alias recopila y procesa la información necesaria para ofrecer servicios de concierge y gestión de reservas para restaurantes.',
    p2: 'La información puede incluir datos de cuenta, datos de reserva, ajustes del restaurante y comunicaciones con clientes.',
    p3: 'Alias no vende datos personales a terceros.',
  },
  fr: {
    title: 'Politique de Confidentialité',
    updated: 'Dernière mise à jour : juin 2026',
    p1: 'Alias collecte et traite les informations nécessaires pour fournir des services de concierge et de gestion des réservations pour les restaurants.',
    p2: 'Les informations peuvent inclure les données de compte, les données de réservation, les paramètres du restaurant et les communications avec les clients.',
    p3: 'Alias ne vend pas de données personnelles à des tiers.',
  },
  de: {
    title: 'Datenschutzerklärung',
    updated: 'Zuletzt aktualisiert: Juni 2026',
    p1: 'Alias erhebt und verarbeitet Informationen, die erforderlich sind, um Concierge- und Reservierungsdienste für Restaurants bereitzustellen.',
    p2: 'Informationen können Kontodaten, Reservierungsdaten, Restauranteinstellungen und Kundenkommunikation umfassen.',
    p3: 'Alias verkauft keine personenbezogenen Daten an Dritte.',
  },
};

export function Privacy() {
  
  const [language, setLanguage] = useState<LanguageCode>(
    detectDefaultLanguage(),
  );
  const content = privacyContent[language];

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