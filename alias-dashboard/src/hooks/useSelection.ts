import { useMemo, useState } from 'react';

import type { TableResponse } from '@/lib/api';

export function useSelection(tables: TableResponse[]) {
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);

  const selectedTables = useMemo(
    () =>
      tables.filter((table) =>
        selectedTableIds.includes(table.id),
      ),
    [tables, selectedTableIds],
  );

  const selectedTable =
    selectedTables.length === 1 ? selectedTables[0] : null;

  const selectedTableId =
    selectedTables.length === 1 ? selectedTables[0].id : null;

  function selectOnly(tableId: string) {
    setSelectedTableIds([tableId]);
  }

  function toggleSelection(tableId: string) {
    setSelectedTableIds((current) =>
      current.includes(tableId)
        ? current.filter((id) => id !== tableId)
        : [...current, tableId],
    );
  }

  function clearSelection() {
    setSelectedTableIds([]);
  }

  function setSelectedTableId(tableId: string | null) {
    if (tableId === null) {
      clearSelection();
      return;
    }

    selectOnly(tableId);
  }

  return {
    selectedTable,
    selectedTableId,
    selectedTables,
    selectedTableIds,
    setSelectedTableIds,
    setSelectedTableId,
    selectOnly,
    toggleSelection,
    clearSelection,
  };
}