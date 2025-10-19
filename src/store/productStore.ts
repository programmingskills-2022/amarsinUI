import { create } from "zustand";
import { ProductState } from "../types/product";
export const useProductStore = create<ProductState>()((set) => ({
  productSearchResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { totalCount: 0, result: { total_count: 0, searchResults: [] } },
  },
  salesPricesSearchResponse: {
    total_count: 0,
    err: 0,
    msg: "",
    searchResults: [],
  },
  indentShowProductListResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: [] },
  },
  accYear: 0,
  accSystem: 0,
  searchTerm: "",
  page: 1,
  //for salesPricesSearch req
  salesPricesSearch: "",
  salesPricesSearchPage: 1,
  lastId: 0,
  //for indent/showProductList req
  mrsId: 0,
  pId: 0,
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
    systemId: 0,
    id: 0,
    err: 0,
    msg: "",
    hasFlow: false,
  },
  indentDtlHistoryResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: 0, msg: "", indentDtlHistories: [] } },
  },
  // for /api/Indent/list?Id=6430&OrdrId=-1&MrsId=0&Acc_Year=0&Acc_System=0&State=0&ShowDeletedInentDtl=false
  id: 0,
  acc_SystemIndentRequest: 0,
  acc_YearIndentRequest: 0,
  showDeletedInentDtl: false,
  ordrIdIndentRequest: 0,
  mrsIdIndentRequest: 0,
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
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setProductSearchResponse: (productSearchResponse) =>
    set({ productSearchResponse }),//for /api/Product/search?searchTerm=searchTerm&page=1
  setSalesPricesSearchResponse: (salesPricesSearchResponse) =>
    set({ salesPricesSearchResponse }),//for /api/SalesPrices/search?salesPricesSearch=salesPricesSearch&salesPricesSearchPage=1&lastId=0
  setIndentShowProductListResponse: (indentShowProductListResponse) =>
    set({ indentShowProductListResponse }),//for /api/Indent/showProductList?mrsId=6480&productId=0&acc_Year=0&providers=[]&brands=[]&salesPriceId=0&saleFDate=&saleTDate=
  setIndentSaveResponse: (indentSaveResponse) => set({ indentSaveResponse }),//for /api/Indent/save
  setIndentDtlHistoryResponse: (indentDtlHistoryResponse) =>
    set({ indentDtlHistoryResponse }),//for /api/Indent/dtlHistory?pId=6480&mrsId=6480
  setIndentResponse: (indentResponse) => set({ indentResponse }),//for /api/Indent/list?Id=6430&OrdrId=-1&MrsId=0&Acc_Year=0&Acc_System=0&State=0&ShowDeletedInentDtl=false
  setIndentDelResponse: (indentDelResponse) => set({ indentDelResponse }),//for delete /api/Indent/6480   
  setIndentDoFirstFlowResponse: (indentDoFirstFlowResponse) => set({ indentDoFirstFlowResponse }),//for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
}));
