import { Combine, LoaderCircle, X } from 'lucide-react';

import type { TableResponse } from '@/lib/api';
import { cyan } from '@/lib/data';

type CreateTableCombinationDialogProps = {
  open: boolean;
  selectedTables: TableResponse[];
  name: string;
  minCapacity: string;
  maxCapacity: string;
  setupMinutes: string;
  creating: boolean;
  onNameChange: (value: string) => void;
  onMinCapacityChange: (value: string) => void;
  onMaxCapacityChange: (value: string) => void;
  onSetupMinutesChange: (value: string) => void;
  onCancel: () => void;
  onCreate: () => void;
};

export function CreateTableCombinationDialog({
  open,
  selectedTables,
  name,
  minCapacity,
  maxCapacity,
  setupMinutes,
  creating,
  onNameChange,
  onMinCapacityChange,
  onMaxCapacityChange,
  onSetupMinutesChange,
  onCancel,
  onCreate,
}: CreateTableCombinationDialogProps) {
  if (!open) {
    return null;
  }

  const selectedCapacity = selectedTables.reduce(
    (total, table) => total + table.seats,
    0,
  );

  const canCreate =
    selectedTables.length >= 2 &&
    name.trim().length > 0 &&
    Number(minCapacity) >= 1 &&
    Number(maxCapacity) >= 1 &&
    Number(minCapacity) <= Number(maxCapacity) &&
    Number(setupMinutes) >= 0 &&
    !creating;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#080b12] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[.24em] text-cyanAlias">
              <Combine size={16} />
              Table combination
            </div>

            <h2 className="mt-3 font-display text-3xl font-light text-white">
              Create a valid combination
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/45">
              Alias will only combine these physical tables when
              this configuration is suitable and available.
            </p>
          </div>

          <button
            type="button"
            disabled={creating}
            onClick={onCancel}
            className="rounded-full border border-white/10 p-2 text-white/45 transition hover:bg-white/[.06] hover:text-white disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.025] p-4">
          <p className="text-xs uppercase tracking-[.18em] text-white/30">
            Selected tables
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedTables.map((table) => (
              <span
                key={table.id}
                className="rounded-full border border-cyanAlias/20 bg-cyanAlias/10 px-3 py-1.5 text-xs text-cyanAlias"
              >
                Table {table.table_number} · {table.seats} seats
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm text-white/45">
            Physical capacity:
            <strong className="ml-2 text-white/80">
              {selectedCapacity} seats
            </strong>
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-[.16em] text-white/35">
              Combination name
            </span>

            <input
              value={name}
              disabled={creating}
              onChange={(event) =>
                onNameChange(event.target.value)
              }
              placeholder="Table 1 + Table 2"
              className="w-full rounded-2xl border border-white/10 bg-white/[.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyanAlias/40"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs uppercase tracking-[.16em] text-white/35">
              Minimum capacity
            </span>

            <input
              type="number"
              min="1"
              value={minCapacity}
              disabled={creating}
              onChange={(event) =>
                onMinCapacityChange(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[.035] px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAlias/40"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs uppercase tracking-[.16em] text-white/35">
              Maximum capacity
            </span>

            <input
              type="number"
              min="1"
              value={maxCapacity}
              disabled={creating}
              onChange={(event) =>
                onMaxCapacityChange(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[.035] px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAlias/40"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-[.16em] text-white/35">
              Setup time in minutes
            </span>

            <input
              type="number"
              min="0"
              max="180"
              value={setupMinutes}
              disabled={creating}
              onChange={(event) =>
                onSetupMinutesChange(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[.035] px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAlias/40"
            />

            <p className="mt-2 text-xs leading-relaxed text-white/30">
              Time needed by staff to join or separate the tables.
            </p>
          </label>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={creating}
            onClick={onCancel}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/55 transition hover:bg-white/[.05] hover:text-white disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canCreate}
            onClick={onCreate}
            className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: cyan }}
          >
            {creating && (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            )}

            {creating
              ? 'Creating combination...'
              : 'Create combination'}
          </button>
        </div>
      </div>
    </div>
  );
}