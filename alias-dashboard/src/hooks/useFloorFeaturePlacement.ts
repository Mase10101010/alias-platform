import { useEffect, useRef, useState } from 'react';
import type {
  MouseEvent as ReactMouseEvent,
  RefObject,
} from 'react';

import {
  createFloorFeature,
  type FloorFeatureResponse,
  type FloorFeatureType,
} from '@/lib/api';

import type { EditorTool } from '@/components/floorplan/Toolbar';
import { snapToGrid } from '@/hooks/useFloorGeometry';

const featureTools: Partial<Record<EditorTool, FloorFeatureType>> = {
  'add-window': 'window',
  'add-door': 'door',
  'add-wall': 'wall',
  'add-bar-counter': 'bar_counter',
  'add-sofa': 'sofa',
  'add-entrance': 'entrance',
  'add-other': 'other',
};

const dimensions: Record<FloorFeatureType, {
  width: number;
  height: number;
}> = {
  window: { width: 100, height: 16 },
  door: { width: 80, height: 18 },
  wall: { width: 160, height: 12 },
  bar_counter: { width: 160, height: 60 },
  sofa: { width: 120, height: 60 },
  entrance: { width: 100, height: 35 },
  other: { width: 80, height: 60 },
};

type Options = {
  canvasRef: RefObject<HTMLDivElement | null>;
  restaurantId: string | null;
  areaId: string | null;
  floorPlanId: string | null;
  floorBounds: { width: number; height: number } | null;
  activeTool: EditorTool;
  zoom: number;
  pan: { x: number; y: number };
  onCreated: (feature: FloorFeatureResponse) => void;
  onError: (message: string) => void;
};

export function useFloorFeaturePlacement({
  canvasRef,
  restaurantId,
  areaId,
  floorPlanId,
  floorBounds,
  activeTool,
  zoom,
  pan,
  onCreated,
  onError,
}: Options) {
  const [creating, setCreating] = useState(false);
  const creatingRef = useRef(false);

  const scopeKey =
    restaurantId && areaId && floorPlanId
      ? `${restaurantId}:${areaId}:${floorPlanId}`
      : null;

  const currentScopeRef = useRef(scopeKey);
  currentScopeRef.current = scopeKey;

  useEffect(() => {
    return () => {
      currentScopeRef.current = null;
    };
  }, []);

  async function handleFeatureCanvasClick(
    event: ReactMouseEvent<HTMLDivElement>,
  ): Promise<boolean> {
    const featureType = featureTools[activeTool];

    if (!featureType) {
      return false;
    }

    event.preventDefault();

    if (
      creatingRef.current ||
      !restaurantId ||
      !areaId ||
      !floorPlanId ||
      !floorBounds ||
      !canvasRef.current ||
      zoom <= 0
    ) {
      return true;
    }

    const size = dimensions[featureType];

    if (
      size.width > floorBounds.width ||
      size.height > floorBounds.height
    ) {
      onError('This feature does not fit inside the floor plan.');
      return true;
    }

    const rect = canvasRef.current.getBoundingClientRect();

    const pointerX = (event.clientX - rect.left - pan.x) / zoom;
    const pointerY = (event.clientY - rect.top - pan.y) / zoom;

    const x = Math.min(
      Math.max(0, snapToGrid(pointerX - size.width / 2)),
      floorBounds.width - size.width,
    );

    const y = Math.min(
      Math.max(0, snapToGrid(pointerY - size.height / 2)),
      floorBounds.height - size.height,
    );

    const creationScopeKey = scopeKey;

    creatingRef.current = true;
    setCreating(true);

    try {
      const created = await createFloorFeature(
        restaurantId,
        areaId,
        floorPlanId,
        {
          feature_type: featureType,
          x: Math.round(x),
          y: Math.round(y),
          width: size.width,
          height: size.height,
          rotation: 0,
          is_visible: true,
        },
      );

      if (currentScopeRef.current === creationScopeKey) {
        onCreated(created);
      }
    } catch (error) {
      if (currentScopeRef.current === creationScopeKey) {
        onError(
          error instanceof Error
            ? error.message
            : 'Unable to create floor feature.',
        );
      }
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }

    return true;
  }

  return {
    creatingFeature: creating,
    handleFeatureCanvasClick,
  };
}
