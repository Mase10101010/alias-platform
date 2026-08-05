import {
  Bell,
  Check,
  LoaderCircle,
  Sparkles,
  X,
} from 'lucide-react';

import { cyan } from '@/lib/data';
import {
  type AISuggestionResponse,
  type ReservationResponse,
} from '@/lib/api';

type Props = {
  open: boolean;
  suggestions: AISuggestionResponse[];
  reservations: ReservationResponse[];
  loading: boolean;
  dismissingId: string | null;
  onClose: () => void;
  onReview: (suggestion: AISuggestionResponse) => void;
  onDismiss: (suggestion: AISuggestionResponse) => void;
};

export function AISuggestionsPanel({
  open,
  suggestions,
  reservations,
  loading,
  dismissingId,
  onClose,
  onReview,
  onDismiss,
}: Props) {
  if (!open) {
    return null;
  }

  function getMovedReservationName(
    reservationId: string,
  ) {
    return (
      reservations.find(
        (reservation) =>
          reservation.id === reservationId,
      )?.customer_name ??
      'Existing reservation'
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/65 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close AI suggestions"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <aside className="relative h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-ink p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className="flex items-center gap-2 text-xs uppercase tracking-[.22em]"
              style={{ color: cyan }}
            >
              <Sparkles size={16} />
              AI Suggestions
            </div>

            <h2 className="mt-3 font-display text-3xl font-light text-white">
              Alias is watching the room
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Review improvements found by the seating
              intelligence engine.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white/45 transition hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-5 text-sm text-white/50">
            <LoaderCircle
              size={18}
              className="animate-spin"
              style={{ color: cyan }}
            />
            Loading AI suggestions…
          </div>
        ) : suggestions.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[.03] p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[.04]">
              <Check
                size={20}
                className="text-white/50"
              />
            </div>

            <p className="mt-4 text-sm font-medium text-white">
              The room is already optimized
            </p>

            <p className="mt-2 text-sm leading-relaxed text-white/40">
              Alias has no active improvements to recommend.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {suggestions.map((suggestion) => {
              const plan = suggestion.payload.plan;
              const assignment =
                plan.new_reservation_assignment;

              return (
                <article
                  key={suggestion.id}
                  className={`rounded-3xl border p-5 ${
                    suggestion.is_read
                      ? 'border-white/10 bg-white/[.03]'
                      : 'border-cyanAlias/25 bg-cyanAlias/[.06]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {suggestion.title}
                      </p>

                      <p className="mt-2 text-sm leading-relaxed text-white/50">
                        {suggestion.description}
                      </p>
                    </div>

                    {!suggestion.is_read && (
                      <span
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: cyan }}
                      />
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[.16em] text-white/30">
                      Proposed result
                    </p>

                    <p className="mt-2 text-sm text-white">
                      {
                        suggestion.payload.reservation
                          .customer_name
                      }
                      {' → '}
                      {assignment.table_numbers.length === 1
                        ? 'Table '
                        : 'Tables '}
                      {assignment.table_numbers.join(' + ')}
                    </p>

                    {plan.moves.map((move) => (
                      <p
                        key={move.reservation_id}
                        className="mt-2 text-xs text-white/45"
                      >
                        {getMovedReservationName(
                          move.reservation_id,
                        )}
                        {': '}
                        {move.from_table_numbers.join(' + ')}
                        {' → '}
                        {move.to_table_numbers.join(' + ')}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-white/35">
                    <span>
                      {plan.moved_reservations_count}{' '}
                      {plan.moved_reservations_count === 1
                        ? 'move'
                        : 'moves'}
                    </span>

                    <span>
                      Score {plan.score.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      disabled={
                        dismissingId === suggestion.id
                      }
                      onClick={() =>
                        onDismiss(suggestion)
                      }
                      className="flex flex-1 items-center justify-center rounded-full border border-white/10 px-4 py-3 text-sm text-white/50 transition hover:border-white/20 hover:text-white disabled:opacity-50"
                    >
                      {dismissingId === suggestion.id
                        ? 'Dismissing…'
                        : 'Dismiss'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onReview(suggestion)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
                      style={{ background: cyan }}
                    >
                      <Bell size={15} />
                      Review
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
}