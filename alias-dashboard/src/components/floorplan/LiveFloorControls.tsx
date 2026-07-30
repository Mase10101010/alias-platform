import {
  CalendarDays,
  Clock3,
  PencilRuler,
  RefreshCw,
  Radio,
} from 'lucide-react';

export type FloorMode = 'edit' | 'live';

type LiveFloorControlsProps = {
  mode: FloorMode;
  selectedDate: Date;
  loading: boolean;
  lastUpdatedAt: Date | null;
  onModeChange: (mode: FloorMode) => void;
  onDateChange: (date: Date) => void;
  onRefresh: () => void;
};

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

function roundToNearestHalfHour(date: Date) {
  const rounded = new Date(date);
  const roundedMinutes = Math.round(rounded.getMinutes() / 30) * 30;

  rounded.setMinutes(roundedMinutes, 0, 0);

  return rounded;
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
  onModeChange,
  onDateChange,
  onRefresh,
}: LiveFloorControlsProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex rounded-xl border border-white/10 bg-black/25 p-1">
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
            onClick={() => onDateChange(roundToNearestHalfHour(new Date()))}
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
  );
}