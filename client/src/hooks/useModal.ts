import { create } from "zustand";

export interface IModal {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useModal = create<IModal>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
