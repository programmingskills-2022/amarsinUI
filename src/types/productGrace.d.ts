import { ProductItem, ProductOperation, ProductOperationRequest, SaveRequest } from "./productOperation";

//http://apitest.dotis.ir/api/ProductGrace?YearId=15&SystemId=4&State=0&PageNumber=1&SrchId=-1&SrchAccepted=-1&SortId=0&SortDate=0&SortTime=0&SortDsc=0&SortAccepted=0&SortUsrName=0&SortStep=0
export interface ProductGraceRequest extends ProductOperationRequest {
    yearId: number;
    systemId: number;
    systemIdDtl: number;
    yearIdDtl: number;
    srchAccepted:number;
    sortAccepted:number;
  }
  
  export interface ProductGrace extends ProductOperation {
    //productPermId: number;
  }
 
  interface ProductGraceDtl extends ProductItem {
    ordr: number;
    productCode: string;
    gd: number;
    gdo: number;
    sc: number;
    sco: number;
    cc: number;
    cco: number;
    ec: number;
    eco: number;  
  }
  
  interface Result {
    err: number;
    msg: string | null;
    total_count: number;
    productGraces: ProductGrace[];
    productGraceDtls: ProductGraceDtl[];
  }
  
  interface Data {
    result: Result;
  }
  
  interface ProductGraceResponse {
    meta: Meta;
    data: Data;
  }
  //http://apitest.dotis.ir/api/ProductGrace/showProductList
//ShowProductListRequest is in productOperation.d.ts
  
  type ProductGraceListResponse = {
    meta: Meta;
    data: DataProductGraceList;
  };
  
  type DataProductGraceList = {
    result: ResultProductGraceList;
  };

  type ResultProductGraceList ={
    err:number,
    msg:string,
    productGraceProducts:ProductGraceListItem[]
  }
  
  interface ProductGraceListItem extends ProductItem {
    gdo: number;
    gd: number;
    sc: number;
    sco: number;
    cc: number;
    cco: number;
    ec: number;
    eco: number;
  }
  
  export interface ProductGraceListItemTable extends ProductGraceListItem {
    isDeleted: boolean;
  } 
  
  export interface ProductGraceListItemTable2 extends ProductGraceListItemTable {
    index: number;
  }

  //http://apitest.dotis.ir/api/ProductGrace/dtlHistory?PId=589
  export interface ProductGraceDtlHistoryResponse {
    meta: Meta;
    data: DataProductGraceDtlHistory;
  }
  export interface DataProductGraceDtlHistory {
    result: ProductGraceDtlHistory[];
  }
  
  export interface ProductGraceDtlHistory {
    id: number;
    date: string;
    accepted: boolean;
    graceDays: number;
    salesCommission: number;
    collectionCommission: number;
    extraCommission: number;
    dtlDsc: string;
  }
  
  //http://apitest.dotis.ir/api/ProductGrace/save
  export interface ProductGraceSaveRequest extends SaveRequest {
    acc_Year: number;
    acc_System: number;
    dtls: Dtl[];
  }
  
  // Detail item
  export interface Dtl {
    id: number;
    pId: number;
    gd: number;
    sc: number;
    cc: number;
    ec: number;
    dtlDsc: string;
    deleted: boolean;
  }
  
  type ProductGraceSaveResponse = {
    meta: Meta;
    data: {
      result: {
        acc_System: number;
        id: number;
        err: number;
        msg: string;
        hasFlow: boolean;
      };
    };
  };
  
  //http://apitest.dotis.ir/api/ProductGrace/doFirstFlow?ChartId=1&Acc_System=1&Acc_Year=15&Id=123123&Dsc=   
  interface ProductGraceDoFirstFlowRequest {
    acc_System: number;
    acc_Year: number;
    chartId: number;
    id: number;
    dsc: string;
  }
  
  interface ResultProductGraceDoFirstFlow {
    acc_System: number;
    id: number;
    err: number;
    msg: string;
    hasFlow: boolean;
  }
  
  interface DataProductGraceDoFirstFlow {
    result: ResultProductGraceDoFirstFlow;
  }
  
  interface ProductGraceDoFirstFlowResponse {
    meta: Meta;
    data: DataProductGraceDoFirstFlow;
  }
  //http://apitest.dotis.ir/api/ProductGrace/del?Id=1637
  interface ResultProductGraceDel {
    acc_System: number;
    id: number;
    err: number;
    msg: string;
    hasFlow: boolean;
  }
  
  interface DataProductGraceDel {
    result: ResultProductGraceDel;
  }
  
  interface ProductGraceDelResponse {
    meta: Meta;
    data: DataProductGraceDel;
  }
  export interface ProductGraceState extends ProductGraceRequest {
    idTrigger:number; //for productGrace?id=
    pId: number; //for productGrace/dtlHistory
    pIdTrigger: number; //for productGrace/dtlHistory
    productGraceDoFirstFlowResponse: ProductGraceDoFirstFlowResponse; //for productGrace/doFirstFlow
    setProductGraceDoFirstFlowResponse: (
      productGraceDoFirstFlowResponse: ProductGraceDoFirstFlowResponse
    ) => void; //for productGrace/doFirstFlow
    productGraceDelResponse: ProductGraceDelResponse; //for productPerm/del
    setProductGraceDelResponse: (
      productGraceDelResponse: ProductGraceDelResponse
    ) => void; //for productGrace/del
    productGraceSaveResponse: ProductGraceSaveResponse; //for productGrace/save
    setProductGraceSaveResponse: (
      productGraceSaveResponse: ProductGraceSaveResponse
    ) => void; //for productGrace/save
    productGraceDtlHistoryResponse: ProductGraceDtlHistoryResponse; //for productPerm/dtlHistory
    setProductGraceDtlHistoryResponse: (
      productGraceDtlHistoryResponse: ProductGraceDtlHistoryResponse
    ) => void; //for productGrace/dtlHistory
    productGraceListResponse: ProductGraceListResponse; //for productGrace/productList
    setProductGraceListResponse: (
      productGraceListResponse: ProductGraceListResponse
    ) => void; //for productGrace/productList
    setField: (field: string, value: any) => void;
    productGraceResponse: ProductGraceResponse; //for productGrace/productGrace
    setProductGraceResponse: (productGraceResponse: ProductGraceResponse) => void; //for productGrace/productGrace
  }
  