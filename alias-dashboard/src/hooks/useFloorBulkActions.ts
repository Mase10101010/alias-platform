import { useState } from 'react';

import {
  createTable,
  deleteTable,
  type TableResponse,
} from '@/lib/api';

type UseFloorBulkActionsOptions = {
  restaurantId: string | null;
  tables: TableResponse[];
  selectedTables: TableResponse[];
  setTables: React.Dispatch<
    React.SetStateAction<TableResponse[]>
  >;
  clearSelection: () => void;
  onError: (message: string) => void;
};

function getNextAvailableTableNumber(
  sourceNumber: string,
  usedNumbers: Set<string>,
) {
  const trimmed = sourceNumber.trim();
  const match = trimmed.match(/^(.*?)(\d+)$/);

  if (match) {
    const prefix = match[1];
    const numericPart = match[2];
    const padding = numericPart.length;

    let nextValue = Number(numericPart) + 1;

    while (true) {
      const candidate = `${prefix}${String(nextValue).padStart(
        padding,
        '0',
      )}`;

      if (!usedNumbers.has(candidate)) {
        return candidate;
      }

      nextValue += 1;
    }
  }

  let copyIndex = 2;
  let candidate = `${trimmed} 2`;

  while (usedNumbers.has(candidate)) {
    copyIndex += 1;
    candidate = `${trimmed} ${copyIndex}`;
  }

  return candidate;
}

export function useFloorBulkActions({
  restaurantId,
  tables,
  selectedTables,
  setTables,
  clearSelection,
  onError,
}: UseFloorBulkActionsOptions) {
  const [deletingSelectedTables, setDeletingSelectedTables] =
    useState(false);

  const [duplicatingSelectedTables, setDuplicatingSelectedTables] =
    useState(false);

  async function removeSelectedTables() {
    if (
      selectedTables.length === 0 ||
      !restaurantId ||
      deletingSelectedTables
    ) {
      return;
    }

    const label =
      selectedTables.length === 1
        ? `table ${selectedTables[0].table_number}`
        : `${selectedTables.length} selected tables`;

    const confirmed = window.confirm(
      `Delete ${label}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingSelectedTables(true);
      onError('');

      await Promise.all(
        selectedTables.map((table) =>
          deleteTable(restaurantId, table.id),
        ),
      );

      const deletedIds = new Set(
        selectedTables.map((table) => table.id),
      );

      setTables((current) =>
        current.filter(
          (table) => !deletedIds.has(table.id),
        ),
      );

      clearSelection();
    } catch (error) {
      console.error(
        'Failed to delete selected tables',
        error,
      );

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to delete the selected tables.',
      );
    } finally {
      setDeletingSelectedTables(false);
    }
  }

  async function duplicateSelectedTables() {
    if (
      selectedTables.length === 0 ||
      !restaurantId ||
      duplicatingSelectedTables
    ) {
      return;
    }

    try {
      setDuplicatingSelectedTables(true);
      onError('');

      const createdTables: TableResponse[] = [];

      const usedNumbers = new Set(
        tables.map((table) => table.table_number),
      );

      for (const table of selectedTables) {
        const nextTableNumber =
          getNextAvailableTableNumber(
            table.table_number,
            usedNumbers,
          );

        usedNumbers.add(nextTableNumber);

        const created = await createTable(
          restaurantId,
          {
            table_number: nextTableNumber,
            seats: table.seats,
            x: table.x + 40,
            y: table.y + 40,
            width: table.width,
            height: table.height,
            shape: table.shape,
            rotation: table.rotation,
          },
        );

        createdTables.push(created);
      }

      setTables((current) => [
        ...current,
        ...createdTables,
      ]);
    } catch (error) {
      console.error(
        'Failed to duplicate selected tables',
        error,
      );

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to duplicate the selected tables.',
      );
    } finally {
      setDuplicatingSelectedTables(false);
    }
  }

  return {
    deletingSelectedTables,
    duplicatingSelectedTables,
    removeSelectedTables,
    duplicateSelectedTables,
  };
}