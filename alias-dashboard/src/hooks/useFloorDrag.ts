import {
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import {
  updateTablePlacement,
  type TableResponse,
} from '@/lib/api';

import {
  clampTablePosition,
  floorRectsOverlap,
  snapToGrid,
  type FloorBounds,
} from '@/hooks/useFloorGeometry';

import type {
  PanPosition,
} from '@/hooks/useFloorViewport';

export type GuideLines = {
  vertical: number | null;
  horizontal: number | null;
};

type DragState = {
  tableId: string;
  pointerId: number;

  startPointerFloorX: number;
  startPointerFloorY: number;

  startTableX: number;
  startTableY: number;

  currentX: number;
  currentY: number;
};

type UseFloorDragOptions = {
  restaurantId: string | null;
  zoom: number;
  pan: PanPosition;
  setPan: (
    next:
      | PanPosition
      | ((current: PanPosition) => PanPosition),
  ) => void;

  floorPlanId: string | null;
  floorBounds: FloorBounds | null;
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

const AUTO_PAN_EDGE = 80;
const AUTO_PAN_SPEED = 18;

export function useFloorDrag({
  restaurantId,
  floorPlanId,
  floorBounds,
  tables,
  canvasRef,
  enabled,
  zoom,
  pan,
  setPan,
  savingTableId,
  setTables,
  setSavingTableId,
  setGuideLines,
  selectTable,
  onError,
  onMoveSaved,
}: UseFloorDragOptions) {
  const dragRef = useRef<DragState | null>(null);

  function pointerToFloor(
    clientX: number,
    clientY: number,
  ) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  }

  function autoPanViewport(
    clientX: number,
    clientY: number,
  ) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    let deltaX = 0;
    let deltaY = 0;

    if (
      clientX <
      rect.left + AUTO_PAN_EDGE
    ) {
      deltaX = AUTO_PAN_SPEED;
    } else if (
      clientX >
      rect.right - AUTO_PAN_EDGE
    ) {
      deltaX = -AUTO_PAN_SPEED;
    }

    if (
      clientY <
      rect.top + AUTO_PAN_EDGE
    ) {
      deltaY = AUTO_PAN_SPEED;
    } else if (
      clientY >
      rect.bottom - AUTO_PAN_EDGE
    ) {
      deltaY = -AUTO_PAN_SPEED;
    }

    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    setPan((current) => ({
      x: current.x + deltaX,
      y: current.y + deltaY,
    }));
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    table: TableResponse,
  ) {
    if (!enabled || savingTableId === table.id) {
      return;
    }

    const pointer = pointerToFloor(
      event.clientX,
      event.clientY,
    );

    if (!pointer) {
      return;
    }

    event.preventDefault();

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    selectTable(table.id);

    dragRef.current = {
      tableId: table.id,
      pointerId: event.pointerId,

      startPointerFloorX: pointer.x,
      startPointerFloorY: pointer.y,

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

    autoPanViewport(
      event.clientX,
      event.clientY,
    );

    const pointer = pointerToFloor(
      event.clientX,
      event.clientY,
    );

    if (!pointer) {
      return;
    }

    const deltaX =
      pointer.x - drag.startPointerFloorX;

    const deltaY =
      pointer.y - drag.startPointerFloorY;

    const position = floorBounds
      ? clampTablePosition(
          floorBounds,
          table,
          drag.startTableX + deltaX,
          drag.startTableY + deltaY,
        )
      : {
          x: Math.max(
            0,
            drag.startTableX + deltaX,
          ),
          y: Math.max(
            0,
            drag.startTableY + deltaY,
          ),
        };

    const nextX = snapToGrid(position.x);
    const nextY = snapToGrid(position.y);

    setGuideLines({
      vertical: nextX,
      horizontal: nextY,
    });

    const collides = tables.some(
      (otherTable) => {
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
      },
    );

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

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    const hasMoved =
      drag.currentX !== drag.startTableX ||
      drag.currentY !== drag.startTableY;

    if (
      !restaurantId ||
      !floorPlanId ||
      !hasMoved
    ) {
      return;
    }

    try {
      setSavingTableId(table.id);
      onError('');

      const updated =
        await updateTablePlacement(
          restaurantId,
          floorPlanId,
          table.id,
          {
            x: drag.currentX,
            y: drag.currentY,
          },
        );

      setTables((current) =>
        current.map((item) =>
          item.id === table.id
            ? {
                ...item,
                x: updated.x,
                y: updated.y,
              }
            : item,
        ),
      );

      onMoveSaved(
        table,
        {
          x: drag.startTableX,
          y: drag.startTableY,
        },
        {
          x: drag.currentX,
          y: drag.currentY,
        },
      );
    } catch (error) {
      console.error(
        'Failed to save table position',
        error,
      );

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