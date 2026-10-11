import { Trash2, X } from 'lucide-react';

import type {
  FloorFeatureResponse,
  FloorFeatureType,
} from '@/lib/api';

type Props = {
  feature: FloorFeatureResponse | null;
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const labels: Record<FloorFeatureType, string> = {
  window: 'Window',
  door: 'Door',
  wall: 'Wall',
  bar_counter: 'Bar Counter',
  sofa: 'Sofa',
  entrance: 'Entrance',
  other: 'Other',
};

export function FloorFeaturePropertyPanel({
  feature,
  deleting,
  onClose,
  onDelete,
}: Props) {
  if (!feature) return null;

  return (
    <aside className="w-full rounded-3xl border border-white/10 bg-white/[.035] p-5 lg:w-80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[.24em] text-white/30">
            Spatial feature
          </p>
          <h2 className="mt-2 text-xl font-light text-white">
            {feature.label?.trim() || labels[feature.feature_type]}
          </h2>
          <p className="mt-2 text-xs text-white/40">
            {labels[feature.feature_type]} · {Math.round(feature.width)} × {Math.round(feature.height)}
          </p>
          <p className="mt-1 text-xs text-white/40">
            Position: {Math.round(feature.x)}, {Math.round(feature.y)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close feature properties"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-white/45">
        This physical feature helps Alias understand the restaurant's layout.
        Its position is saved automatically when you move it.
      </p>

      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200 transition hover:bg-red-400/15 disabled:opacity-40"
      >
        <Trash2 size={16} />
        {deleting ? 'Deleting...' : 'Delete feature'}
      </button>
    </aside>
  );
}
