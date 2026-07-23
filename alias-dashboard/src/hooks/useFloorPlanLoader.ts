import { useEffect, useState } from 'react';

import {
  getRestaurants,
  getTables,
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
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFloorPlan() {
      try {
        setLoading(true);
        onError('');

        const restaurants = await getRestaurants();
        const restaurant = restaurants[0];

        if (!restaurant) {
          if (!cancelled) {
            setRestaurantId(null);
            setTables([]);
            onError('No restaurant found.');
          }

          return;
        }

        const restaurantTables = await getTables(restaurant.id);

        if (cancelled) {
          return;
        }

        setRestaurantId(restaurant.id);
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

    void loadFloorPlan();

    return () => {
      cancelled = true;
    };
  }, [onError]);

  return {
    restaurantId,
    tables,
    setTables,
    loading,
  };
}