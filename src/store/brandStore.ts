import { create } from "zustand";
import type { BrandState } from "../types/brand";
import { createJSONStorage, persist } from "zustand/middleware";
export const useBrandStore = create<BrandState>()(persist((set) => ({
  brands: [],
  accSystem: 0, // Provide a default value for accSystem
  page: 1, // Provide a default value for page
  lastId: 0, // Provide a default value for lastId
  usrPerm: false, // Provide a default value for usrPerm
  search:'',
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setBrands: (brands) => set({ brands }),
}),
{
  name: "brand-store",
  storage: createJSONStorage(() => localStorage),
}
));
