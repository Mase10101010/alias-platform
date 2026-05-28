import { Mail, MessageCircle } from 'lucide-react';
import { cyan } from '@/lib/data';

import {
    detectDefaultLanguage,
    translations,
} from '@/lib/i18n';

export function Support() {
  const language = detectDefaultLanguage();
  const t = translations[language];
  
  return (
    <div className="mx-auto max-w-4xl">
      <p
        className="text-[11px] uppercase tracking-[0.28em]"
        style={{ color: cyan }}
      >
        {t.supportTitle}
      </p>

      <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em] text-white">
        {t.supportHeading}
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
        {t.supportDescription}
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: `${cyan}15`,
              color: cyan,
            }}
          >
            <Mail size={20} />
          </div>

          <h2 className="mt-6 font-display text-2xl font-light">
            {t.supportEmailTitle}
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/45">
            {t.supportEmailDescription}
          </p>

          <a
            href="mailto:support@aliasconcierge.com"
            className="mt-6 inline-flex rounded-full px-5 py-3 text-sm text-black"
            style={{ background: cyan }}
          >
            support@aliasconcierge.com
          </a>
        </div>

        <div className="glass rounded-3xl p-6">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: `${cyan}15`,
              color: cyan,
            }}
          >
            <MessageCircle size={20} />
          </div>

          <h2 className="mt-6 font-display text-2xl font-light">
            {t.supportFastResponseTitle}
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/45">
            {t.supportFastResponseDescription}
          </p>
        </div>
      </div>
    </div>
  );
}