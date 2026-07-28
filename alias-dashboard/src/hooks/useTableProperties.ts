import { useEffect, useState } from 'react';

import {
  deleteTable,
  updateTable,
  type TableResponse,
  type TableShape,
} from '@/lib/api';

type UseTablePropertiesOptions = {
  restaurantId: string | null;
  selectedTable: TableResponse | null;
  setTables: React.Dispatch<
    React.SetStateAction<TableResponse[]>
  >;
  clearSelection: () => void;
  onError: (message: string) => void;
};

export function useTableProperties({
  restaurantId,
  selectedTable,
  setTables,
  clearSelection,
  onError,
}: UseTablePropertiesOptions) {
  const [tableNumber, setTableNumber] = useState('');
  const [seats, setSeats] = useState('4');
  const [shape, setShape] =
    useState<TableShape>('square');

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!selectedTable) {
      setTableNumber('');
      setSeats('4');
      setShape('square');
      return;
    }

    setTableNumber(selectedTable.table_number);
    setSeats(String(selectedTable.seats));
    setShape(selectedTable.shape);
  }, [selectedTable]);

  async function save() {
    if (!selectedTable || !restaurantId || saving) {
      return;
    }

    const normalizedTableNumber = tableNumber.trim();
    const parsedSeats = Number(seats);

    if (
      !normalizedTableNumber ||
      !Number.isInteger(parsedSeats) ||
      parsedSeats < 1 ||
      parsedSeats > 100
    ) {
      onError('Please enter valid table details.');
      return;
    }

    try {
      setSaving(true);
      onError('');

      const updated = await updateTable(
        restaurantId,
        selectedTable.id,
        {
          table_number: normalizedTableNumber,
          seats: parsedSeats,
          shape,
        },
      );

      setTables((current) =>
        current.map((table) =>
          table.id === updated.id
            ? {
                ...table,
                table_number: updated.table_number,
                table_code: updated.table_code,
                seats: updated.seats,
                shape: updated.shape,
                is_active: updated.is_active,
                updated_at: updated.updated_at,
              }
            : table,
        ),
      );
    } catch (error) {
      console.error(
        'Failed to update table',
        error,
      );

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to update table.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selectedTable || !restaurantId || deleting) {
      return;
    }

    const confirmed = window.confirm(
      `Delete table ${selectedTable.table_number}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      onError('');

      await deleteTable(
        restaurantId,
        selectedTable.id,
      );

      setTables((current) =>
        current.filter(
          (table) =>
            table.id !== selectedTable.id,
        ),
      );

      clearSelection();
    } catch (error) {
      console.error(
        'Failed to delete table',
        error,
      );

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to delete table.',
      );
    } finally {
      setDeleting(false);
    }
  }

  return {
    tableNumber,
    setTableNumber,

    seats,
    setSeats,

    shape,
    setShape,

    saving,
    deleting,

    save,
    remove,
  };
}