// for http://apitest.dotis.ir/api/PayRequest/PayRequest?Id=1513&Acc_Year=15&Acc_System=4&State=0
import { RpCustomerBillsResponse, RpCustomerBillsRequest } from './sales';
interface Meta {
  errorCode: number;
  message: null | string;
  type: string;
}

interface PayRequest {
  id: number;
  guid: string;
  systemId: number;
  systemTitle: string;
  yearId: number;
  yearName: string;
  ordr: number;
  dat: string;
  tim: string;
  fDate: string;
  tDate: string;
  dueDate: string;
  settleAmnt: string;
  providerAmnt: string;
  customerId: number;
  srName: string;
  amount: string;
  dsc: string;
  accepted: boolean;
  usrName: string;
  flwId: number;
  flowMapName: string;
  attachCount: number;
  rem: number;
}

interface PayRequestDtl {
  id: number;
  chequeBookId: number;
  chequeBook: string;
  chequeBookDtlId: number;
  chequeBookDtl: string;
  prsn: string;
  chqNo: null | string;
  chqBkNo: string;
  dat: string;
  amount: string;
  dtlDsc: string;
  del: boolean;
}
//use in PayRequestActiveTab2
interface PayRequestDtlTable extends PayRequestDtl {
  index: number;
  checked: boolean;
}

interface InvcsItem {
  payRequestDtlId: number;
  paymentRow: number;
  id: number;
  dcrmntPrcnt: number;
  dcrmnt: number;
  settle: number;
}

interface Result {
  err: number;
  msg: null | string;
  payRequests: PayRequest[];
  payRequestDtls: PayRequestDtl[];
  invcs: InvcsItem[];
}

interface Data {
  result: Result;
}

interface PayRequestResponse {
  meta: Meta;
  data: Data;
}

interface PayRequestRequest {
  id: number;
  acc_year: number;
  acc_system: number;
}
//for http://apitest.dotis.ir/api/PayRequest/PayRequestInvoices?PayRequestId=1513&SystemId=4&YearId=15&CustomerId=787

interface PayRequestInvoicesResponse {
  meta: Meta;
  data: PayRequestInvoicesData;
}

interface PayRequestInvoicesData {
  result: PayRequestInvoicesResult;
}

interface PayRequestInvoicesResult {
  err: number;
  msg: string | null;
  invoices: PayRequestInvoices[];
}

interface PayRequestInvoices {
  id: number;
  sanadKind: number;
  kind: string;
  dat: string;
  factorNo: string;
  payDat: string;
  fact: number;
  dcrmnt: number;
  factNoDcrmnt: number;
  pls: number;
  mns: number;
  valueTax: number;
  pay: number;
  total: number;
  rem: number;
  checked: boolean;
}

interface PayRequestInvoicesTable extends PayRequestInvoices {
  index: number;
  settle: number;
  dcrmntPercent: number;  
}

//برای فاکتورهای تسویه نشده
interface PayRequestInvoiceIncludeChecks extends PayRequestInvoices {
  index: number;
  settle: number;
  dcrmntPercent: number;  
  invcs: InvcsItem[];
}
interface PayRequestInvoicesRequest {
  payRequestId: number;
  systemIdPayRequestInvoice: number;
  yearIdPayRequestInvoice: number;
  customerId: number;
}
//http://apitest.dotis.ir/api/Payment/chequeBookSearch?page=1&lastId=0&Acc_System=1
  interface ChequeBookSearchResult {
    id: number;
    text: string;
}

interface ChequeBookSearchData {
    result: {
        total_count: number;
        results: ChequeBookSearchResult[];
    };
}

interface ChequeBookSearchMeta {
    errorCode: number;
    message: string;
    type: string;
}

interface ChequeBookSearchResponse {
    meta: ChequeBookSearchMeta;
    data: ChequeBookSearchData;
}

interface ChequeBookSearchRequest {
  acc_systemChequeBookSearch:number;
  searchChequeBookSearch:string;
  pageChequeBookSearch:number
  lastIdChequeBookSearch:number
}

//http://apitest.dotis.ir/api/Payment/chequeBookDtlSearch?ChequeBookId=174&page=1&lastId=0
interface ChequeBookDtlSearchResult {
  id: number;
  text: string;
}
interface ChequeBookDtlSearchData {
  result: {
    total_count: number;
    results: ChequeBookDtlSearchResult[];
  };
}
interface ChequeBookDtlSearchMeta {
  errorCode: number;
  message: string;
  type: string;
}
interface ChequeBookDtlSearchResponse {
  meta: ChequeBookDtlSearchMeta;
  data: ChequeBookDtlSearchData;
}
interface ChequeBookDtlSearchRequest {
  searchChequeBookDtlSearch:string;
  chequeBookIdChequeBookDtlSearch: number;
  pageChequeBookDtlSearch: number;
  lastIdChequeBookDtlSearch: number;
}

//http://apitest.dotis.ir/api/Payment/chequeBookDtlById?ChequeBookDtlId=11249
interface ChequeBookDtlByIdRequest {
  chequeBookDtlId: number;
}

interface ChequeBookDtlByIdResponse {
  meta: {
    errorCode: number;
    message: string;
    type: string; 
  };
  data: {
    result: {
      err: number;
      msg: string;
      checkBookDtl: {
        id: number;
        chqBkNo: string;
      };
    };
  };
};
//http://apitest.dotis.ir/api/PayRequest/PayRequestSave
interface PayRequestSaveDetail {
  ordr: number;
  id: number;
  chequeBookId: number;
  chequeBookDtlId: number;
  prsn: string;
  chqNo: string;
  chqBkNo: string;
  dat: string;
  amount: string;
  dtlDsc: string;
  deleted: boolean;
}

interface PayRequestSaveInvoice {
  payRequestDtlId: number;
  paymentRow: number;
  id: number;
  dcrmntPrcnt: number;
  dcrmnt: number;
  settle: number;
}

interface PayRequestSaveRequest {
  guid: string;
  usrId: number;
  id: number;
  acc_System: number;
  acc_Year: number;
  customerId: number;
  dat: string;
  tim: string;
  fDate: string;
  tDate: string;
  dueDate: string;
  settleAmnt: string;
  providerAmnt: string;
  dsc: string;
  dtls: PayRequestSaveDetail[];
  invcs: PayRequestSaveInvoice[];
}
interface PayRequestSaveResponse {
  meta: {
    errorCode: number;
    message: string;
    type: string;
  };
  data: {
    result: {
      id: number;
      err: number;
      msg: string;
      dtlErrMsgs: string[];
    };
  };
}
export interface PayRequestState
  extends PayRequestRequest,
    PayRequestInvoicesRequest,
    RpCustomerBillsRequest,ChequeBookSearchRequest,ChequeBookDtlSearchRequest,ChequeBookDtlByIdRequest  {
  payRequestResponse: PayRequestResponse;
  payRequestInvoicesResponse: PayRequestInvoicesResponse;
  rpCustomerBillsResponse: RpCustomerBillsResponse;//for SaleReport/RpCustomerBills 
  chequeBookSearchResponse:ChequeBookSearchResponse; // for Payment/chequeBookSearch
  chequeBookDtlSearchResponse:ChequeBookDtlSearchResponse; // for Payment/chequeBookDtlSearch
  chequeBookDtlByIdResponse:ChequeBookDtlByIdResponse; // for Payment/chequeBookDtlById
  payRequestSaveResponse:PayRequestSaveResponse; // for PayRequest/PayRequestSave
  setField: (field: string | number | symbol, value: any) => void;
  setPayRequestResponse: (payRequestResponse: PayRequestResponse) => void;
  setPayRequestInvoicesResponse: (
    payRequestInvoicesResponse: PayRequestInvoicesResponse
  ) => void;
  setRpCustomerBillsResponse: (rpCustomerBillsResponse: RpCustomerBillsResponse) => void;//for SaleReport/RpCustomerBills
  setChequeBookSearchResponse:(chequeBookSearchResponse)=>void//for Payment/chequeBookSearch
  setChequeBookDtlSearchResponse:(chequeBookDtlSearchResponse)=>void//for Payment/chequeBookDtlSearch
  setChequeBookDtlByIdResponse:(chequeBookDtlByIdResponse:ChequeBookDtlByIdResponse)=>void//for Payment/chequeBookDtlById
  setPayRequestSaveResponse:(payRequestSaveResponse:PayRequestSaveResponse)=>void//for PayRequest/PayRequestSave
}
