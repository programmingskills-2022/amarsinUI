import { create } from "zustand";
import { InvoiceReceiptState } from "../types/invoiceReceipt";

export const useInvoiceReceiptStore = create<InvoiceReceiptState>()((set) => ({

  indentMrsResponse: {
    err: 0,
    msg: '',
    indents: [],
    indentDtls: [],
  },
  mrsId: 0,
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setIndentMrsResponse: (indentMrsResponse) =>
    set({ indentMrsResponse }),

}));
