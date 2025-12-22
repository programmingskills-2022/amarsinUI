//http://apitest.dotis.ir/api/ProductPerm/productPerm?Id=0&yearId=15&systemId=4&State=0&PageNumber=1&SrchId=-1&SrchAccepted=-1&SortId=0&SortDate=0&SortTime=0&SortDsc=0&SortAccepted=0&SortUsrName=0&SortStep=0
import { Meta, UpdateResult } from "./general";
import {
  ProductItem,
  ProductOperation,
  ProductOperationRequest,
  SaveRequest,
} from "./productOperation";

export interface ProductPermRequest extends ProductOperationRequest {
  yearId: number;
  systemId: number;
  systemIdDtl: number;
  yearIdDtl: number;
  srchAccepted:number;
  sortAccepted:number;  
}

export interface ProductPerm extends ProductOperation {
  productPermId: number;
}

interface ProductPermDtl extends ProductItem {
  ordr: number;
  productCode: string;
  np: boolean;
}

interface Result {
  err: number;
  msg: string | null;
  total_count: number;
  productPerms: ProductPerm[];
  productPermDtls: ProductPermDtl[];
}

interface Data {
  result: Result;
}

interface ProductPermResponse {
  meta: Meta;
  data: Data;
}
//http://apitest.dotis.ir/api/ProductPerm/productList
interface ProductPermListRequest {
  id: number;
  productId: number;
  systemId: number;
  yearId: number;
  brands: number[];
}

type ProductPermListResponse = {
  meta: Meta;
  data: DataProductPermList;
};

type DataProductPermList = {
  result: ProductPermListItem[];
};

interface ProductPermListItem extends ProductItem {
  np: boolean; //primary value
  npo: boolean;
  npCk: JSX.Element | null;
  npoCk: JSX.Element | null;
}

export interface ProductPermListItemTable extends ProductPermListItem {
  isDeleted: boolean;
}

export interface ProductPermListItemTable2 extends ProductPermListItemTable {
  index: number;
}
//http://apitest.dotis.ir/api/ProductPerm/dtlHistory?PId=589
export interface ProductPermDtlHistoryResponse {
  meta: Meta;
  data: DataProductPermDtlHistory;
}
export interface DataProductPermDtlHistory {
  result: ProductPermDtlHistory[];
}

export interface ProductPermDtlHistory {
  id: number;
  date: string;
  accepted: boolean;
  np: boolean;
  dtlDsc: string;
}

//http://apitest.dotis.ir/api/ProductPerm/save
export interface ProductPermSaveRequest extends SaveRequest {
  systemId: number;
  yearId: number;
  dtls: Dtl[];
}

// Detail item
export interface Dtl {
  id: number;
  pId: number;
  np: boolean;
  dtlDsc: string;
  deleted: boolean;
}

type ProductPermSaveResponse = {
  meta: Meta;
  data: { result: UpdateResult };
};

//http://apitest.dotis.ir/api/ProductPerm/doFirstFlow?ChartId=1&Acc_System=1&Acc_Year=15&Id=123123&Dsc=
interface ProductPermDoFirstFlowRequest {
  chartId: number;
  systemId: number;
  yearId: number;
  id: number;
  dsc: string;
}

/*interface ResultProductPermDoFirstFlow {
  systemId: number;
  id: number;
  err: number;
  msg: string;
  hasFlow: boolean;
}*/

interface DataProductPermDoFirstFlow {
  result: UpdateResult;
}

interface ProductPermDoFirstFlowResponse {
  meta: Meta;
  data: DataProductPermDoFirstFlow;
}
//http://apitest.dotis.ir/api/ProductPerm/del?Id=1637
interface ResultProductPermDel {
  systemId: number;
  id: number;
  err: number;
  msg: string;
  hasFlow: boolean;
}

interface DataProductPermDel {
  result: ResultProductPermDel;
}

interface ProductPermDelResponse {
  meta: Meta;
  data: DataProductPermDel;
}
export interface ProductPermState extends ProductPermRequest {
  pId: number; //for productPerm/dtlHistory
  pIdTrigger: number; //for productPerm/dtlHistory
  productPermDoFirstFlowResponse: ProductPermDoFirstFlowResponse; //for productPerm/doFirstFlow
  setProductPermDoFirstFlowResponse: (
    productPermDoFirstFlowResponse: ProductPermDoFirstFlowResponse
  ) => void; //for productPerm/doFirstFlow
  productPermDelResponse: ProductPermDelResponse; //for productPerm/del
  setProductPermDelResponse: (
    productPermDelResponse: ProductPermDelResponse
  ) => void; //for productPerm/del
  productPermSaveResponse: ProductPermSaveResponse; //for productPerm/save
  setProductPermSaveResponse: (
    productPermSaveResponse: ProductPermSaveResponse
  ) => void; //for productPerm/save
  productPermDtlHistoryResponse: ProductPermDtlHistoryResponse; //for productPerm/dtlHistory
  setProductPermDtlHistoryResponse: (
    productPermDtlHistoryResponse: ProductPermDtlHistoryResponse
  ) => void; //for productPerm/dtlHistory
  productPermListResponse: ProductPermListResponse; //for productPerm/productList
  setProductPermListResponse: (
    productPermListResponse: ProductPermListResponse
  ) => void; //for productPerm/productList
  setField: (field: string, value: any) => void;
  productPermResponse: ProductPermResponse; //for productPerm/productPerm
  setProductPermResponse: (productPermResponse: ProductPermResponse) => void; //for productPerm/productPerm
}
