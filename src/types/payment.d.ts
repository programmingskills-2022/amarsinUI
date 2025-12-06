import { Meta } from "react-table";
import { SearchItem } from "./general";

//http://apitest.dotis.ir/api/Payment/KindSearch?search=%D8%B3&page=1&lastId=0
interface PaymentKindSearchRequest {
  paymentKindSearch: string;
  paymentKindSearchPage: number;
  paymentKindSearchLastId: number;
}
interface PaymentKindSearchResponse {
  meta: Meta;
  data: PaymentKindSearchData;
}
interface PaymentKindSearchData {
  total_count: number;
  result: SearchItem[];
}

//http://apitest.dotis.ir/api/Payment/posList
interface PosListItem {
  id: number;
  name: string;
  deviceKind: number;
  code: number;
}

interface DataPosList {
  result: PosListItem[];
}
interface PosListResponse {
  meta: Meta;
  data: DataPosList;
}
///api/Payment/chequeBookGetById?id=190
interface ResultChequeBookGetById {
  fixChqNo: string;
  chequeBookDtlId: number;
  cheqNo: string;
  chqBkNo: string;
  bnkId: number;
  bnk: string;
  brnchId: number;
  brnch: string;
  sheba: string;
}

interface DataChequeBookGetById {
  result: ResultChequeBookGetById;
}

interface ChequeBookGetByIdResponse {
  meta: Meta;
  data: DataChequeBookGetById;
}

export interface PaymentState extends PaymentKindSearchRequest {
  posListResponse: PosListResponse; // api/Payment/posList
  checkBookId:number
  posSystemId:number
  chequeBookGetByIdResponse:ChequeBookGetByIdResponse; //api/Payment/chequeBookGetById?id=190
  paymentKindSearchResponse: PaymentKindSearchResponse;
  setField: (field: string, value: any) => void;
  setPaymentKindSearchResponse: (
    paymentKindSearchResponse: PaymentKindSearchResponse
  ) => void;
  setPosListResponse: (posListResponse: PosListResponse) => void;
  setChequeBookGetByIdResponse:(chequeBookGetByIdResponse:ChequeBookGetByIdResponse)=>void //api/Payment/chequeBookGetById?id=190
}
