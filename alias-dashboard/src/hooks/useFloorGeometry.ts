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