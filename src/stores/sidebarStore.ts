import { create } from "zustand";

type sidebarState = {
  isOpen: boolean;
  toggle: () => void;
};

export const useSidebarStore = create<sidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
