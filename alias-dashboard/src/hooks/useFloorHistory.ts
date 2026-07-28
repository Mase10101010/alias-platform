import { useState } from 'react';

import { updateTablePlacement } from '@/lib/api';

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
  floorPlanId: string | null;
  setTables: React.Dispatch<React.SetStateAction<any[]>>;
  onError(message: string): void;
};

export function useFloorHistory({
  restaurantId,
  floorPlanId,
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
    if (!restaurantId || !floorPlanId) {
      throw new Error('Restaurant or floor plan not found');
    }

    if (change.type === 'move') {
        return updateTablePlacement(
          restaurantId, 
          floorPlanId,
          change.tableId, 
          {
              x: change.x,
              y: change.y,
          },
      );
    }

    if (change.type === 'resize') {
        return updateTablePlacement(
          restaurantId, 
          floorPlanId,
          change.tableId, 
          {
            width: change.width,
            height: change.height,
          },
      );
    }

    return updateTablePlacement(
        restaurantId, 
        floorPlanId,
        change.tableId, 
        {
          rotation: change.rotation,
        },
      );
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
          table.id === entry.before.tableId
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
          table.id === entry.after.tableId
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