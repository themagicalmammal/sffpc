"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useStore } from "@/lib/store";
import { SffCase } from "@/lib/cases";

export function AboutModal() {
  return (
    <Modal
      open={useStore((s) => s.activeModal === "about")}
      onClose={() => useStore.getState().closeModal()}
      title="About"
    >
      <div className="space-y-4 text-white/70 text-sm leading-relaxed">
        <p>
          <strong className="text-white">SFF Case Compare</strong> is a tool to help
          you visually compare Small Form Factor PC cases in 3D.
        </p>
        <p>
          Select cases from the search bar above to add them to the 3D viewer.
          Each case is rendered to scale so you can see the real-world size
          differences between cases.
        </p>
        <p>
          The database includes over 200 cases from popular manufacturers like
          Silverstone, Streacom, Fractal, ASRock, and many custom 3D-printed designs.
        </p>
        <p className="text-white/40 text-xs mt-4">
          Inspired by <a href="https://comparesffpc.com" target="_blank" rel="noopener" className="text-indigo-400 hover:underline">comparesffpc.com</a>
        </p>
      </div>
    </Modal>
  );
}

export function AddCustomCaseModal() {
  const addCustomCase = useStore((s) => s.addCustomCase);
  const closeModal = useStore((s) => s.closeModal);
  const [name, setName] = useState("");
  const [seller, setSeller] = useState("Custom");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!name || isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) return;

    addCustomCase({
      seller,
      name: `${seller}: ${name}`,
      length: l,
      width: w,
      height: h,
    });
    closeModal();
    setName("");
    setSeller("Custom");
    setLength("");
    setWidth("");
    setHeight("");
  };

  return (
    <Modal
      open={useStore((s) => s.activeModal === "addCustom")}
      onClose={() => useStore.getState().closeModal()}
      title="Add Custom Case"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/60 text-sm mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            placeholder="My Custom Case"
            required
          />
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-1">Seller</label>
          <input
            type="text"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            placeholder="Custom"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-white/60 text-sm mb-1">Length (mm)</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="180"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1">Width (mm)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="60"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1">Height (mm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="210"
              min="1"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition"
        >
          Add to Compare
        </button>
      </form>
    </Modal>
  );
}

export function ContactModal() {
  return (
    <Modal
      open={useStore((s) => s.activeModal === "contact")}
      onClose={() => useStore.getState().closeModal()}
      title="Contact"
    >
      <div className="space-y-4 text-white/70 text-sm">
        <p>
          Found an issue or have a suggestion? Get in touch:
        </p>
        <p className="text-indigo-400">
          <a href="https://github.com/your-repo" target="_blank" rel="noopener" className="hover:underline">
            GitHub Issues
          </a>
        </p>
        <p className="text-white/40 text-xs">
          Inspired by comparesffpc.com — built with Next.js, Three.js, and Tailwind CSS.
        </p>
      </div>
    </Modal>
  );
}
