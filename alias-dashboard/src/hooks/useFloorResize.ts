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
  floorRectsOverlap,
  snapToGrid,
} from '@/hooks/useFloorGeometry';

type ResizeState = {
  tableId: string;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startWidth: number;
  startHeight: number;
  currentWidth: number;
  currentHeight: number;
};

type UseFloorResizeOptions = {
  restaurantId: string | null;
  floorPlanId: string | null;
  tables: TableResponse[];
  canvasRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  zoom: number;
  savingTableId: string | null;
  setTables: React.Dispatch<
    React.SetStateAction<TableResponse[]>
  >;
  setSavingTableId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  selectTable: (tableId: string) => void;
  onError: (message: string) => void;
  onSaved: (
    table: TableResponse,
    before: {
      width: number;
      height: number;
    },
    after: {
      width: number;
      height: number;
    },
  ) => void;
};

export function useFloorResize({
  restaurantId,
  floorPlanId,
  tables,
  canvasRef,
  enabled,
  zoom,
  savingTableId,
  setTables,
  setSavingTableId,
  selectTable,
  onError,
  onSaved,
}: UseFloorResizeOptions) {
  const resizeRef = useRef<ResizeState | null>(null);

  function handleResizePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    if (!enabled || savingTableId === table.id) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);
    selectTable(table.id);

    resizeRef.current = {
      tableId: table.id,
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startWidth: table.width,
      startHeight: table.height,
      currentWidth: table.width,
      currentHeight: table.height,
    };
  }

  function handleResizePointerMove(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    const resize = resizeRef.current;

    if (
      !resize ||
      resize.tableId !== table.id ||
      resize.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX = 
        (event.clientX - resize.startPointerX) / zoom;
    const deltaY = 
        (event.clientY - resize.startPointerY) / zoom;
    const minSize = 60;

    let nextWidth = Math.max(
      minSize,
      resize.startWidth + deltaX,
    );

    let nextHeight = Math.max(
      minSize,
      resize.startHeight + deltaY,
    );

    if (table.shape === 'round') {
      const size = Math.max(nextWidth, nextHeight);
      nextWidth = size;
      nextHeight = size;
    }

    const canvas = canvasRef.current;

    if (canvas) {
      nextWidth = Math.min(
        nextWidth,
        canvas.clientWidth - table.x,
      );

      nextHeight = Math.min(
        nextHeight,
        canvas.clientHeight - table.y,
      );
    }

    const snappedWidth = Math.max(
      minSize,
      snapToGrid(nextWidth),
    );

    const snappedHeight = Math.max(
      minSize,
      snapToGrid(nextHeight),
    );

    const collides = tables.some((otherTable) => {
      if (otherTable.id === table.id) {
        return false;
      }

      return floorRectsOverlap(
        {
          x: table.x,
          y: table.y,
          width: snappedWidth,
          height: snappedHeight,
        },
        otherTable,
      );
    });

    if (collides) {
      return;
    }

    resize.currentWidth = snappedWidth;
    resize.currentHeight = snappedHeight;

    setTables((current) =>
      current.map((item) =>
        item.id === table.id
          ? {
              ...item,
              width: resize.currentWidth,
              height: resize.currentHeight,
            }
          : item,
      ),
    );
  }

  async function finishResize(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    const resize = resizeRef.current;

    if (
      !resize ||
      resize.tableId !== table.id ||
      resize.pointerId !== event.pointerId
    ) {
      return;
    }

    resizeRef.current = null;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    const hasChanged =
      resize.currentWidth !== resize.startWidth ||
      resize.currentHeight !== resize.startHeight;

    if (
      !restaurantId || 
      !floorPlanId ||
      !hasChanged
    ) {
      return;
    }

    try {
      setSavingTableId(table.id);
      onError('');

      const updated = await updateTablePlacement(
        restaurantId,
        floorPlanId,
        table.id,
        {
          width: resize.currentWidth,
          height: resize.currentHeight,
        },
      );

      setTables((current) =>
        current.map((item) =>
          item.id === table.id
            ? {
                ...item,
                width: updated.width,
                height: updated.height,
            }
          : item,
        ),
      );

      onSaved(
        table,
        {
          width: resize.startWidth,
          height: resize.startHeight,
        },
        {
          width: updated.width,
          height: updated.height,
        },
      );
    } catch (error) {
      console.error('Failed to resize table', error);

      setTables((current) =>
        current.map((item) =>
          item.id === table.id
            ? {
                ...item,
                width: resize.startWidth,
                height: resize.startHeight,
              }
            : item,
        ),
      );

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to save the new table size.',
      );
    } finally {
      setSavingTableId(null);
    }
  }

  return {
    handleResizePointerDown,
    handleResizePointerMove,
    finishResize,
  };
}