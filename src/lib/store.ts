import { create } from "zustand";
import { SffCase } from "./cases";

export type ModalType = "about" | "addCustom" | "contact" | null;

export interface CustomCase extends SffCase {
  isCustom: true;
}

interface AppState {
  // Selected cases for comparison
  selected: Map<string, SffCase | CustomCase>;

  // Modal state
  activeModal: ModalType;

  // Custom cases counter (for ID generation)
  customCount: number;

  // Actions
  selectCase: (id: string, caseData: SffCase | CustomCase) => void;
  deselectCase: (id: string) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  addCustomCase: (caseData: Omit<CustomCase, "id" | "isCustom">) => void;
  clearAll: () => void;
}

export const useStore = create<AppState>((set) => ({
  selected: new Map(),
  activeModal: null,
  customCount: 0,

  selectCase: (id, caseData) =>
    set((state) => {
      if (state.selected.has(id) || state.selected.size >= 20) return state;
      const next = new Map(state.selected);
      next.set(id, caseData);
      return { selected: next };
    }),

  deselectCase: (id) =>
    set((state) => {
      if (!state.selected.has(id)) return state;
      const next = new Map(state.selected);
      next.delete(id);
      return { selected: next };
    }),

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),

  addCustomCase: (caseData) =>
    set((state) => {
      const id = `custom-${state.customCount}`;
      const customCase: CustomCase = {
        ...caseData,
        id,
        isCustom: true,
      };
      const next = new Map(state.selected);
      next.set(id, customCase);
      return { selected: next, customCount: state.customCount + 1 };
    }),

  clearAll: () => set({ selected: new Map() }),
}));
