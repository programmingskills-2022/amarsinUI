import { create } from "zustand";
import { InvoiceState } from "../types/invoice";

export const useInvoiceStore = create<InvoiceState>()((set) => ({
  invoiceShowIdResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        invoice: {
          id: 0,
          ordr: 0,
          dat: "",
          cId: 0,
          srName: "",
          exp: "",
          usrName: "",
          flwId: 0,
          flowMapName: "",
          canEdit: 0,
        },
        invoiceDtls: [],
        diagnosises: [],
      },
    },
  },
  formId: -1,
  // for Invoice/payment
  invoiceId: -1,
  invoicePaymentResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        customerId: 0,
        srName: "",
        dat: "",
        dsc: "",
        amnt: "",
        payments: [],
      },
    },
  },
  // api/Invoice/paymentSave
  invoicePaymentSaveResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        customerId: 0,
        srName: "",
        dat: "",
        dsc: "",
        amnt: "",
        payments: [],
      },
    },
  },
  
  setInvoicePaymentResponse: (invoicePaymentResponse) =>   // for Invoice/payment
    set({ invoicePaymentResponse }),
  setInvoicePaymentSaveResponse: (invoicePaymentSaveResponse) =>   // api/Invoice/paymentSave
    set({ invoicePaymentSaveResponse }),
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setInvoiceShowIdResponse: (invoiceShowIdResponse) =>
    set({ invoiceShowIdResponse }),
}));
