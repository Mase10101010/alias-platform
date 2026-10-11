import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getFloorFeatures,
  type FloorFeatureResponse,
} from '@/lib/api';

type UseFloorFeaturesOptions = {
  restaurantId: string | null;
  areaId: string | null;
  floorPlanId: string | null;
  onError: (message: string) => void;
};

export function useFloorFeatures({
  restaurantId,
  areaId,
  floorPlanId,
  onError,
}: UseFloorFeaturesOptions) {
  const [features, setFeatures] = useState<FloorFeatureResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  const scopeKey =
    restaurantId && areaId && floorPlanId
      ? `${restaurantId}:${areaId}:${floorPlanId}`
      : null;

  const [loadedScopeKey, setLoadedScopeKey] = useState<string | null>(
    null,
  );

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!restaurantId || !areaId || !floorPlanId || !scopeKey) {
      setFeatures([]);
      setLoadedScopeKey(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getFloorFeatures(
        restaurantId,
        areaId,
        floorPlanId,
      );

      if (requestId !== requestIdRef.current) {
        return;
      }

      setFeatures(result);
      setLoadedScopeKey(scopeKey);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setFeatures([]);
      setLoadedScopeKey(scopeKey);

      console.error('Failed to load floor features', error);

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to load floor features.',
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [restaurantId, areaId, floorPlanId, scopeKey, onError]);

  useEffect(() => {
    void refresh();

    return () => {
      requestIdRef.current += 1;
    };
  }, [refresh]);

  const visibleFeatures =
    loadedScopeKey === scopeKey ? features : [];

  return {
    features: visibleFeatures,
    setFeatures,
    loading,
    refresh,
  };
}
