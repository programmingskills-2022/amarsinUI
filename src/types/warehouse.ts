import { ReactNode } from "react";
import { Meta } from "./invoice";

interface Indent {
  id: number;
  code: string | null;
  cnt: number;
  offer: number;
  dsc: string;
}

export interface WarehouseTemporaryReceiptIndentDtl {
  id: number;
  iocId: number;
  produce: string;
  expire: string;
  uId: string;
  status: number;
  cId: number;
  code: string;
  gtin: string;
  irc: string;
  pCode: string;
  pName: string;
  cnt: number;
  stock: number;
  pOffer: number;
  indents: Indent[];
  rCnt: number;
  rOffer: number;
}

/*export interface WarehouseTemporaryReceiptIndentDtlTable
  extends WarehouseTemporaryReceiptIndentDtl {


  }*/
export interface WarehouseTemporaryReceiptIndentDtlTable {
  id: number;
  expire: string;
  uId: string;
  status: ReactNode;
  editIcon: ReactNode;
  historyIcon: ReactNode;
  statusOriginal: number;
  cId: number;
  code: string;
  pCode: string;
  pName: string;
  cnt: number;
  indentId: string;
  indentCode: string;
  indentCnt: string;
  indentOffer: string;
  indentDsc: string;
  rCnt: number;
  rOffer: number;
}

export interface ProductCatalogTable {
  rowId: string;
  title: string;
  systemInfo: string;
  samaneInfo: string;
}

interface WarehouseTemporaryReceiptMst {
  id: number;
  formId: number;
  code: string;
  dat: string;
  tim: string;
  cId: number;
  srName: string;
  gln: string;
  blackList: boolean;
  exp: string;
  guid: string;
  status: number;
  msg: string;
}

interface WarehouseResponse {
  wId: number;
  wName: string;
  warehouseTemporaryReceiptMst: WarehouseTemporaryReceiptMst;
  warehouseTemporaryReceiptIndentDtls: WarehouseTemporaryReceiptIndentDtl[];
}

interface Result {
  err: number;
  msg: string;
  response: WarehouseResponse;
}

interface Data {
  result: Result;
}

export interface WarehouseShowIdResponse {
  meta: Meta;
  data: Data;
}

export interface WarehouseState extends WarehouseSearchRequest {
  formId: number;
  productId: number;
  iocId: number;
  warehouseShowIdResponse: WarehouseShowIdResponse;
  warehouseIndentListResponse: WarehouseIndentListResponse;
  productCatalog: ProductCatalog;
  warehouseSearchResponse: WarehouseSearchResponse;
  setField: (field: string, value: any) => void;
  setWarehouseShowIdResponse: (
    warehouseShowIdResponse: WarehouseShowIdResponse
  ) => void;
  setProductCatalog: (productCatalog: ProductCatalog) => void;
  setWarehouseIndentListResponse: (
    warehouseIndentListResponse: WarehouseIndentListResponse
  ) => void;
  selectIndentsResponse: SelectIndentsResponse;
  setSelectIndentsResponse: (
    selectIndentsResponse: SelectIndentsResponse
  ) => void;
  regResponse: RegResponse;
  setRegResponse: (regResponse: RegResponse) => void;
  setWarehouseSearchResponse: (
    warehouseSearchResponse: WarehouseSearchResponse
  ) => void;
}

export interface ProductCatalog {
  data: {
    Manufacturing: string;
    Expiration: string;
    BatchCode: string;
    GenericName: string | null;
    GenericCode: string;
    UID: string;
    GTIN: string;
    IRC: string;
    LicenseOwner: string;
    EnglishProductName: string;
    PersianProductName: string;
    ProductCategory: string;
    ProductCategoryCode: number;
    PackageCount: number;
    StatusCode: number;
  };
  statusCode: number;
  statusMessage: string;
  CupId: number;
  UID: string;
  IRC: string;
  ttac: boolean;
  SystemId: number;
}

type TemporaryReceiptIndent = {
  id: number;
  payDuration: number;
  dId: number;
  cnt: number;
  offer: number;
  amnt: number;
  rem: number;
  dcrmnt: number;
  dsc: string;
};

export interface WarehouseTemporaryReceiptIndent
  extends TemporaryReceiptIndent {
  rCnt: number;
  rOffer: number;
}

export interface WarehouseTemporaryReceiptIndentTbl {
  id: string;
  payDuration: string;
  dId: string;
  cnt: string;
  offer: string;
  amnt: string;
  rem: string;
  dcrmnt: string;
  dsc: string;
  rCnt: string;
  rOffer: string;
}

export interface WarehouseIndentListResponse {
  meta: Meta;
  data: {
    result: {
      err: number;
      msg: string;
      warehouseTemporaryReceiptIndentLists: WarehouseTemporaryReceiptIndent[];
    };
  };
}

export type IndentRequest = {
  id: number;
  cnt: number;
  offer: number;
};

export type SelectIndentsRequest = {
  iocId: number;
  indents: IndentRequest[];
};

export interface SelectIndentsResponse {
  meta: {
    errorCode: number;
    message: string;
    type: string;
  };
  data: {
    result: {
      err: number;
      msg: string;
      indents: Indent[];
    };
  };
}

export interface RegRequest {
  usrId: number;
  id: number;
  customerId: number;
  dtls: IndentRequest[];
}

export interface RegResponse {
  meta: Meta;
  data: {
    result: {
      id: number;
      err: number;
      msg: string;
      dtlErrMsgs: any[];
    };
  };
}

// for api/Warehouse/WarehouseSearch?search=%D8%A7&page=1&pageSize=30&lastId=0&CustomerTypeId=-1

export interface WarehouseSearchRequest {
  search: string;
  page: number;
  pageSize: number;
  lastId: number;
  CustomerTypeId: number;
  PartKey:number
}
export interface WarehouseSearchResult {
  id: number;
  text: string;
}

export interface WarehouseSearchResponse {
  meta: {
      errorCode: number;
      message: string | null;
      type: string;
  };
  data: {
      result: {
          total_count: number;
          err: number;
          msg: string | null;
          searchResults: WarehouseSearchResult[];
      };
  };
}