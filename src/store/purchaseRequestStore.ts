import { create } from "zustand";
import { PurchaseRequestState } from "../types/purchaseRequest";

export const usePurchaseRequestStore = create<PurchaseRequestState>()((set) => ({
//indent/showProductList
  indentShowProductListResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: [] },
  },
  //for indent/showProductList req
  mrsId: -1,
  mrsIdTrigger: 0,
  pId: -1,
  productId: 0,
  acc_Year: 0,
  providers: [],
  brands: [],
  salesPriceId: 0,
  saleFDate: "",
  saleTDate: "",
  indentSaveRequest: {
    id: 0,
    ordrId: 0,
    mrsId: 0,
    customerId: 0,
    del: false,
    acc_System: 0,
    acc_Year: 0,
    payDuration: 0,
    dat: "",
    tim: "",
    dsc: "",
    salesPriceId: 0,
    saleFDate: "",
    saleTDate: "",
    dtls: [],
  },
  indentSaveResponse: {
    meta: { errorCode: 0, message: "", type: "" },
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
  indentDtlHistoryResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: 0, msg: "", indentDtlHistories: [] } },
  },
  // for /api/Indent/list?Id=6430&OrdrId=-1&MrsId=0&Acc_Year=0&Acc_System=0&State=0&ShowDeletedInentDtl=false
  id: 0,
  acc_SystemIndentRequest: -1,
  acc_YearIndentRequest: -1,
  acc_SystemIndentDtlRequest: -1,
  acc_YearIndentDtlRequest: -1,
  showDeletedInentDtl: false,
  ordrIdIndentRequest: 0,
  mrsIdIndentRequest: -1,
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
  srchUsrName: "",
  srchStep: "",
  srchSRName: "",
  srchPayDuration: 0,
  sortId: 0,
  sortDat: 0,
  sortTime: 0,
  sortDsc: 0,
  sortUsrName: 0,
  sortStep: 0,
  sortSRName: 0,
  sortPayDuration: 0,
  indentResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { total_count: 0, indents: [], indentDtls: [] } },
  },
  //for delete /api/Indent/6480
  indentDelResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  //for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
  indentDoFirstFlowResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  },
  //for api/Product/productInstanceCatalog?Id=166717&UID=0&IRC=0
  idProductCatalogRequest: -1,
  uIDProductCatalogRequest: "",
  iRCProductCatalogRequest: "",
  productCatalog: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        data: {
          manufacturing: "",
          expiration: "",
          batchCode: "",
          genericName: "",
          genericCode: "",
          uid: "",
          gtin: "",
          irc: "",
          licenseOwner: "",
          englishProductName: "",
          persianProductName: "",
          productCategory: "",
          productCategoryCode: 0,
          packageCount: 0,
          statusCode: 0,
        },
        statusCode: 0,
        statusMessage: "",
        cupId: 0,
        uid: "",
        irc: "",
        ttac: false,
        systemId: 0,
      },
    },
  },

  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setIndentShowProductListResponse: (indentShowProductListResponse) =>
    set({ indentShowProductListResponse }), //for /api/Indent/showProductList?mrsId=6480&productId=0&acc_Year=0&providers=[]&brands=[]&salesPriceId=0&saleFDate=&saleTDate=
  setIndentSaveResponse: (indentSaveResponse) => set({ indentSaveResponse }), //for /api/Indent/save
  setIndentDtlHistoryResponse: (indentDtlHistoryResponse) =>
    set({ indentDtlHistoryResponse }), //for /api/Indent/dtlHistory?pId=6480&mrsId=6480
  setIndentResponse: (indentResponse) => set({ indentResponse }), //for /api/Indent/list?Id=6430&OrdrId=-1&MrsId=0&Acc_Year=0&Acc_System=0&State=0&ShowDeletedInentDtl=false
  setIndentDelResponse: (indentDelResponse) => set({ indentDelResponse }), //for delete /api/Indent/6480
  setIndentDoFirstFlowResponse: (indentDoFirstFlowResponse) =>
    set({ indentDoFirstFlowResponse }), //for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
}));
