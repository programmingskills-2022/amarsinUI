import { create } from "zustand";
import { PreInvoiceReturnState } from "../types/preInvoiceReturn";

export const usePreInvoiceReturnStore = create<PreInvoiceReturnState>()(
  (set) => ({
    ///api/PreInvoiceReturn/warehouseTemporaryReceiptShow?Id=924865
    temporaryReceiptShowId: -1,
    responseWarehouseTemporaryReceiptShow: {
      meta: { errorCode: 0, message: null, type: "" },
      data: {
        result: {
          err: 0,
          msg: "",
          preInvoiceReturn: {
            id: 0,
            ordr: 0,
            dat: "",
            cId: 0,
            srName: "",
            exp: "",
          },
          preInvoiceReturnDtls: [],
          diagnosises: [],
        },
      },
    },
    //api/WarehouseTemporaryReceipt/preInvoiceDtSearch?PreInvoiceDtlId=4512744&page=1
    searchPreInvoiceDtlSearch: "",
    pagePreInvoiceDtlSearch: 1,
    preInvoiceDtlId: -1,
    responsePreInvoiceDtlSearch: {
      meta: { errorCode: 0, message: null, type: "" },
      data: { result: { total_count: 0, results: [] } },
    },
    //api/PreInvoiceReturn/warehouseTemporaryReceiptSave
    WarehouseTemporaryReceiptSaveRequestId: 0,
    warehouseTemporaryReceiptDtlId: 0,
    warehouseTemporaryReceiptSaveResponse: {
      meta: { errorCode: 0, message: null, type: "" },
      data: {
        result: { id: 0, err: 0, msg: "", cupboardId: 0, statusCode: 0 },
      },
    },
    //api/PreInvoiceReturn/show?Id=925177
    preInvoiceReturnShowId: -1,
    preInvoiceReturnShowResponse: {
      meta: { errorCode: 0, message: null, type: "" },
      data: {
        result: {
          err: 0,
          msg: "",
          preInvoiceReturn: {
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
          preInvoiceReturnDtls: [],
          diagnosises: [],
        },
      },
    },
    setField: (field: string | number | symbol, value: any) =>
      set((state) => ({ ...state, [field]: value })),
    setResponseWarehouseTemporaryReceiptShow: (
      responseWarehouseTemporaryReceiptShow
    ) => set({ responseWarehouseTemporaryReceiptShow }),
    setResponsePreInvoiceDtlSearch: (responsePreInvoiceDtlSearch) =>
      set({ responsePreInvoiceDtlSearch }),
    setWarehouseTemporaryReceiptSaveResponse: (
      warehouseTemporaryReceiptSaveResponse
    ) => set({ warehouseTemporaryReceiptSaveResponse }),
    setPreInvoiceReturnShowResponse: (preInvoiceReturnShowResponse) =>
      set({ preInvoiceReturnShowResponse }), // api/PreInvoiceReturn/show?Id=925177
  })
);
