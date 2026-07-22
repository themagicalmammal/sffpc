import { create } from "zustand";
import type { SffCase } from "@/lib/cases";

export type Modal = null | "about" | "contact" | "addCustom";

export interface CustomCase {
  seller: string;
  name: string;
  length: string;
  width: string;
  height: string;
}

interface Store {
  selectedCases: SffCase[];
  customCases: CustomCase[];
  selectedCase: SffCase | null;
  modal: Modal;
  searchQuery: string;
  addCase: (caseData: SffCase) => void;
  removeCase: (name: string) => void;
  setSelectedCase: (caseData: SffCase | null) => void;
  openModal: (modal: Modal) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  addCustomCase: (customCase: CustomCase) => void;
}

export const useStore = create<Store>((set) => ({
  selectedCases: [],
  customCases: [],
  selectedCase: null,
  modal: null,
  searchQuery: "",
  addCase: (caseData: SffCase) =>
    set((state) => {
      if (state.selectedCases.some((c) => c.name === caseData.name)) {
        return state;
      }
      return { selectedCases: [...state.selectedCases, caseData] };
    }),
  removeCase: (name: string) =>
    set((state) => ({
      selectedCases: state.selectedCases.filter((c) => c.name !== name),
    })),
  setSelectedCase: (caseData: SffCase | null) => set({ selectedCase: caseData }),
  openModal: (modal: Modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  addCustomCase: (customCase: CustomCase) =>
    set((state) => ({
      customCases: [...state.customCases, customCase],
    })),
}));
