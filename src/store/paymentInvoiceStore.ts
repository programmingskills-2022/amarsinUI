import { create } from "zustand";
import {
  InvoiceOutStandingRequest,
  InvoiceOutStandingResponse,
  InvoiceOutStandingState,
  PaymentInvoicesSaveResponse,
  SettlementAveragesResponse,
} from "../types/paymentInvoice";

export const usePaymentInvoiceStore = create<InvoiceOutStandingState>()(
  (set) => ({
    invoiceOutStandingResponse: {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        invoiceOutstandings: [],
        err: 0,
        msg: "",
        rem: 0,
        dsc: "",
        kind: 0,
      },
    },
    paymentInvoicesSaveResponse: {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          id: 0,
          err: 0,
          msg: "",
          dtlErrMsgs: [],
        },
      },
    },
    usrId: -1,
    paymentInvoices: [],
    dsc: "",
    rem: 0,
    paymentId: -1,
    systemId: -1,
    yearId: -1,
    //for Payment/settlementAverages
    settlementAveragesResponse: {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: [],
      },
    },
    setField: (
      field: keyof InvoiceOutStandingRequest | "dsc" | "rem",
      value: any
    ) => set((state) => ({ ...state, [field]: value })),
    setInvoiceOutStandingResponse: (
      invoiceOutStandingResponse: InvoiceOutStandingResponse
    ) => set({ invoiceOutStandingResponse }),
    setPaymentInvoicesSaveResponse: (
      paymentInvoicesSaveResponse: PaymentInvoicesSaveResponse
    ) => set({ paymentInvoicesSaveResponse }),
    setSettlementAveragesResponse: (
      settlementAveragesResponse: SettlementAveragesResponse
    ) => set({ settlementAveragesResponse }),
  })
);
