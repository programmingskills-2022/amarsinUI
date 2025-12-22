import { Meta, UpdateResult } from "./general";
import {
  ProductOperation,
  ProductOperationRequest,
  SaveRequest,
} from "./productOperation";

//http://apitest.dotis.ir/api/ProductOffer/ProductOffer?Id=1363&Acc_Year=15&Acc_System=4&RegFDate=1404%2F01%2F01&RegTDate=1404%2F05%2F01&FDate=1404%2F01%2F01&TDate=1404%2F05%2F01&State=0

export interface ProductOfferRequest extends ProductOperationRequest {
  acc_Year: number;
  acc_System: number;
  acc_YearDtl:number;
  acc_SystemDtl:number;
  srchAccepted:number;
  sortAccepted:number;
}

export interface ProductOffer extends ProductOperation {
  productOfferId: number;
}

interface ProductOfferDtl {
  id: number;
  ordr: number;
  pId: number;
  bName: string;
  productCode: string;
  product: string;
  lastDate: string;
  s1NO: number;
  s1DO: number;
  s2NO: number;
  s2DO: number;
  s3NO: number;
  s3DO: number;
  s4NO: number;
  s4DO: number;
  s5NO: number;
  s1N: number;
  s1D: number;
  s2N: number;
  s2D: number;
  s3N: number;
  s3D: number;
  s4N: number;
  s4D: number;
  s5N: number;
  dtlDsc: string;
  deleted: boolean;
  no: boolean;
}

interface ProductOfferDtlTable {
  index: string;
  id: number;
  bName: string;
  pId: number;
  product: string;
  lastDate: string;
  s1O: string;
  s2O: string;
  s3O: string;
  s4O: string;
  dtlDsc: string;
  no: JSX.Element | null;
}

interface Result {
  err: number;
  msg: string | null;
  total_count: number;
  productOffers: ProductOffer[];
  productOfferDtls: ProductOfferDtl[];
}

interface Data {
  result: Result;
}

interface ProductOfferResponse {
  meta: Meta;
  data: Data;
}

//http://apitest.dotis.ir/api/ProductOffer/ShowProductList
interface ShowProductListRequest {
  id: number;
  productId: number;
  acc_Year: number;
  brands: string[];
}

interface ProductOfferProduct {
  id: number;
  ordr: number;
  pId: number;
  bName: string;
  productCode: string;
  product: string;
  lastDate: string;
  s1NO: number;
  s1DO: number;
  s2NO: number;
  s2DO: number;
  s3NO: number;
  s3DO: number;
  s4NO: number;
  s4DO: number;
  s5NO: number;
  s5DO: number;
  s1N: number;
  s1D: number;
  s2N: number;
  s2D: number;
  s3N: number;
  s3D: number;
  s4N: number;
  s4D: number;
  s5N: number;
  s5D: number;
  dtlDsc: string;
  deleted: boolean;
}

export interface ProductOfferProductTable {
  //index: number;
  id: number;
  bName: string;
  pId: number;
  productCode: string;
  product: string;
  lastDate: string;
  s1O: string;
  s2O: string;
  s3O: string;
  s4O: string;
  s1N: string;
  s1D: string;
  s2N: string;
  s2D: string;
  s3N: string;
  s3D: string;
  s4N: string;
  s4D: string;
  no: boolean;
  dtlDsc: string;
  deleted: boolean;
  isDeleted: boolean;
}

export interface ProductOfferProductTable2 extends ProductOfferProductTable {
  index: number;
}

interface ShowProductListData {
  result: ProductOfferProduct[];
}

interface ShowProductListResponse {
  meta: Meta;
  data: ShowProductListData;
}
//http://apitest.dotis.ir/api/ProductOffer/PrductOfferDtlHistory?PId=12483
interface ProductOfferDtlHistoryResponse {
  meta: Meta;
  data: ProductOfferDtlHistoryData;
}

interface ProductOfferDtlHistoryData {
  result: ProductOfferDtlHistory[];
}

interface ProductOfferDtlHistory {
  id: number;
  date: string;
  accepted: boolean;
  s1NO: number;
  s1DO: number;
  s2NO: number;
  s2DO: number;
  s3NO: number;
  s3DO: number;
  s4NO: number;
  s4DO: number;
  s5NO: number;
  s5DO: number;
  no: boolean;
  dtlDsc: string;
}
//http://apitest.dotis.ir/api/ProductOffer/ProductOfferSave
export interface ProductOfferSaveRequest extends SaveRequest {
  acc_System: number;
  acc_Year: number;
  dtls: Dtl[];
}

// Detail item
export interface Dtl {
  id: number;
  pId: number;
  s1: string;
  s2: string;
  s3: string;
  s4: string;
  no: boolean;
  dtlDsc: string;
  deleted: boolean;
}

type ProductOfferSaveResponse = {
  meta: Meta;
  data: {
    result: UpdateResult;
  };
};

//http://apitest.dotis.ir/api/ProductOffer/ProductOfferDoFirstFlow?ChartId=1&Acc_System=1&Acc_Year=15&Id=123123
interface ProductOfferDoFirstFlowRequest {
  chartIdProductOfferDoFirstFlow: number;
  acc_SystemProductOfferDoFirstFlow: number;
  acc_YearProductOfferDoFirstFlow: number;
  idProductOfferDoFirstFlow: number;
  dscProductOfferDoFirstFlow: string;
}

interface FormAfterClick {
  id: number;
  title: string | null;
  viewPath: string | null;
}

interface ResultProductOfferDoFirstFlow {
  id: number;
  err: number;
  msg: string;
  formAfterClick: FormAfterClick;
}

interface DataProductOfferDoFirstFlow {
  result: ResultProductOfferDoFirstFlow;
}

interface ProductOfferDoFirstFlowResponse {
  meta: Meta;
  data: DataProductOfferDoFirstFlow;
}
//http://apitest.dotis.ir/api/ProductOffer/Del?Id=1637
/*  interface ResultProductOfferDel {
    systemId: number;
    id: number;
    err: number;
    msg: string;
    hasFlow: boolean;
  }*/

interface DataProductOfferDel {
  result: UpdateResult;
}

interface ProductOfferDelResponse {
  meta: Meta;
  data: DataProductOfferDel;
}

export interface ProductOfferState
  extends ProductOfferRequest,
    ShowProductListRequest,
    ProductOfferDoFirstFlowRequest {
  pId: number; //for product offer dtl history request
  pIdTrigger: number; //for product offer dtl history request
  productOfferDtlHistoryResponse: ProductOfferDtlHistoryResponse; //for product offer dtl history
  showProductListResponse: ShowProductListResponse; //for show product list
  productOfferResponse: ProductOfferResponse; //for product offer
  productOfferSaveResponse: ProductOfferSaveResponse; //for product offer save
  productOfferDoFirstFlowResponse: ProductOfferDoFirstFlowResponse; //for product offer do first flow
  productOfferDelResponse: ProductOfferDelResponse; //for product offer del
  setField: (field: string, value: any) => void;
  setProductOfferResponse: (productOfferResponse: ProductOfferResponse) => void;
  setShowProductListResponse: (
    showProductListResponse: ShowProductListResponse
  ) => void;
  setProductOfferDtlHistoryResponse: (
    productOfferDtlHistoryResponse: ProductOfferDtlHistoryResponse
  ) => void;
  setProductOfferSaveResponse: (
    productOfferSaveResponse: ProductOfferSaveResponse
  ) => void;
  setProductOfferDoFirstFlowResponse: (
    productOfferDoFirstFlowResponse: ProductOfferDoFirstFlowResponse
  ) => void;
  setProductOfferDelResponse: (
    productOfferDelResponse: ProductOfferDelResponse
  ) => void;
}
