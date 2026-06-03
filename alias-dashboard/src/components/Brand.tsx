import { cyan, cyanDeep } from '@/lib/data';

export function AliasMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center select-none">
      <img
        src="/alias-word.png"
        alt="Alias"
        className={compact ? 'h-8 w-auto' : 'h-9 w-auto'}
      />
    </div>
  );
}

export function StatusPill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em]" style={{ borderColor: `${cyan}35`, color: cyan, background: `${cyan}10` }}>{children}</span>;
}
