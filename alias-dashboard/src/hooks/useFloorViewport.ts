import {
  useCallback,
  useState,
  type WheelEvent as ReactWheelEvent,
} from 'react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

function clampZoom(value: number) {
  return Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, value),
  );
}

export function useFloorViewport() {
  const [zoom, setZoom] = useState(1);

  const zoomIn = useCallback(() => {
    setZoom((current) =>
      clampZoom(current + ZOOM_STEP),
    );
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((current) =>
      clampZoom(current - ZOOM_STEP),
    );
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();

      setZoom((current) => {
        const direction =
          event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;

        return clampZoom(current + direction);
      });
    },
    [],
  );

  return {
    zoom,
    zoomPercentage: Math.round(zoom * 100),
    canZoomIn: zoom < MAX_ZOOM,
    canZoomOut: zoom > MIN_ZOOM,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheel,
  };
}