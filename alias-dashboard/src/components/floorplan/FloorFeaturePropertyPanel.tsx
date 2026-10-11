import { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';

import type {
  FloorFeatureResponse,
  FloorFeatureType,
} from '@/lib/api';

type Props = {
  feature: FloorFeatureResponse | null;
  deleting: boolean;
  saving: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSave: (changes: {
    label: string | null;
    width: number;
    height: number;
    rotation: number;
  }) => Promise<void>;
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
  saving,
  onClose,
  onDelete,
  onSave,
}: Props) {
  const [label, setLabel] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [rotation, setRotation] = useState('');

  useEffect(() => {
    setLabel(feature?.label ?? '');
    setWidth(feature ? String(feature.width) : '');
    setHeight(feature ? String(feature.height) : '');
    setRotation(feature ? String(feature.rotation) : '');
  }, [
    feature?.id,
    feature?.label,
    feature?.width,
    feature?.height,
    feature?.rotation,
  ]);

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
          disabled={saving || deleting}
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

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();

          const w = Number(width);
          const h = Number(height);
          const r = Number(rotation);

          if (
            !Number.isFinite(w) ||
            !Number.isFinite(h) ||
            !Number.isFinite(r) ||
            w < 10 ||
            h < 10 ||
            r < -360 ||
            r > 360
          ) return;

          void onSave({
            label: label.trim() || null,
            width: w,
            height: h,
            rotation: r,
          });
        }}
      >
        <label className="block text-xs text-white/60">
          Name
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            disabled={saving || deleting}
            maxLength={100}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          {([
            ['Width', width, setWidth],
            ['Height', height, setHeight],
          ] as const).map(([name, value, setter]) => (
            <label key={name} className="block text-xs text-white/60">
              {name}
              <input
                type="number"
                min={10}
                step={1}
                required
                value={value}
                onChange={(event) => setter(event.target.value)}
                disabled={saving || deleting}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
              />
            </label>
          ))}
        </div>

        <label className="block text-xs text-white/60">
          Rotation (degrees)
          <input
            type="number"
            min={-360}
            max={360}
            step={1}
            required
            value={rotation}
            onChange={(event) => setRotation(event.target.value)}
            disabled={saving || deleting}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
          />
        </label>

        <button
          type="submit"
          disabled={saving || deleting}
          className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-medium text-black transition hover:bg-cyan-300 disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <button
        type="button"
        onClick={onDelete}
        disabled={saving || deleting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200 transition hover:bg-red-400/15 disabled:opacity-40"
      >
        <Trash2 size={16} />
        {deleting ? 'Deleting...' : 'Delete feature'}
      </button>
    </aside>
  );
}
