import {
  forwardRef,
  type MouseEventHandler,
  type ReactNode,
  type WheelEventHandler,
} from 'react';
import { LoaderCircle } from 'lucide-react';

import { cyan } from '@/lib/data';

type FloorCanvasProps = {
  loading: boolean;
  tablesCount: number;
  activeToolIsSelect: boolean;
  zoom: number;
  onCanvasClick: MouseEventHandler<HTMLDivElement>;
  onWheel: WheelEventHandler<HTMLDivElement>;
  children: ReactNode;
};

export const FloorCanvas = forwardRef<
  HTMLDivElement,
  FloorCanvasProps
>(function FloorCanvas(
  {
    loading,
    tablesCount,
    activeToolIsSelect,
    zoom,
    onCanvasClick,
    onWheel,
    children,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      onClick={onCanvasClick}
      onWheel={onWheel}
      className={`relative h-[650px] w-full touch-none overflow-hidden rounded-3xl border border-white/10 bg-black/25 ${
        activeToolIsSelect
          ? 'cursor-default'
          : 'cursor-crosshair'
      }`}
    >
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `scale(${zoom})`,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {children}
      </div>

      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/10">
          <div className="flex items-center gap-3 text-sm text-white/45">
            <LoaderCircle
              size={18}
              className="animate-spin"
              style={{ color: cyan }}
            />
            Loading floor plan...
          </div>
        </div>
      )}

      {!loading && tablesCount === 0 && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center">
          <div>
            <p className="font-display text-2xl font-light text-white/70">
              Your floor plan is empty
            </p>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/35">
              Select a table shape from the toolbar, then click
              anywhere inside the room to create it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});