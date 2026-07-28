import { Save, Trash2, X } from 'lucide-react';

import type {
  TableResponse,
  TableShape,
} from '@/lib/api';

type PropertyPanelProps = {
  table: TableResponse | null;
  tableNumber: string;
  seats: string;
  shape: TableShape;
  saving: boolean;
  deleting: boolean;
  onTableNumberChange: (value: string) => void;
  onSeatsChange: (value: string) => void;
  onShapeChange: (value: TableShape) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
};

export function PropertyPanel({
  table,
  tableNumber,
  seats,
  shape,
  saving,
  deleting,
  onTableNumberChange,
  onSeatsChange,
  onShapeChange,
  onClose,
  onSave,
  onDelete,
}: PropertyPanelProps) {
  if (!table) {
    return null;
  }

  const numericSeats = Number(seats);

  const canSave =
    tableNumber.trim().length > 0 &&
    Number.isInteger(numericSeats) &&
    numericSeats >= 1 &&
    numericSeats <= 100;

  return (
    <aside className="w-full rounded-3xl border border-white/10 bg-white/[.035] p-5 lg:w-80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[.24em] text-white/30">
            Selected table
          </p>

          <h2 className="mt-2 font-display text-2xl font-light text-white">
            Table {table.table_number}
          </h2>

          <p className="mt-1 text-xs text-white/35">
            Alias code: {table.table_code}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[.03] text-white/45 transition hover:text-white"
          aria-label="Close table properties"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="property-table-number"
            className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35"
          >
            Table number
          </label>

          <input
            id="property-table-number"
            value={tableNumber}
            onChange={(event) =>
              onTableNumberChange(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyanAlias/40"
          />
        </div>

        <div>
          <label
            htmlFor="property-table-seats"
            className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35"
          >
            Seats
          </label>

          <input
            id="property-table-seats"
            type="number"
            min={1}
            max={100}
            value={seats}
            onChange={(event) =>
              onSeatsChange(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyanAlias/40"
          />
        </div>

        <div>
          <label
            htmlFor="property-table-shape"
            className="mb-2 block text-xs uppercase tracking-[.18em] text-white/35"
          >
            Shape
          </label>

          <select
            id="property-table-shape"
            value={shape}
            onChange={(event) =>
              onShapeChange(
                event.target.value as TableShape,
              )
            }
            className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyanAlias/40"
          >
            <option value="square">Square</option>
            <option value="round">Round</option>
            <option value="rectangle">Rectangle</option>
          </select>
        </div>
      </div>

      <div className="mt-7 space-y-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || deleting || !canSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyanAlias px-4 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save changes'}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={saving || deleting}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200 transition hover:bg-red-400/15 disabled:opacity-40"
        >
          <Trash2 size={16} />
          {deleting ? 'Deleting...' : 'Delete table'}
        </button>
      </div>
    </aside>
  );
}