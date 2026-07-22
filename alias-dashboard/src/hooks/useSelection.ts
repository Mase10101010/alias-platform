import { useMemo, useState } from 'react';
import type { TableResponse } from '@/lib/api';

export function useSelection(tables: TableResponse[]) {
  const [selectedTableId, setSelectedTableId] =
    useState<string | null>(null);

  const selectedTable = useMemo(
    () =>
      tables.find(
        (table) => table.id === selectedTableId,
      ) ?? null,
    [tables, selectedTableId],
  );

  return {
    selectedTable,
    selectedTableId,
    setSelectedTableId,
  };
}