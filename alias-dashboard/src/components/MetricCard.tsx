import { cyan } from '@/lib/data';

export function MetricCard({ label, value, detail, accent=false }: { label: string; value: string; detail: string; accent?: boolean }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="font-display text-4xl font-light" style={{ color: accent ? cyan : 'white' }}>{value}</span>
        <span className="mb-1 text-xs text-white/40">{detail}</span>
      </div>
    </div>
  );
}
