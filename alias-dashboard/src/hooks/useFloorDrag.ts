import {
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import {
  updateTable,
  type TableResponse,
} from '@/lib/api';
import {
  clampTablePosition,
  floorRectsOverlap,
  snapToGrid,
} from '@/hooks/useFloorGeometry';

export type GuideLines = {
  vertical: number | null;
  horizontal: number | null;
};

type DragState = {
  tableId: string;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startTableX: number;
  startTableY: number;
  currentX: number;
  currentY: number;
};

type UseFloorDragOptions = {
  restaurantId: string | null;
  zoom: number;
  tables: TableResponse[];
  canvasRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  savingTableId: string | null;
  setTables: React.Dispatch<
    React.SetStateAction<TableResponse[]>
  >;
  setSavingTableId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setGuideLines: React.Dispatch<
    React.SetStateAction<GuideLines>
  >;
  selectTable: (tableId: string) => void;
  onError: (message: string) => void;
  onMoveSaved: (
    table: TableResponse,
    before: {
      x: number;
      y: number;
    },
    after: {
      x: number;
      y: number;
    },
  ) => void;
};

export function useFloorDrag({
  restaurantId,
  tables,
  canvasRef,
  enabled,
  zoom,
  savingTableId,
  setTables,
  setSavingTableId,
  setGuideLines,
  selectTable,
  onError,
  onMoveSaved,
}: UseFloorDragOptions) {
  const dragRef = useRef<DragState | null>(null);

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    table: TableResponse,
  ) {
    if (!enabled || savingTableId === table.id) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    selectTable(table.id);

    dragRef.current = {
      tableId: table.id,
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startTableX: table.x,
      startTableY: table.y,
      currentX: table.x,
      currentY: table.y,
    };
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
    table: TableResponse,
  ) {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.tableId !== table.id ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX = 
      (event.clientX - drag.startPointerX) / zoom;

    const deltaY = 
    (event.clientY - drag.startPointerY) / zoom;

    const position = clampTablePosition(
      canvasRef,
      table,
      drag.startTableX + deltaX,
      drag.startTableY + deltaY,
    );

    const nextX = snapToGrid(position.x);
    const nextY = snapToGrid(position.y);

    setGuideLines({
      vertical: nextX,
      horizontal: nextY,
    });

    const collides = tables.some((otherTable) => {
      if (otherTable.id === table.id) {
        return false;
      }

      return floorRectsOverlap(
        {
          x: nextX,
          y: nextY,
          width: table.width,
          height: table.height,
        },
        otherTable,
      );
    });

    if (collides) {
      return;
    }

    drag.currentX = nextX;
    drag.currentY = nextY;

    setTables((current) =>
      current.map((item) =>
        item.id === table.id
          ? {
              ...item,
              x: nextX,
              y: nextY,
            }
          : item,
      ),
    );
  }

  async function finishDrag(
    event: ReactPointerEvent<HTMLDivElement>,
    table: TableResponse,
  ) {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.tableId !== table.id ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    dragRef.current = null;

    setGuideLines({
      vertical: null,
      horizontal: null,
    });

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const hasMoved =
      drag.currentX !== drag.startTableX ||
      drag.currentY !== drag.startTableY;

    if (!restaurantId || !hasMoved) {
      return;
    }

    try {
      setSavingTableId(table.id);
      onError('');

      const updated = await updateTable(
        restaurantId,
        table.id,
        {
          x: drag.currentX,
          y: drag.currentY,
        },
      );

      setTables((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );

      onMoveSaved(
        table,
        {
          x: drag.startTableX,
          y: drag.startTableY,
        },
        {
          x: updated.x,
          y: updated.y,
        },
      );
    } catch (error) {
      console.error('Failed to save table position', error);

      setTables((current) =>
        current.map((item) =>
          item.id === table.id
            ? {
                ...item,
                x: drag.startTableX,
                y: drag.startTableY,
              }
            : item,
        ),
      );

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to save the new table position.',
      );
    } finally {
      setSavingTableId(null);
    }
  }

  return {
    handlePointerDown,
    handlePointerMove,
    finishDrag,
  };
}