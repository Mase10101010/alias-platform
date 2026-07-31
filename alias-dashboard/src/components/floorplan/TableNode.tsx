import {
  LoaderCircle,
  type LucideProps,
} from 'lucide-react';
import type {
  PointerEventHandler,
  MouseEventHandler,
} from 'react';

import type {
  ReservationResponse,
  TableResponse,
} from '@/lib/api';

import type {
  LiveTableStatus,
} from '@/hooks/useLiveFloor';
import { cyan } from '@/lib/data';

type TableNodeProps = {
  table: TableResponse;
  saving: boolean;
  selected?: boolean;
  viewPortPanningEnabled?: boolean;
  draggingEnabled: boolean;
  mode?: 'edit' | 'live';
  liveStatus?: LiveTableStatus;
  liveReservation?: ReservationResponse | null;
  selectedDate?: Date;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerUp: PointerEventHandler<HTMLDivElement>;
  onPointerCancel: PointerEventHandler<HTMLDivElement>;
  onResizePointerDown?: PointerEventHandler<HTMLButtonElement>;
  onResizePointerMove?: PointerEventHandler<HTMLButtonElement>;
  onResizePointerUp?: PointerEventHandler<HTMLButtonElement>;
  onResizePointerCancel?: PointerEventHandler<HTMLButtonElement>;
  onRotatePointerDown?: PointerEventHandler<HTMLButtonElement>;
  onRotatePointerMove?: PointerEventHandler<HTMLButtonElement>;
  onRotatePointerUp?: PointerEventHandler<HTMLButtonElement>;
  onRotatePointerCancel?: PointerEventHandler<HTMLButtonElement>;
};

function getBorderRadius(table: TableResponse) {
  if (table.shape === 'round') {
    return '9999px';
  }

  if (table.shape === 'rectangle') {
    return '18px';
  }

  return '22px';
}

function SavingIcon(props: LucideProps) {
  return (
    <LoaderCircle
      {...props}
      className="animate-spin"
      style={{ color: cyan }}
    />
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelativeStart(
  reservation: ReservationResponse,
  selectedDate: Date,
) {
  const reservationStart = new Date(
    reservation.reservation_time,
  );

  const differenceMinutes = Math.round(
    (reservationStart.getTime() - selectedDate.getTime()) /
      60_000,
  );

  if (differenceMinutes <= 0) {
    return null;
  }

  if (differenceMinutes < 60) {
    return `Starts in ${differenceMinutes}m`;
  }

  const hours = Math.floor(differenceMinutes / 60);
  const minutes = differenceMinutes % 60;

  return minutes > 0
    ? `Starts in ${hours}h ${minutes}m`
    : `Starts in ${hours}h`;
}

export function TableNode({
  table,
  saving,
  selected = false,
  draggingEnabled,
  viewPortPanningEnabled = false,
  mode = 'edit',
  liveStatus = 'available',
  liveReservation = null,
  selectedDate,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onResizePointerDown,
  onResizePointerMove,
  onResizePointerUp,
  onResizePointerCancel,
  onRotatePointerDown,
  onRotatePointerMove,
  onRotatePointerUp,
  onRotatePointerCancel,
}: TableNodeProps) {
  const isLiveMode = mode === 'live';

  const liveAppearance = {
    available: {
      border: 'rgba(74, 222, 128, .65)',
      background:
        'linear-gradient(145deg, rgba(74,222,128,.22), rgba(255,255,255,.035))',
      shadow:
        '0 12px 35px rgba(0,0,0,.35), 0 0 26px rgba(74,222,128,.14)',
      label: 'Available',
      labelClass: 'text-green-300',
    },
    reserved: {
      border: 'rgba(251, 191, 36, .7)',
      background:
        'linear-gradient(145deg, rgba(251,191,36,.24), rgba(255,255,255,.035))',
      shadow:
        '0 12px 35px rgba(0,0,0,.35), 0 0 28px rgba(251,191,36,.15)',
      label: 'Reserved',
      labelClass: 'text-amber-300',
    },
    occupied: {
      border: 'rgba(248, 113, 113, .75)',
      background:
        'linear-gradient(145deg, rgba(248,113,113,.27), rgba(255,255,255,.04))',
      shadow:
        '0 12px 35px rgba(0,0,0,.4), 0 0 30px rgba(248,113,113,.18)',
      label: 'Occupied',
      labelClass: 'text-red-300',
    },
  }[liveStatus];

  const reservationStart = liveReservation
    ? new Date(liveReservation.reservation_time)
    : null;

  const reservationEnd =
    liveReservation && reservationStart
      ? new Date(
          reservationStart.getTime() +
            liveReservation.duration_minutes * 60_000,
        )
      : null;

  const relativeStart =
    liveReservation && selectedDate
      ? formatRelativeStart(liveReservation, selectedDate)
      : null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Table ${table.table_number}, ${table.seats} seats`}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      onPointerDown={(event) => {
        if (viewPortPanningEnabled || event.button === 1) {
          return;
        }
        event.stopPropagation();
        onPointerDown(event);
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className={`absolute flex select-none items-center justify-center border text-center transition ${
        draggingEnabled
          ? 'cursor-grab active:cursor-grabbing'
          : 'cursor-default'
      }`}
      style={{
        left: table.x,
        top: table.y,
        width: table.width,
        height: table.height,
        borderRadius: getBorderRadius(table),
        transform: `rotate(${table.rotation}deg)`,
        borderColor: isLiveMode
          ? selected
            ? 'rgba(255, 255, 255, .95)'
            : liveAppearance.border
          : selected
            ? cyan
            : `${cyan}45`,
        background: isLiveMode
          ? liveAppearance.background
          : selected
            ? `linear-gradient(145deg, ${cyan}35, rgba(255,255,255,.06))`
            : `linear-gradient(145deg, ${cyan}22, rgba(255,255,255,.035))`,
        boxShadow: isLiveMode
          ? selected
            ? `0 0 0 3px rgba(255,255,255,.12), ${liveAppearance.shadow}`
            : liveAppearance.shadow
          : selected
            ? `0 0 0 2px ${cyan}30, 0 16px 42px rgba(0,0,0,.42), 0 0 32px ${cyan}20`
            : `0 12px 35px rgba(0,0,0,.35), 0 0 25px ${cyan}10`,
        opacity: saving ? 0.7 : 1,
        touchAction: 'none',
        zIndex: selected ? 20 : 10,
      }}
    >
      <div
        className="flex max-w-full flex-col items-center px-2"
        style={{
          transform: `rotate(-${table.rotation}deg)`,
        }}
      >
        {saving ? (
          <SavingIcon size={16} />
        ) : isLiveMode ? (
          <>
            <span className="max-w-full truncate font-display text-lg text-white">
              {table.table_number}
            </span>

            <span
              className={`mt-1 text-[9px] font-medium uppercase tracking-[.16em] ${liveAppearance.labelClass}`}
            >
              {liveAppearance.label}
            </span>

            {liveReservation && reservationStart && reservationEnd && (
              <>
                <span className="mt-1 max-w-full truncate px-1 text-xs font-medium text-white/85">
                  {liveReservation.customer_name}
                </span>

                <span className="mt-0.5 text-[10px] text-white/55">
                  {formatTime(reservationStart)}–{formatTime(reservationEnd)}
                </span>

                <span className="mt-0.5 text-[10px] text-white/40">
                  {liveReservation.party_size}{' '}
                  {liveReservation.party_size === 1
                    ? 'guest'
                    : 'guests'}
                </span>

                {relativeStart && (
                  <span className="mt-1 rounded-full bg-black/25 px-2 py-0.5 text-[9px] font-medium text-amber-200">
                    {relativeStart}
                  </span>
                )}
              </>
            )}

            {!liveReservation && (
              <span className="mt-1 text-[10px] text-white/35">
                {table.seats} seats
              </span>
            )}
          </>
        ) : (
          <>
            <span className="max-w-full truncate font-display text-lg text-white">
              {table.table_number}
            </span>

            <span className="mt-1 text-[10px] uppercase tracking-[.18em] text-white/40">
              {table.seats} seats
            </span>
          </>
        )}
      </div>

      {!isLiveMode && selected && draggingEnabled && (
        <button
          type="button"
          aria-label={`Rotate table ${table.table_number}`}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRotatePointerDown?.(event);
          }}
          onPointerMove={(event) => {
            event.stopPropagation();
            onRotatePointerMove?.(event);
          }}
          onPointerUp={(event) => {
            event.stopPropagation();
            onRotatePointerUp?.(event);
          }}
          onPointerCancel={(event) => {
            event.stopPropagation();
            onRotatePointerCancel?.(event);
          }}
          className="absolute -top-10 left-1/2 z-30 flex h-7 w-7 -translate-x-1/2 cursor-grab items-center justify-center rounded-full border-2 border-[#050607] bg-cyanAlias text-xs font-bold text-black shadow-[0_0_16px_rgba(127,227,230,.45)] active:cursor-grabbing"
        >
          ↻
        </button>
      )}

      {!isLiveMode && selected && draggingEnabled && (
        <button
          type="button"
          aria-label={`Resize table ${table.table_number}`}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onResizePointerDown?.(event);
          }}
          onPointerMove={(event) => {
            event.stopPropagation();
            onResizePointerMove?.(event);
          }}
          onPointerUp={(event) => {
            event.stopPropagation();
            onResizePointerUp?.(event);
          }}
          onPointerCancel={(event) => {
            event.stopPropagation();
            onResizePointerCancel?.(event);
          }}
          className="absolute -bottom-2 -right-2 z-30 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-[#050607] bg-cyanAlias shadow-[0_0_16px_rgba(127,227,230,.45)]"
        />
      )}
    </div>
  );
}