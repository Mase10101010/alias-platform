import {
  Circle,
  MousePointer2,
  Plus,
  RectangleHorizontal,
  Square,
} from 'lucide-react';

type EditorTool =
  | 'select'
  | 'add-square'
  | 'add-round'
  | 'add-rectangle';

type ToolbarProps = {
  activeTool: EditorTool;
  setActiveTool: (tool: EditorTool) => void;
  tablesCount: number;
  cyan: string;
};

export function Toolbar({
  activeTool,
  setActiveTool,
  tablesCount,
  cyan,
}: ToolbarProps) {
  return (
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

      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-4 py-2 text-xs text-white/45">
        {tablesCount} tables
      </div>

    </div>
  );
}