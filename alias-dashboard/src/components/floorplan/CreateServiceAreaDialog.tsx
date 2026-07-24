import type { ServiceAreaType } from '@/lib/api';

type CreateServiceAreaDialogProps = {
  open: boolean;
  name: string;
  areaType: ServiceAreaType;
  creating: boolean;
  onNameChange: (value: string) => void;
  onAreaTypeChange: (value: ServiceAreaType) => void;
  onCancel: () => void;
  onCreate: () => void;
};

const areaTypes: Array<{
  value: ServiceAreaType;
  label: string;
}> = [
  { value: 'indoor', label: 'Indoor dining room' },
  { value: 'terrace', label: 'Terrace' },
  { value: 'garden', label: 'Garden' },
  { value: 'outdoor', label: 'Outdoor area' },
  { value: 'bar', label: 'Bar' },
  { value: 'private', label: 'Private room' },
  { value: 'rooftop', label: 'Rooftop' },
  { value: 'other', label: 'Other' },
];

export function CreateServiceAreaDialog({
  open,
  name,
  areaType,
  creating,
  onNameChange,
  onAreaTypeChange,
  onCancel,
  onCreate,
}: CreateServiceAreaDialogProps) {
  if (!open) {
    return null;
  }

  const canCreate =
    name.trim().length > 0 &&
    !creating;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0"
        onClick={() => {
          if (!creating) {
            onCancel();
          }
        }}
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0b101b] p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[.25em] text-white/30">
          Restaurant area
        </p>

        <h2 className="mt-3 font-display text-2xl font-light text-white">
          Create a new area
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-white/40">
          Alias will automatically create a default floor plan
          for this area.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35">
              Area name
            </span>

            <input
              type="text"
              value={name}
              disabled={creating}
              autoFocus
              placeholder="Terrace"
              onChange={(event) =>
                onNameChange(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  canCreate
                ) {
                  onCreate();
                }

                if (
                  event.key === 'Escape' &&
                  !creating
                ) {
                  onCancel();
                }
              }}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyanAlias/40"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35">
              Area type
            </span>

            <select
              value={areaType}
              disabled={creating}
              onChange={(event) =>
                onAreaTypeChange(
                  event.target.value as ServiceAreaType,
                )
              }
              className="h-11 w-full rounded-xl border border-white/10 bg-[#111827] px-4 text-sm text-white/75 outline-none transition focus:border-cyanAlias/40"
            >
              {areaTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={creating}
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/45 transition hover:bg-white/[.05] hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canCreate}
            onClick={onCreate}
            className="rounded-xl bg-cyanAlias px-5 py-2.5 text-sm font-medium text-[#071015] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {creating ? 'Creating...' : 'Create area'}
          </button>
        </div>
      </div>
    </div>
  );
}