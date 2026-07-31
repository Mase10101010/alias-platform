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

function getSafeFetchWindow(date: Date) {
  // Fetch an intentionally wider range than one calendar day.
  // This avoids losing reservations when the API stores timestamps in UTC
  // while the dashboard displays the restaurant's local calendar day.
  const selectedDayStart = new Date(date);
  selectedDayStart.setHours(0, 0, 0, 0);

  const start = new Date(selectedDayStart);
  start.setDate(start.getDate() - 1);

  const end = new Date(selectedDayStart);
  end.setDate(end.getDate() + 2);

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

const LIVE_SLOT_MINUTES = 30;

const AUTO_REFRESH_INTERVAL_MS = 60_000;

function isViewingCurrentSlot(selectedMoment: Date) {
  const now = new Date();
  const slotEnd = new Date(
    selectedMoment.getTime() + LIVE_SLOT_MINUTES * 60_000,
  );

  return now >= selectedMoment && now < slotEnd;
}

function getSelectedSlot(selectedMoment: Date) {
  const start = new Date(selectedMoment);
  const end = new Date(
    start.getTime() + LIVE_SLOT_MINUTES * 60_000,
  );

  return { start, end };
}

function doesReservationOverlapSelectedSlot(
  reservation: ReservationResponse,
  selectedMoment: Date,
) {
  const reservationWindow = getReservationWindow(reservation);
  const selectedSlot = getSelectedSlot(selectedMoment);

  return (
    reservationWindow.start < selectedSlot.end &&
    reservationWindow.end > selectedSlot.start
  );
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

      const { start, end } = getSafeFetchWindow(selectedDate);

      const loaded = await getReservations({
        restaurantId,
        start,
        end,
        limit: 500,
      });

      const activeReservations = loaded.filter((reservation) => {
        if (
          reservation.status === 'cancelled' ||
          reservation.status === 'no_show' ||
          reservation.status === 'completed'
        ) {
          return false;
        }

        const { start: reservationStart, end: reservationEnd } =
          getReservationWindow(reservation);

        // Keep reservations touching the selected local calendar day,
        // including bookings that cross midnight.
        const selectedDayStart = new Date(selectedDate);
        selectedDayStart.setHours(0, 0, 0, 0);

        const selectedDayEnd = new Date(selectedDayStart);
        selectedDayEnd.setDate(selectedDayEnd.getDate() + 1);

        return (
          reservationStart < selectedDayEnd &&
          reservationEnd > selectedDayStart
        );
      });

      console.log('LIVE FLOOR FETCH', {
        selectedDate,
        start,
        end,
        loadedCount: loaded.length,
        selectedDayCount: activeReservations.length,
        reservations: activeReservations.map((reservation) => ({
          id: reservation.id,
          tableId: reservation.table_id,
          status: reservation.status,
          reservationTime: reservation.reservation_time,
          parsedLocalTime: new Date(
            reservation.reservation_time,
          ).toString(),
        })),
      });

      setReservations(activeReservations);

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

  useEffect(() => {
    if (!enabled || !restaurantId) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (isViewingCurrentSlot(selectedDate)) {
        void loadReservations();
      }
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [enabled, loadReservations, restaurantId, selectedDate]);

  const tableStates = useMemo(() => {
    const selectedMoment = new Date(selectedDate);

    const reservationsByTable = new Map<
      string,
      ReservationResponse[]
    >();

    for (const reservation of reservations) {
      if (!reservation.table_id) {
        continue;
      }

      // A reservation affects the map only when its actual duration
      // overlaps the selected 30-minute slot.
      if (
        !doesReservationOverlapSelectedSlot(
          reservation,
          selectedMoment,
        )
      ) {
        continue;
      }

      const current =
        reservationsByTable.get(reservation.table_id) ?? [];

      current.push(reservation);
      reservationsByTable.set(reservation.table_id, current);
    }

    const states = new Map<string, LiveTableState>();

    for (const [tableId, tableReservations] of reservationsByTable) {
      const reservation = [...tableReservations].sort(
        (left, right) => {
          // Prefer an already seated reservation if overlapping bookings
          // somehow exist for the same table and slot.
          if (
            left.status === 'seated' &&
            right.status !== 'seated'
          ) {
            return -1;
          }

          if (
            right.status === 'seated' &&
            left.status !== 'seated'
          ) {
            return 1;
          }

          return (
            new Date(left.reservation_time).getTime() -
            new Date(right.reservation_time).getTime()
          );
        },
      )[0];

      states.set(tableId, {
        status: 'occupied',
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