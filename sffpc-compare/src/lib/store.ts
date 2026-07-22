import { create } from "zustand";
import type { SffCase } from "@/lib/cases";
import type { Vector3 } from "three";

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
  draggingCase: string | null;
  casePositions: Record<string, Vector3>;
  addCase: (caseData: SffCase) => void;
  removeCase: (name: string) => void;
  setSelectedCase: (caseData: SffCase | null) => void;
  openModal: (modal: Modal) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  addCustomCase: (customCase: CustomCase) => void;
  setDraggingCase: (name: string | null) => void;
  setCasePosition: (name: string, pos: Vector3) => void;
  resetCasePosition: (name: string) => void;
}

export const useStore = create<Store>((set) => ({
  selectedCases: [],
  customCases: [],
  selectedCase: null,
  modal: null,
  searchQuery: "",
  draggingCase: null,
  casePositions: {},
  addCase: (caseData: SffCase) =>
    set((state) => {
      if (state.selectedCases.some((c) => c.name === caseData.name)) {
        return state;
      }
      return { selectedCases: [...state.selectedCases, caseData] };
    }),
  removeCase: (name: string) =>
    set((state) => {
      const { [name]: _pos, ...rest } = state.casePositions;
      return {
        selectedCases: state.selectedCases.filter((c) => c.name !== name),
        casePositions: rest,
      };
    }),
  setSelectedCase: (caseData: SffCase | null) => set({ selectedCase: caseData }),
  openModal: (modal: Modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  addCustomCase: (customCase: CustomCase) =>
    set((state) => ({
      customCases: [...state.customCases, customCase],
    })),
  setDraggingCase: (name: string | null) => set({ draggingCase: name }),
  setCasePosition: (name: string, pos: Vector3) =>
    set((state) => ({
      casePositions: { ...state.casePositions, [name]: pos.clone() },
    })),
  resetCasePosition: (name: string) =>
    set((state) => {
      const { [name]: _pos, ...rest } = state.casePositions;
      return { casePositions: rest };
    }),
}));
