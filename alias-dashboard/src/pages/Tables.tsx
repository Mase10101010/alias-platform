import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Grip, LoaderCircle } from 'lucide-react';

import {
  getRestaurants,
  getTables,
  updateTable,
  type TableResponse,
} from '@/lib/api';
import { cyan } from '@/lib/data';

type DragState = {
  tableId: string;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startTableX: number;
  startTableY: number;
};

export function Tables() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTableId, setSavingTableId] = useState<string | null>(null);
  const [error, setError] = useState('');

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

      {error && (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div
        ref={canvasRef}
        className="relative mt-8 h-[650px] w-full touch-none overflow-hidden rounded-3xl border border-white/10 bg-black/25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
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