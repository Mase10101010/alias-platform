
import { useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Armchair,
  DoorOpen,
  Footprints,
  GlassWater,
  Minus,
  PanelsTopLeft,
  Shapes,
  type LucideProps,
} from 'lucide-react';

import type {
  PointerEventHandler,
  KeyboardEvent,
} from 'react';

import type {
  FloorFeatureResponse,
  FloorFeatureType,
} from '@/lib/api';

type FloorFeatureNodeProps = {
  feature: FloorFeatureResponse;
  selected?: boolean;
  mode?: 'edit' | 'live';
  onClick?: () => void;
  draggingEnabled?: boolean;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  onPointerMove?: PointerEventHandler<HTMLDivElement>;
  onPointerUp?: PointerEventHandler<HTMLDivElement>;
  onPointerCancel?: PointerEventHandler<HTMLDivElement>;
};

const featureAppearance: Record<
  FloorFeatureType,
  {
    label: string;
    icon: React.ComponentType<LucideProps>;
    color: string;
  }
> = {
  window: {
    label: 'Window',
    icon: PanelsTopLeft,
    color: '#7dd3fc',
  },
  door: {
    label: 'Door',
    icon: DoorOpen,
    color: '#fbbf24',
  },
  wall: {
    label: 'Wall',
    icon: Minus,
    color: '#94a3b8',
  },
  bar_counter: {
    label: 'Bar Counter',
    icon: GlassWater,
    color: '#c4b5fd',
  },
  sofa: {
    label: 'Sofa',
    icon: Armchair,
    color: '#86efac',
  },
  entrance: {
    label: 'Entrance',
    icon: Footprints,
    color: '#67e8f9',
  },
  other: {
    label: 'Other',
    icon: Shapes,
    color: '#d4d4d8',
  },
};

export function FloorFeatureNode({
  feature,
  selected = false,
  mode = 'edit',
  onClick,
  draggingEnabled = false,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: FloorFeatureNodeProps) {
  if (!feature.is_visible) {
    return null;
  }

  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  function showTooltip(element: HTMLDivElement) {
    const rect = element.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }

  const appearance = featureAppearance[feature.feature_type];
  const Icon = appearance.icon;
  const isEditable = mode === 'edit';
  const canDrag = isEditable && draggingEnabled;
  const displayLabel = feature.label || appearance.label;

  return (
    <>
    <div
      role={isEditable ? 'button' : undefined}
      tabIndex={isEditable ? 0 : undefined}
      aria-label={`${appearance.label}: ${displayLabel}`}
      onPointerEnter={(event) => {
        if (isEditable && event.pointerType === 'mouse') {
          showTooltip(event.currentTarget);
        }
      }}
      onPointerLeave={() => setTooltipPosition(null)}
      onFocus={(event) => showTooltip(event.currentTarget)}
      onBlur={() => setTooltipPosition(null)}
      onClick={(event) => {
        event.stopPropagation();

        if (isEditable) {
          onClick?.();
        }
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (
          isEditable &&
          (event.key === 'Enter' || event.key === ' ')
        ) {
          event.preventDefault();
          event.stopPropagation();
          onClick?.();
        }
      }}
      onPointerDown={(event) => {
        if (!canDrag) {
          return;
        }

        setTooltipPosition(null);
        onPointerDown?.(event);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
      }}
      className={`absolute flex select-none items-center justify-center overflow-hidden rounded-md border ${
        isEditable
          ? canDrag
            ? 'cursor-grab active:cursor-grabbing'
            : 'cursor-pointer'
          : 'pointer-events-none'
      }`}
      style={{
        left: feature.x,
        top: feature.y,
        width: feature.width,
        height: feature.height,
        transform: `rotate(${feature.rotation}deg)`,
        borderColor: selected ? '#ffffff' : appearance.color,
        backgroundColor: `${appearance.color}22`,
        boxShadow: selected
          ? `0 0 0 2px ${appearance.color}66`
          : 'none',
        zIndex: selected ? 19 : 5,
        touchAction: 'none',
      }}
    >
      <div
        className="flex h-full w-full min-w-0 items-center justify-center gap-1 overflow-hidden px-1"
        style={{
          color: appearance.color,
        }}
      >
        <Icon size={Math.min(18, feature.height - 4)} />
        {feature.width >= 85 && feature.height >= 25 && (
          <span className="truncate text-[10px] font-medium">
            {displayLabel}
          </span>
        )}
      </div>
    </div>
    {tooltipPosition && isEditable && createPortal(
      <div
        role="tooltip"
        className="pointer-events-none fixed z-[9999] w-max max-w-52 -translate-x-1/2 -translate-y-full rounded-xl border border-white/15 bg-[#101722] px-3 py-2 text-left shadow-xl"
        style={{
          left: Math.max(
            110,
            Math.min(window.innerWidth - 110, tooltipPosition.x),
          ),
          top: Math.max(75, tooltipPosition.y - 10),
        }}
      >
        <p className="text-xs font-semibold text-white">
          {displayLabel}
        </p>
        <p className="mt-0.5 text-[11px] text-white/55">
          {appearance.label}
        </p>
        <p className="mt-1 text-[10px] text-cyan-300/80">
          {canDrag
            ? 'Click to select · Drag to move'
            : 'Click to select'}
        </p>
      </div>,
      document.body,
    )}
  </>
  );
}
