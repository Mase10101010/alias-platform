import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { 
  Circle,
  Grip, 
  LoaderCircle,
  MousePointer2,
Plus,
RectangleHorizontal,
Square,
} from 'lucide-react';

import {
  createTable,
  getRestaurants,
  getTables,
  updateTable,
  type TableResponse,
} from '@/lib/api';
import { cyan } from '@/lib/data';
import { CreateTableDialog } from '@/components/floorplan/CreateTableDialog';

type DragState = {
  tableId: string;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startTableX: number;
  startTableY: number;
};

type EditorTool =
  | 'select'
  | 'add-square'
  | 'add-round'
  | 'add-rectangle';

export function Tables() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTableId, setSavingTableId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeTool, setActiveTool] = useState<EditorTool>('select');
  const [pendingTable, setPendingTable] = useState<{
    x: number;
    y: number;
    shape: 'square' | 'round' | 'rectangle';
  } | null>(null);

  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableSeats, setNewTableSeats] = useState('4');
  const [creatingTable, setCreatingTable] = useState(false);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);

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

  function getCanvasBounds(table: TableResponse) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return {
        maxX: Number.MAX_SAFE_INTEGER,
        maxY: Number.MAX_SAFE_INTEGER,
      };
    }

    return {
      maxX: Math.max(0, canvas.clientWidth - table.width),
      maxY: Math.max(0, canvas.clientHeight - table.height),
    };
  }

  function clampPosition(
    table: TableResponse,
    nextX: number,
    nextY: number,
  ) {
    const { maxX, maxY } = getCanvasBounds(table);

    return {
      x: Math.min(Math.max(0, nextX), maxX),
      y: Math.min(Math.max(0, nextY), maxY),
    };
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    table: TableResponse,
  ) {
    if (savingTableId === table.id) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      tableId: table.id,
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startTableX: table.x,
      startTableY: table.y,
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

    setTables((current) =>
      current.map((item) =>
        item.id === table.id
          ? {
              ...item,
              x: Math.round(position.x),
              y: Math.round(position.y),
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
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const currentTable = tables.find((item) => item.id === table.id);

    if (!restaurantId || !currentTable) return;

    const hasMoved =
      currentTable.x !== drag.startTableX ||
      currentTable.y !== drag.startTableY;

    if (!hasMoved) return;

    try {
      setSavingTableId(table.id);
      setError('');

      const updated = await updateTable(restaurantId, table.id, {
        x: currentTable.x,
        y: currentTable.y,
      });

      setTables((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );
    } catch (saveError) {
      console.error('Failed to save table position', saveError);

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

  function getTableBorderRadius(table: TableResponse) {
    if (table.shape === 'round') {
      return '9999px';
    }

    if (table.shape === 'rectangle') {
      return '18px';
    }

    return '22px';
  }

  function handleCanvasClick(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (activeTool === 'select') {
      return;
    }

    if (!canvasRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();

    setPendingTable({
      x: Math.round(event.clientX - rect.left),
      y: Math.round(event.clientY - rect.top),
      shape:
        activeTool === 'add-round'
          ? 'round'
          : activeTool === 'add-rectangle'
            ? 'rectangle'
            : 'square',
    });

    setNewTableNumber('');
    setNewTableSeats('4');
  }
  
  async function handleCreateTable() {
    if (!pendingTable || !restaurantId) {
      return;
    }

    if (!newTableNumber.trim()) {
      alert('Please enter a table number.');
      return;
    }

    try {
      setCreatingTable(true);

      const created = await createTable(restaurantId, {
        table_number: newTableNumber.trim(),
        seats: Number(newTableSeats),
        x: pendingTable.x,
        y: pendingTable.y,
        shape: pendingTable.shape,
        width: pendingTable.shape === 'rectangle' ? 140 : 80,
        height: 80,
        rotation: 0,
      });

      setTables((current) => [...current, created]);

      setPendingTable(null);
      setNewTableNumber('');
      setNewTableSeats('4');
      setActiveTool('select');
    } catch (error) {
      console.error(error);
      alert('Unable to create table.');
    } finally {
      setCreatingTable(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[.03] p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.28em] text-white/30">
            Restaurant layout
          </p>

          <h1 className="mt-3 font-display text-3xl font-light text-white sm:text-4xl">
            Floor Plan
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45">
            Drag each table to recreate the layout of your restaurant.
            Positions are saved automatically when you release a table.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-4 py-2 text-xs text-white/45">
          <Grip size={15} style={{ color: cyan }} />
          {tables.length} tables
        </div>
      </div>

      <div className="mt-8 mb-6 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3">

        <button
          onClick={() => setActiveTool('select')}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 transition ${
            activeTool === 'select'
              ? 'bg-cyanAlias text-black'
              : 'bg-white/[.04] text-white/60 hover:bg-white/[.08]'
          }`}
        >
          <MousePointer2 size={18} />
          Select
        </button>

        <button
          onClick={() => setActiveTool('add-square')}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 transition ${
            activeTool === 'add-square'
              ? 'bg-cyanAlias text-black'
              : 'bg-white/[.04] text-white/60 hover:bg-white/[.08]'
          }`}
        >
          <Square size={18} />
          Square
        </button>

        <button
          onClick={() => setActiveTool('add-round')}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 transition ${
            activeTool === 'add-round'
              ? 'bg-cyanAlias text-black'
              : 'bg-white/[.04] text-white/60 hover:bg-white/[.08]'
          }`}
        >
          <Circle size={18} />
          Round
        </button>

        <button
          onClick={() => setActiveTool('add-rectangle')}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 transition ${
            activeTool === 'add-rectangle'
              ? 'bg-cyanAlias text-black'
              : 'bg-white/[.04] text-white/60 hover:bg-white/[.08]'
          }`}
        >
          <RectangleHorizontal size={18} />
          Rectangle
        </button>

        <div className="ml-auto flex items-center gap-2 rounded-xl border border-cyanAlias/20 bg-cyanAlias/10 px-4 py-3 text-sm text-cyanAlias">
          <Plus size={16} />
          Tool: <strong>{activeTool}</strong>
        </div>

      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="relative mt-8 h-[650px] w-full touch-none overflow-hidden rounded-3xl border border-white/10 bg-black/25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        
        <CreateTableDialog
          pendingTable={pendingTable}
          tableNumber={newTableNumber}
          seats={newTableSeats}
          creating={creatingTable}
          onTableNumberChange={setNewTableNumber}
          onSeatsChange={setNewTableSeats}
          onCancel={() => {
            setPendingTable(null);
            setNewTableNumber('');
            setNewTableSeats('4');
          }}
          onCreate={handleCreateTable}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-white/45">
              <LoaderCircle
                size={18}
                className="animate-spin"
                style={{ color: cyan }}
              />
              Loading floor plan...
            </div>
          </div>
        )}

        {!loading && tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div>
              <p className="font-display text-2xl font-light text-white/70">
                No tables available
              </p>

              <p className="mt-2 text-sm text-white/35">
                Add tables from your restaurant settings before arranging
                the floor plan.
              </p>
            </div>
          </div>
        )}

        {!loading &&
          tables.map((table) => {
            const isSaving = savingTableId === table.id;

            return (
              <div
                key={table.id}
                role="button"
                tabIndex={0}
                onPointerDown={(event) =>
                  handlePointerDown(event, table)
                }
                onPointerMove={(event) =>
                  handlePointerMove(event, table)
                }
                onPointerUp={(event) =>
                  finishDrag(event, table)
                }
                onPointerCancel={(event) =>
                  finishDrag(event, table)
                }
                className="absolute flex cursor-grab select-none items-center justify-center border text-center shadow-lg transition-shadow active:cursor-grabbing"
                style={{
                  left: table.x,
                  top: table.y,
                  width: table.width,
                  height: table.height,
                  borderRadius: getTableBorderRadius(table),
                  transform: `rotate(${table.rotation}deg)`,
                  borderColor: `${cyan}45`,
                  background: `linear-gradient(145deg, ${cyan}22, rgba(255,255,255,.035))`,
                  boxShadow: `0 12px 35px rgba(0,0,0,.35), 0 0 25px ${cyan}10`,
                  opacity: isSaving ? 0.7 : 1,
                  touchAction: 'none',
                }}
              >
                <div
                  className="flex flex-col items-center"
                  style={{
                    transform: `rotate(-${table.rotation}deg)`,
                  }}
                >
                  {isSaving ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                      style={{ color: cyan }}
                    />
                  ) : (
                    <>
                      <span className="font-display text-lg text-white">
                        {table.table_number}
                      </span>

                      <span className="mt-1 text-[10px] uppercase tracking-[.18em] text-white/40">
                        {table.seats} seats
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-white/30">
        <span>Drag tables anywhere inside the room</span>
        <span>•</span>
        <span>Release to save automatically</span>
      </div>
    </section>
  );
}