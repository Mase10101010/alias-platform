
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

  const appearance = featureAppearance[feature.feature_type];
  const Icon = appearance.icon;
  const isEditable = mode === 'edit';
  const canDrag = isEditable && draggingEnabled;
  const displayLabel = feature.label || appearance.label;

  return (
    <div
      role={isEditable ? 'button' : undefined}
      tabIndex={isEditable ? 0 : undefined}
      aria-label={`${appearance.label}: ${displayLabel}`}
      title={displayLabel}
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
  );
}
