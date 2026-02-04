import { create } from "zustand";
import { BankState } from "../types/bank";
export const useBankStore = create<BankState>()((set) => ({
  banks: {
    total_count: 0,
    results: [],
  },
  search: "",
  page: -1, // Provide a default value for page
  lastId: 0, // Provide a default value for lastId
  setField: (field: string | number | symbol, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setBanks: (banks) =>
    set({ banks }),
}));
