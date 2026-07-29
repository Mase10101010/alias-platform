import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getReservations,
  type ReservationResponse,
} from '@/lib/api';

export type LiveTableStatus =
  | 'available'
  | 'reserved'
  | 'occupied';

export type LiveTableState = {
  status: LiveTableStatus;
  reservation: ReservationResponse | null;
};

type UseLiveFloorParams = {
  restaurantId: string | null;
  enabled: boolean;
  selectedDate: Date;
  onError?: (message: string) => void;
};

function getDayWindow(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function isReservationActive(
  reservation: ReservationResponse,
  now: Date,
) {
  const reservationStart = new Date(
    reservation.reservation_time,
  );

  const reservationEnd = new Date(
    reservationStart.getTime() +
      reservation.duration_minutes * 60_000,
  );

  return now >= reservationStart && now < reservationEnd;
}

function getReservationPriority(
  reservation: ReservationResponse,
  now: Date,
) {
  if (reservation.status === 'seated') {
    return 3;
  }

  if (isReservationActive(reservation, now)) {
    return 2;
  }

  return 1;
}

export function useLiveFloor({
  restaurantId,
  enabled,
  selectedDate,
  onError,
}: UseLiveFloorParams) {
  const [reservations, setReservations] = useState<
    ReservationResponse[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [lastUpdatedAt, setLastUpdatedAt] =
    useState<Date | null>(null);

  const loadReservations = useCallback(async () => {
    if (!restaurantId || !enabled) {
      setReservations([]);
      return;
    }

    try {
      setLoading(true);

      const { start, end } = getDayWindow(selectedDate);

      const loaded = await getReservations({
        restaurantId,
        start,
        end,
        limit: 500,
      });

      setReservations(
        loaded.filter(
          (reservation) =>
            reservation.status !== 'cancelled' &&
            reservation.status !== 'no_show' &&
            reservation.status !== 'completed',
        ),
      );

      setLastUpdatedAt(new Date());
    } catch (error) {
      console.error(
        'Failed to load live floor reservations',
        error,
      );

      onError?.(
        error instanceof Error
          ? error.message
          : 'Unable to load live floor reservations.',
      );
    } finally {
      setLoading(false);
    }
  }, [
    enabled,
    onError,
    restaurantId,
    selectedDate,
  ]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const tableStates = useMemo(() => {
    const now = new Date();

    const reservationsByTable = new Map<
      string,
      ReservationResponse[]
    >();

    for (const reservation of reservations) {
      if (!reservation.table_id) {
        continue;
      }

      const tableReservations =
        reservationsByTable.get(reservation.table_id) ?? [];

      tableReservations.push(reservation);

      reservationsByTable.set(
        reservation.table_id,
        tableReservations,
      );
    }

    const states = new Map<string, LiveTableState>();

    for (const [tableId, tableReservations] of reservationsByTable) {
      const orderedReservations = [...tableReservations].sort(
        (left, right) => {
          const priorityDifference =
            getReservationPriority(right, now) -
            getReservationPriority(left, now);

          if (priorityDifference !== 0) {
            return priorityDifference;
          }

          return (
            new Date(left.reservation_time).getTime() -
            new Date(right.reservation_time).getTime()
          );
        },
      );

      const reservation = orderedReservations[0];

      const occupied =
        reservation.status === 'seated' ||
        isReservationActive(reservation, now);

      states.set(tableId, {
        status: occupied ? 'occupied' : 'reserved',
        reservation,
      });
    }

    return states;
  }, [reservations]);

  const getTableState = useCallback(
    (tableId: string): LiveTableState => {
      return (
        tableStates.get(tableId) ?? {
          status: 'available',
          reservation: null,
        }
      );
    },
    [tableStates],
  );

  return {
    reservations,
    loading,
    lastUpdatedAt,
    refresh: loadReservations,
    getTableState,
  };
}