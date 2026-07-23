export type PendingTable = {
  x: number;
  y: number;
  shape: 'square' | 'round' | 'rectangle';
};

type CreateTableDialogProps = {
  pendingTable: PendingTable | null;
  tableNumber: string;
  seats: string;
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  creating: boolean;
  onTableNumberChange: (value: string) => void;
  onSeatsChange: (value: string) => void;
  onCancel: () => void;
  onCreate: () => void;
};

export function CreateTableDialog({
  pendingTable,
  tableNumber,
  seats,
  creating,
  zoom,
  pan,
  onTableNumberChange,
  onSeatsChange,
  onCancel,
  onCreate,
}: CreateTableDialogProps) {
  if (!pendingTable) {
    return null;
  }

  const numericSeats = Number(seats);

  const canCreate =
    tableNumber.trim().length > 0 &&
    Number.isInteger(numericSeats) &&
    numericSeats >= 1 &&
    numericSeats <= 100;

  function handleKeyDown(key: string) {
    if (key === 'Enter' && canCreate && !creating) {
      onCreate();
    }

    if (key === 'Escape' && !creating) {
      onCancel();
    }
  }

  return (
    <div
      className="absolute z-50 w-72 rounded-2xl border border-white/10 bg-[#0e1322] p-5 shadow-[0_24px_80px_rgba(0,0,0,.65)]"
      style={{
        left: pan.x + pendingTable.x * zoom,
        top: pan.y + pendingTable.y * zoom,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[.24em] text-white/30">
          {pendingTable.shape} table
        </p>

        <h3 className="mt-2 font-display text-2xl font-light text-white">
          Create table
        </h3>
      </div>

      <label
        htmlFor="floor-table-number"
        className="mb-2 block text-xs uppercase tracking-wider text-white/40"
      >
        Table number
      </label>

      <input
        id="floor-table-number"
        autoFocus
        value={tableNumber}
        onChange={(event) =>
          onTableNumberChange(event.target.value)
        }
        onKeyDown={(event) => handleKeyDown(event.key)}
        placeholder="Example: 12 or Terrace 2"
        className="mb-4 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyanAlias/40"
      />

      <label
        htmlFor="floor-table-seats"
        className="mb-2 block text-xs uppercase tracking-wider text-white/40"
      >
        Seats
      </label>

      <input
        id="floor-table-seats"
        type="number"
        min={1}
        max={100}
        value={seats}
        onChange={(event) => onSeatsChange(event.target.value)}
        onKeyDown={(event) => handleKeyDown(event.key)}
        className="mb-5 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyanAlias/40"
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={creating}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onCreate}
          disabled={creating || !canCreate}
          className="rounded-xl bg-cyanAlias px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {creating ? 'Creating...' : 'Create table'}
        </button>
      </div>
    </div>
  );
}