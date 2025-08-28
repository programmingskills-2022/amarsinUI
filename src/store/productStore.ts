import { create } from "zustand";
import { ProductState,  } from "../types/product";
export const useProductStore = create<ProductState>()((set) => ({
  productSearchResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { totalCount: 0, result: [] },
  },
  salesPricesSearchResponse: {
    total_count: 0,
    err: 0,
    msg: "",
    searchResults: [],
  },
  indentShowProductListResponse:{
    err:0,
    msg:"",
    indentProducts:[]
  },
  accYear: 0,
  accSystem: 0,
  searchTerm: "",
  page: 1, 
  //for salesPricesSearch req
  salesPricesSearch:"",
  salesPricesSearchPage:1,
  lastId:0,
  //for indent/showProductList req
  mrsId:0,
  pId:0,
  productId:0,
  acc_Year:0,
  providers:[],
  brands:[],
  salesPriceId:0,
  saleFDate:"",
  saleTDate:"",
  indentSaveRequest: {
    id: 0,
    ordrId: 0,
    mrsId: 0,
    customerId: 0,
    del: false,
    acc_System: 0,
    acc_Year: 0,
    payDuration: 0,
    dat: '',
    tim: '',
    dsc: '',
    salesPriceId: 0,
    saleFDate: '',
    saleTDate: '',
    dtls: [],
  },
  indentSaveResponse: {
    systemId: 0,
    id: 0,
    err: 0,
    msg: '',
    hasFlow: false,
  },
  indentDtlHistoryResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: 0, msg: "", indentDtlHistories: [] } },
  },
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setProductSearchResponse: (productSearchResponse) =>
    set({ productSearchResponse }),
  setSalesPricesSearchResponse:(salesPricesSearchResponse) =>
    set({ salesPricesSearchResponse }),
  setIndentShowProductListResponse: (indentShowProductListResponse) =>
    set({ indentShowProductListResponse }),
  setIndentSaveResponse: (indentSaveResponse) =>
    set({ indentSaveResponse }),
  setIndentDtlHistoryResponse: (indentDtlHistoryResponse) =>
    set({ indentDtlHistoryResponse }),
  
}));

