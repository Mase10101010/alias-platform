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

function getTableDimensions(shape: TableShape) {
  if (shape === 'rectangle') {
    return {
      width: 140,
      height: 80,
    };
  }

  return {
    width: 80,
    height: 80,
  };
}

export function useTableProperties({
  restaurantId,
  selectedTable,
  setTables,
  clearSelection,
  onError,
}: UseTablePropertiesOptions) {
  const [tableNumber, setTableNumber] = useState('');
  const [seats, setSeats] = useState('4');
  const [shape, setShape] = useState<TableShape>('square');
  const [rotation, setRotation] = useState('0');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!selectedTable) {
      setTableNumber('');
      setSeats('4');
      setShape('square');
      setRotation('0');
      return;
    }

    setTableNumber(selectedTable.table_number);
    setSeats(String(selectedTable.seats));
    setShape(selectedTable.shape);
    setRotation(String(selectedTable.rotation));
  }, [selectedTable]);

  async function save() {
    if (!selectedTable || !restaurantId || saving) {
      return;
    }

    const normalizedTableNumber = tableNumber.trim();
    const parsedSeats = Number(seats);
    const parsedRotation = Number(rotation);

    if (
      !normalizedTableNumber ||
      !Number.isInteger(parsedSeats) ||
      parsedSeats < 1 ||
      parsedSeats > 100 ||
      !Number.isInteger(parsedRotation) ||
      parsedRotation < 0 ||
      parsedRotation >= 360
    ) {
      onError('Please enter valid table details.');
      return;
    }

    const dimensions = getTableDimensions(shape);

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
          rotation: parsedRotation,
          width: dimensions.width,
          height: dimensions.height,
        },
      );

      setTables((current) =>
        current.map((table) =>
          table.id === updated.id ? updated : table,
        ),
      );
    } catch (error) {
      console.error('Failed to update table', error);

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
          (table) => table.id !== selectedTable.id,
        ),
      );

      clearSelection();
    } catch (error) {
      console.error('Failed to delete table', error);

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
    rotation,
    setRotation,
    saving,
    deleting,
    save,
    remove,
  };
}