import { create } from "zustand";
import { ProductOfferState } from "../types/productOffer";
export const useProductOfferStore = create<ProductOfferState>()((set) => ({
  //productOffer
  productOfferResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: {
      result: { err: 0, msg: null, total_count: 0, productOffers: [], productOfferDtls: [] },
    },
  },
  id: 0,
  acc_Year: -1,
  acc_System: -1,
  acc_YearDtl: -1,
  acc_SystemDtl: -1,
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
  //showProductList
  idShowProductList: 0,
  productId: 0,
  acc_YearShowProductList: 0,
  brands: [],
  showProductListResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: [] },
  },
  //productOfferDtlHistory
  pId: -1,
  pIdTrigger: 0,
  productOfferDtlHistoryResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [] },
  },
  //productOfferSave
  productOfferSaveResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  //productOfferDoFirstFlow
  productOfferDoFirstFlowResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { id: 0, err: 0, msg: "", formAfterClick: { id: 0, title: null, viewPath: null } } },
  },
  idProductOfferDoFirstFlow: 0,
  acc_SystemProductOfferDoFirstFlow: -1,
  acc_YearProductOfferDoFirstFlow: -1,
  chartIdProductOfferDoFirstFlow: -1,
  dscProductOfferDoFirstFlow: "",
  //productOfferDel
  productOfferDelResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  setProductOfferSaveResponse: (
    productOfferSaveResponse //for productOfferSave
  ) => set({ productOfferSaveResponse }),
  setShowProductListResponse: (
    showProductListResponse //for showProductList
  ) => set({ showProductListResponse }),
  setProductOfferDtlHistoryResponse: (
    productOfferDtlHistoryResponse //for productOfferDtlHistory
  ) => set({ productOfferDtlHistoryResponse }),
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setProductOfferResponse: (
    productOfferResponse //for productOffer
  ) => set({ productOfferResponse }),
  setProductOfferDoFirstFlowResponse: (
    productOfferDoFirstFlowResponse //for productOfferDoFirstFlow
  ) => set({ productOfferDoFirstFlowResponse }),
  setProductOfferDelResponse: (
    productOfferDelResponse //for productOfferDel
  ) => set({ productOfferDelResponse }),
}));
