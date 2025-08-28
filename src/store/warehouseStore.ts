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
  productCatalog: {
    data: {
      Manufacturing: "",
      Expiration: "",
      BatchCode: "",
      GenericName: "",
      GenericCode: "",
      UID: "",
      GTIN: "",
      IRC: "",
      LicenseOwner: "",
      EnglishProductName: "",
      PersianProductName: "",
      ProductCategory: "",
      ProductCategoryCode: 0,
      PackageCount: 0,
      StatusCode: 0,
    },
    statusCode: 0,
    statusMessage: "",
    CupId: 0,
    UID: "",
    IRC: "",
    ttac: false,
    SystemId: 0,
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
  //for api/Warehouse/WarehouseSearch?search=%D8%A7&page=1&pageSize=30&lastId=0&CustomerTypeId=-1
  search: "ا",
  page: 1,
  pageSize: 30,
  lastId: 0,
  CustomerTypeId: -1,
  PartKey: 0,
  //end of api/Warehouse/WarehouseSearch?search=%D8%A7&page=1&pageSize=30&lastId=0&CustomerTypeId=-1
  setField: (field: string, value: any) => {
    set((state) => ({ ...state, [field]: value }));
  },
  setWarehouseShowIdResponse: (warehouseShowIdResponse) =>
    set({ warehouseShowIdResponse }),
  setProductCatalog: (productCatalog) => set({ productCatalog }),
  setWarehouseIndentListResponse: (warehouseIndentListResponse) =>
    set({ warehouseIndentListResponse }),
  setSelectIndentsResponse: (selectIndentsResponse) =>
    set({ selectIndentsResponse }),
  setRegResponse: (regResponse) => set({ regResponse }),
  setWarehouseSearchResponse: (warehouseSearchResponse) =>
    set({ warehouseSearchResponse }),
}));
