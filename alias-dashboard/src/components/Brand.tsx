import { cyan, cyanDeep } from '@/lib/data';

export function AliasMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
        <defs>
          <linearGradient id="alias-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8F4F6" />
            <stop offset="100%" stopColor={cyanDeep} />
          </linearGradient>
        </defs>
        <path d="M12 2 L21 22 H17.2 L15.6 18 H8.4 L6.8 22 H3 Z M9.6 15 H14.4 L12 9 Z" fill="url(#alias-a)" />
      </svg>
      {!compact && <span className="tracking-[0.28em] text-sm font-light text-white">ALIAS</span>}
    </div>
  );
}

export function StatusPill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em]" style={{ borderColor: `${cyan}35`, color: cyan, background: `${cyan}10` }}>{children}</span>;
}
