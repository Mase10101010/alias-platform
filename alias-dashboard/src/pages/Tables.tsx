import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  applyIntelligenceRecommendation,
  cancelReservation,
  createFloorPlan,
  createServiceArea,
  getFloorPlans,
  getTables,
  moveReservation,
  optimizeReservation,
  updateReservation,
  type FloorPlanResponse,
  type IntelligenceAssignmentResponse,
  type ReservationStatus,
  type ServiceAreaType,
  type TableResponse,
} from '@/lib/api';

import { cyan } from '@/lib/data';

import {
  LiveReservationPanel,
} from '@/components/floorplan/LiveReservationPanel';

import {
  LiveFloorControls,
  type FloorMode,
} from '@/components/floorplan/LiveFloorControls';

import { useLiveFloor } from '@/hooks/useLiveFloor';

import {
  CreateServiceAreaDialog,
} from '@/components/floorplan/CreateServiceAreaDialog';

import { useFloorKeyboard } from '@/hooks/useFloorKeyboard';
import { useFloorResize } from '@/hooks/useFloorResize';
import { useFloorPlanLoader } from '@/hooks/useFloorPlanLoader';
import { useTableProperties } from '@/hooks/useTableProperties';
import { useFloorBulkActions } from '@/hooks/useFloorBulkActions';
import { useFloorHistory } from '@/hooks/useFloorHistory';
import { useFloorPlacement } from '@/hooks/useFloorPlacement';

import { useFloorViewport } from '@/hooks/useFloorViewport';
import { ZoomControls } from '@/components/floorplan/ZoomControls';

import { FloorPlanNavigator } from '@/components/floorplan/FloorPlanNavigator';

import {
  useFloorDrag,
  type GuideLines,
} from '@/hooks/useFloorDrag';

import {
  CreateFloorPlanDialog,
} from '@/components/floorplan/CreateFloorPlanDialog';


import { useFloorRotate } from '@/hooks/useFloorRotate';

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


function getCurrentHalfHourSlot(date: Date) {
  const slot = new Date(date);
  const slotMinutes = Math.floor(slot.getMinutes() / 30) * 30;

  slot.setMinutes(slotMinutes, 0, 0);

  return slot;
}

type TablesProps = {
  onboardingMode?: boolean;
  onOnboardingComplete?: () => void;
};

export function Tables({
  onboardingMode = false,
  onOnboardingComplete,
}: TablesProps) {
  const [floorMode, setFloorMode] =
    useState<FloorMode>('edit');

  const [liveDate, setLiveDate] =
    useState(() => getCurrentHalfHourSlot(new Date()));

  const [followCurrentSlot, setFollowCurrentSlot] =
    useState(true);
  useEffect(() => {
    if (floorMode !== 'live' || !followCurrentSlot) {
      return;
    }

    const syncCurrentSlot = () => {
      const currentSlot = getCurrentHalfHourSlot(new Date());

      setLiveDate((previous) =>
        previous.getTime() === currentSlot.getTime()
          ? previous
          : currentSlot,
      );
    };

    syncCurrentSlot();

    const intervalId = window.setInterval(
      syncCurrentSlot,
      15_000,
    );

    return () => window.clearInterval(intervalId);
  }, [floorMode, followCurrentSlot]);

  const [savingTableId, setSavingTableId] = useState<
    string | null
  >(null);

  const [allRestaurantTables, setAllRestaurantTables] =
    useState<TableResponse[]>([]);

  const [allRestaurantFloorPlans, setAllRestaurantFloorPlans] =
    useState<FloorPlanResponse[]>([]);

  const [
    updatingReservationId,
    setUpdatingReservationId,
  ] = useState<string | null>(null);

  const [
    intelligenceRecommendation,
    setIntelligenceRecommendation,
  ] = useState<IntelligenceAssignmentResponse | null>(null);

  const [
    loadingIntelligence,
    setLoadingIntelligence,
  ] = useState(false);

  const [
    applyingIntelligence,
    setApplyingIntelligence,
  ] = useState(false);

  const [
    intelligenceError,
    setIntelligenceError,
  ] = useState('');
  
  
  const [error, setError] = useState('');
  const [createAreaOpen, setCreateAreaOpen] =
    useState(false);

  const [createFloorPlanOpen, setCreateFloorPlanOpen] =
    useState(false);

  const [newFloorPlanName, setNewFloorPlanName] =
    useState('');

  const [newFloorPlanWidth, setNewFloorPlanWidth] =
    useState('1200');

  const [newFloorPlanHeight, setNewFloorPlanHeight] =
    useState('800');

  const [newFloorPlanDefault, setNewFloorPlanDefault] =
    useState(false);

  const [creatingFloorPlan, setCreatingFloorPlan] =
    useState(false);

  const [newAreaName, setNewAreaName] =
    useState('');

  const [newAreaType, setNewAreaType] =
    useState<ServiceAreaType>('indoor');

  const [creatingArea, setCreatingArea] =
    useState(false);
  const {
    restaurantId,
    serviceAreas,
    selectedAreaId,
    selectArea,
    refreshServiceAreas,
    floorPlans,
    selectedFloorPlanId,
    selectFloorPlan,
    refreshFloorPlans,
    tables,
    setTables,
    loading,
  } = useFloorPlanLoader({
    onError: setError,
  });

  const loadAllRestaurantTables = useCallback(async () => {
    if (!restaurantId) {
      setAllRestaurantTables([]);
      setAllRestaurantFloorPlans([]);
      return;
    }

    try {
      const activeAreas = serviceAreas.filter(
        (area) => area.is_active,
      );

      const plansByArea = await Promise.all(
        activeAreas.map((area) =>
          getFloorPlans(restaurantId, area.id),
        ),
      );

      const activeFloorPlans = plansByArea
        .flat()
        .filter((plan) => plan.is_active);

      setAllRestaurantFloorPlans(activeFloorPlans);

      const tablesByFloorPlan = await Promise.all(
        activeFloorPlans.map((plan) =>
          getTables(restaurantId, plan.id),
        ),
      );

      const uniqueTables = Array.from(
        new Map(
          tablesByFloorPlan
            .flat()
            .filter((table) => table.is_active)
            .map((table) => [table.id, table]),
        ).values(),
      );

      setAllRestaurantTables(uniqueTables);
    } catch (error) {
      console.error(
        'Failed to load all restaurant tables',
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load restaurant tables.',
      );
    }
  }, [restaurantId, serviceAreas]);

  useEffect(() => {
    if (floorMode !== 'live') {
      return;
    }

    void loadAllRestaurantTables();
  }, [floorMode, loadAllRestaurantTables]);

  const {
    loading: liveLoading,
    lastUpdatedAt,
    refresh: refreshLiveFloor,
    getTableState,
  } = useLiveFloor({
    restaurantId,
    enabled: floorMode === 'live',
    selectedDate: liveDate,
    onError: setError,
  });
  const liveTableCounts = useMemo(() => {
    const counts = {
      total: tables.length,
      available: 0,
      reserved: 0,
      occupied: 0,
    };

    for (const table of tables) {
      const status = getTableState(table.id).status;
      counts[status] += 1;
    }

    return counts;
  }, [getTableState, tables]);

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
    saving: savingProperties,
    deleting: deletingTable,
    save: handleSaveSelectedTable,
    remove: handleDeleteSelectedTable,
  } = useTableProperties({
    restaurantId,
    floorPlanId: selectedFloorPlanId,
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
    floorPlanId: selectedFloorPlanId,
    onCreated(created) {
      setTables((current) => [...current, created]);
      setAllRestaurantTables((current) => [
        ...current.filter((table) => table.id !== created.id),
        created,
      ]);
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
    zoom,
    pan,
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
    floorPlanId: selectedFloorPlanId,
    setTables,
    onError: setError,
  });

  const {
    handlePointerDown,
    handlePointerMove,
    finishDrag,
  } = useFloorDrag({
    restaurantId,
    floorPlanId: selectedFloorPlanId,
    tables,
    canvasRef,
    enabled: 
      floorMode === 'edit' &&
      activeTool === 'select' &&
      !spacePressed &&
      !isPanning,
    zoom,
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
    floorPlanId: selectedFloorPlanId,
    canvasRef,
    zoom,
    pan,
    savingTableId,
    setSavingTableId,
    setTables,
    selectTable: setSelectedTableId,
    enabled: 
      floorMode === 'edit' &&
      activeTool === 'select' &&
      !spacePressed &&
      !isPanning,
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
    floorPlanId: selectedFloorPlanId,
    tables,
    canvasRef,
    enabled: 
    floorMode === 'edit' &&
      activeTool === 'select' &&
      !spacePressed &&
      !isPanning,
    zoom,
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
    floorMode === 'live' ||
      deletingTable ||
      deletingSelectedTables ||
      duplicatingSelectedTables ||
      historySaving ||
      creatingArea ||
      creatingTable ||
      savingProperties,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDuplicate: handleDuplicateSelectedTables,
    onDelete: handleDeleteSelectedTables,
  });

  function openCreateAreaDialog() {
    setNewAreaName('');
    setNewAreaType('indoor');
    setCreateAreaOpen(true);
  }

  function closeCreateAreaDialog() {
    if (creatingArea) {
      return;
    }

    setCreateAreaOpen(false);
    setNewAreaName('');
    setNewAreaType('indoor');
  }

  async function handleCreateServiceArea() {
    if (
      !restaurantId ||
      !newAreaName.trim() ||
      creatingArea
    ) {
      return;
    }

    try {
      setCreatingArea(true);
      setError('');

      const createdArea = await createServiceArea(
        restaurantId,
        {
          name: newAreaName.trim(),
          area_type: newAreaType,
          sort_order: serviceAreas.length,
        },
      );

      await refreshServiceAreas();

      clearSelection();
      setPendingTable(null);
      resetViewport();

      await selectArea(createdArea.id);

      setCreateAreaOpen(false);
      setNewAreaName('');
      setNewAreaType('indoor');
    } catch (error) {
      console.error(
        'Failed to create service area',
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create service area.',
      );
    } finally {
      setCreatingArea(false);
    }
  }

  function openCreateFloorPlanDialog() {
    setNewFloorPlanName('');
    setNewFloorPlanWidth('1200');
    setNewFloorPlanHeight('800');
    setNewFloorPlanDefault(false);
    setCreateFloorPlanOpen(true);
  }

  function closeCreateFloorPlanDialog() {
    if (creatingFloorPlan) {
      return;
    }

    setCreateFloorPlanOpen(false);
  }

  async function handleCreateFloorPlan() {
    if (
      !restaurantId ||
      !selectedAreaId ||
      !newFloorPlanName.trim() ||
      creatingFloorPlan
    ) {
      return;
    }

    const width = Number(newFloorPlanWidth);
    const height = Number(newFloorPlanHeight);

    if (
      !Number.isInteger(width) ||
      width < 400 ||
      !Number.isInteger(height) ||
      height < 400
    ) {
      setError('Please enter valid layout dimensions.');
      return;
    }

    try {
      setCreatingFloorPlan(true);
      setError('');

      const created = await createFloorPlan(
        restaurantId,
        selectedAreaId,
        {
          name: newFloorPlanName.trim(),
          width,
          height,
          sort_order: floorPlans.length,
          is_default: newFloorPlanDefault,
        },
      );

      await refreshFloorPlans(selectedAreaId);

      clearSelection();
      setPendingTable(null);
      resetViewport();

      await selectFloorPlan(created.id);

      setCreateFloorPlanOpen(false);
    } catch (error) {
      console.error(
        'Failed to create floor plan',
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create floor plan.',
      );
    } finally {
      setCreatingFloorPlan(false);
    }
  }

  const selectedLiveState = selectedTableId
    ? getTableState(selectedTableId)
    : null;

  const loadIntelligenceRecommendation = useCallback(
    async () => {
      const reservation = selectedLiveState?.reservation;

      if (
        floorMode !== 'live' ||
        !restaurantId ||
        !reservation ||
        reservation.status === 'completed' ||
        reservation.status === 'cancelled' ||
        reservation.status === 'no_show'
      ) {
        setIntelligenceRecommendation(null);
        setIntelligenceError('');
        return;
      }

      try {
        setLoadingIntelligence(true);
        setIntelligenceError('');

        const result = await optimizeReservation({
          restaurant_id: restaurantId,
          reservation_id: reservation.id,
          requested_start: reservation.reservation_time,
          party_size: reservation.party_size,
          duration_minutes: reservation.duration_minutes,
          buffer_before_minutes: 0,
          buffer_after_minutes: 0,
          preferred_service_area_id: selectedAreaId ?? null,
          max_alternatives: 3,
        });

        const recommendation = result.recommended;

        if (
          !result.available ||
          !recommendation ||
          recommendation.table_ids.length <= 1
        ) {
          setIntelligenceRecommendation(null);
          return;
        }

        const currentTableIds = new Set(
          reservation.table_ids?.length
            ? reservation.table_ids
            : [reservation.table_id].filter(
                (tableId): tableId is string =>
                  Boolean(tableId),
              ),
        );

        const recommendationChangesAssignment =
          recommendation.table_ids.some(
            (tableId) => !currentTableIds.has(tableId),
          ) ||
          recommendation.table_ids.length !== currentTableIds.size;

        setIntelligenceRecommendation(
          recommendationChangesAssignment
            ? recommendation
            : null,
        );
      } catch (error) {
        console.error(
          'Failed to load Alias recommendation',
          error,
        );

        setIntelligenceRecommendation(null);

        setIntelligenceError(
          error instanceof Error
            ? error.message
            : 'Unable to load Alias recommendation.',
        );
      } finally {
        setLoadingIntelligence(false);
      }
    },
    [
      floorMode,
      restaurantId,
      selectedAreaId,
      selectedLiveState?.reservation,
    ],
  );

  useEffect(() => {
    void loadIntelligenceRecommendation();
  }, [loadIntelligenceRecommendation]);

  async function handleApplyIntelligenceRecommendation() {
    const reservation = selectedLiveState?.reservation;
    const recommendation = intelligenceRecommendation;

    if (
      !reservation ||
      !recommendation ||
      applyingIntelligence
    ) {
      return;
    }

    const primaryTableId =
      recommendation.table_ids[0];

    if (!primaryTableId) {
      setIntelligenceError(
        'Alias did not return a valid primary table.',
      );
      return;
    }

    const confirmed = window.confirm(
      `Apply Alias recommendation and assign this reservation to tables ${recommendation.table_numbers.join(
        ' + ',
      )}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setApplyingIntelligence(true);
      setIntelligenceError('');
      setError('');

      await applyIntelligenceRecommendation({
        reservation_id: reservation.id,
        table_ids: recommendation.table_ids,
        primary_table_id: primaryTableId,
      });

      await Promise.all([
        refreshLiveFloor(),
        loadAllRestaurantTables(),
      ]);

      setIntelligenceRecommendation(null);

      const primaryTable = allRestaurantTables.find(
        (table) => table.id === primaryTableId,
      );

      const primaryFloorPlan = primaryTable
        ? allRestaurantFloorPlans.find(
            (plan) =>
              plan.id === primaryTable.floor_plan_id,
          )
        : null;

      if (
        primaryFloorPlan &&
        primaryFloorPlan.service_area_id !== selectedAreaId
      ) {
        clearSelection();
        setPendingTable(null);
        resetViewport();

        await selectArea(
          primaryFloorPlan.service_area_id,
        );

        await selectFloorPlan(primaryFloorPlan.id);
      } else if (
        primaryFloorPlan &&
        primaryFloorPlan.id !== selectedFloorPlanId
      ) {
        clearSelection();
        setPendingTable(null);
        resetViewport();

        await selectFloorPlan(primaryFloorPlan.id);
      }

      setSelectedTableId(primaryTableId);
    } catch (error) {
      console.error(
        'Failed to apply Alias recommendation',
        error,
      );

      setIntelligenceError(
        error instanceof Error
          ? error.message
          : 'Unable to apply Alias recommendation.',
      );

      await refreshLiveFloor();
      await loadIntelligenceRecommendation();
    } finally {
      setApplyingIntelligence(false);
    }
  }

  async function handleReservationStatusChange(
    reservationId: string,
    nextStatus: ReservationStatus,
  ) {
    if (updatingReservationId) {
      return;
    }

    try {
      setUpdatingReservationId(reservationId);
      setError('');

      await updateReservation(reservationId, {
        status: nextStatus,
      });

      await refreshLiveFloor();

      if (
        nextStatus === 'completed' ||
        nextStatus === 'cancelled' ||
        nextStatus === 'no_show'
      ) {
        clearSelection();
      }
    } catch (error) {
      console.error(
        'Failed to update reservation status',
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to update reservation.',
      );
    } finally {
      setUpdatingReservationId(null);
    }
  }

  async function handleCancelLiveReservation(
    reservationId: string,
  ) {
    if (updatingReservationId) {
      return;
    }

    const confirmed = window.confirm(
      'Cancel this reservation? This action will make the table available again.',
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingReservationId(reservationId);
      setError('');

      await cancelReservation(reservationId);
      await refreshLiveFloor();

      clearSelection();
    } catch (error) {
      console.error(
        'Failed to cancel reservation',
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to cancel reservation.',
      );
    } finally {
      setUpdatingReservationId(null);
    }
  }

  async function handleMoveLiveReservation(
    reservationId: string,
    destinationTableId: string,
  ) {
    if (updatingReservationId) {
      return;
    }

    try {
      setUpdatingReservationId(reservationId);
      setError('');

      const destinationTable = allRestaurantTables.find(
        (table) => table.id === destinationTableId,
      );

      const destinationFloorPlan = destinationTable
        ? allRestaurantFloorPlans.find(
            (plan) => plan.id === destinationTable.floor_plan_id,
          )
        : null;

      await moveReservation(
        reservationId,
        destinationTableId,
      );

      await refreshLiveFloor();

      if (
        destinationFloorPlan &&
        destinationFloorPlan.service_area_id !== selectedAreaId
      ) {
        clearSelection();
        setPendingTable(null);
        resetViewport();

        await selectArea(destinationFloorPlan.service_area_id);
        await selectFloorPlan(destinationFloorPlan.id);
      } else if (
        destinationFloorPlan &&
        destinationFloorPlan.id !== selectedFloorPlanId
      ) {
        clearSelection();
        setPendingTable(null);
        resetViewport();

        await selectFloorPlan(destinationFloorPlan.id);
      }

      await loadAllRestaurantTables();
      setSelectedTableId(destinationTableId);
    } catch (error) {
      console.error(
        'Failed to move reservation',
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to move reservation.',
      );
    } finally {
      setUpdatingReservationId(null);
    }
  }
  
  

  const liveMoveTargets = selectedTableId
    ? allRestaurantTables
        .filter(
          (table) =>
            table.id !== selectedTableId &&
            table.is_active,
        )
        .map((table) => {
          const floorPlan = allRestaurantFloorPlans.find(
            (plan) => plan.id === table.floor_plan_id,
          );

          const area = floorPlan
            ? serviceAreas.find(
                (serviceArea) =>
                  serviceArea.id === floorPlan.service_area_id,
              )
            : null;

          return {
            table,
            status: getTableState(table.id).status,
            areaName: area?.name ?? 'Other area',
          };
        })
        .sort((first, second) => {
          const areaComparison = first.areaName.localeCompare(
            second.areaName,
          );

          if (areaComparison !== 0) {
            return areaComparison;
          }

          return first.table.table_number.localeCompare(
            second.table.table_number,
            undefined,
            { numeric: true },
          );
        })
    : [];

  function handleFloorModeChange(mode: FloorMode) {
    setFloorMode(mode);
    setActiveTool('select');
    setPendingTable(null);
    clearSelection();
    setIntelligenceRecommendation(null);
    setIntelligenceError('');
  }

  const onboardingConfigurationReady =
    serviceAreas.some((area) => area.is_active) &&
    floorPlans.some((plan) => plan.is_active) &&
    tables.some((table) => table.is_active);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[.03] p-5 sm:p-8">
      <div>
        <p className="text-xs uppercase tracking-[.28em] text-white/30">
          {onboardingMode ? 'Onboarding · Restaurant layout' : 'Restaurant layout'}
        </p>

        <h1 className="mt-3 font-display text-3xl font-light text-white sm:text-4xl">
          {onboardingMode ? 'Build your restaurant map' : 'Floor Plan'}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45">
          {onboardingMode
            ? 'Create an area, add a layout and position at least one table. Everything you create here will remain available in the dashboard.'
            : 'Create and arrange the physical tables in your restaurant. Every change is connected to the same tables used by reservations and Alias Concierge AI.'}
        </p>
      </div>

      {!onboardingMode && (
        <LiveFloorControls
          mode={floorMode}
          selectedDate={liveDate}
          loading={liveLoading}
          lastUpdatedAt={lastUpdatedAt}
          tableCounts={liveTableCounts}
          onModeChange={handleFloorModeChange}
          onDateChange={(date) => {
            clearSelection();
            setFollowCurrentSlot(false);
            setLiveDate(date);
          }}
          onNow={() => {
            clearSelection();
            setFollowCurrentSlot(true);
            setLiveDate(getCurrentHalfHourSlot(new Date()));
          }}
          onRefresh={() => {
            void Promise.all([
              refreshLiveFloor(),
              loadAllRestaurantTables(),
            ]);
          }}
        />
      )}

      <FloorPlanNavigator
        serviceAreas={serviceAreas}
        selectedAreaId={selectedAreaId}
        floorPlans={floorPlans}
        selectedFloorPlanId={selectedFloorPlanId}
        disabled={
          loading ||
          liveLoading ||
          creatingArea ||
          creatingFloorPlan ||
          creatingTable ||
          savingProperties ||
          deletingTable ||
          deletingSelectedTables ||
          duplicatingSelectedTables ||
          historySaving
        }
        onAreaChange={(areaId) => {
          clearSelection();
          setPendingTable(null);
          resetViewport();
          void selectArea(areaId);
        }}
        onFloorPlanChange={(floorPlanId) => {
          clearSelection();
          setPendingTable(null);
          resetViewport();
          void selectFloorPlan(floorPlanId);
        }}
        onCreateArea={
          floorMode === 'edit'
            ? openCreateAreaDialog
            : undefined
        }
        onCreateFloorPlan={
          floorMode === 'edit'
            ? openCreateFloorPlanDialog
            : undefined
        }
      />

      {floorMode === 'edit' && (
        <Toolbar
          activeTool={activeTool}
          tablesCount={tables.length}
          onToolChange={handleToolChange}
        />
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col items-start gap-6 lg:flex-row">

        <div className="relative w-full min-w-0 flex-1">

          <FloorCanvas
            ref={canvasRef}
            loading={loading || liveLoading}
            tablesCount={tables.length}
            activeToolIsSelect={
              floorMode === 'edit' &&
              activeTool === 'select'
            }
            zoom={zoom}
            pan={pan}
            isPanning={isPanning}
            spacePressed={spacePressed}
            onCanvasClick={(event) => {
              if (consumeSuppressedClick()) {
                event.preventDefault();
                return;
              }

              if (floorMode === 'live') {
                clearSelection();
                return;
              }

              handleCanvasClick(event);
            }}
            onWheel={handleWheel}
            onViewportPointerDown={handleViewportPointerDown}
            onViewportPointerMove={handleViewportPointerMove}
            onViewportPointerUp={finishViewportPan}
            onViewportPointerCancel={finishViewportPan}
          >
            {floorMode === 'edit' &&
              guideLines.vertical !== null && (
              <div
                className="absolute top-0 bottom-0 w-px bg-cyanAlias/60 pointer-events-none"
                style={{
                  left: guideLines.vertical,
                }}
                />
            )}

            {floorMode === 'edit' &&
              guideLines.horizontal !== null && (
              <div
                className="absolute left-0 right-0 h-px bg-cyanAlias/60 pointer-events-none"
                style={{
                  top: guideLines.horizontal,
                }}
              />
            )}

            {!loading &&
              tables.map((table) => {
                const liveState = getTableState(table.id);

                return (
                  <TableNode
                    key={table.id}
                    table={table}
                    saving={
                      floorMode === 'edit' &&
                      savingTableId === table.id
                    }
                    mode={floorMode}
                    liveStatus={liveState.status}
                    liveReservation={liveState.reservation}
                    selected={selectedTableIds.includes(table.id)}
                    draggingEnabled={
                      floorMode === 'edit' &&
                      activeTool === 'select' &&
                      !spacePressed &&
                      !isPanning
                    }
                    viewPortPanningEnabled={
                      spacePressed || isPanning
                    }
                    onClick={(event) => {
                      if (consumeSuppressedClick()) {
                        event.preventDefault();
                        return;
                      }

                      if (floorMode === 'live') {
                        setSelectedTableId(table.id);
                        return;
                      }

                      if (activeTool !== 'select') {
                        return;
                      }

                      if (event.ctrlKey || event.metaKey) {
                        toggleSelection(table.id);
                        return;
                      }

                      setSelectedTableId(table.id);
                    }}
                    onPointerDown={(event) => {
                      if (floorMode === 'edit') {
                        handlePointerDown(event, table);
                      }
                    }}
                    onPointerMove={(event) => {
                      if (floorMode === 'edit') {
                        handlePointerMove(event, table);
                      }
                    }}
                    onPointerUp={(event) => {
                      if (floorMode === 'edit') {
                        finishDrag(event, table);
                      }
                    }}
                    onPointerCancel={(event) => {
                      if (floorMode === 'edit') {
                        finishDrag(event, table);
                      }
                    }}
                    onResizePointerDown={(event) => {
                      if (floorMode === 'edit') {
                        handleResizePointerDown(event, table);
                      }
                    }}
                    onResizePointerMove={(event) => {
                      if (floorMode === 'edit') {
                        handleResizePointerMove(event, table);
                      }
                    }}
                    onResizePointerUp={(event) => {
                      if (floorMode === 'edit') {
                        finishResize(event, table);
                      }
                    }}
                    onResizePointerCancel={(event) => {
                      if (floorMode === 'edit') {
                        finishResize(event, table);
                      }
                    }}
                    onRotatePointerDown={(event) => {
                      if (floorMode === 'edit') {
                        handleRotatePointerDown(event, table);
                      }
                    }}
                    onRotatePointerMove={(event) => {
                      if (floorMode === 'edit') {
                        handleRotatePointerMove(event, table);
                      }
                    }}
                    onRotatePointerUp={(event) => {
                      if (floorMode === 'edit') {
                        finishRotate(event, table);
                      }
                    }}
                    onRotatePointerCancel={(event) => {
                      if (floorMode === 'edit') {
                        finishRotate(event, table);
                      }
                    }}
                  />
                );
              })}
          </FloorCanvas>

          <ZoomControls
            zoomPercentage={zoomPercentage}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={resetViewport}
          />

          {floorMode === 'edit' && (
            <CreateTableDialog
              pendingTable={pendingTable}
              tableNumber={newTableNumber}
              seats={newTableSeats}
              creating={creatingTable}
              zoom={zoom}
              pan={pan}
              onTableNumberChange={setNewTableNumber}
              onSeatsChange={setNewTableSeats}
              onCancel={closeCreateDialog}
              onCreate={handleCreateTable}
            />
          )}

        </div>

        {floorMode === 'edit' && (
          <PropertyPanel
            table={selectedTable}
            tableNumber={propertyTableNumber}
            seats={propertySeats}
            shape={propertyShape}
            saving={savingProperties}
            deleting={deletingTable}
            onTableNumberChange={setPropertyTableNumber}
            onSeatsChange={setPropertySeats}
            onShapeChange={setPropertyShape}
            onClose={clearSelection}
            onSave={handleSaveSelectedTable}
            onDelete={handleDeleteSelectedTable}
          />
        )}

        {floorMode === 'live' &&
          selectedTable &&
          selectedLiveState && (
            <LiveReservationPanel
              table={selectedTable}
              status={selectedLiveState.status}
              reservation={selectedLiveState.reservation}
              moveTargets={liveMoveTargets}
              recommendation={intelligenceRecommendation}
              loadingRecommendation={loadingIntelligence}
              applyingRecommendation={applyingIntelligence}
              recommendationError={intelligenceError}
              updating={
                updatingReservationId ===
                selectedLiveState.reservation?.id
              }
              onClose={clearSelection}
              onSeatGuest={() => {
                const reservation =
                  selectedLiveState.reservation;

                if (!reservation) {
                  return;
                }

                void handleReservationStatusChange(
                  reservation.id,
                  'seated',
                );
              }}
              onCompleteService={() => {
                const reservation =
                  selectedLiveState.reservation;

                if (!reservation) {
                  return;
                }

                void handleReservationStatusChange(
                  reservation.id,
                  'completed',
                );
              }}
              onMarkNoShow={() => {
                const reservation =
                  selectedLiveState.reservation;

                if (!reservation) {
                  return;
                }

                void handleReservationStatusChange(
                  reservation.id,
                  'no_show',
                );
              }}
              onCancelReservation={() => {
                const reservation =
                  selectedLiveState.reservation;

                if (!reservation) {
                  return;
                }

                void handleCancelLiveReservation(
                  reservation.id,
                );
              }}
              onMoveReservation={(destinationTableId) => {
                const reservation =
                  selectedLiveState.reservation;

                if (!reservation) {
                  return;
                }

                void handleMoveLiveReservation(
                  reservation.id,
                  destinationTableId,
                );
              }}
              onRefreshRecommendation={() => {
                void loadIntelligenceRecommendation();
              }}
              onApplyRecommendation={() => {
                void handleApplyIntelligenceRecommendation();
              }}
            />
          )}

      </div>

      {floorMode === 'edit' && (
        <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-white/30">
          <span>Select a shape and click to create a table</span>
          <span>•</span>
          <span>Drag tables to reposition them</span>
          <span>•</span>
          <span>Positions save automatically</span>
        </div>
      )}

      {onboardingMode && (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[.025] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">
                Complete your restaurant map
              </p>
              <p className="mt-1 text-sm text-white/40">
                Create at least one area, one floor plan and one table before launching Alias.
              </p>
            </div>

            <button
              type="button"
              disabled={!onboardingConfigurationReady}
              onClick={onOnboardingComplete}
              className="rounded-full px-6 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: cyan }}
            >
              Launch Alias
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <span className={serviceAreas.some((area) => area.is_active) ? 'text-emerald-300' : 'text-white/30'}>
              {serviceAreas.some((area) => area.is_active) ? '✓' : '○'} Service area
            </span>
            <span className={floorPlans.some((plan) => plan.is_active) ? 'text-emerald-300' : 'text-white/30'}>
              {floorPlans.some((plan) => plan.is_active) ? '✓' : '○'} Floor plan
            </span>
            <span className={tables.some((table) => table.is_active) ? 'text-emerald-300' : 'text-white/30'}>
              {tables.some((table) => table.is_active) ? '✓' : '○'} At least one table
            </span>
          </div>
        </div>
      )}

      <CreateServiceAreaDialog
        open={createAreaOpen}
        name={newAreaName}
        areaType={newAreaType}
        creating={creatingArea}
        onNameChange={setNewAreaName}
        onAreaTypeChange={setNewAreaType}
        onCancel={closeCreateAreaDialog}
        onCreate={() => {
          void handleCreateServiceArea();
        }}
      />

      <CreateFloorPlanDialog
        open={createFloorPlanOpen}
        name={newFloorPlanName}
        width={newFloorPlanWidth}
        height={newFloorPlanHeight}
        makeDefault={newFloorPlanDefault}
        creating={creatingFloorPlan}
        onNameChange={setNewFloorPlanName}
        onWidthChange={setNewFloorPlanWidth}
        onHeightChange={setNewFloorPlanHeight}
        onMakeDefaultChange={setNewFloorPlanDefault}
        onCancel={closeCreateFloorPlanDialog}
        onCreate={() => {
          void handleCreateFloorPlan();
        }}
      />
    </section>
  );
}
