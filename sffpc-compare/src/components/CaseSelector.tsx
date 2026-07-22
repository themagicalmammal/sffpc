"use client";

import { useMemo, useRef, useEffect } from "react";
import { cases } from "@/lib/cases";
import { useStore } from "@/lib/store";

export default function CaseSelector() {
  const { searchQuery, setSearchQuery, addCase, selectedCases } = useStore();

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return cases.filter(
      (c) =>
        !selectedCases.some((s) => s.name === c.name) &&
        (c.name.toLowerCase().includes(query) ||
          c.seller.toLowerCase().includes(query))
    ).slice(0, 20);
  }, [searchQuery, selectedCases]);

  return (
    <div className="absolute top-4 left-4 z-10 w-80 max-h-[80vh] bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">
          Add Cases
        </h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cases or sellers..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-zinc-500 text-center">
            {selectedCases.length > 0 ? "All cases added!" : "No matches found"}
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => addCase(c)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {c.name}
                    </span>
                    {c.style && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {c.style}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {c.seller} &middot; {c.length}&times;{c.width}&times;{c.height}mm
                    {c.volume ? ` &middot; ${c.volume.toFixed(1)}L` : ""}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
