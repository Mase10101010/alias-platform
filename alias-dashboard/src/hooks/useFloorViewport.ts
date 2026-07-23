import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

type PanPosition = {
  x: number;
  y: number;
};

type PanState = {
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startPanX: number;
  startPanY: number;
};

function clampZoom(value: number) {
  return Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, value),
  );
}

export function useFloorViewport() {
  const [zoom, setZoom] = useState(1);

  const [pan, setPan] = useState<PanPosition>({
    x: 0,
    y: 0,
  });

  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);

  const panRef = useRef<PanState | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      const isEditing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;

      if (isEditing) {
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        setSpacePressed(true);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.code === 'Space') {
        setSpacePressed(false);
      }
    }

    function handleWindowBlur() {
      setSpacePressed(false);
      setIsPanning(false);
      panRef.current = null;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

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

  const resetViewport = useCallback(() => {
    setZoom(1);
    setPan({
      x: 0,
      y: 0,
    });
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

  function handleViewportPointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    const isMiddleMouse = event.button === 1;
    const isSpaceDrag = spacePressed && event.button === 0;

    if (!isMiddleMouse && !isSpaceDrag) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);

    panRef.current = {
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };

    setIsPanning(true);
  }

  function handleViewportPointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    const currentPan = panRef.current;

    if (
      !currentPan ||
      currentPan.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX =
      event.clientX - currentPan.startPointerX;

    const deltaY =
      event.clientY - currentPan.startPointerY;

    setPan({
      x: currentPan.startPanX + deltaX,
      y: currentPan.startPanY + deltaY,
    });
  }

  function finishViewportPan(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    const currentPan = panRef.current;

    if (
      !currentPan ||
      currentPan.pointerId !== event.pointerId
    ) {
      return;
    }

    panRef.current = null;
    setIsPanning(false);

    if (
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }
  }

  return {
    zoom,
    zoomPercentage: Math.round(zoom * 100),
    canZoomIn: zoom < MAX_ZOOM,
    canZoomOut: zoom > MIN_ZOOM,

    pan,
    isPanning,
    spacePressed,

    zoomIn,
    zoomOut,
    resetViewport,
    handleWheel,

    handleViewportPointerDown,
    handleViewportPointerMove,
    finishViewportPan,
  };
}