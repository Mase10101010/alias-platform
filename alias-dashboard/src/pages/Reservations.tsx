import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  LoaderCircle,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

import { cyan } from '@/lib/data';
import {
  detectDefaultLanguage,
  translations,
} from '@/lib/i18n';

import {
  createReservation,
  getConversationHistory,
  getReservations,
  applyIntelligenceRecommendation,
  applyIntelligenceReoptimization,
  optimizeReservation,
  reoptimizeReservation,
  getRestaurants,
  getTables,
  cancelReservation,
  getFloorPlans,
  getServiceAreas,
  analyzeAISuggestion,
  moveReservation,
  dismissAISuggestion,
  type AISuggestionResponse,
  type IntelligenceAssignmentResponse,
  type IntelligenceReoptimizationPlanResponse,
  type ConversationHistoryResponse,
  type ReservationResponse,
  type TableResponse,
} from '@/lib/api';

type FormState = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  party_size: string;
  table_id: string;
  reservation_date: string;
  reservation_time: string;
  special_requests: string;
};

type ReservationTableOption = TableResponse & {
  service_area_name: string;
  floor_plan_name: string;
};

const initialForm: FormState = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  party_size: '2',
  table_id: '',
  reservation_date: '',
  reservation_time: '19:30',
  special_requests: '',
};

function formatReservationTimeOption(time: string, language: string) {
  const [hourRaw, minute] = time.split(':');
  const hour = Number(hourRaw);

  if (language === 'en') {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute} ${period}`;
  }

  return time;
}

const reservationTimeOptions = [
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
];

export function Reservations() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'name' | 'party'>('date');
  const [tables, setTables] =
    useState<ReservationTableOption[]>([]);
  const [restaurantId, setRestaurantId] =
    useState<string | null>(null);
  
  const [
    cancellingReservationId,
    setCancellingReservationId,
  ] = useState<string | null>(null);

  const [
    reservationToMove,
    setReservationToMove,
  ] = useState<ReservationResponse | null>(null);

  const [
    selectedMoveTableId,
    setSelectedMoveTableId,
  ] = useState('');

  const [
    movingReservation,
    setMovingReservation,
  ] = useState(false);

  const [
    moveReservationError,
    setMoveReservationError,
  ] = useState<string | null>(null);

  const [
    reviewingSuggestionId,
    setReviewingSuggestionId,
  ] = useState<string | null>(null);

  const [
    optimizingReservationId,
    setOptimizingReservationId,
  ] = useState<string | null>(null);

  const [
    applyingRecommendation,
    setApplyingRecommendation,
  ] = useState(false);

  const [
    optimizationReservation,
    setOptimizationReservation,
  ] = useState<ReservationResponse | null>(null);

  const [
    optimizationRecommendation,
    setOptimizationRecommendation,
  ] =
    useState<IntelligenceAssignmentResponse | null>(null);

  const [
    optimizationError,
    setOptimizationError,
  ] = useState<string | null>(null);

  const [
    reoptimizingReservationId,
    setReoptimizingReservationId,
  ] = useState<string | null>(null);

  const [
    applyingReoptimization,
    setApplyingReoptimization,
  ] = useState(false);

  const [
    reoptimizationReservation,
    setReoptimizationReservation,
  ] = useState<ReservationResponse | null>(null);

  const [
    reoptimizationPlan,
    setReoptimizationPlan,
  ] = useState<IntelligenceReoptimizationPlanResponse | null>(null);

  const [
    reoptimizationError,
    setReoptimizationError,
  ] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const language = detectDefaultLanguage();
  const t = translations[language];

  const [selectedReservation, setSelectedReservation] =
    useState<ReservationResponse | null>(null);
  const [conversation, setConversation] =
    useState<ConversationHistoryResponse | null>(null);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(
    null,
  );

  async function loadAllRestaurantTables(
    currentRestaurantId: string,
  ): Promise<ReservationTableOption[]> {
    const serviceAreas = await getServiceAreas(
      currentRestaurantId,
    );

    const activeAreas = serviceAreas.filter(
      (area) => area.is_active,
    );

    const floorPlanGroups = await Promise.all(
      activeAreas.map(async (area) => {
        const floorPlans = await getFloorPlans(
          currentRestaurantId,
          area.id,
        );

        return floorPlans
          .filter((floorPlan) => floorPlan.is_active)
          .map((floorPlan) => ({
            floorPlan,
            serviceArea: area,
          }));
      }),
    );

    const floorPlanEntries = floorPlanGroups.flat();

    const tableGroups = await Promise.all(
      floorPlanEntries.map(
        async ({ floorPlan, serviceArea }) => {
          const floorPlanTables = await getTables(
            currentRestaurantId,
            floorPlan.id,
          );

          return floorPlanTables
            .filter((table) => table.is_active)
            .map((table) => ({
              ...table,
              service_area_name: serviceArea.name,
              floor_plan_name: floorPlan.name,
            }));
        },
      ),
    );

    const uniqueTables = new Map<
      string,
      ReservationTableOption
    >();

    for (const table of tableGroups.flat()) {
      if (!uniqueTables.has(table.id)) {
        uniqueTables.set(table.id, table);
      }
    }

    return [...uniqueTables.values()].sort(
      (first, second) => {
        const areaComparison =
          first.service_area_name.localeCompare(
            second.service_area_name,
          );

        if (areaComparison !== 0) {
          return areaComparison;
        }

        return first.table_number.localeCompare(
          second.table_number,
          undefined,
          {
            numeric: true,
          },
        );
      },
    );
  }

  async function loadReservations(showLoader = false) {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const data = await getReservations();
      setReservations(data);
      const restaurants = await getRestaurants();
      const restaurant = restaurants[0];

        if (restaurant) {
          setRestaurantId(restaurant.id);

          const restaurantTables =
            await loadAllRestaurantTables(
              restaurant.id,
            );

          setTables(restaurantTables);
        } else {
          setRestaurantId(null);
          setTables([]);
        }
    } catch (err) {
      console.error('Failed to load reservations', err);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
  loadReservations(true);

  const interval = setInterval(() => {
    loadReservations(false);
  }, 10000);

  return () => clearInterval(interval);
}, []);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleTimeString(getLocale(language), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: language === 'en',
    });
  }

  function getLocale(language: string) {
    if (language === 'it') return 'it-IT';
    if (language === 'es') return 'es-ES';
    if (language === 'fr') return 'fr-FR';
    if (language === 'de') return 'de-DE';
    return 'en-US';
  }

  function formatDate(dateString: string) {
    const formatted = new Date(dateString).toLocaleDateString(
      getLocale(language),
      {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      },
    );

    return formatted.replace(
      /\b([a-zà-ÿ])/,
      (match) => match.toUpperCase(),
    );
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const visibleReservations = reservations.filter((reservation) => {
    if (reservation.status === 'cancelled') {
      return false;
    }
    const reservationDate = new Date(reservation.reservation_time);

    if (reservationDate < todayStart) {
      return false;
    }

    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      reservation.customer_name.toLowerCase().includes(query) ||
      reservation.customer_phone.toLowerCase().includes(query) ||
      (reservation.customer_email || '').toLowerCase().includes(query)
    );
  });

  const sortedReservations = [...visibleReservations].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'date' || sortBy === 'time') {
      comparison =
        new Date(a.reservation_time).getTime() -
        new Date(b.reservation_time).getTime();
    }

    if (sortBy === 'name') {
      comparison = a.customer_name.localeCompare(b.customer_name);
    }

    if (sortBy === 'party') {
      comparison = a.party_size - b.party_size;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const availableTables = useMemo(() => {
    const partySize = Number(form.party_size);

    if (
      !form.reservation_date ||
      !form.reservation_time ||
      !Number.isFinite(partySize) ||
      partySize < 1
    ) {
      return tables.filter(
        (table) =>
          table.seats >= Math.max(partySize || 1, 1),
      );
    }

    const requestedStart = new Date(
      `${form.reservation_date}T${form.reservation_time}:00`,
    );

    const requestedStartMs =
      requestedStart.getTime();

    if (Number.isNaN(requestedStartMs)) {
      return [];
    }

    const requestedDurationMinutes = 90;

    const requestedEndMs =
      requestedStartMs +
      requestedDurationMinutes * 60 * 1000;

    const occupiedTableIds = new Set<string>();

    for (const reservation of reservations) {
      const normalizedStatus =
        String(reservation.status).toLowerCase();

      if (
        normalizedStatus === 'cancelled' ||
        normalizedStatus === 'completed' ||
        normalizedStatus === 'no_show'
      ) {
        continue;
      }

      const existingStartMs = new Date(
        reservation.reservation_time,
      ).getTime();

      if (Number.isNaN(existingStartMs)) {
        continue;
      }

      const existingDurationMinutes =
        reservation.duration_minutes || 90;

      const existingEndMs =
        existingStartMs +
        existingDurationMinutes * 60 * 1000;

      const overlaps =
        existingStartMs < requestedEndMs &&
        existingEndMs > requestedStartMs;

      if (!overlaps) {
        continue;
      }

      const assignedTableIds =
        reservation.table_ids?.length
          ? reservation.table_ids
          : reservation.table_id
            ? [reservation.table_id]
            : [];

      for (const tableId of assignedTableIds) {
        occupiedTableIds.add(tableId);
      }
    }

    return tables.filter(
      (table) =>
        table.seats >= partySize &&
        !occupiedTableIds.has(table.id),
    );
  }, [
    form.party_size,
    form.reservation_date,
    form.reservation_time,
    reservations,
    tables,
  ]);

  useEffect(() => {
    if (!form.table_id) {
      return;
    }

    const remainsAvailable = availableTables.some(
      (table) => table.id === form.table_id,
    );

    if (!remainsAvailable) {
      setForm((current) => ({
        ...current,
        table_id: '',
      }));
    }
  }, [availableTables, form.table_id]);

  useEffect(() => {
    const storedSuggestion = sessionStorage.getItem(
      'alias_ai_suggestion_review',
    );

    if (!storedSuggestion) {
      return;
    }

    try {
      const suggestion = JSON.parse(
        storedSuggestion,
      ) as AISuggestionResponse;

      const reservationId =
        suggestion.reservation_id ??
        suggestion.payload.reservation.id;

      const targetReservation = reservations.find(
        (reservation) =>
          reservation.id === reservationId,
      );

      if (!targetReservation) {
        return;
      }

      setReviewingSuggestionId(
        suggestion.id,
      );

      setReoptimizationReservation(
        targetReservation,
      );

      setReoptimizationPlan(
        suggestion.payload.plan,
      );

      setReoptimizationError(null);

      sessionStorage.removeItem(
        'alias_ai_suggestion_review',
      );
    } catch (error) {
      console.error(
        'Unable to open AI suggestion review',
        error,
      );

      sessionStorage.removeItem(
        'alias_ai_suggestion_review',
      );
    }
  }, [reservations]);

  async function openConversation(reservation: ReservationResponse) {
    setSelectedReservation(reservation);
    setConversation(null);
    setConversationError(null);

    if (!reservation.session_id) {
      setConversationError(
        'No AI conversation is linked to this reservation.',
      );
      return;
    }

    setConversationLoading(true);

    try {
      const history = await getConversationHistory(reservation.session_id);
      setConversation(history);
    } catch (err) {
      console.error('Failed to load conversation history', err);
      setConversationError('Unable to load conversation history.');
    } finally {
      setConversationLoading(false);
    }
  }

  function closeConversation() {
    setSelectedReservation(null);
    setConversation(null);
    setConversationError(null);
    setConversationLoading(false);
  }

  async function handleCreateReservation() {
    setError(null);

    if (!form.customer_name.trim()) {
      setError('Guest name is required.');
      return;
    }

    if (!form.customer_phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    if (!form.customer_email.trim()) {
      setError(t.emailRequiredError);
      return;
    }

    if (!form.reservation_date || !form.reservation_time) {
      setError('Reservation date and time are required.');
      return;
    }

    setSubmitting(true);

    try {
      const reservationDateTime = new Date(
        `${form.reservation_date}T${form.reservation_time}:00`,
      );

      const createdReservation = await createReservation({
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        customer_email: form.customer_email.trim(),
        party_size: Number(form.party_size),
        reservation_time: reservationDateTime.toISOString(),
        special_requests: form.special_requests.trim() || undefined,
        table_id: form.table_id || null,
      });

      setForm(initialForm);
      setShowForm(false);

      await loadReservations();

      const hasAssignedTables =
        createdReservation.table_ids?.length ||
        createdReservation.table_id;

      if (
        !hasAssignedTables &&
        restaurantId
      ) {
        try {
          setReoptimizingReservationId(
            createdReservation.id,
          );

          setReoptimizationReservation(
            createdReservation,
          );

          setReoptimizationPlan(null);
          setReoptimizationError(null);

          const result =
            await reoptimizeReservation({
              restaurant_id: restaurantId,
              reservation_id: createdReservation.id,
              requested_start:
                createdReservation.reservation_time,
              party_size:
                createdReservation.party_size,
              duration_minutes:
                createdReservation.duration_minutes,
              buffer_before_minutes: 0,
              buffer_after_minutes: 0,
              max_reservations_to_move: 1,
              max_plans: 5,
            });

          if (
            result.available &&
            result.recommended
          ) {
            setReoptimizationPlan(
              result.recommended,
            );

            try {
              const analysis =
                await analyzeAISuggestion(
                  createdReservation.id,
                );

              if (analysis.suggestion) {
                setReviewingSuggestionId(
                  analysis.suggestion.id,
                );

                setReoptimizationPlan(
                  analysis.suggestion.payload.plan,
                );
              }
            } catch (suggestionError) {
              console.error(
                'Seating plan created, but AI suggestion could not be linked',
                suggestionError,
              );
            }
          } else {
            setReoptimizationError(
              'The reservation was created, but Alias could not find a safe seating plan.',
            );
          }
        } catch (reoptimizationErr) {
          console.error(
            'Automatic reoptimization failed',
            reoptimizationErr,
          );

          setReoptimizationError(
            reoptimizationErr instanceof Error
              ? reoptimizationErr.message
              : 'The reservation was created, but Alias could not prepare a seating plan.',
          );
        } finally {
          setReoptimizingReservationId(null);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create reservation.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOptimizeReservation(
    reservation: ReservationResponse,
  ) {
    if (
      !restaurantId ||
      optimizingReservationId ||
      applyingRecommendation
    ) {
      return;
    }

    try {
      setOptimizingReservationId(reservation.id);
      setOptimizationReservation(reservation);
      setOptimizationRecommendation(null);
      setOptimizationError(null);

      const result = await optimizeReservation({
        restaurant_id: restaurantId,
        reservation_id: reservation.id,
        requested_start: reservation.reservation_time,
        party_size: reservation.party_size,
        duration_minutes: reservation.duration_minutes,
        buffer_before_minutes: 0,
        buffer_after_minutes: 0,
        max_alternatives: 3,
      });

      if (!result.available || !result.recommended) {
        setOptimizationError(
          'Alias could not find an available table configuration.',
        );
        return;
      }

      setOptimizationRecommendation(
        result.recommended,
      );
    } catch (err) {
      console.error(
        'Failed to optimize reservation',
        err,
      );

      setOptimizationError(
        err instanceof Error
          ? err.message
          : 'Unable to optimize this reservation.',
      );
    } finally {
      setOptimizingReservationId(null);
    }
  }

  async function handleApplyOptimization() {
    if (
      !optimizationReservation ||
      !optimizationRecommendation ||
      applyingRecommendation
    ) {
      return;
    }

    const primaryTableId =
      optimizationRecommendation.table_ids[0];

    if (!primaryTableId) {
      setOptimizationError(
        'Alias did not return a valid primary table.',
      );
      return;
    }

    try {
      setApplyingRecommendation(true);
      setOptimizationError(null);

      await applyIntelligenceRecommendation({
        reservation_id:
          optimizationReservation.id,
        table_ids:
          optimizationRecommendation.table_ids,
        primary_table_id: primaryTableId,
      });

      await loadReservations();

      setOptimizationReservation(null);
      setOptimizationRecommendation(null);
    } catch (err) {
      console.error(
        'Failed to apply Alias recommendation',
        err,
      );

      setOptimizationError(
        err instanceof Error
          ? err.message
          : 'Unable to apply the recommendation.',
      );
    } finally {
      setApplyingRecommendation(false);
    }
  }

  function closeOptimization() {
    if (applyingRecommendation) {
      return;
    }

    setOptimizationReservation(null);
    setOptimizationRecommendation(null);
    setOptimizationError(null);
  }

  async function handleReoptimizeReservation(
    reservation: ReservationResponse,
  ) {
    if (
      !restaurantId ||
      reoptimizingReservationId ||
      applyingReoptimization
    ) {
      return;
    }

    try {
      setReoptimizingReservationId(reservation.id);
      setReoptimizationReservation(reservation);
      setReoptimizationPlan(null);
      setReoptimizationError(null);

      const result = await reoptimizeReservation({
        restaurant_id: restaurantId,
        reservation_id: reservation.id,
        requested_start: reservation.reservation_time,
        party_size: reservation.party_size,
        duration_minutes: reservation.duration_minutes,
        buffer_before_minutes: 0,
        buffer_after_minutes: 0,
        max_reservations_to_move: 1,
        max_plans: 5,
      });

      if (!result.available || !result.recommended) {
        setReoptimizationError(
          'Alias could not find a safe room reoptimization plan.',
        );
        return;
      }

      setReoptimizationPlan(result.recommended);
    } catch (err) {
      console.error('Failed to reoptimize room', err);

      setReoptimizationError(
        err instanceof Error
          ? err.message
          : 'Unable to reoptimize the room.',
      );
    } finally {
      setReoptimizingReservationId(null);
    }
  }

  async function handleApplyReoptimization() {
    if (
      !reoptimizationReservation ||
      !reoptimizationPlan ||
      applyingReoptimization
    ) {
      return;
    }

    const assignment =
      reoptimizationPlan.new_reservation_assignment;

    const primaryTableId = assignment.table_ids[0];

    if (!primaryTableId) {
      setReoptimizationError(
        'Alias did not return a valid primary table.',
      );
      return;
    }

    for (const move of reoptimizationPlan.moves) {
      if (!move.to_table_ids[0]) {
        setReoptimizationError(
          'Alias returned an invalid destination table.',
        );
        return;
      }
    }

    try {
      setApplyingReoptimization(true);
      setReoptimizationError(null);

      await applyIntelligenceReoptimization({
        suggestion_id: reviewingSuggestionId,
        
        new_reservation_id: reoptimizationReservation.id,
        new_reservation_table_ids: assignment.table_ids,
        new_reservation_primary_table_id: primaryTableId,
        moves: reoptimizationPlan.moves.map((move) => ({
          reservation_id: move.reservation_id,
          to_table_ids: move.to_table_ids,
          primary_table_id: move.to_table_ids[0],
        })),
      });

      if (reviewingSuggestionId) {
        window.dispatchEvent(
          new CustomEvent(
            'alias-ai-suggestion-resolved',
            {
              detail: {
                suggestionId:
                  reviewingSuggestionId,
              },
            },
          ),
        );
      }

      setReviewingSuggestionId(null);

      await loadReservations();

      setReoptimizationReservation(null);
      setReoptimizationPlan(null);
      setReviewingSuggestionId(null);
    } catch (err) {
      console.error('Failed to apply reoptimization plan', err);

      setReoptimizationError(
        err instanceof Error
          ? err.message
          : 'Unable to apply the reoptimization plan.',
      );
    } finally {
      setApplyingReoptimization(false);
    }
  }

  async function handleKeepCurrentLayout() {
    if (applyingReoptimization) {
      return;
    }

    if (reviewingSuggestionId) {
      try {
        await dismissAISuggestion(
          reviewingSuggestionId,
        );
      } catch (error) {
        console.error(
          'AI suggestion could not be marked as dismissed',
          error,
        );

        setReoptimizationError(
          'Unable to record the manager decision.',
        );

        return;
      }
    }

    setReviewingSuggestionId(null);
    setReoptimizationReservation(null);
    setReoptimizationPlan(null);
    setReoptimizationError(null);
  }

  async function closeReoptimization() {
    if (applyingReoptimization) {
      return;
    }

    const reservation =
      reoptimizationReservation;

    const shouldCreateSuggestion =
      Boolean(
        reservation &&
          reoptimizationPlan &&
          reoptimizationPlan
            .moved_reservations_count > 0 &&
          !reviewingSuggestionId,
      );

    setReoptimizationReservation(null);
    setReoptimizationPlan(null);
    setReoptimizationError(null);
    setReviewingSuggestionId(null);

    if (!shouldCreateSuggestion || !reservation) {
      return;
    }

    try {
      const result = await analyzeAISuggestion(
        reservation.id,
      );

      if (result.created && result.suggestion) {
        window.dispatchEvent(
          new CustomEvent(
            'alias-ai-suggestion-created',
            {
              detail: {
                suggestion:
                  result.suggestion,
              },
            },
          ),
        );
      }
    } catch (error) {
      console.error(
        'Unable to create AI suggestion after keeping the current layout',
        error,
      );
    }
  }

  function getReservationName(reservationId: string) {
    return (
      reservations.find(
        (reservation) => reservation.id === reservationId,
      )?.customer_name || 'Existing reservation'
    );
  }

  function translateReason(
    reason: {
      code: string;
      title: string;
      description: string;
    },
  ) {
    const translationsByCode: Record<
      string,
      {
        title: string;
        description: string;
      }
    > = {
      no_moves_required: {
        title: t.seatingReasonNoMovesTitle,
        description:
          t.seatingReasonNoMovesDescription,
      },

      preferred_single_move: {
        title:
          t.seatingReasonPreferredSingleMoveTitle,
        description:
          t.seatingReasonPreferredSingleMoveDescription,
      },

      single_move_profile_match: {
        title:
          language === 'it'
            ? 'Struttura coerente con lo storico'
            : 'Matches current plan profile',
        description:
          language === 'it'
            ? (
                'Questo piano richiede un solo spostamento, '
                + 'come i piani accettati finora. Tuttavia, '
                + 'le decisioni accettate e rifiutate non '
                + 'dimostrano ancora che il numero di '
                + 'spostamenti determini realmente '
                + 'la scelta del manager.'
              )
            : (
                'This plan requires moving only one '
                + 'reservation, matching plans accepted so '
                + 'far. However, accepted and dismissed '
                + 'decisions do not yet show that move count '
                + 'itself drives manager acceptance.'
              ),
      },

      within_preferred_move_limit: {
        title:
          t.seatingReasonPreferredMoveLimitTitle,
        description:
          t.seatingReasonPreferredMoveLimitDescription,
      },

      within_preferred_move_limit: {
        title:
          t.seatingReasonPreferredMoveLimitTitle,
        description:
          t.seatingReasonPreferredMoveLimitDescription,
      },

      above_preferred_move_limit: {
        title:
          t.seatingReasonAboveMoveLimitTitle,
        description:
          t.seatingReasonAboveMoveLimitDescription,
      },

      exact_capacity_fit: {
        title: t.seatingReasonExactFitTitle,
        description:
          t.seatingReasonExactFitDescription,
      },

      within_preferred_seat_waste: {
        title:
          t.seatingReasonSeatWasteWithinTitle,
        description:
          t.seatingReasonSeatWasteWithinDescription,
      },

      above_typical_seat_waste: {
        title:
          t.seatingReasonSeatWasteHighTitle,
        description:
          t.seatingReasonSeatWasteHighDescription,
      },

      above_learned_score_reference: {
        title:
          t.seatingReasonStrongScoreTitle,
        description:
          t.seatingReasonStrongScoreDescription,
      },

      below_learned_score_reference: {
        title:
          t.seatingReasonLowScoreTitle,
        description:
          t.seatingReasonLowScoreDescription,
      },

      personalization_bonus: {
        title:
          t.seatingReasonPersonalizationBonusTitle,
        description:
          t.seatingReasonPersonalizationBonusDescription,
      },

      personalization_penalty: {
        title:
          t.seatingReasonPersonalizationPenaltyTitle,
        description:
          t.seatingReasonPersonalizationPenaltyDescription,
      },
    };

    return (
      translationsByCode[reason.code] ?? {
        title: reason.title,
        description: reason.description,
      }
    );
  }

  function translateConfidence(
    confidence: 'low' | 'medium' | 'high',
  ) {
    const labels = {
      low: {
        en: 'Low',
        it: 'Bassa',
        es: 'Baja',
        fr: 'Faible',
        de: 'Niedrig',
      },
      medium: {
        en: 'Medium',
        it: 'Media',
        es: 'Media',
        fr: 'Moyenne',
        de: 'Mittel',
      },
      high: {
        en: 'High',
        it: 'Alta',
        es: 'Alta',
        fr: 'Élevée',
        de: 'Hoch',
      },
    } as const;

    return labels[confidence][language];
  }

  function translateLearnedSignalStrength(
    strength: 'none' | 'low' | 'medium' | 'high',
  ) {
    const labels = {
      none: {
        en: 'No evidence yet',
        it: 'Nessuna evidenza ancora',
        es: 'Sin evidencia todavía',
        fr: 'Pas encore de preuve',
        de: 'Noch keine Evidenz',
      },
      low: {
        en: 'Low',
        it: 'Bassa',
        es: 'Baja',
        fr: 'Faible',
        de: 'Niedrig',
      },
      medium: {
        en: 'Medium',
        it: 'Media',
        es: 'Media',
        fr: 'Moyenne',
        de: 'Mittel',
      },
      high: {
        en: 'High',
        it: 'Alta',
        es: 'Alta',
        fr: 'Élevée',
        de: 'Hoch',
      },
    } as const;

    return labels[strength][language];
  }

  function translateLearnedSignalTitle(
    code: string,
    fallback: string,
  ) {
    const labels: Record<
      string,
      Record<
        'en' | 'it' | 'es' | 'fr' | 'de',
        string
      >
    > = {
      move_structure: {
        en: 'Plan structure',
        it: 'Struttura del piano',
        es: 'Estructura del plan',
        fr: 'Structure du plan',
        de: 'Planstruktur',
      },
      seat_waste: {
        en: 'Capacity usage',
        it: 'Uso della capacità',
        es: 'Uso de la capacidad',
        fr: 'Utilisation de la capacité',
        de: 'Kapazitätsnutzung',
      },
      technical_score: {
        en: 'Technical score',
        it: 'Punteggio tecnico',
        es: 'Puntuación técnica',
        fr: 'Score technique',
        de: 'Technischer Score',
      },
    };

    return (
      labels[code]?.[language]
      ?? fallback
    );
  }

  function translateDecisionLevel(
    level:
      | 'review_recommended'
      | 'recommended'
      | 'strong_recommendation',
  ) {
    const labels = {
      review_recommended:
        t.seatingDecisionReviewRecommended,
      recommended:
        t.seatingDecisionRecommended,
      strong_recommendation:
        t.seatingDecisionStrongRecommendation,
    } as const;

    return labels[level];
  }

  function decisionLevelClasses(
    level:
      | 'review_recommended'
      | 'recommended'
      | 'strong_recommendation',
  ) {
    const classes = {
      review_recommended:
        'border-amber-400/20 bg-amber-400/[.06] text-amber-200',

      recommended:
        'border-cyanAlias/20 bg-cyanAlias/10 text-cyanAlias',

      strong_recommendation:
        'border-emerald-400/20 bg-emerald-400/[.08] text-emerald-300',
    } as const;

    return classes[level];
  }

  function translateDecisionSummary(
  level:
    | 'review_recommended'
    | 'recommended'
    | 'strong_recommendation',
) {
  const labels = {
    review_recommended:
      t.seatingDecisionSummaryReview,
    recommended:
      t.seatingDecisionSummaryRecommended,
    strong_recommendation:
      t.seatingDecisionSummaryStrong,
  } as const;

  return labels[level];
}

  function translateDecisionReason(
    code: string,
    fallback: string,
  ) {
    const labels: Record<string, string> = {
      calibration_not_mature:
        t.seatingDecisionReasonCalibrationNotMature,
      high_acceptance_probability:
        t.seatingDecisionReasonHighAcceptanceProbability,
      low_acceptance_probability:
        t.seatingDecisionReasonLowAcceptanceProbability,
      no_moves_required:
        t.seatingDecisionReasonNoMovesRequired,
      above_preferred_move_limit:
        t.seatingDecisionReasonAbovePreferredMoveLimit,
      exact_capacity_fit:
        t.seatingDecisionReasonExactCapacityFit,
      below_recommended_score:
        t.seatingDecisionReasonBelowRecommendedScore,
    };

    return labels[code] ?? fallback;
  }

  function translateExecutionEligibility(
    eligibility:
      | 'blocked'
      | 'manager_confirmation_required'
      | 'eligible_for_automatic_execution',
  ) {
    const labels = {
      blocked:
        t.seatingExecutionBlocked,
      manager_confirmation_required:
        t.seatingExecutionManagerConfirmation,
      eligible_for_automatic_execution:
        t.seatingExecutionEligible,
    } as const;

    return labels[eligibility];
  }

  function translateExecutionReason(
    code: string,
    fallback: string,
  ) {
    const labels: Record<string, string> = {
      policy_advisory_only:
        t.seatingExecutionReasonPolicyAdvisory,
      manager_confirmation_required:
        t.seatingExecutionReasonManagerConfirmation,
      decision_not_strong_enough:
        t.seatingExecutionReasonDecisionNotStrong,
      prediction_confidence_not_high:
        t.seatingExecutionReasonConfidenceNotHigh,
      automatic_execution_eligible:
        t.seatingExecutionReasonEligible,
    };

    return labels[code] ?? fallback;
  }

  function openMoveReservation(
    reservation: ReservationResponse,
  ) {
    setReservationToMove(reservation);
    setSelectedMoveTableId('');
    setMoveReservationError(null);
  }

  function closeMoveReservation() {
    if (movingReservation) {
      return;
    }

    setReservationToMove(null);
    setSelectedMoveTableId('');
    setMoveReservationError(null);
  }

  async function handleCancelReservation(
    reservation: ReservationResponse,
  ) {
    if (cancellingReservationId) {
      return;
    }

    const confirmed = window.confirm(
      `Cancel the reservation for ${reservation.customer_name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingReservationId(reservation.id);
      setError(null);

      await cancelReservation(reservation.id);

      await loadReservations();
    } catch (err) {
      console.error(
        'Failed to cancel reservation',
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to cancel the reservation.',
      );
    } finally {
      setCancellingReservationId(null);
    }
  }

  async function handleMoveReservation() {
    if (
      !reservationToMove ||
      !selectedMoveTableId ||
      movingReservation
    ) {
      return;
    }

    try {
      setMovingReservation(true);
      setMoveReservationError(null);

      await moveReservation(
        reservationToMove.id,
        selectedMoveTableId,
      );

      await loadReservations();

      window.dispatchEvent(
        new CustomEvent(
          'alias-room-layout-changed',
        ),
      );

      setReservationToMove(null);
      setSelectedMoveTableId('');
    } catch (error) {
      console.error(
        'Failed to move reservation',
        error,
      );

      setMoveReservationError(
        error instanceof Error
          ? error.message
          : 'Unable to move the reservation.',
      );
    } finally {
      setMovingReservation(false);
    }
  }


  return (
    <div className="min-w-0 overflow-x-hidden">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: cyan }}
          >
            {t.reservationsTitle}
          </p>

          <h1 className="mt-4 font-display text-5xl font-light tracking-[-.04em]">
            {t.reservationsHeading}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            style={{ background: cyan }}
          >
            <Plus size={16} />
            {t.newReservation}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass mt-10 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[.22em] text-white/35">
                {t.manualBooking}
              </p>

              <h2 className="mt-2 font-display text-3xl font-light">
                {t.createReservationTitle}
              </h2>
            </div>

            <button
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
              className="rounded-full border border-white/10 p-2 text-white/50 transition hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <Input
              placeholder={t.guestName}
              value={form.customer_name}
              onChange={(value) => updateField('customer_name', value)}
            />

            <Input
              placeholder={t.phoneNumber}
              value={form.customer_phone}
              onChange={(value) => updateField('customer_phone', value)}
            />

            <Input
              placeholder={t.emailRequired}
              value={form.customer_email}
              onChange={(value) => updateField('customer_email', value)}
            />

            <Input
              placeholder={t.partySize}
              value={form.party_size}
              onChange={(value) => updateField('party_size', value)}
            />

            <select
              value={form.table_id}
              onChange={(event) =>
                updateField(
                  'table_id',
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
            >
              <option
                value=""
                style={{
                  backgroundColor: '#111827',
                  color: 'white',
                }}
              >
                Automatic table assignment
              </option>

              {availableTables.map((table) => (
                <option
                  key={table.id}
                  value={table.id}
                  style={{
                    backgroundColor: '#111827',
                    color: 'white',
                  }}
                >
                  Table {table.table_number} ·{' '}
                  {table.seats} seats ·{' '}
                  {table.service_area_name} /{' '}
                  {table.floor_plan_name}
                </option>
              ))}
            </select>

            <div className="text-xs leading-relaxed text-white/35">
              {!form.reservation_date || !form.reservation_time ? (
                <span>
                  Select a date and time to check table availability.
                </span>
              ) : availableTables.length > 0 ? (
                <span>
                  {availableTables.length}{' '}
                  {availableTables.length === 1
                    ? 'suitable table is'
                    : 'suitable tables are'}{' '}
                  currently available.
                </span>
              ) : (
                <span className="text-amber-200/70">
                  No single table is available with enough capacity.
                  Automatic assignment may still use an approved table
                  combination.
                </span>
              )}
            </div>

            {form.reservation_date &&
              form.reservation_time && (
                <div className="mt-2 text-[11px] text-white/25">
                  Checking availability for{' '}
                  {new Date(
                    `${form.reservation_date}T${form.reservation_time}:00`,
                  ).toLocaleString()}
                </div>
              )}

            <Input
              type="date"
              placeholder="Date"
              value={form.reservation_date}
              onChange={(value) => updateField('reservation_date', value)}
            />

            <select
              value={form.reservation_time}
              onChange={(event) => updateField('reservation_time', event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
            >
              {reservationTimeOptions.map((time) => (
                <option 
                  key={time} 
                  value={time}
                  style={{ backgroundColor: '#111827', color: 'white' }}
                >
                  {formatReservationTimeOption(time, language)}
                </option>
              ))}
            </select>

            <div className="md:col-span-2">
              <Input
                placeholder={t.specialRequestsOptional}
                value={form.special_requests}
                onChange={(value) => updateField('special_requests', value)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mt-7 flex justify-end">
            <button
              onClick={handleCreateReservation}
              disabled={submitting}
              className="rounded-full px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-60"
              style={{ background: cyan }}
            >
              {submitting 
                ? t.creating 
                : t.createReservationButton}
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.22em] text-white/35">
            {t.searchAndSortReservations}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white/45 lg:w-80">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t.searchReservationsPlaceholder}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as 'date' | 'time' | 'name' | 'party',
              )
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="date">{t.date}</option>
            <option value="time">{t.time}</option>
            <option value="name">{t.guestName}</option>
            <option value="party">{t.partySize}</option>
          </select>

          <select
            value={sortDirection}
            onChange={(event) =>
              setSortDirection(event.target.value as 'asc' | 'desc')
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="desc">{t.newestFirst}</option>
            <option value="asc">{t.oldestFirst}</option>
          </select>
        </div>
      </div>

      <div className="glass mt-10 max-w-full overflow-x-auto rounded-3xl">
        <div className="grid min-w-[1050px] grid-cols-[120px_80px_1fr_80px_110px_240px_1fr_170px] items-center gap-3 border-b border-white/[.04] px-5 py-4 text-sm last:border-none">
          <span>{t.date}</span>
          <span>{t.timeColumn}</span>
          <span>{t.guestColumn}</span>
          <span>{t.partyColumn}</span>
          <span>{t.tableLabel}</span>
          <span>{t.contactDetails}</span>
          <span>{t.notesColumn}</span>
          <span>{t.actionsColumn}</span>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-sm text-white/45">
            {t.loadingReservations}
          </div>
        ) : visibleReservations.length === 0 ? (
          <div className="px-5 py-10 text-sm text-white/45">
            {t.noReservations}
          </div>
        ) : (
          sortedReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="grid min-w-[1050px] grid-cols-[120px_80px_1fr_80px_110px_240px_1fr_170px] items-center gap-3 border-b border-white/[.04] px-5 py-4 text-sm last:border-none"
            >
              <span className="text-white/50">
                {formatDate(reservation.reservation_time)}
              </span>

              <span className="text-white/50">
                {formatTime(reservation.reservation_time)}
              </span>

              <span className="text-white/88">
                {reservation.customer_name}
              </span>

              <span className="text-white/55">
                {reservation.party_size}
              </span>

              

              <span className="text-white/55">
                {reservation.table_numbers?.length
                  ? `${t.tableLabel} ${reservation.table_numbers.join(' + ')}`
                  : reservation.table_number
                    ? `${t.tableLabel} ${reservation.table_number}`
                    : '—'}
              </span>

              <div className="min-w-0 text-white/55">
                <div className="truncate">{reservation.customer_phone || '—'}</div>
                <div className="mt-1 truncate text-xs text-white/35">
                  {reservation.customer_email || '—'}
                </div>
              </div>

              <span className="text-white/45">
                {reservation.special_requests || '—'}
              </span>

              <div className="flex flex-col items-center justify-center gap-2">
                {reservation.session_id && (
                  <span
                    className="rounded-full px-2 py-1 text-[10px] uppercase tracking-[.18em]"
                    style={{
                      background: `${cyan}18`,
                      color: cyan,
                    }}
                  >
                    AI
                  </span>
                )}

                {!reservation.table_id && (
                  <button
                    type="button"
                    disabled={
                      optimizingReservationId ===
                      reservation.id
                    }
                    onClick={() => {
                      void handleOptimizeReservation(
                        reservation,
                      );
                    }}
                    className="flex items-center justify-center gap-2 rounded-full border border-cyanAlias/25 bg-cyanAlias/10 px-4 py-2 text-xs uppercase tracking-[.16em] text-cyanAlias transition hover:bg-cyanAlias/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {optimizingReservationId ===
                    reservation.id ? (
                      <LoaderCircle
                        size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <Sparkles size={14} />
                    )}

                    {optimizingReservationId ===
                    reservation.id
                      ? 'Optimizing'
                      : 'Ask Alias'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    openMoveReservation(
                      reservation,
                    );
                  }}
                  className="flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-center text-xs uppercase tracking-[.16em] text-white/60 transition hover:border-cyanAlias/30 hover:text-cyanAlias"
                >
                  Move table
                </button>

                <button
                  type="button"
                  disabled={
                    reoptimizingReservationId === reservation.id
                  }
                  onClick={() => {
                    void handleReoptimizeReservation(reservation);
                  }}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-center text-xs uppercase tracking-[.16em] text-white/60 transition hover:border-cyanAlias/30 hover:text-cyanAlias disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reoptimizingReservationId === reservation.id ? (
                    <LoaderCircle
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={14} />
                  )}

                  {reoptimizingReservationId === reservation.id
                    ? 'Planning'
                    : 'Reoptimize room'}
                </button>

                <button
                  type="button"
                  disabled={
                    cancellingReservationId === reservation.id
                  }
                  onClick={() => {
                    void handleCancelReservation(
                      reservation,
                    );
                  }}
                  className="flex items-center justify-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-xs uppercase tracking-[.16em] text-red-200 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancellingReservationId === reservation.id ? (
                    <LoaderCircle
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={14} />
                  )}

                  {cancellingReservationId === reservation.id
                    ? 'Cancelling'
                    : 'Cancel'}
                </button>

                <button
                  onClick={() => openConversation(reservation)}
                  className="rounded-full border border-white/10 px-4 py-2 text-center text-xs uppercase tracking-[.18em] text-white/60 transition hover:border-white/20 hover:text-white"
                >
                  {t.viewConversation}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {reservationToMove && (
        <div className="fixed inset-0 z-[68] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-xs uppercase tracking-[.22em]"
                  style={{ color: cyan }}
                >
                  Move reservation
                </p>

                <h2 className="mt-3 font-display text-3xl font-light text-white">
                  {reservationToMove.customer_name}
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Party of {reservationToMove.party_size}
                  {' · '}
                  Current{' '}
                  {reservationToMove.table_numbers?.length
                    ? `Tables ${reservationToMove.table_numbers.join(
                        ' + ',
                      )}`
                    : reservationToMove.table_number
                      ? `Table ${reservationToMove.table_number}`
                      : 'assignment unavailable'}
                </p>
              </div>

              <button
                type="button"
                disabled={movingReservation}
                onClick={closeMoveReservation}
                className="rounded-full border border-white/10 p-2 text-white/45 transition hover:text-white disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-7">
              <label className="text-xs uppercase tracking-[.18em] text-white/35">
                Destination table
              </label>

              <select
                value={selectedMoveTableId}
                onChange={(event) => {
                  setSelectedMoveTableId(
                    event.target.value,
                  );

                  setMoveReservationError(null);
                }}
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
              >
                <option
                  value=""
                  style={{
                    backgroundColor: '#111827',
                    color: 'white',
                  }}
                >
                  Select a table
                </option>

                {tables
                  .filter(
                    (table) =>
                      table.id !==
                        reservationToMove.table_id &&
                      table.seats >=
                        reservationToMove.party_size,
                  )
                  .map((table) => (
                    <option
                      key={table.id}
                      value={table.id}
                      style={{
                        backgroundColor: '#111827',
                        color: 'white',
                      }}
                    >
                      Table {table.table_number} ·{' '}
                      {table.seats} seats ·{' '}
                      {table.service_area_name} /{' '}
                      {table.floor_plan_name}
                    </option>
                  ))}
              </select>

              <p className="mt-3 text-xs leading-relaxed text-white/35">
                Alias will verify that the selected table is
                available for the complete reservation duration.
              </p>
            </div>

            {moveReservationError && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {moveReservationError}
              </div>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={movingReservation}
                onClick={closeMoveReservation}
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/55 transition hover:border-white/20 hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  !selectedMoveTableId ||
                  movingReservation
                }
                onClick={() => {
                  void handleMoveReservation();
                }}
                className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
                style={{ background: cyan }}
              >
                {movingReservation && (
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                )}

                {movingReservation
                  ? 'Moving…'
                  : 'Move reservation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {optimizationReservation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-ink p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className="flex items-center gap-2 text-xs uppercase tracking-[.24em]"
                  style={{ color: cyan }}
                >
                  <Sparkles size={16} />
                  Alias recommendation
                </div>

                <h2 className="mt-3 font-display text-3xl font-light text-white">
                  {optimizationReservation.customer_name}
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Party of{' '}
                  {optimizationReservation.party_size}
                  {' · '}
                  {formatTime(
                    optimizationReservation.reservation_time,
                  )}
                </p>
              </div>

              <button
                type="button"
                disabled={applyingRecommendation}
                onClick={closeOptimization}
                className="rounded-full border border-white/10 p-2 text-white/45 transition hover:text-white disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {optimizingReservationId ===
              optimizationReservation.id && (
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-5 text-sm text-white/50">
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                  style={{ color: cyan }}
                />
                Alias is evaluating the floor plan…
              </div>
            )}

            {optimizationError && (
              <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-200">
                {optimizationError}
              </div>
            )}

            {optimizationRecommendation && (
              <>
                <div className="mt-8 rounded-3xl border border-cyanAlias/20 bg-cyanAlias/[.06] p-5">
                  <p className="text-xs uppercase tracking-[.18em] text-white/35">
                    Recommended assignment
                  </p>

                  <h3 className="mt-3 font-display text-2xl font-light text-white">
                    Tables{' '}
                    {optimizationRecommendation.table_numbers.join(
                      ' + ',
                    )}
                  </h3>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-[.15em] text-white/30">
                        Capacity
                      </p>
                      <p className="mt-2 text-lg text-white">
                        {optimizationRecommendation.capacity}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-[.15em] text-white/30">
                        Seat waste
                      </p>
                      <p className="mt-2 text-lg text-white">
                        {optimizationRecommendation.seat_waste}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-[.15em] text-white/30">
                        Score
                      </p>
                      <p className="mt-2 text-lg text-white">
                        {optimizationRecommendation.score.toFixed(
                          2,
                        )}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-white/50">
                    {optimizationRecommendation.explanation}
                  </p>
                </div>

                <div className="mt-7 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={applyingRecommendation}
                    onClick={closeOptimization}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/55 disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={applyingRecommendation}
                    onClick={() => {
                      void handleApplyOptimization();
                    }}
                    className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-black disabled:opacity-50"
                    style={{ background: cyan }}
                  >
                    {applyingRecommendation && (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    )}

                    {applyingRecommendation
                      ? 'Applying…'
                      : 'Apply recommendation'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {reoptimizationReservation && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-ink p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className="flex items-center gap-2 text-xs uppercase tracking-[.24em]"
                  style={{ color: cyan }}
                >
                  <Sparkles size={16} />
                  Alias seating plan
                </div>

                <h2 className="mt-3 font-display text-3xl font-light text-white">
                  {reoptimizationReservation.customer_name}
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Party of {reoptimizationReservation.party_size}
                  {' · '}
                  {formatTime(
                    reoptimizationReservation.reservation_time,
                  )}
                </p>
              </div>

              <button
                type="button"
                disabled={applyingReoptimization}
                onClick={closeReoptimization}
                className="rounded-full border border-white/10 p-2 text-white/45 transition hover:text-white disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {reoptimizingReservationId ===
              reoptimizationReservation.id && (
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-5 text-sm text-white/50">
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                  style={{ color: cyan }}
                />
                Alias is evaluating the entire room…
              </div>
            )}

            {reoptimizationError && (
              <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-200">
                {reoptimizationError}
              </div>
            )}

            {reoptimizationPlan && (
              <>
                <p className="mt-6 text-sm leading-relaxed text-white/55">
                  Alias found a safe way to accommodate this booking
                  {reoptimizationPlan.moves.length > 0
                    ? ` by moving ${
                        reoptimizationPlan.moves.length === 1
                          ? 'one existing reservation'
                          : `${reoptimizationPlan.moves.length} existing reservations`
                      }.`
                    : ' without moving any existing reservations.'}
                </p>

                <div className="mt-6 rounded-3xl border border-cyanAlias/20 bg-cyanAlias/[.06] p-5">
                  <p className="text-xs uppercase tracking-[.18em] text-white/35">
                    Seat this booking
                  </p>

                  <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm text-white/45">
                        {reoptimizationReservation.customer_name}
                      </p>

                      <h3 className="mt-1 font-display text-2xl font-light text-white">
                        Tables{' '}
                        {reoptimizationPlan.new_reservation_assignment.table_numbers.join(
                          ' + ',
                        )}
                      </h3>
                    </div>

                    <div className="self-start rounded-full border border-cyanAlias/20 bg-cyanAlias/10 px-3 py-1 text-xs text-cyanAlias sm:self-auto">
                      {reoptimizationReservation.party_size}{' '}
                      guests
                    </div>
                  </div>
                </div>

                {reoptimizationPlan.moves.length > 0 ? (
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[.18em] text-white/35">
                      Move existing reservations
                    </p>

                    <div className="mt-3 space-y-3">
                      {reoptimizationPlan.moves.map((move) => (
                        <div
                          key={move.reservation_id}
                          className="rounded-2xl border border-white/10 bg-white/[.035] p-4"
                        >
                          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                              <p className="text-sm font-medium text-white">
                                {getReservationName(
                                  move.reservation_id,
                                )}
                              </p>

                              <p className="mt-1 text-xs text-white/40">
                                Party of {move.party_size}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-white/55">
                                {move.from_table_numbers.length === 1
                                  ? 'Table'
                                  : 'Tables'}{' '}
                                {move.from_table_numbers.join(
                                  ' + ',
                                )}
                              </span>

                              <span className="text-cyanAlias">
                                →
                              </span>

                              <span className="rounded-full border border-cyanAlias/20 bg-cyanAlias/10 px-3 py-2 text-cyanAlias">
                                {move.to_table_numbers.length === 1
                                  ? 'Table'
                                  : 'Tables'}{' '}
                                {move.to_table_numbers.join(
                                  ' + ',
                                )}
                              </span>
                            </div>
                          </div>

                          <p className="mt-4 text-xs leading-relaxed text-white/40">
                            {move.seat_waste === 0
                              ? 'Exact capacity fit with no wasted seats.'
                              : `${move.seat_waste} unused ${
                                  move.seat_waste === 1
                                    ? 'seat'
                                    : 'seats'
                                } after the move.`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-4 text-sm text-white/50">
                    No existing reservations need to be moved.
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[.15em] text-white/30">
                      Moves
                    </p>

                    <p className="mt-2 text-lg text-white">
                      {reoptimizationPlan.moved_reservations_count}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[.15em] text-white/30">
                      Unused seats
                    </p>

                    <p className="mt-2 text-lg text-white">
                      {reoptimizationPlan.total_seat_waste}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[.15em] text-white/30">
                      Plan score
                    </p>

                    <p className="mt-2 text-lg text-white">
                      {reoptimizationPlan.score.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                {reoptimizationPlan.decision && (
                  <div className="mt-6 rounded-3xl border border-cyanAlias/20 bg-cyanAlias/[.05] p-5">
                    <span
                      className={`inline-flex rounded-full border px-3 py-2 text-xs font-medium ${decisionLevelClasses(
                        reoptimizationPlan.decision.level,
                      )}`}
                    >
                      {translateDecisionLevel(
                        reoptimizationPlan.decision.level,
                      )}
                    </span>

                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      {translateDecisionSummary(
                        reoptimizationPlan.decision.level,
                      )}
                    </p>

                    {reoptimizationPlan.decision.reasons.some(
                      (reason) =>
                        reason.code === 'calibration_not_mature',
                    ) && (
                      <div className="mt-4 space-y-2">
                        {reoptimizationPlan.decision.reasons
                          .filter(
                            (reason) =>
                              reason.code === 'calibration_not_mature',
                          )
                          .map((reason) => (
                            <div
                              key={reason.code}
                              className="flex items-start gap-2 text-xs leading-relaxed text-white/40"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyanAlias/60" />

                              <span>
                                {translateDecisionReason(
                                  reason.code,
                                  reason.description,
                                )}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {reoptimizationPlan.execution_eligibility && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.02] px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[.15em] text-white/30">
                      {t.seatingExecutionStatus}
                    </p>

                    <p className="mt-2 text-sm font-medium text-white/70">
                      {translateExecutionEligibility(
                        reoptimizationPlan.execution_eligibility
                          .eligibility,
                      )}
                    </p>

                    {reoptimizationPlan.execution_eligibility.reasons
                      .slice(0, 1)
                      .map((reason) => (
                        <p
                          key={reason.code}
                          className="mt-2 text-xs leading-relaxed text-white/40"
                        >
                          {translateExecutionReason(
                            reason.code,
                            reason.description,
                          )}
                        </p>
                        ))}
                  </div>
                )}

                {reoptimizationPlan.acceptance_prediction && (
                  <div className="mt-6 rounded-3xl border border-cyanAlias/20 bg-cyanAlias/[.05] p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs uppercase tracking-[.18em] text-white/35">
                          {t.seatingPlanMatchPreferences}
                        </p>

                        <p className="mt-2 font-display text-4xl font-light text-white">
                          {Math.round(
                            reoptimizationPlan
                              .acceptance_prediction
                              .acceptance_probability * 100,
                          )}
                          %
                        </p>
                      </div>

                      <div className="self-start rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/50 sm:self-auto">
                        {t.seatingPlanConfidence}:{' '}
                        {translateConfidence(
                          reoptimizationPlan.acceptance_prediction.confidence,
                        )}
                      </div>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-white/40">
                      {t.seatingPlanPredictionDescription}
                    </p>
                  </div>
                )}
                {reoptimizationPlan.reasoning?.learned_signals &&
                  reoptimizationPlan.reasoning.learned_signals.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-[.18em] text-white/35">
                        {
                          language === 'it'
                            ? 'Cosa sta pesando di più'
                            : language === 'es'
                              ? 'Qué está pesando más'
                              : language === 'fr'
                                ? 'Ce qui pèse le plus'
                                : language === 'de'
                                  ? 'Was derzeit am stärksten gewichtet wird'
                                  : 'What is weighing most'
                        }
                      </p>

                      <div className="mt-3 space-y-3">
                        {reoptimizationPlan.reasoning.learned_signals.map(
                          (signal) => (
                            <div
                              key={signal.code}
                              className="rounded-2xl border border-white/10 bg-white/[.025] p-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-medium text-white/85">
                                    {translateLearnedSignalTitle(
                                      signal.code,
                                      signal.title,
                                    )}
                                  </p>

                                  <p className="mt-1 text-[11px] uppercase tracking-[.14em] text-white/30">
                                    {
                                      language === 'it'
                                        ? 'Forza appresa'
                                        : language === 'es'
                                          ? 'Fuerza aprendida'
                                          : language === 'fr'
                                            ? 'Force apprise'
                                            : language === 'de'
                                              ? 'Gelernte Stärke'
                                              : 'Learned strength'
                                    }
                                    {' · '}
                                    {translateLearnedSignalStrength(
                                      signal.strength,
                                    )}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-sm font-medium text-white/70">
                                    {Math.round(
                                      signal.strength_value * 100,
                                    )}
                                    %
                                  </p>
                                </div>
                              </div>

                              <p className="mt-3 text-xs leading-relaxed text-white/40">
                                {signal.description}
                              </p>

                              {signal.accepted_value !== null &&
                                signal.dismissed_value !== null && (
                                  <div className="mt-3 flex gap-4 text-[11px] text-white/30">
                                    <span>
                                      Accepted:{' '}
                                      {signal.accepted_value.toFixed(2)}
                                    </span>

                                    <span>
                                      Dismissed:{' '}
                                      {signal.dismissed_value.toFixed(2)}
                                    </span>
                                  </div>
                                )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                {reoptimizationPlan.reasoning &&
                  reoptimizationPlan.reasoning.reasons.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-[.18em] text-white/35">
                        {t.seatingPlanWhyRecommended}
                      </p>

                      <div className="mt-3 space-y-3">
                        {reoptimizationPlan.reasoning.reasons.map(
                          (reason) => {
                            const translated =
                              translateReason(reason);

                            return (
                              <div
                                key={reason.code}
                                className="rounded-2xl border border-white/10 bg-white/[.025] p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyanAlias/20 bg-cyanAlias/10 text-xs text-cyanAlias">
                                    ✓
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium text-white/85">
                                      {translated.title}
                                    </p>

                                    <p className="mt-1 text-xs leading-relaxed text-white/40">
                                      {translated.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}

                <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={applyingReoptimization}
                    onClick={() => {
                      void handleKeepCurrentLayout();
                    }}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/55 transition hover:border-white/20 hover:text-white disabled:opacity-40"
                  >
                    {t.seatingKeepCurrentLayout}
                  </button>

                  <button
                    type="button"
                    disabled={applyingReoptimization}
                    onClick={() => {
                      void handleApplyReoptimization();
                    }}
                    className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
                    style={{ background: cyan }}
                  >
                    {applyingReoptimization && (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    )}

                    {applyingReoptimization
                      ? 'Applying changes…'
                      : reoptimizationPlan.execution_eligibility
                            ?.eligibility ===
                          'manager_confirmation_required'
                        ? t.seatingConfirmAndApplyPlan
                        : t.seatingApplyPlan}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl border-l border-white/10 bg-ink p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.28em]"
                  style={{ color: cyan }}
                >
                  {t.aiConversation}
                </p>

                <h2 className="mt-3 font-display text-4xl font-light tracking-[-.04em]">
                  {selectedReservation.customer_name}
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  {t.partyOfLabel} {selectedReservation.party_size} ·{' '}
                  {formatTime(selectedReservation.reservation_time)}
                </p>
              </div>

              <button
                onClick={closeConversation}
                className="rounded-full border border-white/10 p-2 text-white/50 transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8 h-[calc(100vh-180px)] space-y-4 overflow-y-auto pr-2">
              {conversationLoading ? (
                <div className="text-sm text-white/45">
                  {t.loadingConversation}
                </div>
              ) : conversationError ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {conversationError}
                </div>
              ) : conversation?.messages.length ? (
                conversation.messages
                  .filter((message) => message.role !== 'tool')
                  .map((message) => {
                    const isUser = message.role === 'user';

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isUser ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className="max-w-[82%] rounded-3xl px-5 py-4 text-sm leading-6"
                          style={{
                            background: isUser
                              ? cyan
                              : 'rgba(255,255,255,.055)',
                            color: isUser
                              ? '#050707'
                              : 'rgba(255,255,255,.84)',
                          }}
                        >
                          {message.content}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-sm text-white/45">
                  {t.noConversationMessages}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none transition focus:border-white/25"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}