import {
  LoaderCircle,
  type LucideProps,
} from 'lucide-react';
import type {
  PointerEventHandler,
  MouseEventHandler,
} from 'react';

import type { TableResponse } from '@/lib/api';
import { cyan } from '@/lib/data';

type TableNodeProps = {
  table: TableResponse;
  saving: boolean;
  selected?: boolean;
  draggingEnabled: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerUp: PointerEventHandler<HTMLDivElement>;
  onPointerCancel: PointerEventHandler<HTMLDivElement>;
  onResizePointerDown?: PointerEventHandler<HTMLButtonElement>;
  onResizePointerMove?: PointerEventHandler<HTMLButtonElement>;
  onResizePointerUp?: PointerEventHandler<HTMLButtonElement>;
  onResizePointerCancel?: PointerEventHandler<HTMLButtonElement>;
};

function getBorderRadius(table: TableResponse) {
  if (table.shape === 'round') {
    return '9999px';
  }

  if (table.shape === 'rectangle') {
    return '18px';
  }

  return '22px';
}

function SavingIcon(props: LucideProps) {
  return (
    <LoaderCircle
      {...props}
      className="animate-spin"
      style={{ color: cyan }}
    />
  );
}

export function TableNode({
  table,
  saving,
  selected = false,
  draggingEnabled,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onResizePointerDown,
  onResizePointerMove,
  onResizePointerUp,
  onResizePointerCancel,
}: TableNodeProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Table ${table.table_number}, ${table.seats} seats`}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onPointerDown(event);
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className={`absolute flex select-none items-center justify-center border text-center transition ${
        draggingEnabled
          ? 'cursor-grab active:cursor-grabbing'
          : 'cursor-default'
      }`}
      style={{
        left: table.x,
        top: table.y,
        width: table.width,
        height: table.height,
        borderRadius: getBorderRadius(table),
        transform: `rotate(${table.rotation}deg)`,
        borderColor: selected ? cyan : `${cyan}45`,
        background: selected
          ? `linear-gradient(145deg, ${cyan}35, rgba(255,255,255,.06))`
          : `linear-gradient(145deg, ${cyan}22, rgba(255,255,255,.035))`,
        boxShadow: selected
          ? `0 0 0 2px ${cyan}30, 0 16px 42px rgba(0,0,0,.42), 0 0 32px ${cyan}20`
          : `0 12px 35px rgba(0,0,0,.35), 0 0 25px ${cyan}10`,
        opacity: saving ? 0.7 : 1,
        touchAction: 'none',
        zIndex: selected ? 20 : 10,
      }}
    >
      <div
        className="flex flex-col items-center px-2"
        style={{
          transform: `rotate(-${table.rotation}deg)`,
        }}
      >
        {saving ? (
          <SavingIcon size={16} />
        ) : (
          <>
            <span className="max-w-full truncate font-display text-lg text-white">
              {table.table_number}
            </span>

            <span className="mt-1 text-[10px] uppercase tracking-[.18em] text-white/40">
              {table.seats} seats
            </span>
          </>
        )}
      </div>

      {selected && draggingEnabled && (
        <button
          type="button"
          aria-label={`Resize table ${table.table_number}`}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onResizePointerDown?.(event);
          }}
          onPointerMove={(event) => {
            event.stopPropagation();
            onResizePointerMove?.(event);
          }}
          onPointerUp={(event) => {
            event.stopPropagation();
            onResizePointerUp?.(event);
          }}
          onPointerCancel={(event) => {
            event.stopPropagation();
            onResizePointerCancel?.(event);
          }}
          className="absolute -bottom-2 -right-2 z-30 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-[#050607] bg-cyanAlias shadow-[0_0_16px_rgba(127,227,230,.45)]"
        />
      )}
    </div>
  );
}