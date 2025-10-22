import { create } from "zustand";
import { WarehouseState } from "../types/warehouse";

export const useWarehouseStore = create<WarehouseState>()((set) => ({
  warehouseShowIdResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        err: 0,
        msg: "",
        response: {
          wId: 0,
          wName: "",
          warehouseTemporaryReceiptMst: {
            id: 0,
            formId: 0,
            code: "",
            dat: "",
            tim: "",
            cId: 0,
            srName: "",
            gln: "",
            blackList: false,
            exp: "",
            guid: "",
            status: 0,
            msg: "",
          },
          warehouseTemporaryReceiptIndentDtls: [],
        },
      },
    },
  },
  warehouseIndentListResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        err: 0,
        msg: "",
        warehouseTemporaryReceiptIndentLists: [],
      },
    },
  },
  selectIndentsResponse: {
    meta: { errorCode: -1, message: "", type: "" },
    data: {
      result: { err: 0, msg: "", indents: [] },
    },
  },
  formId: 0,
  productId: 0,
  iocId: 0,
  selectIndentsRequest: {
    iocId: 0,
    indents: {
      id: 0,
      cnt: 0,
      offer: 0,
    },
  },
  regResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: { id: 0, err: 0, msg: "", dtlErrMsgs: [] },
    },
  },
  warehouseSearchResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: { total_count: 0, err: 0, msg: "", searchResults: [] },
    },
  },
  //for api/Warehouse/Search?search=%D8%A7&page=1&pageSize=30&lastId=0&CustomerTypeId=-1
  search: "ا",
  page: 1,
  pageSize: 30,
  lastId: 0,
  CustomerTypeId: -1,
  PartKey: 0,
  //end of api/Warehouse/Search?search=%D8%A7&page=1&pageSize=30&lastId=0&CustomerTypeId=-1
  //for api/WarehouseTemporaryReceipt/purchaseShow/1107390
  receiptPurchaseId: 0,
  warehouseTemporaryReceiptPurchaseShowResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        err: 0,
        msg: "",
        result: {
          spId: 0,
          spTitle: "",
          wId: 0,
          wName: "",
          warehouseTemporaryReceiptMst: {
            id: 0,
            formId: 0,
            code: "",
            dat: "",
            tim: "",
            cId: 0,
            srName: "",
            gln: "",
            blackList: false,
            exp: "",
            guid: "",
            status: 0,
            msg: "",
          },
          warehouseTemporaryReceiptPurchaseDtls: [],
        },
      },
    },
  },
  //for api/WarehouseTemporaryReceipt/salesPrices?id=1106779&salesPriceId=1
  id: 0,
  salesPriceId: 0,
  warehouseTemporaryReceiptSalesPricesResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: 0, msg: "", salesPrices: [] } },
  },
  //for api/WarehouseTemporaryReceipt/purchaseReg?id=1106779&salesPriceId=1
  idReg: 0,
  salesPriceIdReg: 0,
  warehouseTemporaryReceiptPurchaseRegResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { id: 0, err: 0, msg: "", dtlErrMsgs: [] } },
  },
  setField: (field: string, value: any) => {
    set((state) => ({ ...state, [field]: value }));
  },
  setWarehouseShowIdResponse: (warehouseShowIdResponse) =>
    set({ warehouseShowIdResponse }),
  setWarehouseIndentListResponse: (warehouseIndentListResponse) =>
    set({ warehouseIndentListResponse }),
  setSelectIndentsResponse: (selectIndentsResponse) =>
    set({ selectIndentsResponse }),
  setRegResponse: (regResponse) => set({ regResponse }),
  setWarehouseSearchResponse: (warehouseSearchResponse) =>
    set({ warehouseSearchResponse }),
  setWarehouseTemporaryReceiptPurchaseShowResponse: ( //for api/WarehouseTemporaryReceipt/purchaseShow/1107390
    warehouseTemporaryReceiptPurchaseShowResponse
  ) => set({ warehouseTemporaryReceiptPurchaseShowResponse }),
  setWarehouseTemporaryReceiptSalesPricesResponse: ( //for api/WarehouseTemporaryReceipt/salesPrices?id=1106779&salesPriceId=1
    warehouseTemporaryReceiptSalesPricesResponse
  ) => set({ warehouseTemporaryReceiptSalesPricesResponse }),
  setWarehouseTemporaryReceiptPurchaseRegResponse: ( //for api/WarehouseTemporaryReceipt/purchaseReg?id=1106779&salesPriceId=1
    warehouseTemporaryReceiptPurchaseRegResponse
  ) => set({ warehouseTemporaryReceiptPurchaseRegResponse }),
}));
