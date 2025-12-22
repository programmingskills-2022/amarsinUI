import { create } from "zustand";
import { ProductGraceState } from "../types/productGrace";
export const useProductGraceStore = create<ProductGraceState>()((set) => ({
  //productGrace
  productGraceResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: {
      result: {
        err: 0,
        msg: null,
        total_count: 0,
        productGraces: [],
        productGraceDtls: [],
      },
    },
  },
  idTrigger:0, //for productGrace?id=
  id: -1,
  yearId: -1,
  systemId: -1,
  yearIdDtl: -1,
  systemIdDtl: -1,
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
  //productOfferDtlHistory
  pId: -1,
  pIdTrigger: 0,
  productGraceDtlHistoryResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [] },
  },
  //productGraceSave
  productGraceSaveResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { acc_System: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  //productGraceDoFirstFlow
  productGraceDoFirstFlowResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { acc_System: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  //ProductGrace show list
  productGraceListResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: 0, msg: "", productGraceProducts: [] } },
  },
  //productGraceDel
  productGraceDelResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { acc_System: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  setProductGraceSaveResponse: (
    productGraceSaveResponse //for productGraceSave
  ) => set({ productGraceSaveResponse }),
  setProductGraceListResponse: (
    productGraceListResponse //for showProductList
  ) => set({ productGraceListResponse }),
  setProductGraceDtlHistoryResponse: (
    productGraceDtlHistoryResponse //for productGraceDtlHistory
  ) => set({ productGraceDtlHistoryResponse }),
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setProductGraceResponse: (
    productGraceResponse //for productGrace
  ) => set({ productGraceResponse }),
  setProductGraceDoFirstFlowResponse: (
    productGraceDoFirstFlowResponse //for productGraceDoFirstFlow
  ) => set({ productGraceDoFirstFlowResponse }),
  setProductGraceDelResponse: (
    productGraceDelResponse //for productGraceDel
  ) => set({ productGraceDelResponse }),
}));
