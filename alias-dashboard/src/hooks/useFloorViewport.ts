import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;
const PAN_LIMIT = 1200;

export type PanPosition = {
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

  const [pan, setPanState] = useState<PanPosition>({
    x: 0,
    y: 0,
  });

  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);

  const panRef = useRef<PanState | null>(null);
  const suppressNextClickRef = useRef(false);

  const userAdjustedViewportRef = useRef(false);

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

  const setPan = useCallback(
    (
      next:
        | PanPosition
        | ((current: PanPosition) => PanPosition),
    ) => {
      setPanState((current) => {
        const resolved =
          typeof next === 'function'
            ? next(current)
            : next;

        return {
          x: clampPanValue(
            resolved.x,
            -PAN_LIMIT,
            PAN_LIMIT,
          ),
          y: clampPanValue(
            resolved.y,
            -PAN_LIMIT,
            PAN_LIMIT,
          ),
        };
      });
    },
    [],
  );

  const zoomIn = useCallback(() => {
    userAdjustedViewportRef.current = true;
    setZoom((current) =>
      clampZoom(current + ZOOM_STEP),
    );
  }, []);

  const zoomOut = useCallback(() => {
    userAdjustedViewportRef.current = true;
    setZoom((current) =>
      clampZoom(current - ZOOM_STEP),
    );
  }, []);

  const resetViewport = useCallback(() => {
    userAdjustedViewportRef.current = false;

    setZoom(1);
    setPanState({
      x: 0,
      y: 0,
    });
  }, []);

  const prepareAutoFit = useCallback(() => {
    userAdjustedViewportRef.current = false;
  }, []);

  const canAutoFit = useCallback(() => {
    return !userAdjustedViewportRef.current;
  }, []);

  const fitToView = useCallback(
    (
      viewportWidth: number,
      viewportHeight: number,
      floorWidth: number,
      floorHeight: number,
    ) => {
      if (
        viewportWidth <= 0 ||
        viewportHeight <= 0 ||
        floorWidth <= 0 ||
        floorHeight <= 0
      ) {
        return;
      }

      const padding = 48;

      const availableWidth = Math.max(
        1,
        viewportWidth - padding * 2,
      );

      const availableHeight = Math.max(
        1,
        viewportHeight - padding * 2,
      );

      const nextZoom = clampZoom(
        Math.min(
          availableWidth / floorWidth,
          availableHeight / floorHeight,
          1,
        ),
      );

      const nextPanX =
        (viewportWidth - floorWidth * nextZoom) / 2;

      const nextPanY =
        (viewportHeight - floorHeight * nextZoom) / 2;

      setZoom(nextZoom);

      setPanState({
        x: nextPanX,
        y: nextPanY,
      });
    },
    [],
  );

  const fitToBounds = useCallback(
    (
      viewportWidth: number,
      viewportHeight: number,
      bounds: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
      },
      floorWidth: number,
      floorHeight: number,
    ) => {
      if (
        viewportWidth <= 0 ||
        viewportHeight <= 0
      ) {
        return;
      }

      const boundsWidth = bounds.maxX - bounds.minX;
      const boundsHeight = bounds.maxY - bounds.minY;

      if (
        !Number.isFinite(boundsWidth) ||
        !Number.isFinite(boundsHeight) ||
        boundsWidth <= 0 ||
        boundsHeight <= 0
      ) {
        return;
      }

      const padding = 80;

      const availableWidth = Math.max(
        1,
        viewportWidth - padding * 2,
      );

      const availableHeight = Math.max(
        1,
        viewportHeight - padding * 2,
      );

      const nextZoom = clampZoom(
        Math.min(
          availableWidth / boundsWidth,
          availableHeight / boundsHeight,
          1,
        ),
      );

      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerY = (bounds.minY + bounds.maxY) / 2;

      const desiredPanX =
        viewportWidth / 2 - centerX * nextZoom;
      const desiredPanY =
        viewportHeight / 2 - centerY * nextZoom;

      // Keep the table group centered where possible,
      // without unnecessarily pushing the floor grid off-screen.
      const constrainPan = (
        desiredPan: number,
        viewportSize: number,
        floorSize: number,
      ) => {
        const scaledFloorSize = floorSize * nextZoom;

        if (scaledFloorSize <= viewportSize) {
          const minimum = 0;
          const maximum = viewportSize - scaledFloorSize;

          return Math.min(
            maximum,
            Math.max(minimum, desiredPan),
          );
        }

        const minimum = viewportSize - scaledFloorSize;
        const maximum = 0;

        return Math.min(
          maximum,
          Math.max(minimum, desiredPan),
        );
      };

      setZoom(nextZoom);

      setPanState({
        x: constrainPan(
          desiredPanX,
          viewportWidth,
          floorWidth,
        ),
        y: constrainPan(
          desiredPanY,
          viewportHeight,
          floorHeight,
        ),
      });
    },
    [],
  );

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();

      userAdjustedViewportRef.current = true;

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
    const isLeftMouse = event.button === 0;

    if (!isMiddleMouse && !isLeftMouse) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

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
      Math.abs(deltaY) >= 3
    ) {
      currentPan.hasMoved = true;
      userAdjustedViewportRef.current = true;
    }

    const nextX =
      currentPan.startPanX + deltaX;

    const nextY =
      currentPan.startPanY + deltaY;

    setPan({
      x: nextX,
      y: nextY,
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
      suppressNextClickRef.current = true;
    }

    panRef.current = null;
    setIsPanning(false);

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
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
    setPan,
    isPanning,
    spacePressed,

    zoomIn,
    zoomOut,
    resetViewport,
    prepareAutoFit,
    canAutoFit,
    fitToView,
    fitToBounds,
    handleWheel,

    handleViewportPointerDown,
    handleViewportPointerMove,
    finishViewportPan,
    consumeSuppressedClick,
  };
}