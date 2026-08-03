import { useCallback, useEffect, useState } from 'react';

import {
  getFloorPlans,
  getRestaurants,
  getServiceAreas,
  getTables,
  type FloorPlanResponse,
  type ServiceAreaResponse,
  type TableResponse,
} from '@/lib/api';

type UseFloorPlanLoaderOptions = {
  onError: (message: string) => void;
};

export function useFloorPlanLoader({
  onError,
}: UseFloorPlanLoaderOptions) {
  const [restaurantId, setRestaurantId] = useState<string | null>(
    null,
  );

  const [serviceAreas, setServiceAreas] = useState<
    ServiceAreaResponse[]
  >([]);

  const [selectedAreaId, setSelectedAreaId] = useState<
    string | null
  >(null);

  const [floorPlans, setFloorPlans] = useState<
    FloorPlanResponse[]
  >([]);

  const [selectedFloorPlanId, setSelectedFloorPlanId] =
    useState<string | null>(null);

  const [tables, setTables] = useState<TableResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTablesForFloorPlan = useCallback(
    async (
      currentRestaurantId: string,
      floorPlanId: string,
    ) => {
      const restaurantTables = await getTables(
        currentRestaurantId,
        floorPlanId,
      );

      return restaurantTables;
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadInitialFloorPlan() {
      try {
        setLoading(true);
        onError('');

        const restaurants = await getRestaurants();
        const restaurant = restaurants[0];

        if (!restaurant) {
          if (!cancelled) {
            setRestaurantId(null);
            setServiceAreas([]);
            setSelectedAreaId(null);
            setFloorPlans([]);
            setSelectedFloorPlanId(null);
            setTables([]);
            onError('No restaurant found.');
          }

          return;
        }

        const areas = await getServiceAreas(restaurant.id);
        const firstArea = areas[0];

        if (!firstArea) {
          if (!cancelled) {
            setRestaurantId(restaurant.id);
            setServiceAreas([]);
            setSelectedAreaId(null);
            setFloorPlans([]);
            setSelectedFloorPlanId(null);
            setTables([]);
            onError('');
          }

          return;
        }

        const plans = await getFloorPlans(
          restaurant.id,
          firstArea.id,
        );

        const defaultPlan =
          plans.find((plan) => plan.is_default) ??
          plans[0];

        if (!defaultPlan) {
          if (!cancelled) {
            setRestaurantId(restaurant.id);
            setServiceAreas(areas);
            setSelectedAreaId(firstArea.id);
            setFloorPlans([]);
            setSelectedFloorPlanId(null);
            setTables([]);
            onError('');
          }

          return;
        }

        const restaurantTables =
          await loadTablesForFloorPlan(
            restaurant.id,
            defaultPlan.id,
          );

        if (cancelled) {
          return;
        }

        setRestaurantId(restaurant.id);
        setServiceAreas(areas);
        setSelectedAreaId(firstArea.id);
        setFloorPlans(plans);
        setSelectedFloorPlanId(defaultPlan.id);
        setTables(restaurantTables);
      } catch (error) {
        console.error('Failed to load floor plan', error);

        if (!cancelled) {
          onError(
            error instanceof Error
              ? error.message
              : 'Unable to load the floor plan.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialFloorPlan();

    return () => {
      cancelled = true;
    };
  }, [loadTablesForFloorPlan, onError]);

  async function refreshServiceAreas() {
    if (!restaurantId) {
      return [];
    }

    const areas = await getServiceAreas(restaurantId);
    setServiceAreas(areas);

    return areas
  }

  async function selectArea(areaId: string) {
    if (!restaurantId || areaId === selectedAreaId) {
      return;
    }

    try {
      setLoading(true);
      onError('');

      const plans = await getFloorPlans(
        restaurantId,
        areaId,
      );

      const defaultPlan =
        plans.find((plan) => plan.is_default) ??
        plans[0];

      if (!defaultPlan) {
        setSelectedAreaId(areaId);
        setFloorPlans(plans);
        setSelectedFloorPlanId(null);
        setTables([]);
        return;
      }

      const restaurantTables =
        await loadTablesForFloorPlan(
          restaurantId,
          defaultPlan.id,
        );

      setSelectedAreaId(areaId);
      setFloorPlans(plans);
      setSelectedFloorPlanId(defaultPlan.id);
      setTables(restaurantTables);
    } catch (error) {
      console.error('Failed to change service area', error);

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to change service area.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function selectFloorPlan(floorPlanId: string) {
    if (
      !restaurantId ||
      floorPlanId === selectedFloorPlanId
    ) {
      return;
    }

    try {
      setLoading(true);
      onError('');

      const restaurantTables =
        await loadTablesForFloorPlan(
          restaurantId,
          floorPlanId,
        );

      setSelectedFloorPlanId(floorPlanId);
      setTables(restaurantTables);
    } catch (error) {
      console.error('Failed to change floor plan', error);

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to change floor plan.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function refreshFloorPlans(areaId?: string) {
    if (!restaurantId) {
      return [];
    }

    const targetAreaId =
      areaId ?? selectedAreaId;

    if (!targetAreaId) {
      return [];
    }

    const plans = await getFloorPlans(
      restaurantId,
      targetAreaId,
    );

    setFloorPlans(plans);

    return plans;
  }

  return {
    restaurantId,

    serviceAreas,
    selectedAreaId,
    selectArea,
    refreshServiceAreas,

    floorPlans,
    selectedFloorPlanId,
    selectFloorPlan,
    refreshFloorPlans,

    tables,
    setTables,
    loading,
  };
}