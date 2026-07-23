import {
  Maximize2,
  Minus,
  Plus,
} from 'lucide-react';

type ZoomControlsProps = {
  zoomPercentage: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export function ZoomControls({
  zoomPercentage,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-40 flex items-center overflow-hidden rounded-xl border border-white/10 bg-[#0b101b]/95 shadow-2xl backdrop-blur-xl">
      <button
        type="button"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        aria-label="Zoom out"
        className="flex h-10 w-10 items-center justify-center border-r border-white/10 text-white/55 transition hover:bg-white/[.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
      >
        <Minus size={16} />
      </button>

      <button
        type="button"
        onClick={onReset}
        aria-label="Reset zoom to 100%"
        className="flex h-10 min-w-20 items-center justify-center gap-2 border-r border-white/10 px-3 text-xs font-medium text-white/65 transition hover:bg-white/[.06] hover:text-white"
      >
        <Maximize2 size={14} />
        {zoomPercentage}%
      </button>

      <button
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        aria-label="Zoom in"
        className="flex h-10 w-10 items-center justify-center text-white/55 transition hover:bg-white/[.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}