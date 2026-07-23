import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import { useFloorKeyboard } from '@/hooks/useFloorKeyboard';
import { useFloorResize } from '@/hooks/useFloorResize';
import { useFloorPlanLoader } from '@/hooks/useFloorPlanLoader';

import {
  useFloorDrag,
  type GuideLines,
} from '@/hooks/useFloorDrag';

import { useHistory } from '@/hooks/useHistory';

import { useFloorRotate } from '@/hooks/useFloorRotate';

import {
  floorRectsOverlap,
  snapToGrid,
  clampTablePosition,
} from '@/hooks/useFloorGeometry';

import {
  createTable,
  deleteTable,
  updateTable,
  type TableResponse,
  type TableShape,
} from '@/lib/api';

import { useSelection } from '@/hooks/useSelection';

import {
  CreateTableDialog,
  type PendingTable,
} from '@/components/floorplan/CreateTableDialog';
import { useCreateTable } from '@/hooks/useCreateTable';
import { PropertyPanel } from '@/components/floorplan/PropertyPanel';
import { FloorCanvas } from '@/components/floorplan/FloorCanvas';
import { TableNode } from '@/components/floorplan/TableNode';
import {
  Toolbar,
  type EditorTool,
} from '@/components/floorplan/Toolbar';

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
  const [savingTableId, setSavingTableId] = useState<
    string | null
  >(null);
  
  const [propertyTableNumber, setPropertyTableNumber] = useState('');
  const [propertySeats, setPropertySeats] = useState('4');
  const [propertyShape, setPropertyShape] = useState<TableShape>('square');
  const [propertyRotation, setPropertyRotation] = useState('0');
  const [savingProperties, setSavingProperties] = useState(false);
  const [deletingTable, setDeletingTable] = useState(false);
  const [historySaving, setHistorySaving] = useState(false);
  const [error, setError] = useState('');
  const {
    restaurantId,
    tables,
    setTables,
    loading,
  } = useFloorPlanLoader({
    onError: setError,
  });
  const {
    selectedTable,
    selectedTableId,
    selectedTables,
    selectedTableIds,
    setSelectedTableId,
    toggleSelection,
    clearSelection,
  } = useSelection(tables);

  const {
    pendingTable,
    setPendingTable,
    creatingTable,
    tableNumber: newTableNumber,
    setTableNumber: setNewTableNumber,
    seats: newTableSeats,
    setSeats: setNewTableSeats,
    closeDialog: closeCreateDialog,
    create: handleCreateTable,
  } = useCreateTable({
    restaurantId,
    onCreated(created) {
      setTables((current) => [...current, created]);
      setSelectedTableId(created.id);
      setActiveTool('select');
    },
    onError(message) {
      setError(message);
    },
  });

  const [activeTool, setActiveTool] =
    useState<EditorTool>('select');

  const [guideLines, setGuideLines] = 
    useState<GuideLines>({
      vertical: null,
      horizontal: null,
    });

  const canvasRef = useRef<HTMLDivElement | null>(null);
  
  const {
    canUndo,
    canRedo,
    undoEntry,
    redoEntry,
    record,
    commitUndo,
    commitRedo,
  } = useHistory<FloorHistoryChange>();

  const {
    handlePointerDown,
    handlePointerMove,
    finishDrag,
  } = useFloorDrag({
    restaurantId,
    tables,
    canvasRef,
    enabled: activeTool === 'select',
    savingTableId,
    setTables,
    setSavingTableId,
    setGuideLines,
    selectTable: setSelectedTableId,
    onError: setError,
    onMoveSaved(table, before, after) {
      record({
        label: `Move table ${table.table_number}`,
        before: {
          type: 'move',
          tableId: table.id,
          x: before.x,
          y: before.y,
        },
        after: {
          type: 'move',
          tableId: table.id,
          x: after.x,
          y: after.y,
        },
      });
    },
  });

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

  const {
    handleRotatePointerDown,
    handleRotatePointerMove,
    finishRotate,
  } = useFloorRotate({
    restaurantId,
    canvasRef,
    savingTableId,
    setSavingTableId,
    setTables,
    setPropertyRotation,
    selectTable: setSelectedTableId,
    enabled: activeTool === 'select',
    onError: setError,
    onSaved(table, before, after) {
      record({
        label: `Rotate table ${table.table_number}`,
        before: {
          type: 'rotate',
          tableId: table.id,
          rotation: before,
        },
        after: {
          type: 'rotate',
          tableId: table.id,
          rotation: after,
        },
      });
    },
  });

  const {
    handleResizePointerDown,
    handleResizePointerMove,
    finishResize,
  } = useFloorResize({
    restaurantId,
    tables,
    canvasRef,
    enabled: activeTool === 'select',
    savingTableId,
    setTables,
    setSavingTableId,
    selectTable: setSelectedTableId,
    onError: setError,
    onSaved(table, before, after) {
      record({
        label: `Resize table ${table.table_number}`,
        before: {
          type: 'resize',
          tableId: table.id,
          width: before.width,
          height: before.height,
        },
        after: {
          type: 'resize',
          tableId: table.id,
          width: after.width,
          height: after.height,
        },
      });
    },
  });

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
  
  async function applyHistoryChange(
    change: FloorHistoryChange,
  ) {
    if (!restaurantId) {
      throw new Error('Restaurant not found');
    }

    if (change.type === 'move') {
      return updateTable(restaurantId, change.tableId, {
        x: change.x,
        y: change.y,
      });
    }

    if (change.type === 'resize') {
      return updateTable(restaurantId, change.tableId, {
        width: change.width,
        height: change.height,
      });
    }

    return updateTable(restaurantId, change.tableId, {
      rotation: change.rotation,
    });
  }

  async function handleUndo() {
    if (
      !undoEntry ||
      !canUndo ||
      historySaving
    ) {
      return;
    }

    try {
      setHistorySaving(true);
      setError('');

      const updated = await applyHistoryChange(
        undoEntry.before,
      );

      setTables((current) =>
        current.map((table) =>
          table.id === updated.id ? updated : table,
        ),
      );

      commitUndo();
    } catch (undoError) {
      console.error('Failed to undo floor-plan change', undoError);

      setError(
        undoError instanceof Error
          ? undoError.message
          : 'Unable to undo the last change.',
      );
    } finally {
      setHistorySaving(false);
    }
  }

  async function handleRedo() {
    if (
      !redoEntry ||
      !canRedo ||
      historySaving
    ) {
      return;
    }

    try {
      setHistorySaving(true);
      setError('');

      const updated = await applyHistoryChange(
        redoEntry.after,
      );

      setTables((current) =>
        current.map((table) =>
          table.id === updated.id ? updated : table,
        ),
      );

      commitRedo();
    } catch (redoError) {
      console.error('Failed to redo floor-plan change', redoError);

      setError(
        redoError instanceof Error
          ? redoError.message
          : 'Unable to redo the last change.',
      );
    } finally {
      setHistorySaving(false);
    }
  }
    
  function handleToolChange(tool: EditorTool) {
    setActiveTool(tool);
    setPendingTable(null);

    if (tool !== 'select') {
      setSelectedTableId(null);
    }
  }

  useFloorKeyboard({
    selectedCount: selectedTableIds.length,
    canUndo,
    canRedo,
    disabled:
      deletingTable ||
      historySaving ||
      creatingTable ||
      savingProperties,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDuplicate: handleDuplicateSelectedTables,
    onDelete: handleDeleteSelectedTables,
  });

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