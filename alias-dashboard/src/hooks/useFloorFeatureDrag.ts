
import {
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import {
  updateFloorFeature,
  type FloorFeatureResponse,
} from '@/lib/api';

import { snapToGrid } from '@/hooks/useFloorGeometry';

type FloorBounds = {
  width: number;
  height: number;
};

type DragState = {
  featureId: string;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

type Options = {
  restaurantId: string | null;
  areaId: string | null;
  floorPlanId: string | null;
  floorBounds: FloorBounds | null;
  canvasRef: RefObject<HTMLDivElement | null>;
  zoom: number;
  pan: { x: number; y: number };
  enabled: boolean;
  setFeatures: React.Dispatch<
    React.SetStateAction<FloorFeatureResponse[]>
  >;
  onError: (message: string) => void;
};

export function useFloorFeatureDrag({
  restaurantId,
  areaId,
  floorPlanId,
  floorBounds,
  canvasRef,
  zoom,
  pan,
  enabled,
  setFeatures,
  onError,
}: Options) {
  const dragRef = useRef<DragState | null>(null);
  const savingRef = useRef(new Set<string>());
  const currentScopeRef = useRef({
    restaurantId,
    areaId,
    floorPlanId,
  });

  currentScopeRef.current = {
    restaurantId,
    areaId,
    floorPlanId,
  };

  function pointerToFloor(clientX: number, clientY: number) {
    const canvas = canvasRef.current;

    if (!canvas || zoom <= 0) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    feature: FloorFeatureResponse,
  ) {
    if (
      !enabled ||
      !restaurantId ||
      !areaId ||
      !floorPlanId ||
      savingRef.current.has(feature.id) ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    const pointer = pointerToFloor(event.clientX, event.clientY);

    if (!pointer) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      featureId: feature.id,
      pointerId: event.pointerId,
      startPointerX: pointer.x,
      startPointerY: pointer.y,
      startX: feature.x,
      startY: feature.y,
      currentX: feature.x,
      currentY: feature.y,
    };
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
    feature: FloorFeatureResponse,
  ) {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.featureId !== feature.id ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const pointer = pointerToFloor(event.clientX, event.clientY);

    if (!pointer) {
      return;
    }

    const maxX = Math.max(
      0,
      (floorBounds?.width ?? Infinity) - feature.width,
    );

    const maxY = Math.max(
      0,
      (floorBounds?.height ?? Infinity) - feature.height,
    );

    const x = Math.min(
      maxX,
      Math.max(
        0,
        snapToGrid(drag.startX + pointer.x - drag.startPointerX),
      ),
    );

    const y = Math.min(
      maxY,
      Math.max(
        0,
        snapToGrid(drag.startY + pointer.y - drag.startPointerY),
      ),
    );

    drag.currentX = x;
    drag.currentY = y;

    setFeatures((current) =>
      current.map((item) =>
        item.id === feature.id ? { ...item, x, y } : item,
      ),
    );
  }

  async function finishDrag(
    event: ReactPointerEvent<HTMLDivElement>,
    feature: FloorFeatureResponse,
  ) {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.featureId !== feature.id ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    dragRef.current = null;
    event.stopPropagation();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (
      drag.currentX === drag.startX &&
      drag.currentY === drag.startY
    ) {
      return;
    }

    if (!restaurantId || !areaId || !floorPlanId) {
      setFeatures((current) =>
        current.map((item) =>
          item.id === feature.id
            ? { ...item, x: drag.startX, y: drag.startY }
            : item,
        ),
      );
      return;
    }

    const scope = `${restaurantId}:${areaId}:${floorPlanId}`;
    savingRef.current.add(feature.id);
    onError('');

    const isCurrentScope = () => {
      const current = currentScopeRef.current;
      return (
        `${current.restaurantId}:${current.areaId}:${current.floorPlanId}` === scope
      );
    };

    try {
      const updated = await updateFloorFeature(
        restaurantId,
        areaId,
        floorPlanId,
        feature.id,
        { x: drag.currentX, y: drag.currentY },
      );

      if (!isCurrentScope()) {
        return;
      }

      setFeatures((current) =>
        current.map((item) =>
          item.id === feature.id
            ? { ...item, x: updated.x, y: updated.y }
            : item,
        ),
      );
    } catch (error) {
      if (!isCurrentScope()) {
        return;
      }

      setFeatures((current) =>
        current.map((item) =>
          item.id === feature.id
            ? { ...item, x: drag.startX, y: drag.startY }
            : item,
        ),
      );

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to save the new feature position.',
      );
    } finally {
      savingRef.current.delete(feature.id);
    }
  }

  return {
    handlePointerDown,
    handlePointerMove,
    finishDrag,
  };
}
