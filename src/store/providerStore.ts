import { create } from "zustand";
import { ProviderDetailState, ProviderState, } from "../types/provider";


export const useProviderStore = create<ProviderState>()((set) => ({
  sanadKind: -1,
  fDate: "",
  tDate: "",
  providerList: { err: 0, msg: "", rpProviders: [] },
  accSystem: -1, // Provide a default value for accSystem
  accYear: -1, // Provide a default value for accYear
  brandId: -1, // Provide a default value for brandId
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setProviderList: (providerList) => set({ providerList }),
}));

export const useProviderDetailStore = create<ProviderDetailState>()((set) => ({
  productId: -1,
  sanadKind: -1,
  fDate: "",
  tDate: "",
  providerList: { err: 0, msg: "", rpProviders: [] },
  accSystem: -1, // Provide a default value for accSystem
  accYear: -1, // Provide a default value for accYear
  brandId: -1, // Provide a default value for brandId
  providerDetailList: { err: 0, msg: "", rpProviderDetails: [] },
  setField: (field:  string | number | symbol, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setProviderDetailList: (providerDetailList) => set({ providerDetailList }),
  
}));
