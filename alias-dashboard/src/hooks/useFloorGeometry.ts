export type FloorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function snapToGrid(value: number, grid = 20) {
  return Math.round(value / grid) * grid;
}

export function floorRectsOverlap(
  first: FloorRect,
  second: FloorRect,
  gap = 8,
) {
  return !(
    first.x + first.width + gap <= second.x ||
    first.x >= second.x + second.width + gap ||
    first.y + first.height + gap <= second.y ||
    first.y >= second.y + second.height + gap
  );
}

import type { RefObject } from 'react';
import type { TableResponse } from '@/lib/api';

export function clampTablePosition(
  canvasRef: RefObject<HTMLDivElement | null>,
  table: TableResponse,
  nextX: number,
  nextY: number,
) {
  const canvas = canvasRef.current;

  if (!canvas) {
    return {
      x: Math.max(0, nextX),
      y: Math.max(0, nextY),
    };
  }

  const maxX = Math.max(
    0,
    canvas.clientWidth - table.width,
  );

  const maxY = Math.max(
    0,
    canvas.clientHeight - table.height,
  );

  return {
    x: Math.min(Math.max(0, nextX), maxX),
    y: Math.min(Math.max(0, nextY), maxY),
  };
}