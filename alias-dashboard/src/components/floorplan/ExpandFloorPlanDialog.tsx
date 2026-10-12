type ExpandFloorPlanDialogProps = {
  open: boolean;
  currentWidth: number;
  currentHeight: number;
  width: string;
  height: string;
  expanding: boolean;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onCancel: () => void;
  onExpand: () => void;
};

export function ExpandFloorPlanDialog({
  open,
  currentWidth,
  currentHeight,
  width,
  height,
  expanding,
  onWidthChange,
  onHeightChange,
  onCancel,
  onExpand,
}: ExpandFloorPlanDialogProps) {
  if (!open) {
    return null;
  }

  const parsedWidth = Number(width);
  const parsedHeight = Number(height);

  const canExpand =
    Number.isInteger(parsedWidth) &&
    Number.isInteger(parsedHeight) &&
    parsedWidth >= currentWidth &&
    parsedHeight >= currentHeight &&
    parsedWidth >= 400 &&
    parsedHeight >= 400 &&
    parsedWidth <= 5000 &&
    parsedHeight <= 5000 &&
    (parsedWidth > currentWidth ||
      parsedHeight > currentHeight) &&
    !expanding;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0"
        onClick={() => {
          if (!expanding) {
            onCancel();
          }
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="expand-floor-plan-title"
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0b101b] p-6 shadow-2xl"
      >
        <p className="text-xs uppercase tracking-[.25em] text-white/30">
          Floor plan
        </p>

        <h2
          id="expand-floor-plan-title"
          className="mt-3 font-display text-2xl font-light text-white"
        >
          Expand floor plan
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-white/40">
          Increase your workspace without changing the
          positions or sizes of existing tables and features.
        </p>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/[.03] p-4">
          <p className="text-xs uppercase tracking-[.18em] text-white/35">
            Current dimensions
          </p>

          <p className="mt-2 text-lg text-white/80">
            {currentWidth} × {currentHeight}
          </p>

          <p className="mt-1 text-xs text-white/30">
            Canvas units
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35">
              New width
            </span>

            <input
              type="number"
              min={currentWidth}
              max={5000}
              step={1}
              value={width}
              disabled={expanding}
              onChange={(event) =>
                onWidthChange(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm text-white outline-none transition focus:border-cyanAlias/40 disabled:opacity-40"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35">
              New height
            </span>

            <input
              type="number"
              min={currentHeight}
              max={5000}
              step={1}
              value={height}
              disabled={expanding}
              onChange={(event) =>
                onHeightChange(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm text-white outline-none transition focus:border-cyanAlias/40 disabled:opacity-40"
            />
          </label>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-white/35">
          The floor plan expands to the right and bottom.
          Existing tables, walls and windows remain in their
          current positions. Maximum size: 5000 × 5000.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={expanding}
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/45 transition hover:bg-white/[.05] hover:text-white/75 disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canExpand}
            onClick={onExpand}
            className="rounded-xl bg-cyanAlias px-5 py-2.5 text-sm font-medium text-[#071015] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {expanding ? 'Expanding...' : 'Expand floor plan'}
          </button>
        </div>
      </div>
    </div>
  );
}