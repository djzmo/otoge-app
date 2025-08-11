"use client";

interface ChunithmFilterPanelProps {
  canScroll: boolean;
  sheetMode: boolean;
  className?: string;
}

export default function ChunithmFilterPanel({ canScroll, sheetMode, className }: ChunithmFilterPanelProps) {
  return (
    <div className={["flex flex-col h-full bg-white rounded-t-[10px]", className].filter(Boolean).join(" ")}> 
      <div className="px-4 pt-2 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
      </div>

      <div className={["px-4", canScroll ? "overflow-y-auto grow min-h-0" : ""].join(" ")}
           style={canScroll ? { WebkitOverflowScrolling: "touch" } : undefined}>
        <div className="space-y-6 text-sm text-gray-600">
          <p>CHUNITHM filter options will be added here.</p>
        </div>
      </div>

      {sheetMode && <div className="h-2" />}
    </div>
  );
}


