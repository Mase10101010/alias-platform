import { useCallback, useMemo, useState } from 'react';

export type HistoryEntry<T> = {
  label: string;
  before: T;
  after: T;
};

type UseHistoryOptions = {
  limit?: number;
};

export function useHistory<T>({
  limit = 100,
}: UseHistoryOptions = {}) {
  const [past, setPast] = useState<HistoryEntry<T>[]>([]);
  const [future, setFuture] = useState<HistoryEntry<T>[]>([]);

  const undoEntry = useMemo(
    () => past[past.length - 1] ?? null,
    [past],
  );

  const redoEntry = useMemo(
    () => future[future.length - 1] ?? null,
    [future],
  );

  const canUndo = undoEntry !== null;
  const canRedo = redoEntry !== null;

  const record = useCallback(
    (entry: HistoryEntry<T>) => {
      setPast((current) => {
        const next = [...current, entry];

        if (next.length <= limit) {
          return next;
        }

        return next.slice(next.length - limit);
      });

      // Una nuova modifica invalida la cronologia Redo.
      setFuture([]);
    },
    [limit],
  );

  const commitUndo = useCallback(() => {
    setPast((currentPast) => {
      const entry = currentPast[currentPast.length - 1];

      if (!entry) {
        return currentPast;
      }

      setFuture((currentFuture) => [
        ...currentFuture,
        entry,
      ]);

      return currentPast.slice(0, -1);
    });
  }, []);

  const commitRedo = useCallback(() => {
    setFuture((currentFuture) => {
      const entry = currentFuture[currentFuture.length - 1];

      if (!entry) {
        return currentFuture;
      }

      setPast((currentPast) => [
        ...currentPast,
        entry,
      ]);

      return currentFuture.slice(0, -1);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  return {
    canUndo,
    canRedo,
    undoEntry,
    redoEntry,
    record,
    commitUndo,
    commitRedo,
    clearHistory,
  };
}