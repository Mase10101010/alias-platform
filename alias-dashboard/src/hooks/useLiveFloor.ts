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

function getReservationWindow(reservation: ReservationResponse) {
  const start = new Date(reservation.reservation_time);
  const end = new Date(
    start.getTime() + reservation.duration_minutes * 60_000,
  );

  return { start, end };
}

function isReservationActive(
  reservation: ReservationResponse,
  selectedMoment: Date,
) {
  const { start, end } = getReservationWindow(reservation);

  return selectedMoment >= start && selectedMoment < end;
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

  const selectedDayKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;

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
  }, [enabled, onError, restaurantId, selectedDayKey]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const tableStates = useMemo(() => {
    const selectedMoment = new Date(selectedDate);

    const reservationsByTable = new Map<
      string,
      ReservationResponse[]
    >();

    for (const reservation of reservations) {
      if (!reservation.table_id) continue;

      const current =
        reservationsByTable.get(reservation.table_id) ?? [];

      current.push(reservation);
      reservationsByTable.set(reservation.table_id, current);
    }

    const states = new Map<string, LiveTableState>();

    for (const [tableId, tableReservations] of reservationsByTable) {
      const relevantReservations = tableReservations
        .filter((reservation) => {
          if (reservation.status === 'seated') return true;

          const { end } = getReservationWindow(reservation);
          return end > selectedMoment;
        })
        .sort((left, right) => {
          if (left.status === 'seated' && right.status !== 'seated') {
            return -1;
          }

          if (right.status === 'seated' && left.status !== 'seated') {
            return 1;
          }

          const leftActive = isReservationActive(
            left,
            selectedMoment,
          );
          const rightActive = isReservationActive(
            right,
            selectedMoment,
          );

          if (leftActive !== rightActive) {
            return leftActive ? -1 : 1;
          }

          return (
            new Date(left.reservation_time).getTime() -
            new Date(right.reservation_time).getTime()
          );
        });

      const reservation = relevantReservations[0];

      if (!reservation) continue;

      const occupied =
        reservation.status === 'seated' ||
        isReservationActive(reservation, selectedMoment);

      states.set(tableId, {
        status: occupied ? 'occupied' : 'reserved',
        reservation,
      });
    }

    return states;
  }, [reservations, selectedDate]);

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