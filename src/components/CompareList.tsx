"use client";

import { useStore } from "@/lib/store";
import { getCaseColor } from "@/lib/cases";

export default function CompareList() {
  const selected = useStore((s) => s.selected);
  const deselectCase = useStore((s) => s.deselectCase);
  const entries = Array.from(selected.entries());

  if (entries.length === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
      <span className="text-white/40 text-xs font-medium uppercase tracking-wider whitespace-nowrap">
        Comparing ({entries.length}/20)
      </span>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1" style={{ scrollbarWidth: "none" }}>
        {entries.map(([id, caseData], i) => (
          <div
            key={id}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/10 flex-shrink-0 group hover:bg-white/15 transition"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: getCaseColor(i) }}
            />
            <span className="text-white text-sm whitespace-nowrap max-w-32 truncate">
              {caseData.name}
            </span>
            <span className="text-white/30 text-xs whitespace-nowrap">
              {caseData.length}×{caseData.width}×{caseData.height}
            </span>
            <button
              onClick={() => deselectCase(id)}
              className="w-5 h-5 flex items-center justify-center rounded-full text-white/40 hover:text-red-400 hover:bg-red-500/20 transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          const clearAll = useStore.getState().clearAll;
          clearAll();
        }}
        className="text-white/40 text-xs hover:text-red-400 transition flex-shrink-0"
      >
        Clear all
      </button>
    </div>
  );
}
