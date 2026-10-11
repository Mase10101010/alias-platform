import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getFloorPlanSpatialAnalysis,
  type FloorPlanSpatialAnalysisResponse,
} from '@/lib/api';

type UseSpatialAdvisoryOptions = {
  restaurantId: string | null;
  areaId: string | null;
  floorPlanId: string | null;
};

export function useSpatialAdvisory({
  restaurantId,
  areaId,
  floorPlanId,
}: UseSpatialAdvisoryOptions) {
  const [analysis, setAnalysis] =
    useState<FloorPlanSpatialAnalysisResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedScopeKey, setLoadedScopeKey] =
    useState<string | null>(null);

  const requestIdRef = useRef(0);
  const geometryVersionRef = useRef(0);
  const activeGeometryEditsRef = useRef(
    new Map<string, string | null>(),
  );
  const nextGeometryEditIdRef = useRef(0);

  const scopeKey =
    restaurantId && areaId && floorPlanId
      ? `${restaurantId}:${areaId}:${floorPlanId}`
      : null;

  const currentScopeRef = useRef(scopeKey);
  currentScopeRef.current = scopeKey;

  const invalidate = useCallback(() => {
    geometryVersionRef.current += 1;
    requestIdRef.current += 1;
    setAnalysis(null);
    setLoadedScopeKey(null);
    setError(null);
    setLoading(false);
  }, []);

  const beginGeometryEdit = useCallback((): string => {
    const id = String(++nextGeometryEditIdRef.current);
    activeGeometryEditsRef.current.set(id, scopeKey);
    requestIdRef.current += 1;
    setAnalysis(null);
    setLoadedScopeKey(null);
    setError(null);
    setLoading(false);

    return id;
  }, [scopeKey]);

  const endGeometryEdit = useCallback((id: string): boolean => {
    const edits = activeGeometryEditsRef.current;

    if (!edits.has(id)) {
      return false;
    }

    const editScope = edits.get(id);
    edits.delete(id);

    return editScope === currentScopeRef.current;
  }, []);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const geometryVersion = geometryVersionRef.current;

    const isCurrentScopeEditing = () =>
      [...activeGeometryEditsRef.current.values()].some(
        (editScope) => editScope === scopeKey,
      );

    if (isCurrentScopeEditing()) {
      setAnalysis(null);
      setLoadedScopeKey(null);
      setLoading(false);
      return;
    }

    setAnalysis(null);
    setLoadedScopeKey(null);
    setError(null);

    if (!restaurantId || !areaId || !floorPlanId || !scopeKey) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getFloorPlanSpatialAnalysis(
        restaurantId,
        areaId,
        floorPlanId,
      );

      if (
        requestId !== requestIdRef.current ||
        geometryVersion !== geometryVersionRef.current ||
        isCurrentScopeEditing()
      ) {
        return;
      }

      setAnalysis(result);
      setLoadedScopeKey(scopeKey);
    } catch (caughtError) {
      if (
        requestId !== requestIdRef.current ||
        geometryVersion !== geometryVersionRef.current ||
        isCurrentScopeEditing()
      ) {
        return;
      }

      console.error(
        'Failed to load spatial advisory',
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to load spatial advisory.',
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [restaurantId, areaId, floorPlanId, scopeKey]);

  useEffect(() => {
    void refresh();

    return () => {
      requestIdRef.current += 1;
    };
  }, [refresh]);

  return {
    analysis:
      loadedScopeKey === scopeKey ? analysis : null,
    loading,
    error,
    refresh,
    invalidate,
    beginGeometryEdit,
    endGeometryEdit,
  };
}
