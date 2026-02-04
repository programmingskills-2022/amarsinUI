import { create } from "zustand";
import { PayRequestState } from "../types/payRequest";
import { RpCustomerBillsResponse } from "../types/sales";
export const usePayRequestStore = create<PayRequestState>()((set) => ({
  //for PayRequest
  id: -1,
  yearId: -1,
  systemId: -1,
  yearIdDtl: -1, // for detail table
  systemIdDtl: -1,//for detail table
  state: -1,
  regFDate: "",
  regTDate: "",
  fDate: "",
  tDate: "",
  pageNumber: 1,
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
  srchSrName: "",
  srchAmount: 0,
  sortSrName: 0,
  sortAmount: 0,
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
        payRequest: {
          total_count: 0,
          payRequests: [],
        },
        payRequests: [],
        payRequestDtls: [],
        invcs: [],
      },
    },
  },
  //for PayRequest/PayRequestInvoices
  //change to below
  //http://apitest.dotis.ir/api/PayRequest/DtlInvoices?PayRequestDtlId=3290
  payRequestDtlId: -1,
  payRequestDtlIdTrigger: 0,
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
  payRequestId: -1,
  systemIdPayRequestInvoice: -1,
  yearIdPayRequestInvoice: -1,
  customerId: -1,
  //for SalesReport/RpCustomerBills
  customerIdRpCustomerBills: -1,
  systemIdRpCustomerBills: -1,
  yearIdRpCustomerBills: -1,
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
  acc_systemChequeBookSearch:-1,
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
  chequeBookIdChequeBookDtlSearch: -1,
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
  chequeBookDtlId: -1,
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
  //for PayRequest/save
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
  //for PayRequest/doFirstFlow
  payRequestDoFirstFlowResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
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
  //for PayRequest/del
  payRequestDelResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
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
  //for PayRequest/DtlRemoveInvoice
  payRequestDtlRemoveInvoiceResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: 0,
    },
  },
  //for PayRequest/DtlAddInvoice
  payRequestDtlAddInvoiceResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: 0,
    },
  },
  setPayRequestDoFirstFlowResponse: (payRequestDoFirstFlowResponse) =>
    set({ payRequestDoFirstFlowResponse }),
  //for PayRequest/del
  setPayRequestDelResponse: (payRequestDelResponse) =>
    set({ payRequestDelResponse }),
  setField: (field: string | number | symbol, value: any) => {
    set((state) => {
      if (state[field as keyof PayRequestState] === value) return state;
      return { ...state, [field]: value };
    });
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
  setPayRequestDtlRemoveInvoiceResponse: (payRequestDtlRemoveInvoiceResponse) =>
    set({ payRequestDtlRemoveInvoiceResponse }), //for PayRequest/DtlRemoveInvoice
  setPayRequestDtlAddInvoiceResponse: (payRequestDtlAddInvoiceResponse) =>
    set({ payRequestDtlAddInvoiceResponse }), //for PayRequest/DtlAddInvoice
}));
