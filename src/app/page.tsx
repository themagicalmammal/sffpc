"use client";

import Viewer from "@/components/Viewer";
import CaseSelector from "@/components/CaseSelector";
import CompareList from "@/components/CompareList";
import { AboutModal, AddCustomCaseModal, ContactModal } from "@/components/Modals";
import { useStore } from "@/lib/store";

export default function Home() {
  const selected = useStore((s) => s.selected);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 sm:px-6 flex items-center gap-4 border-b border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <h1 className="font-outfit font-bold text-lg text-white hidden sm:block">
            SFF Compare
          </h1>
        </div>

        {/* Case Selector */}
        <div className="flex-1 max-w-md">
          <CaseSelector />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => useStore.getState().openModal("addCustom")}
            className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            + Custom
          </button>
          <button
            onClick={() => useStore.getState().openModal("about")}
            className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition"
            title="About"
          >
            ?
          </button>
          <button
            onClick={() => useStore.getState().openModal("contact")}
            className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition"
            title="Contact"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 p-3 sm:p-4 gap-3">
        {/* 3D Viewer */}
        <div className="flex-1 min-h-0">
          <Viewer />
        </div>

        {/* Compare List */}
        {selected.size > 0 && (
          <div className="flex-shrink-0">
            <CompareList />
          </div>
        )}
      </main>

      {/* Modals */}
      <AboutModal />
      <AddCustomCaseModal />
      <ContactModal />
    </div>
  );
}
