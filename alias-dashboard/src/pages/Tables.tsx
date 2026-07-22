import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import {
  createTable,
  deleteTable,
  getRestaurants,
  getTables,
  updateTable,
  type TableResponse,
  type TableShape,
} from '@/lib/api';

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
  const [selectedTableId, setSelectedTableId] = useState<
    string | null
  >(null);
  const [propertyTableNumber, setPropertyTableNumber] = useState('');
  const [propertySeats, setPropertySeats] = useState('4');
  const [propertyShape, setPropertyShape] = useState<TableShape>('square');
  const [propertyRotation, setPropertyRotation] = useState('0');
  const [savingProperties, setSavingProperties] = useState(false);
  const [deletingTable, setDeletingTable] = useState(false);
  const [error, setError] = useState('');

  const [activeTool, setActiveTool] =
    useState<EditorTool>('select');

  const [pendingTable, setPendingTable] =
    useState<PendingTable | null>(null);

  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableSeats, setNewTableSeats] = useState('4');
  const [creatingTable, setCreatingTable] = useState(false);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);
  const selectedTable = 
    tables.find((table) => table.id === selectedTableId) ?? null;

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

    drag.currentX = Math.round(position.x);
    drag.currentY = Math.round(position.y);

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
      setSelectedTableId(null);
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
      x: Math.round(x),
      y: Math.round(y),
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
            {!loading &&
              tables.map((table) => (
                <TableNode
                  key={table.id}
                  table={table}
                  saving={savingTableId === table.id}
                  selected={selectedTableId === table.id}
                  draggingEnabled={activeTool === 'select'}
                  onClick={() => {
                    if (activeTool === 'select') {
                      setSelectedTableId(table.id);
                    }
                  }}
                  onPointerDown={(e) => handlePointerDown(e, table)}
                  onPointerMove={(e) => handlePointerMove(e, table)}
                  onPointerUp={(e) => finishDrag(e, table)}
                  onPointerCancel={(e) => finishDrag(e, table)}
                  onResizePointerDown={(e) => handleResizePointerDown(e,table)}
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