import { Meta } from "./general";

//http://apitest.dotis.ir/api/ProductOffer/ProductOffer?Id=1363&Acc_Year=15&Acc_System=4&RegFDate=1404%2F01%2F01&RegTDate=1404%2F05%2F01&FDate=1404%2F01%2F01&TDate=1404%2F05%2F01&State=0

export interface ProductOfferRequest {
  id: number;
  acc_Year: number;
  acc_System: number;
  state: number;
  regFDate: string;
  regTDate: string;
  fDate: string;
  tDate: string;
}

export interface ProductOffer {
  id: number;
  ordr: number;
  productOfferId: number;
  dat: string;
  tim: string;
  dsc: string;
  accepted: boolean;
  usrName: string;
  flwId: number;
  flowMapName: string;
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
  index:string;
  id:number;
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
  id:number;
  bName: string;
  pId: number;
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

export interface ProductOfferProductTable2 extends ProductOfferProductTable{
  index: number;
}

interface ShowProductListResult {
  err: number;
  msg: string;
  productOfferProducts: ProductOfferProduct[];
}

interface ShowProductListData {
  result: ShowProductListResult;
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
export interface ProductOfferSaveRequest {
  chartId: number;
  id: number;
  acc_System: number;
  acc_Year: number;
  dat: string;
  tim: string;
  dsc: string;
  saveAndSend: boolean;
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
    result: {
      systemId: number;
      id: number;
      err: number;
      msg: string;
      hasFlow: boolean;
    };
  };
};
export interface ProductOfferState extends ProductOfferRequest,ShowProductListRequest {
  pId: number; //for product offer dtl history request
  productOfferDtlHistoryResponse: ProductOfferDtlHistoryResponse; //for product offer dtl history
  showProductListResponse: ShowProductListResponse; //for show product list
  productOfferResponse: ProductOfferResponse; //for product offer
  productOfferSaveResponse: ProductOfferSaveResponse; //for product offer save
  setField: (field: string, value: any) => void;
  setProductOfferResponse: (productOfferResponse: ProductOfferResponse) => void;
  setShowProductListResponse: (showProductListResponse: ShowProductListResponse) => void;
  setProductOfferDtlHistoryResponse: (productOfferDtlHistoryResponse: ProductOfferDtlHistoryResponse) => void;
  setProductOfferSaveResponse: (productOfferSaveResponse: ProductOfferSaveResponse) => void;
}
