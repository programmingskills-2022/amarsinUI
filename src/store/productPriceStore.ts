import { create } from "zustand";
import { ProductPriceState } from "../types/productPrice";
export const useProductPriceStore = create<ProductPriceState>()((set) => ({
  //productPrice
  productPriceResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: {
      result: {
        err: 0,
        msg: null,
        total_count: 0,
        productPrices: [],
        productPriceDtls: [],
      },
    },
  },
  id: 0,
  yearId: -1,
  systemId: -1,
  systemIdDtl: -1,
  yearIdDtl: -1,
  state: -1,
  regFDate: "",
  regTDate: "",
  fDate: "",
  tDate: "",
  pageNumber: 0,
  srchId: 0,
  srchDate: "",
  srchTime: "",
  srchDsc: "",
  srchAccepted: 0,
  srchUsrName: "",
  srchStep: "",
  sortId: 0,
  sortDat: 0,
  sortTime: 0,
  sortDsc: 0,
  sortAccepted: 0,
  sortUsrName: 0, 
  sortStep: 0,
   //productPriceDtlHistory
  pId: -1,
  pIdTrigger: 0,
  productPriceDtlHistoryResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [] },
  },
  //productPriceSave
  productPriceSaveResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: { id: 0, err: 0, msg: "", dtlErrMsgs: [] } },
  },
  //productPriceDoFirstFlow
  productPriceDoFirstFlowResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  //ProductPrice show list 
  productPriceListResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: [] },
  },
  //productPriceDel
  productPriceDelResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  setProductPriceSaveResponse: (
    productPriceSaveResponse //for productPriceSave
  ) => set({ productPriceSaveResponse }),
  setProductPriceListResponse: (
    productPriceListResponse //for showProductList
  ) => set({ productPriceListResponse }),
  setProductPriceDtlHistoryResponse: (
    productPriceDtlHistoryResponse //for productPriceDtlHistory
  ) => set({ productPriceDtlHistoryResponse }),
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setProductPriceResponse: (
    productPriceResponse //for productPrice
  ) => set({ productPriceResponse }),
  setProductPriceDoFirstFlowResponse: (
    productPriceDoFirstFlowResponse //for productPriceDoFirstFlow
  ) => set({ productPriceDoFirstFlowResponse }),
  setProductPriceDelResponse: (
    productPriceDelResponse //for productPriceDel
  ) => set({ productPriceDelResponse }),
}));
