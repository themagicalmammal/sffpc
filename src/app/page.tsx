"use client";

import Viewer from "@/components/Viewer";
import CaseSelector from "@/components/CaseSelector";
import CompareList from "@/components/CompareList";
import { useStore } from "@/lib/store";

export default function Home() {
  const selectedCases = useStore((s) => s.selectedCases);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 3D Viewer */}
      <Viewer />

      {/* Case Selector Panel */}
      <CaseSelector />

      {/* Compare List */}
      <CompareList />

      {/* Header / Nav */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-lg font-bold text-white drop-shadow-sm" style={{ fontFamily: "var(--font-outfit)" }}>
            SFF Case Compare
          </h1>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={() => useStore.setState({ selectedCases: [] })}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Clear All ({selectedCases.length})
          </button>
          <button
            onClick={() => useStore.setState({ modal: "about" })}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            About
          </button>
        </div>
      </div>
    </div>
  );
}
