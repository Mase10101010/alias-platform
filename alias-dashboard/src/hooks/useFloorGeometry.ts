export type FloorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FloorBounds = {
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

export function clampTablePosition(
  floorBounds: FloorBounds,
  table: FloorRect,
  nextX: number,
  nextY: number,
) {
  const maxX = Math.max(
    0,
    floorBounds.width - table.width,
  );

  const maxY = Math.max(
    0,
    floorBounds.height - table.height,
  );

  return {
    x: Math.min(Math.max(0, nextX), maxX),
    y: Math.min(Math.max(0, nextY), maxY),
  };
}
export type RotatedFloorRect = FloorRect & {
  rotation: number;
};

export function getRotatedFeatureBounds(
  feature: RotatedFloorRect,
): FloorRect {
  const radians = (feature.rotation * Math.PI) / 180;
  const cosine = Math.abs(Math.cos(radians));
  const sine = Math.abs(Math.sin(radians));

  const width = feature.width * cosine + feature.height * sine;
  const height = feature.width * sine + feature.height * cosine;

  const centerX = feature.x + feature.width / 2;
  const centerY = feature.y + feature.height / 2;

  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height,
  };
}

export function clampRotatedFeaturePosition(
  floorBounds: FloorBounds,
  feature: RotatedFloorRect,
  nextX: number,
  nextY: number,
) {
  const rotated = getRotatedFeatureBounds({
    ...feature,
    x: nextX,
    y: nextY,
  });

  if (
    rotated.width > floorBounds.width ||
    rotated.height > floorBounds.height
  ) {
    return null;
  }

  const minX = nextX - rotated.x;
  const minY = nextY - rotated.y;

  return {
    x: Math.min(
      Math.max(nextX, minX),
      floorBounds.width - rotated.width + minX,
    ),
    y: Math.min(
      Math.max(nextY, minY),
      floorBounds.height - rotated.height + minY,
    ),
  };
}

export function isRotatedFeatureWithinBounds(
  floorBounds: FloorBounds,
  feature: RotatedFloorRect,
): boolean {
  const rotated = getRotatedFeatureBounds(feature);
  const epsilon = 0.000001;

  return (
    rotated.x >= -epsilon &&
    rotated.y >= -epsilon &&
    rotated.x + rotated.width <= floorBounds.width + epsilon &&
    rotated.y + rotated.height <= floorBounds.height + epsilon
  );
}
