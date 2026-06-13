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
    sections: [
      'Alias provides AI-powered concierge, reservation management, availability management, customer communication, and hospitality automation services for restaurants and hospitality businesses.',
      'By creating an account and using Alias, you agree to provide accurate information, maintain the security of your account, and use the platform in compliance with applicable laws and regulations.',
      'Alias offers a 7-day free trial for eligible accounts. After the trial period ends, subscriptions automatically renew unless cancelled through the billing portal.',
      'Subscription payments are securely processed by Stripe. Alias does not store full payment card information.',
      'Users may cancel their subscription at any time through the Stripe Customer Portal. Cancellation prevents future billing but does not automatically generate refunds for previous billing periods.',
      'Alias may update, modify, suspend, or discontinue features, pricing, or services over time.',
      'Alias is provided on an "as is" basis. We do not guarantee uninterrupted service, error-free operation, or specific business outcomes.',
      'Contact: support@aliasconcierge.com',
    ],
  },
  it: {
    title: 'Privacy Policy',
    updated: 'Ultimo aggiornamento: giugno 2026',
    sections: [
      'Alias fornisce servizi di concierge AI, gestione prenotazioni, gestione disponibilità, comunicazione con i clienti e automazione per ristoranti e attività del settore hospitality.',
      'Creando un account e utilizzando Alias, accetti di fornire informazioni accurate, mantenere sicuro il tuo account e utilizzare la piattaforma nel rispetto delle leggi applicabili.',
      'Alias offre una prova gratuita di 7 giorni per gli account idonei. Al termine del periodo di prova, l’abbonamento si rinnova automaticamente salvo cancellazione tramite il portale di fatturazione.',
      'I pagamenti sono elaborati in modo sicuro tramite Stripe. Alias non memorizza i dati completi delle carte di pagamento.',
      'Gli utenti possono annullare l’abbonamento in qualsiasi momento tramite il Portale Clienti Stripe. La cancellazione impedisce addebiti futuri ma non genera automaticamente rimborsi per periodi già fatturati.',
      'Alias può aggiornare, modificare, sospendere o interrompere funzionalità, prezzi o servizi nel tempo.',
      'Alias viene fornito "così com’è". Non garantiamo disponibilità continua, assenza di errori o specifici risultati commerciali.',
      'Contatto: support@aliasconcierge.com',
    ],
  },
  es: {
    title: 'Política de Privacidad',
    updated: 'Última actualización: junio de 2026',
    sections: [
      'Alias proporciona servicios de conserjería con IA, gestión de reservas, disponibilidad y automatización para restaurantes y negocios de hostelería.',
      'Al crear una cuenta y utilizar Alias, aceptas proporcionar información precisa y mantener la seguridad de tu cuenta.',
      'Alias ofrece una prueba gratuita de 7 días para cuentas elegibles. Después del período de prueba, la suscripción se renovará automáticamente a menos que se cancele.',
      'Los pagos se procesan de forma segura mediante Stripe. Alias no almacena los datos completos de tarjetas de pago.',
      'Los usuarios pueden cancelar su suscripción en cualquier momento a través del Portal de Clientes de Stripe.',
      'Alias puede actualizar, modificar o suspender funciones, precios o servicios con el tiempo.',
      'Alias se proporciona "tal cual". No garantizamos disponibilidad continua ni resultados comerciales específicos.',
      'Contacto: support@aliasconcierge.com',
    ],
  },
  fr: {
    title: 'Politique de Confidentialité',
    updated: 'Dernière mise à jour : juin 2026',
    sections: [
      'Alias fournit des services de conciergerie IA, de gestion des réservations, de gestion des disponibilités et d’automatisation pour les restaurants et les entreprises du secteur de l’hôtellerie.',
      'En créant un compte et en utilisant Alias, vous acceptez de fournir des informations exactes et de sécuriser votre compte.',
      'Alias propose un essai gratuit de 7 jours pour les comptes éligibles. Après cette période, l’abonnement se renouvelle automatiquement sauf annulation.',
      'Les paiements sont traités de manière sécurisée par Stripe. Alias ne stocke pas les informations complètes de carte bancaire.',
      'Les utilisateurs peuvent annuler leur abonnement à tout moment via le portail client Stripe.',
      'Alias peut modifier, suspendre ou supprimer certaines fonctionnalités, tarifs ou services.',
      'Alias est fourni « en l’état » sans garantie de disponibilité continue ou de résultats commerciaux spécifiques.',
      'Contact : support@aliasconcierge.com',
    ],
  },
  de: {
    title: 'Datenschutzerklärung',
    updated: 'Zuletzt aktualisiert: Juni 2026',
    sections: [
      'Alias bietet KI-gestützte Concierge-, Reservierungs-, Verfügbarkeits- und Automatisierungsdienste für Restaurants und Gastgewerbebetriebe an.',
      'Durch die Erstellung eines Kontos und die Nutzung von Alias verpflichten Sie sich, korrekte Informationen bereitzustellen und Ihr Konto sicher zu verwalten.',
      'Alias bietet eine kostenlose 7-Tage-Testversion für berechtigte Konten an. Nach Ablauf des Testzeitraums verlängert sich das Abonnement automatisch, sofern es nicht gekündigt wird.',
      'Zahlungen werden sicher über Stripe verarbeitet. Alias speichert keine vollständigen Kreditkartendaten.',
      'Abonnements können jederzeit über das Stripe-Kundenportal gekündigt werden.',
      'Alias kann Funktionen, Preise oder Dienste im Laufe der Zeit ändern oder einstellen.',
      'Alias wird ohne Gewähr bereitgestellt. Wir garantieren keine unterbrechungsfreie Verfügbarkeit oder bestimmte Geschäftsergebnisse.',
      'Kontakt: support@aliasconcierge.com',
    ],
  },
}

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
        {content.sections}
      </p>

      <p className="mt-6 text-white/70 leading-8">
        {content.sections}
      </p>

      <p className="mt-6 text-white/70 leading-8">
        {content.sections}
      </p>
    </div>
  );
}