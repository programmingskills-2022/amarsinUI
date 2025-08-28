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
  formId: 0,
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setInvoiceShowIdResponse: (invoiceShowIdResponse) =>
    set({ invoiceShowIdResponse }),
}));
