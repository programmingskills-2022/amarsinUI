import { Meta, SearchItem, UpdateResult } from "./general";
import { IndentDtlHistoryRequest } from "./product.d";
import { ProductOperationRequest } from "./productOperation";
/*export interface ProductSearchRequest {
  accYear: number;
  accSystem: number;
  search?: string;
  page: number;
}*/
//
export interface SalesPricesSearchRequest {
  salesPricesSearch: string;
  salesPricesSearchPage: number;
  lastId: number;
}
//for indent/showProductList
export interface IndentDtlHistoryRequest {
  pId: number;
  mrsId: number;
}

type Product = {
  pId: number;
  n: string;
  cP: number;
  sP: number;
  s: number;
};

interface SearchResults {
  total_count: number;
  searchResults: Product[];
}

interface Data {
  result: SearchResults;
}

type ProductSearchResponse = {
  meta: Meta;
  data: Data;
};

//SalesPrice
/*interface SalesPriceItem {
  id: number;
  text: string;
}*/

interface SalesPricesSearchResponse {
  total_count: number;
  err: number;
  msg: string | null;
  searchResults: SearchItem[];
}
//indent/showProductList
/*interface IndentProduct {
  id: number;
  bName: string;
  pId: number;
  product: string;
  companyStock: number;
  storeStock: number;
  cnt: number;
  offer: number;
  cost: number;
  tax: number;
  taxValue: number;
  sumCompanyCnt: number;
  sumStoreCnt: number;
  lbDate: string;
  total: number;
  dtlDsc: string;
}

interface DataIndentShowProductList {
  result: IndentProduct[];
}

interface IndentShowProductListResponse {
  meta: Meta;
  data: DataIndentShowProductList;
}

interface IndentShowProductListRequest {
  mrsId: number;
  productId: number;
  acc_Year: number;
  providers: number[];
  brands: number[];
  salesPriceId: number;
  saleFDate: string;
  saleTDate: string;
}
// for saveIndent
export interface Detail {
  id: number;
  cId: number;
  pId: number;
  cnt: string;
  offer: string;
  cost: string;
  dcrmntPrcnt: string;
  dcrmnt: string;
  taxValue: string;
  dtlDsc: string;
  deleted: boolean;
}

interface IndentSaveRequest {
  id: number;
  ordrId: number;
  mrsId: number;
  customerId: number;
  del: boolean;
  acc_System: number;
  acc_Year: number;
  payDuration: number;
  dat: string;
  tim: string;
  dsc: string;
  salesPriceId: number;
  saleFDate: string;
  saleTDate: string;
  dtls: Detail[];
}

interface IndentSaveResponse {
  meta: Meta;
  data: { result: UpdateResult };
}

//for Indent/dtlHidtory

type IndentDtlHistory = {
  id: number;
  dat: string;
  cnt: number;
  offer: number;
  taxValue: number;
  dcrmnt: number;
  total: number;
  dtlDsc: string;
  fmName: string;
  fDsc: string;
};

type IndentDtlHistoryResponse = {
  meta: {
    errorCode: number;
    message: string;
    type: string;
  };
  data: {
    result: {
      err: number;
      msg: string;
      indentDtlHistories: IndentDtlHistory[];
    };
  };
};

//for /api/Indent/list?Id=6430&OrdrId=-1&MrsId=0&Acc_Year=0&Acc_System=0&State=0&ShowDeletedInentDtl=false
export interface IndentRequest extends ProductOperationRequest {
  ordrIdIndentRequest: number;
  mrsIdIndentRequest: number;
  acc_YearIndentRequest: number;
  acc_SystemIndentRequest: number;
  acc_YearIndentDtlRequest: number;
  acc_SystemIndentDtlRequest: number;
  state: number;
  showDeletedInentDtl: boolean;
  srchSRName: string;
  srchPayDuration: number;
  sortSRName: number;
  sortPayDuration: number;
}

interface Indent {
  id: number;
  ordr: number;
  ordrId: number;
  payDuration: number;
  mrsId: number;
  dat: string;
  tim: string;
  cId: number;
  srName: string;
  dsc: string;
  usrName: string;
  flwId: number;
  flowMapName: string;
  salesPriceId: number;
  salesPriceTitle: string;
  saleFDate: string;
  saleTDate: string;
}

interface IndentDtl {
  id: number;
  ordr: number;
  custId: number;
  customer: null | string;
  pId: number;
  bName: string;
  productCode: string;
  product: string;
  sumCompanyCnt: number;
  sumStoreCnt: number;
  lbDate: string;
  companyStock: number;
  storeStock: number;
  productExp: null | string;
  cnt: number;
  offer: number;
  cost: number;
  dcrmntPrcnt: number;
  dcrmnt: number;
  taxValue: number;
  total: number;
  dtlDsc: string;
  del: boolean;
  recieptId: number;
  recieptDsc: string;
}

interface ResultIndent {
  total_count: number;
  indents: Indent[];
  indentDtls: IndentDtl[];
}

interface DataIndent {
  result: ResultIndent;
}

interface IndentResponse {
  meta: Meta;
  data: DataIndent;
}

//for delete /api/Indent/6480
interface ResultIndentDel {
  result: UpdateResult;
}

export interface IndentDelResponse {
  meta: Meta;
  data: ResultIndentDel;
}

//for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
export interface IndentDoFirstFlowRequest {
  acc_System: number;
  acc_Year: number;
  mrsId: number;
  chartId: number;
  dsc: string;
}

export interface IndentDoFirstFlowResponse {
  meta: Meta;
  data: ResultIndentDoFirstFlow;
}

export interface ResultIndentDoFirstFlow {
  result: UpdateResult;
}*/

//http://apitest.dotis.ir/api/Product/productInstanceCatalog?Id=166717&UID=0&IRC=0
export interface ProductCatalogRequest {
  idProductCatalogRequest: number;
  uIDProductCatalogRequest: string;
  iRCProductCatalogRequest: string;
}

interface DataProductCatalog {
  manufacturing: string;
  expiration: string;
  batchCode: string;
  genericName: string;
  genericCode: string;
  uid: string;
  gtin: string;
  irc: string;
  licenseOwner: string;
  englishProductName: string;
  persianProductName: string;
  productCategory: string;
  productCategoryCode: number;
  packageCount: number;
  statusCode: number;
}

interface ResultProductCatalog {
  data: DataProductCatalog;
  statusCode: number;
  statusMessage: string;
  cupId: number;
  uid: string;
  irc: string;
  ttac: boolean;
  systemId: number;
}

interface DataProductCatalog2 {
  result: ResultProductCatalog;
}

export interface ProductCatalog {
  meta: Meta;
  data: DataProductCatalog2;
}

export interface ProductCatalogTable {
  rowId: string;
  title: string;
  systemInfo: string;
  samaneInfo: string;
}

export interface ProductState
  extends //ProductSearchRequest,
    //IndentShowProductListRequest,
    //IndentRequest,
    ProductCatalogRequest 
  {
  //for /api/Product/salesPricesSearch?page=1&lastId=0&Search=%D8%B3%D9%81
  salesPricesSearchSearch: string;
  salesPricesSearchPage: number;
  salesPricesSearchLastId: number;
  //pId: number;
  //mrsId: number;
  //mrsIdTrigger: number; // for history not caching
  //for /api/Product/search?search=search&page=1
  productSearchAccYear: number;
  productSearchAccSystem: number;
  productSearchSearch: string;
  productSearchPage: number;
  productSearchResponse: ProductSearchResponse;
  salesPricesSearchResponse: SalesPricesSearchResponse;
  productCatalog: ProductCatalog; // for api/Product/productInstanceCatalog?Id=166717&UID=0&IRC=0
  //indentShowProductListResponse: IndentShowProductListResponse;
  //indentSaveRequest: IndentSaveRequest;
  //indentSaveResponse: IndentSaveResponse;
  //indentDtlHistoryResponse: IndentDtlHistoryResponse;
  //indentResponse: IndentResponse;
  //indentDelResponse: IndentDelResponse; ///api/Indent/6480   //for delete
  //indentDoFirstFlowResponse: IndentDoFirstFlowResponse; //for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
  setField: (field: string, value: any) => void;
  setProductSearchResponse: (
    productSearchResponse: ProductSearchResponse
  ) => void;
  setSalesPricesSearchResponse: (
    salesPricesSearchResponse: SalesPricesSearchResponse
  ) => void;
  /*setIndentShowProductListResponse: (
    indentShowProductListResponse: IndentShowProductListResponse
  ) => void;
  setIndentSaveResponse: (indentSaveResponse: IndentSaveResponse) => void;
  setIndentDtlHistoryResponse: (
    indentDtlHistoryResponse: IndentDtlHistoryResponse
  ) => void;
  setIndentResponse: (indentResponse: IndentResponse) => void;
  setIndentDelResponse: (indentDelResponse: IndentDelResponse) => void;
  setIndentDoFirstFlowResponse: (
    indentDoFirstFlowResponse: IndentDoFirstFlowResponse
  ) => void;*/
  setProductCatalog: (productCatalog: ProductCatalog) => void; // for api/Product/productInstanceCatalog?Id=166717&UID=0&IRC=0
}
