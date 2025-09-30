import { create } from "zustand";
import { ClearBookProductsState } from "../types/clearBook";
export const useClearBookStore = create<ClearBookProductsState>()((set) => ({
  //clearBookProducts
  systemId: 0,
  yearId: 0,
  brandId: 0,
  clearBookProductsResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: { err: 0, msg: "", clearBookProductsName: [], clearBooks: [] } },
  },
  //clearBookProductsSetProduct
  clearBookId: 0,
  productId: 0,
  check: false,
  clearBookProductsSetProductResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: { err: 0, msg: "", clearBookProductsSetProduct: [] } },
  },
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setClearBookProductsResponse: (clearBookProductsResponse) =>
    set({ clearBookProductsResponse }),
  setClearBookProductsSetProductResponse: (clearBookProductsSetProductResponse) =>
    set({ clearBookProductsSetProductResponse }),
}));
