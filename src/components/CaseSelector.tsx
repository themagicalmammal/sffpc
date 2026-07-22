"use client";

import { useState, useRef, useEffect } from "react";
import { cases } from "@/lib/cases";
import { useStore } from "@/lib/store";

export default function CaseSelector() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectCase = useStore((s) => s.selectCase);
  const selected = useStore((s) => s.selected);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query
    ? cases.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.seller.toLowerCase().includes(query.toLowerCase())
      )
    : cases.slice(0, 20);

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        placeholder="Search cases or sellers..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="w-64 px-4 py-2.5 bg-white/10 text-white placeholder-white/40 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition"
      />

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl max-h-80 overflow-y-auto z-50">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-white/40 text-sm">No cases found</div>
          ) : (
            filtered.map((c) => {
              const isSelected = selected.has(c.id);
              return (
                <button
                  key={c.id}
                  disabled={isSelected}
                  onClick={() => {
                    selectCase(c.id, c);
                    setQuery("");
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition ${
                    isSelected
                      ? "text-emerald-400/50 cursor-default"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <div>
                    <span className="font-medium">{c.name}</span>
                    <span className="text-white/40 mx-2">—</span>
                    <span className="text-white/50">{c.seller}</span>
                  </div>
                  <span className="text-white/30 text-xs">
                    {c.length}×{c.width}×{c.height}
                  </span>
                  {isSelected && <span className="ml-2 text-emerald-400 text-xs">Added ✓</span>}
                </button>
              );
            })
          )}
          {filtered.length > 20 && (
            <div className="px-4 py-2 text-white/30 text-xs text-center border-t border-white/10">
              {cases.length - 20} more cases available (type to search)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
