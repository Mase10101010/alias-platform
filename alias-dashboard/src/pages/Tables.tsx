import {
  useRef,
  useState,
} from 'react';

import { useFloorKeyboard } from '@/hooks/useFloorKeyboard';
import { useFloorResize } from '@/hooks/useFloorResize';
import { useFloorPlanLoader } from '@/hooks/useFloorPlanLoader';
import { useTableProperties } from '@/hooks/useTableProperties';
import { useFloorBulkActions } from '@/hooks/useFloorBulkActions';
import { useFloorHistory } from '@/hooks/useFloorHistory';
import { useFloorPlacement } from '@/hooks/useFloorPlacement';

import { useFloorViewport } from '@/hooks/useFloorViewport';
import { ZoomControls } from '@/components/floorplan/ZoomControls';

import {
  useFloorDrag,
  type GuideLines,
} from '@/hooks/useFloorDrag';


import { useFloorRotate } from '@/hooks/useFloorRotate';

import {
  snapToGrid,
} from '@/hooks/useFloorGeometry';

import type { TableShape } from '@/lib/api';

import { useSelection } from '@/hooks/useSelection';

import {
  CreateTableDialog,
} from '@/components/floorplan/CreateTableDialog';
import { useCreateTable } from '@/hooks/useCreateTable';
import { PropertyPanel } from '@/components/floorplan/PropertyPanel';
import { FloorCanvas } from '@/components/floorplan/FloorCanvas';
import { TableNode } from '@/components/floorplan/TableNode';
import {
  Toolbar,
  type EditorTool,
} from '@/components/floorplan/Toolbar';

export function Tables() {
  const [savingTableId, setSavingTableId] = useState<
    string | null
  >(null);
  
  
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
    tableNumber: propertyTableNumber,
    setTableNumber: setPropertyTableNumber,
    seats: propertySeats,
    setSeats: setPropertySeats,
    shape: propertyShape,
    setShape: setPropertyShape,
    rotation: propertyRotation,
    setRotation: setPropertyRotation,
    saving: savingProperties,
    deleting: deletingTable,
    save: handleSaveSelectedTable,
    remove: handleDeleteSelectedTable,
  } = useTableProperties({
    restaurantId,
    selectedTable,
    setTables,
    clearSelection,
    onError: setError,
  });

  const {
    deletingSelectedTables,
    duplicatingSelectedTables,
    removeSelectedTables: handleDeleteSelectedTables,
    duplicateSelectedTables: handleDuplicateSelectedTables,
  } = useFloorBulkActions({
    restaurantId,
    tables,
    selectedTables,
    setTables,
    clearSelection,
    onError: setError,
  });

  const [activeTool, setActiveTool] =
    useState<EditorTool>('select');

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const {
    zoom,
    zoomPercentage,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheel,
  } = useFloorViewport();

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

  const { handleCanvasClick } = useFloorPlacement({
    canvasRef,
    activeTool,
    setPendingTable,
    clearSelection,
    resetCreateForm() {
      setNewTableNumber('');
      setNewTableSeats('4');
    },
  });

  const [guideLines, setGuideLines] = 
    useState<GuideLines>({
      vertical: null,
      horizontal: null,
    });
  
  const {
    record,
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
    historySaving,
  } = useFloorHistory({
    restaurantId,
    setTables,
    onError: setError,
  });

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
      deletingSelectedTables ||
      duplicatingSelectedTables ||
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

          <ZoomControls
            zoomPercentage={zoomPercentage}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={resetZoom}
          />

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
          onClose={clearSelection}
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