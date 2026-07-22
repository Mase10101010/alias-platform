import { useRef } from 'react';

export type DragState = {
  tableId: string;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startTableX: number;
  startTableY: number;
  currentX: number;
  currentY: number;
};

export function useFloorDrag() {
  const dragRef = useRef<DragState | null>(null);

  return {
    dragRef,
  };
}