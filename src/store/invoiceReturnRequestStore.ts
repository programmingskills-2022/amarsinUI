import { create } from "zustand";
import { InvoiceReturnRequestState } from "../types/invoiceReturnRequest";

export const useInvoiceReturnRequestStore = create<InvoiceReturnRequestState>()(
  (set) => ({
    //api/InvoiceReturnRequest/show?Id=2778
    invoiceReturnRequestShowResponse: {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          invoiceReturnRequest: {
            id: 0,
            ordr: 0,
            dat: "",
            cId: 0,
            srName: "",
            dsc: "",
            usrName: "",
            flwId: 0,
            flowMapName: "",
            canEdit: 0,
            attachCount: 0,
          },
          invoiceReturnRequestDtls: [],
          diagnosises: [],
        },
      },
    },
    invoiceReturnRequestId: -1,
    //api/InvoiceReturnRequest/invoiceList?Id=3712
    invoiceReturnRequestInvoiceListResponse: {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          invoiceReturnRequestInvoiceDtls: [],
          invoiceReturnRequestInvoiceDtlCups: [],
        },
      },
    },
    invoiceListId: -1,
    invoiceListIdTrigger: 0,
    //api/InvoiceReturnRequest/registerDtl?InvoiceReturnRequestDtlId=3712
    invoiceReturnRequestDtlId: -1,
    invoiceReturnRequestRegisterDtlResponse: {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          id: 0,
          factorNo: "",
          cnt: 0,
          offer: 0,
          diagnosis: [],
        },
      },
    },
    setField: (field: string, value: any) =>
      set((state) => ({ ...state, [field]: value })),
    setInvoiceReturnRequestRegisterDtlResponse: (
      invoiceReturnRequestRegisterDtlResponse // for api/InvoiceReturnRequest/registerDtl?InvoiceReturnRequestDtlId=3712
    ) => set({ invoiceReturnRequestRegisterDtlResponse }),
    setInvoiceReturnRequestShowResponse: (invoiceReturnRequestShowResponse) =>
      set({ invoiceReturnRequestShowResponse }),
    setInvoiceReturnRequestInvoiceListResponse: (
      invoiceReturnRequestInvoiceListResponse
    ) => set({ invoiceReturnRequestInvoiceListResponse }),
  })
);
