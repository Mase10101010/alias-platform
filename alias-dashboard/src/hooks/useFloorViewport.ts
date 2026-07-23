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
  hasMoved: boolean;
};

function clampZoom(value: number) {
  return Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, value),
  );
}

function clampPanValue(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.min(maximum, Math.max(minimum, value));
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

  const suppressNextClickRef = useRef(false);

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
      hasMoved: false,
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

    if (
      Math.abs(deltaX) >= 3 ||
      Math.abs(deltaY) >+ 3
    ) {
      currentPan.hasMoved = true;
    }

    const nextX = currentPan.startPanX + deltaX;
    const nextY = currentPan.startPanY + deltaY;

    const panLimit = 1200;

    setPan({
      x: clampPanValue(nextX, -panLimit, panLimit),
      y: clampPanValue(nextY, -panLimit, panLimit),
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

    if (currentPan.hasMoved) {
      suppressNextClickRef.current = true
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

  function consumeSuppressedClick() {
    if (!suppressNextClickRef.current) {
      return false;
    }

    suppressNextClickRef.current = false;
    return true;
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
    consumeSuppressedClick,
  };
}