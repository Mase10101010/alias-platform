import {
  CalendarDays,
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

function parseDateInputValue(value: string) {
  const [year, month, day] = value
    .split('-')
    .map(Number);

  return new Date(year, month - 1, day);
}

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
            <CalendarDays
              size={16}
              className="text-white/40"
            />

            <input
              type="date"
              value={formatDateInputValue(selectedDate)}
              onChange={(event) => {
                if (!event.target.value) {
                  return;
                }

                onDateChange(
                  parseDateInputValue(event.target.value),
                );
              }}
              className="bg-transparent text-sm text-white outline-none"
            />
          </label>

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