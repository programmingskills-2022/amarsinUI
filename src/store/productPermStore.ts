import { create } from "zustand";
import {
  ProductPermDelResponse,
  ProductPermDoFirstFlowResponse,
  ProductPermDtlHistoryResponse,
  ProductPermListResponse,
  ProductPermResponse,
  ProductPermSaveResponse,
  ProductPermState,
} from "../types/productPerm";
export const useProductPermStore = create<ProductPermState>()((set) => ({
  //productPerm
  id: 0,
  yearId: -1,
  systemId: -1,
  systemIdDtl: -1,
  yearIdDtl: -1,
  state: 0,
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
  productPermResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: {
      result: {
        err: 0,
        msg: null,
        total_count: 0,
        productPerms: [],
        productPermDtls: [],
      },
    },
  },
  //productPermList
  productPermListResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [] },
  },
  //productPermDtlHistory
  productPermDtlHistoryResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [] },
  },
  ////////////
  pId: -1,
  pIdTrigger: 0,
  //productPermSaveResponse
  productPermSaveResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  //productPermDoFirstFlowResponse
  productPermDoFirstFlowResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: {
      result: {
        systemId: 0,
        id: 0,
        err: 0,
        msg: "",
        hasFlow: false,
      },
    },
  },
  //productPermDelResponse
  productPermDelResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  setProductPermDoFirstFlowResponse: (//for productPerm/doFirstFlow
    productPermDoFirstFlowResponse: ProductPermDoFirstFlowResponse
  ) => set({ productPermDoFirstFlowResponse }),
  setProductPermDelResponse: (productPermDelResponse: ProductPermDelResponse) =>//for productPerm/del
    set({ productPermDelResponse }),
  setProductPermSaveResponse: (
    productPermSaveResponse: ProductPermSaveResponse //for productPerm/save
  ) => set({ productPermSaveResponse }),
  setProductPermDtlHistoryResponse: (
    productPermDtlHistoryResponse: ProductPermDtlHistoryResponse //for productPerm/dtlHistory
  ) => set({ productPermDtlHistoryResponse }),
  setProductPermListResponse: (
    //for productPerm/productList
    productPermListResponse: ProductPermListResponse
  ) => set({ productPermListResponse }),
  setField: (field: string, value: any) => set({ [field]: value }),
  setProductPermResponse: (
    productPermResponse: ProductPermResponse //for productPerm/productPerm
  ) => set({ productPermResponse }),
}));
