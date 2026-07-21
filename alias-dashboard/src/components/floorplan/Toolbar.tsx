import {
  Circle,
  MousePointer2,
  Plus,
  RectangleHorizontal,
  Square,
} from 'lucide-react';

export type EditorTool =
  | 'select'
  | 'add-square'
  | 'add-round'
  | 'add-rectangle';

type ToolbarProps = {
  activeTool: EditorTool;
  tablesCount: number;
  onToolChange: (tool: EditorTool) => void;
};

const tools: {
  id: EditorTool;
  label: string;
  icon: typeof MousePointer2;
}[] = [
  {
    id: 'select',
    label: 'Select',
    icon: MousePointer2,
  },
  {
    id: 'add-square',
    label: 'Square',
    icon: Square,
  },
  {
    id: 'add-round',
    label: 'Round',
    icon: Circle,
  },
  {
    id: 'add-rectangle',
    label: 'Rectangle',
    icon: RectangleHorizontal,
  },
];

export function Toolbar({
  activeTool,
  tablesCount,
  onToolChange,
}: ToolbarProps) {
  return (
    <div className="mb-6 mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3">
      {tools.map(({ id, label, icon: Icon }) => {
        const isActive = activeTool === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onToolChange(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm transition ${
              isActive
                ? 'bg-cyanAlias text-black'
                : 'bg-white/[.04] text-white/60 hover:bg-white/[.08] hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        );
      })}

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-cyanAlias/20 bg-cyanAlias/10 px-4 py-3 text-sm text-cyanAlias">
          <Plus size={16} />
          Tool:
          <strong>{activeTool}</strong>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[.035] px-4 py-3 text-xs text-white/45">
          {tablesCount} {tablesCount === 1 ? 'table' : 'tables'}
        </div>
      </div>
    </div>
  );
}