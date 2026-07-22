import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import { useHistory } from '@/hooks/useHistory';

import {
  floorRectsOverlap,
  snapToGrid,
} from '@/hooks/useFloorGeometry';

import {
  createTable,
  deleteTable,
  getRestaurants,
  getTables,
  updateTable,
  type TableResponse,
  type TableShape,
} from '@/lib/api';

import { useSelection } from '@/hooks/useSelection';

import {
  CreateTableDialog,
  type PendingTable,
} from '@/components/floorplan/CreateTableDialog';
import { PropertyPanel } from '@/components/floorplan/PropertyPanel';
import { FloorCanvas } from '@/components/floorplan/FloorCanvas';
import { TableNode } from '@/components/floorplan/TableNode';
import {
  Toolbar,
  type EditorTool,
} from '@/components/floorplan/Toolbar';

type DragState = {
  tableId: string;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startTableX: number;
  startTableY: number;
  currentX: number;
  currentY: number;
};

type ResizeState = {
  tableId: string;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startWidth: number;
  startHeight: number;
  currentWidth: number;
  currentHeight: number;
};

type RotateState = {
  tableId: string;
  pointerId: number;
  startRotation: number;
  currentRotation: number;
};

type FloorHistoryChange =
  | {
      type: 'move';
      tableId: string;
      x: number;
      y: number;
    }
  | {
      type: 'resize';
      tableId: string;
      width: number;
      height: number;
    }
  | {
      type: 'rotate';
      tableId: string;
      rotation: number;
    };

function getTableDimensions(shape: TableShape) {
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

export function Tables() {
  const [restaurantId, setRestaurantId] = useState<string | null>(
    null,
  );
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTableId, setSavingTableId] = useState<
    string | null
  >(null);
  
  const [propertyTableNumber, setPropertyTableNumber] = useState('');
  const [propertySeats, setPropertySeats] = useState('4');
  const [propertyShape, setPropertyShape] = useState<TableShape>('square');
  const [propertyRotation, setPropertyRotation] = useState('0');
  const [savingProperties, setSavingProperties] = useState(false);
  const [deletingTable, setDeletingTable] = useState(false);
  const [error, setError] = useState('');
  const {
    selectedTable,
    selectedTableId,
    selectedTables,
    selectedTableIds,
    setSelectedTableId,
    toggleSelection,
    clearSelection,
  } = useSelection(tables);

  const [activeTool, setActiveTool] =
    useState<EditorTool>('select');

  const [pendingTable, setPendingTable] =
    useState<PendingTable | null>(null);

  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableSeats, setNewTableSeats] = useState('4');
  const [creatingTable, setCreatingTable] = useState(false);
  const [guideLines, setGuideLines] = useState<{
    vertical: number | null;
    horizontal: number | null;
  }>({
    vertical: null,
    horizontal: null,
  });

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);
  const rotateRef = useRef<RotateState | null>(null);
  const {
    canUndo,
    canRedo,
    undoEntry,
    redoEntry,
    record,
    commitUndo,
    commitRedo,
  } = useHistory<FloorHistoryChange>();

  useEffect(() => {
    async function loadFloorPlan() {
      try {
        setLoading(true);
        setError('');

        const restaurants = await getRestaurants();
        const restaurant = restaurants[0];

        if (!restaurant) {
          setError('No restaurant found.');
          return;
        }

        setRestaurantId(restaurant.id);

        const restaurantTables = await getTables(restaurant.id);
        setTables(restaurantTables);
      } catch (loadError) {
        console.error('Failed to load floor plan', loadError);
        setError('Unable to load the floor plan.');
      } finally {
        setLoading(false);
      }
    }

    loadFloorPlan();
  }, []);

  useEffect(() => {
    if (!selectedTable) {
      setPropertyTableNumber('');
      setPropertySeats('4');
      setPropertyShape('square');
      setPropertyRotation('0');
      return;
    }

    setPropertyTableNumber(selectedTable.table_number);
    setPropertySeats(String(selectedTable.seats));
    setPropertyShape(selectedTable.shape);
    setPropertyRotation(String(selectedTable.rotation));
  }, [selectedTable]);

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

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'd'
      ) {
        event.preventDefault();
        void handleDuplicateSelectedTables();
        return;
      }

      if (
        event.key !== 'Delete' &&
        event.key !== 'Backspace'
      ) {
        return;
      }

      if (selectedTableIds.length === 0) {
        return;
      }

      event.preventDefault();
      void handleDeleteSelectedTables();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    selectedTableIds,
    selectedTables,
    restaurantId,
    deletingTable,
  ]);

  function clampPosition(
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

  

  

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    table: TableResponse,
  ) {
    if (
      activeTool !== 'select' ||
      savingTableId === table.id
    ) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    setSelectedTableId(table.id);

    dragRef.current = {
      tableId: table.id,
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startTableX: table.x,
      startTableY: table.y,
      currentX: table.x,
      currentY: table.y,
    };
  }

  function handleResizePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    if (
      activeTool !== 'select' ||
      savingTableId === table.id
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedTableId(table.id);

    resizeRef.current = {
      tableId: table.id,
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startWidth: table.width,
      startHeight: table.height,
      currentWidth: table.width,
      currentHeight: table.height,
    };
  }

  function handleRotatePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    if (
      activeTool !== 'select' ||
      savingTableId === table.id
    ) {
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

    setSelectedTableId(table.id);
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
      rect.left + table.x + table.width / 2;

    const centerY =
      rect.top + table.y + table.height / 2;

    const angle =
      Math.atan2(
        event.clientY - centerY,
        event.clientX - centerX,
      ) *
      (180 / Math.PI);

    const rotation = Math.round(angle + 90);

    const normalizedRotation = ((rotation % 360) + 360) % 360;

    rotate.currentRotation = normalizedRotation;

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

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const hasChanged =
      rotate.currentRotation !== rotate.startRotation;

    if (!restaurantId || !hasChanged) {
      return;
    }

    try {
      setSavingTableId(table.id);
      setError('');

      const updated = await updateTable(
        restaurantId,
        table.id,
        {
          rotation: rotate.currentRotation,
        },
      );

      setTables((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );

      setPropertyRotation(String(updated.rotation));
    } catch (rotateError) {
      console.error('Failed to rotate table', rotateError);

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

      setPropertyRotation(String(rotate.startRotation));
      setError('Unable to save the new table rotation.');
    } finally {
      setSavingTableId(null);
    }
  }

  function handleResizePointerMove(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    const resize = resizeRef.current;

    if (
      !resize ||
      resize.tableId !== table.id ||
      resize.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX = event.clientX - resize.startPointerX;
    const deltaY = event.clientY - resize.startPointerY;

    const minSize = 60;

    let nextWidth = Math.max(
      minSize,
      resize.startWidth + deltaX,
    );

    let nextHeight = Math.max(
      minSize,
      resize.startHeight + deltaY,
    );

    if (table.shape === 'round') {
      const size = Math.max(nextWidth, nextHeight);
      nextWidth = size;
      nextHeight = size;
    }

    const canvas = canvasRef.current;

    if (canvas) {
      nextWidth = Math.min(
        nextWidth,
        canvas.clientWidth - table.x,
      );

      nextHeight = Math.min(
        nextHeight,
        canvas.clientHeight - table.y,
      );
    }

    const snappedWidth = Math.max(
      minSize,
      snapToGrid(nextWidth),
    );

    const snappedHeight = Math.max(
      minSize,
      snapToGrid(nextHeight),
    );

    const collides = tables.some((otherTable) => {
      if (otherTable.id === table.id) {
        return false;
      }

      return floorRectsOverlap(
        {
          x: table.x,
          y: table.y,
          width: snappedWidth,
          height: snappedHeight,
        },
        otherTable,
      );
    });

    if (collides) {
      return;
    }

    resize.currentWidth = snappedWidth;
    resize.currentHeight = snappedHeight;

    setTables((current) =>
      current.map((item) =>
        item.id === table.id
          ? {
              ...item,
              width: resize.currentWidth,
              height: resize.currentHeight,
            }
          : item,
      ),
    );
  }

  async function finishResize(
    event: ReactPointerEvent<HTMLButtonElement>,
    table: TableResponse,
  ) {
    const resize = resizeRef.current;

    if (
      !resize ||
      resize.tableId !== table.id ||
      resize.pointerId !== event.pointerId
    ) {
      return;
    }

    resizeRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const hasChanged =
      resize.currentWidth !== resize.startWidth ||
      resize.currentHeight !== resize.startHeight;

    if (!restaurantId || !hasChanged) {
      return;
    }

    try {
      setSavingTableId(table.id);
      setError('');

      const updated = await updateTable(
        restaurantId,
        table.id,
        {
          width: resize.currentWidth,
          height: resize.currentHeight,
        },
      );

      setTables((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );
    } catch (resizeError) {
      console.error('Failed to resize table', resizeError);

      setTables((current) =>
        current.map((item) =>
          item.id === table.id
            ? {
                ...item,
                width: resize.startWidth,
                height: resize.startHeight,
              }
            : item,
        ),
      );

      setError('Unable to save the new table size.');
    } finally {
      setSavingTableId(null);
    }
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
    table: TableResponse,
  ) {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.tableId !== table.id ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX = event.clientX - drag.startPointerX;
    const deltaY = event.clientY - drag.startPointerY;

    const position = clampPosition(
      table,
      drag.startTableX + deltaX,
      drag.startTableY + deltaY,
    );

    drag.currentX = snapToGrid(position.x);
    drag.currentY = snapToGrid(position.y);

    setGuideLines({
      vertical: drag.currentX,
      horizontal: drag.currentY,
    });

    const collides = tables.some((otherTable) => {
      if (otherTable.id === table.id) {
        return false;
      }

      return floorRectsOverlap(
        {
          x: drag.currentX,
          y: drag.currentY,
          width: table.width,
          height: table.height,
        },
        otherTable,
      );
    });

    if (collides) {
      return;
    }

    setTables((current) =>
      current.map((item) =>
        item.id === table.id
          ? {
              ...item,
              x: drag.currentX,
              y: drag.currentY,
            }
          : item,
      ),
    );
  }

  async function finishDrag(
    event: ReactPointerEvent<HTMLDivElement>,
    table: TableResponse,
  ) {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.tableId !== table.id ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    dragRef.current = null;

    setGuideLines({
      vertical: null,
      horizontal: null,
    });

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    const hasMoved =
      drag.currentX !== drag.startTableX ||
      drag.currentY !== drag.startTableY;

    if (!restaurantId || !hasMoved) {
      return;
    }

    try {
      setSavingTableId(table.id);
      setError('');

      const updated = await updateTable(
        restaurantId,
        table.id,
        {
          x: drag.currentX,
          y: drag.currentY,
        },
      );

      setTables((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );

      record({
        label: `Move table ${table.table_number}`,
        before: {
          type: 'move',
          tableId: table.id,
          x: drag.startTableX,
          y: drag.startTableY,
        },
        after: {
          type: 'move',
          tableId: table.id,
          x: updated.x,
          y: updated.y,
        },
      });
    } catch (saveError) {
      console.error(
        'Failed to save table position',
        saveError,
      );

      setTables((current) =>
        current.map((item) =>
          item.id === table.id
            ? {
                ...item,
                x: drag.startTableX,
                y: drag.startTableY,
              }
            : item,
        ),
      );

      setError('Unable to save the new table position.');
    } finally {
      setSavingTableId(null);
    }
  }

  function getShapeFromTool(): TableShape {
    if (activeTool === 'add-round') {
      return 'round';
    }

    if (activeTool === 'add-rectangle') {
      return 'rectangle';
    }

    return 'square';
  }

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
    const shape = getShapeFromTool();
    const dimensions = getTableDimensions(shape);

    const rawX =
      event.clientX - rect.left - dimensions.width / 2;
    const rawY =
      event.clientY - rect.top - dimensions.height / 2;

    const x = Math.min(
      Math.max(0, rawX),
      Math.max(0, canvas.clientWidth - dimensions.width),
    );

    const y = Math.min(
      Math.max(0, rawY),
      Math.max(0, canvas.clientHeight - dimensions.height),
    );

    setPendingTable({
      x: snapToGrid(x),
      y: snapToGrid(y),
      shape,
    });

    setSelectedTableId(null);
    setNewTableNumber('');
    setNewTableSeats('4');
  }

  function closeCreateDialog() {
    setPendingTable(null);
    setNewTableNumber('');
    setNewTableSeats('4');
  }

  async function handleCreateTable() {
    if (!pendingTable || !restaurantId) {
      return;
    }

    const tableNumber = newTableNumber.trim();
    const seats = Number(newTableSeats);

    if (
      !tableNumber ||
      !Number.isInteger(seats) ||
      seats < 1
    ) {
      return;
    }

    const dimensions = getTableDimensions(
      pendingTable.shape,
    );

    try {
      setCreatingTable(true);
      setError('');

      const created = await createTable(restaurantId, {
        table_number: tableNumber,
        seats,
        x: pendingTable.x,
        y: pendingTable.y,
        width: dimensions.width,
        height: dimensions.height,
        shape: pendingTable.shape,
        rotation: 0,
      });

      setTables((current) => [...current, created]);
      setSelectedTableId(created.id);

      closeCreateDialog();
      setActiveTool('select');
    } catch (createError) {
      console.error(
        'Failed to create table',
        createError,
      );

      setError(
        createError instanceof Error
          ? createError.message
          : 'Unable to create table.',
      );
    } finally {
      setCreatingTable(false);
    }
  }

  async function handleSaveSelectedTable() {
    if (!selectedTable || !restaurantId || savingProperties) {
      return;
    }

    const tableNumber = propertyTableNumber.trim();
    const seats = Number(propertySeats);
    const rotation = Number(propertyRotation);

    if (
      !tableNumber ||
      !Number.isInteger(seats) ||
      seats < 1 ||
      seats > 100 ||
      !Number.isInteger(rotation) ||
      rotation < 0 ||
      rotation >= 360
    ) {
      setError('Please enter valid table details.');
      return;
    }

    const dimensions = getTableDimensions(propertyShape);

    try {
      setSavingProperties(true);
      setError('');

      const updated = await updateTable(
        restaurantId,
        selectedTable.id,
        {
          table_number: tableNumber,
          seats,
          shape: propertyShape,
          rotation,
          width: dimensions.width,
          height: dimensions.height,
        },
      );

      setTables((current) =>
        current.map((table) =>
          table.id === updated.id ? updated : table,
        ),
      );
    } catch (saveError) {
      console.error('Failed to update table', saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to update table.',
      );
    } finally {
      setSavingProperties(false);
    }
  }

    async function handleDeleteSelectedTable() {
      if (!selectedTable || !restaurantId || deletingTable) {
        return;
      }

      const confirmed = window.confirm(
        `Delete table ${selectedTable.table_number}? This action cannot be undone.`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingTable(true);
        setError('');

        await deleteTable(restaurantId, selectedTable.id);

        setTables((current) =>
          current.filter((table) => table.id !== selectedTable.id),
        );

        setSelectedTableId(null);
      } catch (deleteError) {
        console.error('Failed to delete table', deleteError);

        setError(
          deleteError instanceof Error
            ? deleteError.message
            : 'Unable to delete table.',
        );
      } finally {
        setDeletingTable(false);
      }
    }

    async function handleDeleteSelectedTables() {
      if (
        selectedTables.length === 0 ||
        !restaurantId ||
        deletingTable
      ) {
        return;
      }

      const label =
        selectedTables.length === 1
          ? `table ${selectedTables[0].table_number}`
          : `${selectedTables.length} selected tables`;

      const confirmed = window.confirm(
        `Delete ${label}? This action cannot be undone.`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingTable(true);
        setError('');

        await Promise.all(
          selectedTables.map((table) =>
            deleteTable(restaurantId, table.id),
          ),
        );

        const deletedIds = new Set(
          selectedTables.map((table) => table.id),
        );

        setTables((current) =>
          current.filter((table) => !deletedIds.has(table.id)),
        );

        clearSelection();
      } catch (deleteError) {
        console.error(
          'Failed to delete selected tables',
          deleteError,
        );

        setError(
          deleteError instanceof Error
            ? deleteError.message
            : 'Unable to delete the selected tables.',
        );
      } finally {
        setDeletingTable(false);
      }
    }

    

    function getNextAvailableTableNumber(
      sourceNumber: string,
      usedNumbers: Set<string>,
    ) {
      const trimmed = sourceNumber.trim();

      const match = trimmed.match(/^(.*?)(\d+)$/);

      if (match) {
        const prefix = match[1];
        const numericPart = match[2];
        const padding = numericPart.length;

        let nextValue = Number(numericPart) + 1;

        while (true) {
          const candidate = `${prefix}${String(nextValue).padStart(
            padding,
            '0',
          )}`;

          if (!usedNumbers.has(candidate)) {
            return candidate;
          }

          nextValue += 1;
        }
      }

      let copyIndex = 2;
      let candidate = `${trimmed} 2`;

      while (usedNumbers.has(candidate)) {
        copyIndex += 1;
        candidate = `${trimmed} ${copyIndex}`;
      }

      return candidate;
    }

    async function handleDuplicateSelectedTables() {
      if (
        selectedTables.length === 0 ||
        !restaurantId
      ) {
        return;
      }

      try {
        setError('');

        const createdTables: TableResponse[] = [];

        const usedNumbers = new Set(
          tables.map((table) => table.table_number),
        );

        for (const table of selectedTables) {
          const nextTableNumber = getNextAvailableTableNumber(
            table.table_number,
            usedNumbers,
          );

          usedNumbers.add(nextTableNumber);

          const created = await createTable(restaurantId, {
            table_number: nextTableNumber,
            seats: table.seats,
            x: table.x + 40,
            y: table.y + 40,
            width: table.width,
            height: table.height,
            shape: table.shape,
            rotation: table.rotation,
          });

          createdTables.push(created);
        }

        setTables((current) => [
          ...current,
          ...createdTables,
        ]);

      } catch (error) {
        console.error(error);

        setError('Unable to duplicate table.');
      }
    }

  function handleToolChange(tool: EditorTool) {
    setActiveTool(tool);
    setPendingTable(null);

    if (tool !== 'select') {
      setSelectedTableId(null);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[.03] p-5 sm:p-8">
      <div>
        <p className="text-xs uppercase tracking-[.28em] text-white/30">
          Restaurant layout
        </p>

        <h1 className="mt-3 font-display text-3xl font-light text-white sm:text-4xl">
          Floor Plan
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45">
          Create and arrange the physical tables in your
          restaurant. Every change is connected to the same
          tables used by reservations and Alias Concierge AI.
        </p>
      </div>

      <Toolbar
        activeTool={activeTool}
        tablesCount={tables.length}
        onToolChange={handleToolChange}
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 flex gap-6 items-start">

        <div className="relative flex-1">

          <FloorCanvas
            ref={canvasRef}
            loading={loading}
            tablesCount={tables.length}
            activeToolIsSelect={activeTool === 'select'}
            onCanvasClick={handleCanvasClick}
          >
            {guideLines.vertical !== null && (
              <div
                className="absolute top-0 bottom-0 w-px bg-cyanAlias/60 pointer-events-none"
                style={{
                  left: guideLines.vertical,
                }}
                />
            )}

            {guideLines.horizontal !== null && (
              <div
                className="absolute left-0 right-0 h-px bg-cyanAlias/60 pointer-events-none"
                style={{
                  top: guideLines.horizontal,
                }}
              />
            )}

            {!loading &&
              tables.map((table) => (
                <TableNode
                  key={table.id}
                  table={table}
                  saving={savingTableId === table.id}
                  selected={selectedTableIds.includes(table.id)}
                  draggingEnabled={activeTool === 'select'}
                  onClick={(event) => {
                    if (activeTool !== 'select') {
                      return;
                    }

                    if (event.ctrlKey || event.metaKey) {
                      toggleSelection(table.id);
                      return;
                    }

                    setSelectedTableId(table.id);
                  }}
                  onPointerDown={(e) => handlePointerDown(e, table)}
                  onPointerMove={(e) => handlePointerMove(e, table)}
                  onPointerUp={(e) => finishDrag(e, table)}
                  onPointerCancel={(e) => finishDrag(e, table)}
                  onResizePointerDown={(event) => handleResizePointerDown(event, table)}
                  onResizePointerMove={(event) =>
                    handleResizePointerMove(event, table)
                  }
                  onResizePointerUp={(event) =>
                    finishResize(event, table)
                  }
                  onResizePointerCancel={(event) =>
                    finishResize(event, table)
                  }
                  onRotatePointerDown={(event) =>
                    handleRotatePointerDown(event, table)
                  }
                  onRotatePointerMove={(event) =>
                    handleRotatePointerMove(event, table)
                  }
                  onRotatePointerUp={(event) =>
                    finishRotate(event, table)
                  }
                  onRotatePointerCancel={(event) =>
                    finishRotate(event, table)
                  }
                />
              ))}
          </FloorCanvas>

          <CreateTableDialog
            pendingTable={pendingTable}
            tableNumber={newTableNumber}
            seats={newTableSeats}
            creating={creatingTable}
            onTableNumberChange={setNewTableNumber}
            onSeatsChange={setNewTableSeats}
            onCancel={closeCreateDialog}
            onCreate={handleCreateTable}
          />

        </div>

        <PropertyPanel
          table={selectedTable}
          tableNumber={propertyTableNumber}
          seats={propertySeats}
          shape={propertyShape}
          rotation={propertyRotation}
          saving={savingProperties}
          deleting={deletingTable}
          onTableNumberChange={setPropertyTableNumber}
          onSeatsChange={setPropertySeats}
          onShapeChange={setPropertyShape}
          onRotationChange={setPropertyRotation}
          onClose={() => setSelectedTableId(null)}
          onSave={handleSaveSelectedTable}
          onDelete={handleDeleteSelectedTable}
        />

      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-white/30">
        <span>Select a shape and click to create a table</span>
        <span>•</span>
        <span>Drag tables to reposition them</span>
        <span>•</span>
        <span>Positions save automatically</span>
      </div>
    </section>
  );
}