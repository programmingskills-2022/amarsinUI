import { create } from "zustand";
import { InvoiceReceiptState } from "../types/invoiceReceipt";

export const useInvoiceReceiptStore = create<InvoiceReceiptState>()((set) => ({

  indentMrsResponse: {
    meta: {
      errorCode: 0,
      message: '',
      type: '',
    },
    data: {
      result: {
        totalCount: 0,
        indents: [],
        indentDtls: [],
      },
    },
  },
  mrsId: -1,
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setIndentMrsResponse: (indentMrsResponse) =>
    set({ indentMrsResponse }),

}));
