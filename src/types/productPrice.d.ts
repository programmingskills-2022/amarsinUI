import { UpdateResult } from "./general";
import {
  ProductItem,
  ProductOperation,
  ProductOperationRequest,
  SaveRequest,
} from "./productOperation";

//http://apitest.dotis.ir/api/ProductPrice?YearId=15&SystemId=4&State=0&PageNumber=1&SrchId=-1&SrchAccepted=-1&SortId=0&SortDate=0&SortTime=0&SortDsc=0&SortAccepted=0&SortUsrName=0&SortStep=0
export interface ProductPriceRequest extends ProductOperationRequest {
  yearId: number;
  systemId: number;
  systemIdDtl: number;
  yearIdDtl: number;
  srchAccepted:number;
  sortAccepted:number;
}

interface ProductPrice extends ProductOperation {
  guid: string;
  payDuration: number;
  productPriceId: number;
  srName: string;
  cId: number;
  salesPriceId: number;
  salesPriceTitle: string;
  saleFDate: string;
  saleTDate: string;
  attachCount: number;
}

interface ProductPriceDtl extends ProductItem {
  ordr: number;
  productCode: string;
  lastBuyPrice: number;
  tax: number;
  p1O: number;
  p2O: number;
  p3O: number;
  p4O: number;
  p5O: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
}

interface Result {
  total_count: number;
  productPrices: ProductPrice[];
  productPriceDtls: ProductPriceDtl[];
}

interface Data {
  result: Result;
}

interface ProductPriceResponse {
  meta: Meta;
  data: Data;
}
//http://apitest.dotis.ir/api/ProductPrice/showProductList
//ShowProductListRequest is in productOperation.d.ts

type ProductPriceListResponse = {
  meta: Meta;
  data: DataProductOldPriceList;   
};

type DataProductOldPriceListItem = {
  result: ProductOldPriceListItem[];
};

type DataProductOldPriceList = {
  result: ProductOldPriceListItem[];
};

interface ProductOldPriceListItem extends ProductItem {
  lastBuyPrice: number;
  tax: number;
  p1O: number;
  p2O: number;
  p3O: number;
  p4O: number;
  p5O: number;
}
interface ProductPriceListItem extends ProductItem {
  lastBuyPrice: number;
  tax: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
}

export interface ProductPriceListItemTable extends ProductPriceListItem {
  isDeleted: boolean;
}

export interface ProductPriceListItemTable2 extends ProductPriceListItemTable {
  index: number;
}

//http://apitest.dotis.ir/api/ProductPrice/history/12063
export interface ProductPriceDtlHistoryResponse {
  meta: Meta;
  data: DataProductPriceDtlHistory;
}
export interface DataProductPriceDtlHistory {
  result: ProductPriceDtlHistory[];
}

export interface ProductPriceDtlHistory {
  id: number;
  accepted: boolean;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  date: string;
  dtlDsc: string;
}

//http://apitest.dotis.ir/api/ProductPrice/save
export interface ProductPriceSaveRequest extends SaveRequest {
  guid: string;
  usrId: number;
  acc_Year: number;
  acc_System: number;
  skipWarning: boolean;
  dtls: Dtl[];
}

// Detail item
export interface Dtl {
  ordr: number;
  id: number;
  pId: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  dtlDsc: string;
  deleted: boolean;
}

/*interface DtlErrMsgs {
  systemId: number;
  id: number;
  err: number;
  msg: string;
  hasFlow: boolean;
}*/

type ProductPriceSaveResponse = {
  meta: Meta;
  data: {
    result: {
      id: number;
      err: number;
      msg: string;
      dtlErrMsgs: UpdateResult[];
    };
  };
};

//http://apitest.dotis.ir/api/ProductPrice/doFirstFlow?ChartId=1&Acc_System=1&Acc_Year=15&Id=123123&Dsc=
interface ProductPriceDoFirstFlowRequest {
  acc_System: number;
  acc_Year: number;
  id: number;
  dsc: string;
}

/*interface ResultProductPriceDoFirstFlow {
  systemId: number;
  id: number;
  err: number;
  msg: string;
  hasFlow: boolean;
}*/

interface DataProductPriceDoFirstFlow {
  result: UpdateResult;
}

interface ProductPriceDoFirstFlowResponse {
  meta: Meta;
  data: DataProductPriceDoFirstFlow;
}
//http://apitest.dotis.ir/api/ProductPrice/{id}
interface ResultProductPriceDel {
  systemId: number;
  id: number;
  err: number;
  msg: string;
  hasFlow: boolean;
}

interface DataProductPriceDel {
  result: ResultProductPriceDel;
}

interface ProductPriceDelResponse {
  meta: Meta;
  data: DataProductPriceDel;
}
export interface ProductPriceState extends ProductPriceRequest {
  pId: number; //for productPrice/dtlHistory
  pIdTrigger: number; //for productPrice/dtlHistory
  productPriceDoFirstFlowResponse: ProductPriceDoFirstFlowResponse; //for productPrice/doFirstFlow
  setProductPriceDoFirstFlowResponse: (
    productPriceDoFirstFlowResponse: ProductPriceDoFirstFlowResponse
  ) => void; //for productPrice/doFirstFlow
  productPriceDelResponse: ProductPriceDelResponse; //for productPrice/del
  setProductPriceDelResponse: (
    productPriceDelResponse: ProductPriceDelResponse
  ) => void; //for productPrice/del
  productPriceSaveResponse: ProductPriceSaveResponse; //for productPrice/save
  setProductPriceSaveResponse: (
    productPriceSaveResponse: ProductPriceSaveResponse
  ) => void; //for productPrice/save
  productPriceDtlHistoryResponse: ProductPriceDtlHistoryResponse; //for productPrice/dtlHistory
  setProductPriceDtlHistoryResponse: (
    productPriceDtlHistoryResponse: ProductPriceDtlHistoryResponse
  ) => void; //for productPrice/dtlHistory
  productPriceListResponse: ProductPriceListResponse; //for productPrice/productList
  setProductPriceListResponse: (
    productPriceListResponse: ProductPriceListResponse
  ) => void; //for productPrice/productList
  setField: (field: string, value: any) => void;
  productPriceResponse: ProductPriceResponse; //for productPrice/productPrice
  setProductPriceResponse: (productPriceResponse: ProductPriceResponse) => void; //for productPrice/productPrice
}
