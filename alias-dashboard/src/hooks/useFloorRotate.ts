import {
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import {
  updateTablePlacement,
  type TableResponse,
} from '@/lib/api';

type RotateState = {
  tableId: string;
  pointerId: number;
  startRotation: number;
  currentRotation: number;
};

type UseFloorRotateOptions = {
  restaurantId: string | null;
  floorPlanId: string | null;
  canvasRef: RefObject<HTMLDivElement | null>;
  savingTableId: string | null;
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  setSavingTableId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setTables: React.Dispatch<
    React.SetStateAction<TableResponse[]>
  >;
  setPropertyRotation: (value: string) => void;
  selectTable: (id: string) => void;
  enabled: boolean;
  onError: (message: string) => void;
  onSaved: (
    table: TableResponse,
    before: number,
    after: number,
  ) => void;
};

export function useFloorRotate({
  restaurantId,
  floorPlanId,
  canvasRef,
  zoom,
  pan,
  savingTableId,
  setSavingTableId,
  setTables,
  setPropertyRotation,
  selectTable,
  enabled,
  onError,
  onSaved,
}: UseFloorRotateOptions) {
  const rotateRef = useRef<RotateState | null>(null);

  function handleRotatePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    if (!enabled || savingTableId === table.id) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);

    rotateRef.current = {
      tableId: table.id,
      pointerId: event.pointerId,
      startRotation: table.rotation,
      currentRotation: table.rotation,
    };

    selectTable(table.id);
  }

  function handleRotatePointerMove(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    const rotate = rotateRef.current;

    if (
      !rotate ||
      rotate.tableId !== table.id ||
      rotate.pointerId !== event.pointerId
    ) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const centerX =
      rect.left +
      pan.x + 
      (table.x + table.width / 2) * zoom;

    const centerY =
      rect.top +
      pan.y + 
      (table.y + table.height / 2) * zoom;

    const angle =
      Math.atan2(
        event.clientY - centerY,
        event.clientX - centerX,
      ) *
      (180 / Math.PI);

    rotate.currentRotation =
      ((Math.round(angle + 90) % 360) + 360) % 360;

    setTables((current) =>
      current.map((item) =>
        item.id === table.id
          ? {
              ...item,
              rotation: rotate.currentRotation,
            }
          : item,
      ),
    );
  }

  async function finishRotate(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    const rotate = rotateRef.current;

    if (
      !rotate ||
      rotate.tableId !== table.id ||
      rotate.pointerId !== event.pointerId
    ) {
      return;
    }

    rotateRef.current = null;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    if (
      !restaurantId ||
      !floorPlanId ||
      rotate.currentRotation === rotate.startRotation
    ) {
      return;
    }

    try {
      setSavingTableId(table.id);

      const updated = await updateTablePlacement(
        restaurantId,
        floorPlanId,
        table.id,
        {
          rotation: rotate.currentRotation,
        },
      );

      setTables((current) =>
        current.map((item) =>
          item.id === table.id
            ? {
              ...item,
              rotation: updated.rotation,
            }
          : item,
        ),
      );

      setPropertyRotation(
        String(updated.rotation),
      );

      onSaved(
        table,
        rotate.startRotation,
        updated.rotation,
      );
    } catch (error) {
      console.error(error);

      setTables((current) =>
        current.map((item) =>
          item.id === table.id
            ? {
                ...item,
                rotation: rotate.startRotation,
              }
            : item,
        ),
      );

      setPropertyRotation(
        String(rotate.startRotation),
      );

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to rotate table.',
      );
    } finally {
      setSavingTableId(null);
    }
  }

  return {
    handleRotatePointerDown,
    handleRotatePointerMove,
    finishRotate,
  };
}