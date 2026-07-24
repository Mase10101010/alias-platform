type CreateFloorPlanDialogProps = {
  open: boolean;
  name: string;
  width: string;
  height: string;
  makeDefault: boolean;
  creating: boolean;
  onNameChange: (value: string) => void;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onMakeDefaultChange: (value: boolean) => void;
  onCancel: () => void;
  onCreate: () => void;
};

export function CreateFloorPlanDialog({
  open,
  name,
  width,
  height,
  makeDefault,
  creating,
  onNameChange,
  onWidthChange,
  onHeightChange,
  onMakeDefaultChange,
  onCancel,
  onCreate,
}: CreateFloorPlanDialogProps) {
  if (!open) {
    return null;
  }

  const parsedWidth = Number(width);
  const parsedHeight = Number(height);

  const canCreate =
    name.trim().length > 0 &&
    Number.isInteger(parsedWidth) &&
    parsedWidth >= 400 &&
    Number.isInteger(parsedHeight) &&
    parsedHeight >= 400 &&
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
          Floor plan
        </p>

        <h2 className="mt-3 font-display text-2xl font-light text-white">
          Create a new layout
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-white/40">
          Create an alternative table arrangement for the
          selected service area.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35">
              Layout name
            </span>

            <input
              type="text"
              value={name}
              disabled={creating}
              autoFocus
              placeholder="Friday Night"
              onChange={(event) =>
                onNameChange(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyanAlias/40"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35">
                Width
              </span>

              <input
                type="number"
                min={400}
                max={5000}
                value={width}
                disabled={creating}
                onChange={(event) =>
                  onWidthChange(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm text-white outline-none transition focus:border-cyanAlias/40"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35">
                Height
              </span>

              <input
                type="number"
                min={400}
                max={5000}
                value={height}
                disabled={creating}
                onChange={(event) =>
                  onHeightChange(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm text-white outline-none transition focus:border-cyanAlias/40"
              />
            </label>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3">
            <input
              type="checkbox"
              checked={makeDefault}
              disabled={creating}
              onChange={(event) =>
                onMakeDefaultChange(event.target.checked)
              }
            />

            <div>
              <p className="text-sm text-white/70">
                Make default layout
              </p>

              <p className="mt-1 text-xs text-white/30">
                Alias will open this layout first for this area.
              </p>
            </div>
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
            {creating ? 'Creating...' : 'Create layout'}
          </button>
        </div>
      </div>
    </div>
  );
}