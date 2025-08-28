import { create } from "zustand";
import { InventoryState } from "../types/inventory";

export const useInventoryStore = create<InventoryState>()((set) => ({
  inventoryList: { err: 0, msg: "", rpProviderInventories: [] },
  accSystem: 4, // Provide a default value for accSystem
  accYear: 15, // Provide a default value for accYear
  brandId: 72, // Provide a default value for brandId
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setInventoryList: (inventoryList) => set({ inventoryList }),
}));
