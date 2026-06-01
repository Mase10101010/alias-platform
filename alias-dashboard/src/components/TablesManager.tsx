import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import {
  createTable,
  deleteTable,
  getTables,
  type TableResponse,
} from '@/lib/api';
import { cyan } from '@/lib/data';

export function TablesManager({ restaurantId }: { restaurantId: string }) {
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [seats, setSeats] = useState(2);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadTables() {
    try {
      setError(null);
      setLoading(true);
      const data = await getTables(restaurantId);
      setTables(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load tables.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTables();
  }, [restaurantId]);

  async function handleCreateTable() {
    if (!tableNumber.trim()) {
      setError('Table number is required.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await createTable(restaurantId, {
        table_number: tableNumber.trim(),
        seats,
      });

      setTableNumber('');
      setSeats(2);

      await loadTables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create table.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTable(tableId: string) {
    try {
      setError(null);
      await deleteTable(restaurantId, tableId);
      await loadTables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete table.');
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <div>
        <p className="text-xs uppercase tracking-[.24em] text-white/35">
          Table Management
        </p>

        <h2 className="mt-3 font-display text-3xl font-light text-white">
          Restaurant tables.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
          Add physical tables with visible numbers and internal Alias codes for
          future AI reservation assignment.
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_140px_auto]">
        <input
          value={tableNumber}
          onChange={(event) => setTableNumber(event.target.value)}
          placeholder="Table number"
          className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
        />

        <input
          value={seats}
          onChange={(event) => setSeats(Number(event.target.value))}
          type="number"
          min={1}
          placeholder="Seats"
          className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white outline-none focus:border-white/25"
        />

        <button
          type="button"
          onClick={handleCreateTable}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-60"
          style={{ background: cyan }}
        >
          <Plus size={16} />
          {saving ? 'Adding...' : 'Add table'}
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {loading && (
          <p className="text-sm text-white/40">Loading tables...</p>
        )}

        {!loading && tables.length === 0 && (
          <p className="text-sm text-white/40">No tables added yet.</p>
        )}

        {tables.map((table) => (
          <div
            key={table.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
          >
            <div>
              <p className="font-medium text-white">
                Table {table.table_number}
              </p>
              <p className="mt-1 text-sm text-white/40">
                {table.seats} seats · {table.table_code}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDeleteTable(table.id)}
              className="rounded-full border border-white/10 p-2 text-white/45 transition hover:border-red-400/30 hover:text-red-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}