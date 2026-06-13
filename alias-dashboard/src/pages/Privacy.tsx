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
    sections: [
      'Alias collects and processes information necessary to provide AI concierge, reservation management, customer communication, and hospitality automation services. ',
      'Information may include account details, email addresses, restaurant settings, reservation information, guest details, customer communications, and usage data generated while using the platform. ',
      'Payment information is processed securely by Stripe. Alias does not store full credit card information on its servers. ',
      'Alias may use trusted third-party providers, including hosting, email delivery, artificial intelligence, analytics, and payment processing services, solely for the purpose of operating and improving the platform. ',
      'Alias does not sell personal information or customer data to third parties. ',
      'Users may request access, correction, export, or deletion of their personal data by contacting Alias support, subject to legal and operational requirements. ',
      'Reasonable technical and organizational measures are implemented to protect information against unauthorized access, disclosure, alteration, or destruction. ',
      'Contact: support@aliasconcierge.com',
    ],
  },
  it: {
    title: 'Privacy Policy',
    updated: 'Ultimo aggiornamento: giugno 2026',
    sections: [
      'Alias raccoglie e tratta le informazioni necessarie per fornire servizi di concierge AI, gestione prenotazioni, comunicazione con i clienti e automazione per il settore hospitality. ',
      'Le informazioni possono includere dati dell’account, indirizzi email, impostazioni del ristorante, dati di prenotazione, dati degli ospiti, comunicazioni con i clienti e dati di utilizzo della piattaforma. ',
      'I pagamenti vengono elaborati in modo sicuro tramite Stripe. Alias non memorizza i dati completi delle carte di pagamento sui propri server. ',
      'Alias può utilizzare fornitori terzi affidabili, inclusi servizi di hosting, invio email, intelligenza artificiale, analytics e gestione pagamenti, esclusivamente per fornire e migliorare la piattaforma. ',
      'Alias non vende dati personali o dati dei clienti a terze parti. ',
      'Gli utenti possono richiedere l’accesso, la correzione, l’esportazione o la cancellazione dei propri dati personali contattando il supporto Alias, nei limiti consentiti dalla legge. ',
      'Vengono adottate misure tecniche e organizzative ragionevoli per proteggere le informazioni da accessi non autorizzati, divulgazione, modifica o distruzione. ',
      'Contatto: support@aliasconcierge.com',
    ],
  },
  es: {
    title: 'Política de Privacidad',
    updated: 'Última actualización: junio de 2026',
    sections: [
      'Alias recopila y procesa la información necesaria para proporcionar servicios de conserjería con IA, gestión de reservas y automatización para restaurantes y negocios de hostelería. ',
      'La información puede incluir datos de cuenta, direcciones de correo electrónico, configuraciones del restaurante, reservas, información de clientes y datos de uso. ',
      'Los pagos son procesados de forma segura por Stripe. Alias no almacena información completa de tarjetas de pago. ',
      'Alias puede utilizar proveedores externos de confianza para alojamiento, correo electrónico, inteligencia artificial, análisis y procesamiento de pagos. ',
      'Alias no vende información personal ni datos de clientes a terceros. ',
      'Los usuarios pueden solicitar acceso, corrección, exportación o eliminación de sus datos personales. ',
      'Se implementan medidas técnicas y organizativas razonables para proteger la información. ',
      'Contacto: support@aliasconcierge.com',
    ],
  },
  fr: {
    title: 'Politique de Confidentialité',
    updated: 'Dernière mise à jour : juin 2026',
    sections: [
      'Alias collecte et traite les informations nécessaires pour fournir des services de conciergerie IA, de gestion des réservations et d’automatisation pour le secteur de l’hôtellerie. ',
      'Les informations peuvent inclure les données de compte, les adresses e-mail, les paramètres du restaurant, les réservations, les informations sur les clients et les données d’utilisation. ',
      'Les paiements sont traités de manière sécurisée par Stripe. Alias ne stocke pas les informations complètes de carte bancaire. ',
      'Alias peut faire appel à des prestataires tiers de confiance pour l’hébergement, l’envoi d’e-mails, l’intelligence artificielle, l’analyse et le traitement des paiements. ',
      'Alias ne vend pas les données personnelles ou les données clients à des tiers. ',
      'Les utilisateurs peuvent demander l’accès, la correction, l’exportation ou la suppression de leurs données personnelles. ',
      'Des mesures techniques et organisationnelles raisonnables sont mises en œuvre pour protéger les informations. ',
      'Contact : support@aliasconcierge.com',
    ],
  },
  de: {
    title: 'Datenschutzerklärung',
    updated: 'Zuletzt aktualisiert: Juni 2026',
    sections: [
      'Alias erhebt und verarbeitet Informationen, die für die Bereitstellung von KI-Concierge-, Reservierungs- und Automatisierungsdiensten erforderlich sind. ',
      'Die Informationen können Kontodaten, E-Mail-Adressen, Restauranteinstellungen, Reservierungsdaten, Gästedaten, Kundenkommunikation und Nutzungsdaten umfassen. ',
      'Zahlungen werden sicher über Stripe verarbeitet. Alias speichert keine vollständigen Kreditkartendaten. ',
      'Alias kann vertrauenswürdige Drittanbieter für Hosting, E-Mail-Versand, künstliche Intelligenz, Analysen und Zahlungsabwicklung nutzen. ',
      'Alias verkauft keine personenbezogenen Daten oder Kundendaten an Dritte. ',
      'Benutzer können Zugriff, Berichtigung, Export oder Löschung ihrer personenbezogenen Daten beantragen. ',
      'Es werden angemessene technische und organisatorische Maßnahmen zum Schutz der Daten getroffen. ',
      'Kontakt: support@aliasconcierge.com',
    ],
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


      <p className="text-white/70 leading-8">
        {content.sections}
      </p>

      
    </div>
  );
}