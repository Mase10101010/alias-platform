import { ChevronDown, Plus } from 'lucide-react';

import type {
  FloorPlanResponse,
  ServiceAreaResponse,
} from '@/lib/api';

type FloorPlanNavigatorProps = {
  serviceAreas: ServiceAreaResponse[];
  selectedAreaId: string | null;
  floorPlans: FloorPlanResponse[];
  selectedFloorPlanId: string | null;
  disabled?: boolean;
  onAreaChange: (areaId: string) => void;
  onFloorPlanChange: (floorPlanId: string) => void;
  onCreateArea?: () => void;
  onCreateFloorPlan?: () => void;
};

export function FloorPlanNavigator({
  serviceAreas,
  selectedAreaId,
  floorPlans,
  selectedFloorPlanId,
  disabled = false,
  onAreaChange,
  onFloorPlanChange,
  onCreateArea,
  onCreateFloorPlan,
}: FloorPlanNavigatorProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {serviceAreas.map((area) => {
          const selected = area.id === selectedAreaId;

          return (
            <button
              key={area.id}
              type="button"
              disabled={disabled}
              onClick={() => onAreaChange(area.id)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                selected
                  ? 'border-cyanAlias/40 bg-cyanAlias/10 text-cyanAlias'
                  : 'border-white/10 bg-white/[.03] text-white/45 hover:bg-white/[.06] hover:text-white/75'
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: area.color }}
              />

              {area.name}
            </button>
          );
        })}

        {onCreateArea && (
          <button
            type="button"
            disabled={disabled}
            onClick={onCreateArea}
            className="flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-2 text-sm text-white/35 transition hover:border-white/25 hover:bg-white/[.04] hover:text-white/65 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={15} />
            New area
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <select
            value={selectedFloorPlanId ?? ''}
            disabled={disabled || floorPlans.length === 0}
            onChange={(event) =>
              onFloorPlanChange(event.target.value)
            }
            className="h-10 min-w-52 appearance-none rounded-xl border border-white/10 bg-[#0b101b] pl-4 pr-10 text-sm text-white/70 outline-none transition focus:border-cyanAlias/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {floorPlans.length === 0 && (
              <option value="">No layouts available</option>
            )}

            {floorPlans.map((floorPlan) => (
              <option
                key={floorPlan.id}
                value={floorPlan.id}
              >
                {floorPlan.name}
                {floorPlan.is_default ? ' — Default' : ''}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
          />
        </div>

        {onCreateFloorPlan && (
          <button
            type="button"
            disabled={disabled || !selectedAreaId}
            onClick={onCreateFloorPlan}
            className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-4 text-sm text-white/45 transition hover:bg-white/[.06] hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={15} />
            New layout
          </button>
        )}
      </div>
    </div>
  );
}