import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  PencilRuler,
  RefreshCw,
  Radio,
} from 'lucide-react';

export type FloorMode = 'edit' | 'live';

export type LiveFloorTableCounts = {
  total: number;
  available: number;
  reserved: number;
  occupied: number;
};

type LiveFloorControlsProps = {
  mode: FloorMode;
  selectedDate: Date;
  loading: boolean;
  lastUpdatedAt: Date | null;
  tableCounts: LiveFloorTableCounts;
  onModeChange: (mode: FloorMode) => void;
  onDateChange: (date: Date) => void;
  onNow: () => void;
  onRefresh: () => void;
};

const SLOT_MINUTES = 30;
const VISIBLE_SLOT_OFFSETS = [-2, -1, 0, 1, 2];

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatTimeInputValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function formatTimelineTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatTimelineDay(date: Date) {
  return date.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
  });
}

function parseDateInputValue(value: string, current: Date) {
  const [year, month, day] = value.split('-').map(Number);
  const next = new Date(current);

  next.setFullYear(year, month - 1, day);
  next.setSeconds(0, 0);

  return next;
}

function parseTimeInputValue(value: string, current: Date) {
  const [hours, minutes] = value.split(':').map(Number);
  const next = new Date(current);

  next.setHours(hours, minutes, 0, 0);

  return next;
}


function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function isSameCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? 0 : 30;
  const value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return { value, label: value };
});

export function LiveFloorControls({
  mode,
  selectedDate,
  loading,
  lastUpdatedAt,
  tableCounts,
  onModeChange,
  onDateChange,
  onNow,
  onRefresh,
}: LiveFloorControlsProps) {
  const timelineSlots = VISIBLE_SLOT_OFFSETS.map((offset) => ({
    offset,
    date: addMinutes(selectedDate, offset * SLOT_MINUTES),
  }));

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-fit rounded-xl border border-white/10 bg-black/25 p-1">
          <button
            type="button"
            onClick={() => onModeChange('edit')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
              mode === 'edit'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <PencilRuler size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onModeChange('live')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition ${
              mode === 'live'
                ? 'bg-cyanAlias text-black'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Radio size={16} />
            Live
          </button>
        </div>

        {mode === 'live' && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
              <CalendarDays size={16} className="text-white/40" />

              <input
                type="date"
                value={formatDateInputValue(selectedDate)}
                onChange={(event) => {
                  if (!event.target.value) return;

                  onDateChange(
                    parseDateInputValue(event.target.value, selectedDate),
                  );
                }}
                className="bg-transparent text-sm text-white outline-none"
              />
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
              <Clock3 size={16} className="text-white/40" />

              <select
                value={formatTimeInputValue(selectedDate)}
                onChange={(event) => {
                  onDateChange(
                    parseTimeInputValue(event.target.value, selectedDate),
                  );
                }}
                className="bg-transparent text-sm text-white outline-none"
              >
                {TIME_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-[#111417] text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={onNow}
              disabled={loading}
              className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Now
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2 text-sm text-white/60 transition hover:bg-white/[.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw
                size={15}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>

            {lastUpdatedAt && (
              <span className="text-xs text-white/30">
                Updated{' '}
                {lastUpdatedAt.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
        )}
      </div>

      {mode === 'live' && (
        <div className="flex items-stretch gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/25 p-2">
          <button
            type="button"
            aria-label="Previous 30 minutes"
            title="Previous 30 minutes"
            onClick={() =>
              onDateChange(addMinutes(selectedDate, -SLOT_MINUTES))
            }
            className="flex min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.03] text-white/50 transition hover:bg-white/[.08] hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="grid min-w-[540px] flex-1 grid-cols-5 gap-2">
            {timelineSlots.map(({ offset, date }) => {
              const selected = offset === 0;
              const differentDay = !isSameCalendarDay(date, selectedDate);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => onDateChange(date)}
                  aria-pressed={selected}
                  className={`group flex min-h-14 flex-col items-center justify-center rounded-xl border px-3 py-2 text-center transition ${
                    selected
                      ? 'border-cyan-300/50 bg-cyanAlias text-black shadow-[0_0_24px_rgba(34,211,238,0.12)]'
                      : 'border-white/10 bg-white/[.03] text-white/55 hover:border-white/20 hover:bg-white/[.07] hover:text-white'
                  }`}
                >
                  <span className="text-sm font-semibold tabular-nums">
                    {formatTimelineTime(date)}
                  </span>

                  <span
                    className={`mt-0.5 text-[10px] uppercase tracking-[0.14em] ${
                      selected ? 'text-black/60' : 'text-white/25'
                    }`}
                  >
                    {differentDay ? formatTimelineDay(date) : '30 min'}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next 30 minutes"
            title="Next 30 minutes"
            onClick={() =>
              onDateChange(addMinutes(selectedDate, SLOT_MINUTES))
            }
            className="flex min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.03] text-white/50 transition hover:bg-white/[.08] hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {mode === 'live' && (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
              Table status
            </span>

            <div className="flex items-center gap-2 text-xs text-white/55">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />
              Available
            </div>

            <div className="flex items-center gap-2 text-xs text-white/55">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.45)]" />
              Reserved
            </div>

            <div className="flex items-center gap-2 text-xs text-white/55">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.45)]" />
              Occupied
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-white/[.03] px-2.5 py-1 text-xs tabular-nums text-white/50">
                {tableCounts.total} tables
              </span>
              <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/[.08] px-2.5 py-1 text-xs tabular-nums text-emerald-300">
                {tableCounts.available} available
              </span>
              {tableCounts.reserved > 0 && (
                <span className="rounded-lg border border-amber-400/15 bg-amber-400/[.08] px-2.5 py-1 text-xs tabular-nums text-amber-300">
                  {tableCounts.reserved} reserved
                </span>
              )}
              <span className="rounded-lg border border-red-400/15 bg-red-400/[.08] px-2.5 py-1 text-xs tabular-nums text-red-300">
                {tableCounts.occupied} occupied
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/35">
              <Clock3 size={14} />
              <span>Viewing</span>
              <span className="font-medium tabular-nums text-white/70">
                {formatTimelineTime(selectedDate)}–
                {formatTimelineTime(addMinutes(selectedDate, SLOT_MINUTES))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}