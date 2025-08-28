import { create } from "zustand";
import { PayRequestState } from "../types/payRequest";
import { RpCustomerBillsResponse } from "../types/sales";
export const usePayRequestStore = create<PayRequestState>()((set) => ({
  //for PayRequest/PayRequest
  id: 0,
  acc_year: 0,
  acc_system: 0,
  payRequestResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        err: 0,
        msg: "",
        payRequests: [],
        payRequestDtls: [],
        invcs: [],
      },
    },
  },
  //for PayRequest/PayRequestInvoices
  payRequestInvoicesResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        err: 0,
        msg: "",
        invoices: [],
      },
    },
  },
  payRequestId: 0,
  systemIdPayRequestInvoice: 0,
  yearIdPayRequestInvoice: 0,
  customerId: 0,
  //for SalesReport/RpCustomerBills
  customerIdRpCustomerBills: 0,
  systemIdRpCustomerBills: 0,
  yearIdRpCustomerBills: 0,
  fDateRpCustomerBills: "",
  tDateRpCustomerBills: "",
  rpCustomerBillsResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: [],
    },
  },
  //Payment/chequeBookSearch requests
  acc_systemChequeBookSearch:4,
  searchChequeBookSearch: "",
  pageChequeBookSearch: 1,
  lastIdChequeBookSearch: 0,
  chequeBookSearchResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        total_count: 0,
        results: [],
      },
    },
  },
  //Payment/chequeBookDtlSearch requests
  chequeBookIdChequeBookDtlSearch: 0,
  pageChequeBookDtlSearch: 1,
  lastIdChequeBookDtlSearch: 0,
  searchChequeBookDtlSearch: "",
  chequeBookDtlSearchResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        total_count: 0,
        results: [],
      },
    },
  },
  //Payment/chequeBookDtlById requests
  chequeBookDtlId: 0,
  chequeBookDtlByIdResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        err: 0,
        msg: "",
        checkBookDtl: {
          id: 0,
          chqBkNo: "",
        },
      },
    },
  },
  //for PayRequest/PayRequestSave
  payRequestSaveResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        id: 0,
        err: 0,
        msg: "",
        dtlErrMsgs: [],
      },
    },
  },
  setField: (field: string | number | symbol, value: any) => {
    //console.log(field, value);
    set((state) => ({ ...state, [field]: value }));
  },
  setPayRequestResponse: (payRequestResponse) => set({ payRequestResponse }),
  setPayRequestInvoicesResponse: (payRequestInvoicesResponse) =>
    set({ payRequestInvoicesResponse }),
  setRpCustomerBillsResponse: (
    rpCustomerBillsResponse: RpCustomerBillsResponse
  ) => set({ rpCustomerBillsResponse }),
  setChequeBookSearchResponse: (chequeBookSearchResponse) =>
    set({ chequeBookSearchResponse }), //for Payment/chequeBookSearch
  setChequeBookDtlSearchResponse: (chequeBookDtlSearchResponse) =>
    set({ chequeBookDtlSearchResponse }), //for Payment/chequeBookDtlSearch
  setChequeBookDtlByIdResponse: (chequeBookDtlByIdResponse) =>
    set({ chequeBookDtlByIdResponse }), //for Payment/chequeBookDtlById
  setPayRequestSaveResponse: (payRequestSaveResponse) =>
    set({ payRequestSaveResponse }), //for PayRequest/PayRequestSave
}));
