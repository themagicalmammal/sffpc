"use client";

import { useStore } from "@/lib/store";

export default function CompareList() {
  const { selectedCases, removeCase } = useStore();

  if (selectedCases.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-700">
      <div className="max-w-full overflow-x-auto py-3 px-4">
        <div className="flex gap-3">
          {selectedCases.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg px-3 py-2 min-w-[180px] max-w-[240px] group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                    {c.name}
                  </span>
                  {c.style && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                      {c.style}
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-500">
                  {c.seller} &middot; {c.length}&times;{c.width}&times;{c.height}mm
                  {c.volume ? ` &middot; ${c.volume.toFixed(1)}L` : ""}
                </div>
              </div>
              <button
                onClick={() => removeCase(c.name)}
                className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900 dark:hover:text-red-400 transition-colors"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
