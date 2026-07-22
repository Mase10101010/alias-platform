import { useState } from 'react';

import {
  createTable,
  type TableResponse,
  type TableShape,
} from '@/lib/api';

export type PendingTable = {
  x: number;
  y: number;
  shape: TableShape;
};

type CreateTableOptions = {
  restaurantId: string | null;
  onCreated: (table: TableResponse) => void;
  onError: (message: string) => void;
};

function getDimensions(shape: TableShape) {
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

export function useCreateTable({
  restaurantId,
  onCreated,
  onError,
}: CreateTableOptions) {
  const [pendingTable, setPendingTable] =
    useState<PendingTable | null>(null);

  const [creatingTable, setCreatingTable] =
    useState(false);

  const [tableNumber, setTableNumber] =
    useState('');

  const [seats, setSeats] =
    useState('4');

  function closeDialog() {
    setPendingTable(null);
    setTableNumber('');
    setSeats('4');
  }

  async function create() {
    if (!restaurantId || !pendingTable) {
      return;
    }

    const parsedSeats = Number(seats);

    if (
      !tableNumber.trim() ||
      !Number.isInteger(parsedSeats) ||
      parsedSeats < 1
    ) {
      return;
    }

    try {
      setCreatingTable(true);

      const size = getDimensions(
        pendingTable.shape,
      );

      const created = await createTable(
        restaurantId,
        {
          table_number: tableNumber.trim(),
          seats: parsedSeats,
          x: pendingTable.x,
          y: pendingTable.y,
          shape: pendingTable.shape,
          rotation: 0,
          width: size.width,
          height: size.height,
        },
      );

      onCreated(created);

      closeDialog();
    } catch (error) {
      console.error(error);

      onError(
        error instanceof Error
          ? error.message
          : 'Unable to create table.',
      );
    } finally {
      setCreatingTable(false);
    }
  }

  return {
    pendingTable,
    setPendingTable,

    creatingTable,

    tableNumber,
    setTableNumber,

    seats,
    setSeats,

    closeDialog,

    create,
  };
}