import type {
  MouseEvent as ReactMouseEvent,
  RefObject,
} from 'react';

import type { TableShape } from '@/lib/api';
import type { EditorTool } from '@/components/floorplan/Toolbar';
import type { PendingTable } from '@/hooks/useCreateTable';
import { snapToGrid } from '@/hooks/useFloorGeometry';

type UseFloorPlacementOptions = {
  canvasRef: RefObject<HTMLDivElement | null>;
  activeTool: EditorTool;
  setPendingTable: (
    table: PendingTable | null,
  ) => void;
  clearSelection: () => void;
  resetCreateForm: () => void;
};

export function getDefaultTableDimensions(
  shape: TableShape,
) {
  if (shape === 'rectangle') {
    return {
      width: 140,
      height: 80,
    };
  }

  return {
    width: 80,
    height: 80,
  };
}

function getShapeFromTool(
  activeTool: EditorTool,
): TableShape {
  if (activeTool === 'add-round') {
    return 'round';
  }

  if (activeTool === 'add-rectangle') {
    return 'rectangle';
  }

  return 'square';
}

export function useFloorPlacement({
  canvasRef,
  activeTool,
  setPendingTable,
  clearSelection,
  resetCreateForm,
}: UseFloorPlacementOptions) {
  function handleCanvasClick(
    event: ReactMouseEvent<HTMLDivElement>,
  ) {
    if (activeTool === 'select') {
      clearSelection();
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const shape = getShapeFromTool(activeTool);
    const dimensions =
      getDefaultTableDimensions(shape);

    const rawX =
      event.clientX -
      rect.left -
      dimensions.width / 2;

    const rawY =
      event.clientY -
      rect.top -
      dimensions.height / 2;

    const maximumX = Math.max(
      0,
      canvas.clientWidth - dimensions.width,
    );

    const maximumY = Math.max(
      0,
      canvas.clientHeight - dimensions.height,
    );

    const x = Math.min(
      Math.max(0, rawX),
      maximumX,
    );

    const y = Math.min(
      Math.max(0, rawY),
      maximumY,
    );

    setPendingTable({
      x: snapToGrid(x),
      y: snapToGrid(y),
      shape,
    });

    clearSelection();
    resetCreateForm();
  }

  return {
    handleCanvasClick,
  };
}