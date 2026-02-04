import { create } from "zustand";
import { WarehouseState } from "../types/warehouse";

export const useWarehouseStore = create<WarehouseState>()((set) => ({
  // api/WarehouseTemporaryReceipt/indentShow/1135730
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
  ///api/WarehouseTemporaryReceipt/indentList/${iocId}
  formIdWarehouseTemporaryReceipt: -1,
  productId: -1,
  iocId: -1,
  iocIdTrigger: 0,
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
  page: -1,
  pageSize: 30,
  lastId: 0,
  CustomerTypeId: -1,
  PartKey: 0,
  //end of api/Warehouse/Search?search=%D8%A7&page=1&pageSize=30&lastId=0&CustomerTypeId=-1
  //for api/WarehouseTemporaryReceipt/purchaseShow/1107390
  receiptPurchaseId: -1,
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
  id: -1,
  salesPriceId: 0,
  warehouseTemporaryReceiptSalesPricesResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: 0, msg: "", salesPrices: [] } },
  },
  //for api/WarehouseTemporaryReceipt/purchaseReg?id=1106779&salesPriceId=1
  idReg: -1,
  salesPriceIdReg: -1,
  warehouseTemporaryReceiptPurchaseRegResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { id: 0, err: 0, msg: "", dtlErrMsgs: [] } },
  },
  //for api/WarehouseTemporaryReceipt/Show/1135730
  formIdWarehouseTemporaryReceiptTitac: -1,
  warehouseTemporaryReceiptTitacShowResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
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
          exp: "",
          guid: "",
          status: 0,
          msg: "",
        },
        warehouseTemporaryReceiptDtls: [],
        totalCount: 0,
        hasMore: false,
      },
      total_count: 0,
    },
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
  setWarehouseTemporaryReceiptPurchaseShowResponse: (
    //for api/WarehouseTemporaryReceipt/purchaseShow/1107390
    warehouseTemporaryReceiptPurchaseShowResponse
  ) => set({ warehouseTemporaryReceiptPurchaseShowResponse }),
  setWarehouseTemporaryReceiptSalesPricesResponse: (
    //for api/WarehouseTemporaryReceipt/salesPrices?id=1106779&salesPriceId=1
    warehouseTemporaryReceiptSalesPricesResponse
  ) => set({ warehouseTemporaryReceiptSalesPricesResponse }),
  setWarehouseTemporaryReceiptPurchaseRegResponse: (
    //for api/WarehouseTemporaryReceipt/purchaseReg?id=1106779&salesPriceId=1
    warehouseTemporaryReceiptPurchaseRegResponse
  ) => set({ warehouseTemporaryReceiptPurchaseRegResponse }),
  setWarehouseTemporaryReceiptTitacShowResponse: (
    //for api/WarehouseTemporaryReceipt/Show/1135730
    warehouseTemporaryReceiptTitacShowResponse
  ) => set({ warehouseTemporaryReceiptTitacShowResponse }),
}));
