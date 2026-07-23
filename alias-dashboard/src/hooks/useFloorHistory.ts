import { useState } from 'react';

import { updateTable } from '@/lib/api';

export type FloorHistoryChange =
  | {
      type: 'move';
      tableId: string;
      x: number;
      y: number;
    }
  | {
      type: 'resize';
      tableId: string;
      width: number;
      height: number;
    }
  | {
      type: 'rotate';
      tableId: string;
      rotation: number;
    };

type HistoryEntry = {
  label: string;
  before: FloorHistoryChange;
  after: FloorHistoryChange;
};

type UseFloorHistoryOptions = {
  restaurantId: string | null;
  setTables: React.Dispatch<React.SetStateAction<any[]>>;
  onError(message: string): void;
};

export function useFloorHistory({
  restaurantId,
  setTables,
  onError,
}: UseFloorHistoryOptions) {
  const [undoStack, setUndoStack] = useState<HistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryEntry[]>([]);
  const [historySaving, setHistorySaving] = useState(false);

  function record(entry: HistoryEntry) {
    setUndoStack((current) => [...current, entry]);
    setRedoStack([]);
  }

  async function apply(change: FloorHistoryChange) {
    if (!restaurantId) {
      throw new Error('Restaurant not found');
    }

    if (change.type === 'move') {
      return updateTable(restaurantId, change.tableId, {
        x: change.x,
        y: change.y,
      });
    }

    if (change.type === 'resize') {
      return updateTable(restaurantId, change.tableId, {
        width: change.width,
        height: change.height,
      });
    }

    return updateTable(restaurantId, change.tableId, {
      rotation: change.rotation,
    });
  }

  async function undo() {
    const entry = undoStack[undoStack.length - 1];

    if (!entry || historySaving) {
      return;
    }

    try {
      setHistorySaving(true);
      onError('');

      const updated = await apply(entry.before);

      setTables((current) =>
        current.map((table: any) =>
          table.id === updated.id ? updated : table,
        ),
      );

      setUndoStack((current) => current.slice(0, -1));
      setRedoStack((current) => [...current, entry]);
    } catch (error) {
      console.error(error);

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to undo.',
      );
    } finally {
      setHistorySaving(false);
    }
  }

  async function redo() {
    const entry = redoStack[redoStack.length - 1];

    if (!entry || historySaving) {
      return;
    }

    try {
      setHistorySaving(true);
      onError('');

      const updated = await apply(entry.after);

      setTables((current) =>
        current.map((table: any) =>
          table.id === updated.id ? updated : table,
        ),
      );

      setRedoStack((current) => current.slice(0, -1));
      setUndoStack((current) => [...current, entry]);
    } catch (error) {
      console.error(error);

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to redo.',
      );
    } finally {
      setHistorySaving(false);
    }
  }

  return {
    record,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    historySaving,
  };
}