// for http://apitest.dotis.ir/api/PayRequest?Id=1513&Acc_Year=15&Acc_System=4&State=0
import { ProductOperationRequest } from "./productOperation";
import { RpCustomerBillsResponse, RpCustomerBillsRequest } from "./sales";
import { Meta, SearchItem, UpdateResult } from "./general";
interface PayRequest {
  id: number;
  guid: string;
  systemTitle: string;
  systemId: number;
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
  payRequest: { payRequests: PayRequest[]; total_count: number };
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

export interface PayRequestRequest extends ProductOperationRequest {
  yearId: number;
  systemId: number;
  yearIdDtl: number;
  systemIdDtl: number;
  srchSrName: string;
  srchAmount: number;
  sortSrName: number;
  sortAmount: number;
  srchAccepted: number;
  sortAccepted: number;
}

//for http://apitest.dotis.ir/api/PayRequest/Invoices?PayRequestId=1513&SystemId=4&YearId=15&CustomerId=787
// change to below
//http://apitest.dotis.ir/api/PayRequest/DtlInvoices?PayRequestDtlId=3290
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
  payRequestDtlId: number;
  payed: number;
  settlement: number;
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
/*interface ChequeBookSearchResult {
  id: number;
  text: string;
}*/

interface ChequeBookSearchData {
  result: {
    total_count: number;
    results: SearchItem[];
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
  acc_systemChequeBookSearch: number;
  searchChequeBookSearch: string;
  pageChequeBookSearch: number;
  lastIdChequeBookSearch: number;
}

//http://apitest.dotis.ir/api/Payment/chequeBookDtlSearch?ChequeBookId=174&page=1&lastId=0
/*interface ChequeBookDtlSearchResult {
  id: number;
  text: string;
}*/
interface ChequeBookDtlSearchData {
  result: {
    total_count: number;
    results: SearchItem[];
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
  searchChequeBookDtlSearch: string;
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
}
//http://apitest.dotis.ir/api/PayRequest/save
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
  systemId: number;
  yearId: number;
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
//http://apitest.dotis.ir/api/PayRequest/doFirstFlow?ChartId=1&Acc_System=1&Acc_Year=15&Id=123123&Dsc=
interface PayRequestDoFirstFlowRequest {
  chartId: number;
  systemId: number;
  yearId: number;
  id: number;
  dsc: string;
  flowNo: number;
  wFMS_FlowMapId: number;
}

interface DataPayRequestDoFirstFlow {
  result: UpdateResult;
}

interface PayRequestDoFirstFlowResponse {
  meta: Meta;
  data: DataPayRequestDoFirstFlow;
}
//http://apitest.dotis.ir/api/PayRequest/del?Id=1637
interface ResultPayRequestDel {
  systemId: number;
  id: number;
  err: number;
  msg: string;
  hasFlow: boolean;
}

interface DataPayRequestDel {
  result: ResultPayRequestDel;
}

interface PayRequestDelResponse {
  meta: Meta;
  data: DataPayRequestDel;
}
//////////////////////////////////////////////////////
//http://apitest.dotis.ir/api/PayRequest/DtlRemoveInvoice?PayRequestDtlId=3288&InvoiceId=920018
//http://apitest.dotis.ir/api/PayRequest/DtlAddInvoice?PayRequestDtlId=3288&InvoiceId=920018&Settlement=12000000
interface PayRequestDtlRemoveInvoiceRequest {
  payRequestDtlId: number;
  invoiceId: number;
}
interface PayRequestDtlAddInvoiceRequest extends PayRequestDtlRemoveInvoiceRequest {
  settlement: number;
}
interface PayRequestDtlAddRemoveInvoiceResponse {
  meta: Meta;
  data: { result: number };
}
//////////////////////////////////////////////////////

export interface PayRequestState
  extends
    PayRequestRequest,
    PayRequestInvoicesRequest,
    RpCustomerBillsRequest,
    ChequeBookSearchRequest,
    ChequeBookDtlSearchRequest,
    ChequeBookDtlByIdRequest {
  payRequestResponse: PayRequestResponse;
  payRequestDtlId: number; //for PayRequest/DtlInvoices?PayRequestDtlId=3290
  payRequestDtlIdTrigger: number; //for PayRequest/DtlInvoices?PayRequestDtlId=3290
  payRequestInvoicesResponse: PayRequestInvoicesResponse; //api/PayRequest/DtlInvoices?PayRequestDtlId=3290
  rpCustomerBillsResponse: RpCustomerBillsResponse; //for SaleReport/RpCustomerBills
  chequeBookSearchResponse: ChequeBookSearchResponse; // for Payment/chequeBookSearch
  chequeBookDtlSearchResponse: ChequeBookDtlSearchResponse; // for Payment/chequeBookDtlSearch
  chequeBookDtlByIdResponse: ChequeBookDtlByIdResponse; // for Payment/chequeBookDtlById
  payRequestSaveResponse: PayRequestSaveResponse; // for PayRequest/PayRequestSave
  payRequestDoFirstFlowResponse: PayRequestDoFirstFlowResponse; // for PayRequest/doFirstFlow
  payRequestDelResponse: PayRequestDelResponse; // for PayRequest/del
  payRequestDtlRemoveInvoiceResponse: PayRequestDtlAddRemoveInvoiceResponse; // for PayRequest/DtlRemoveInvoice
  payRequestDtlAddInvoiceResponse: PayRequestDtlAddRemoveInvoiceResponse; // for PayRequest/DtlAddInvoice
  setField: (field: string | number | symbol, value: any) => void;
  setPayRequestResponse: (payRequestResponse: PayRequestResponse) => void;
  setPayRequestInvoicesResponse: (
    payRequestInvoicesResponse: PayRequestInvoicesResponse,
  ) => void;
  setRpCustomerBillsResponse: (
    rpCustomerBillsResponse: RpCustomerBillsResponse,
  ) => void; //for SaleReport/RpCustomerBills
  setChequeBookSearchResponse: (chequeBookSearchResponse) => void; //for Payment/chequeBookSearch
  setChequeBookDtlSearchResponse: (chequeBookDtlSearchResponse) => void; //for Payment/chequeBookDtlSearch
  setChequeBookDtlByIdResponse: (
    chequeBookDtlByIdResponse: ChequeBookDtlByIdResponse,
  ) => void; //for Payment/chequeBookDtlById
  setPayRequestSaveResponse: (
    payRequestSaveResponse: PayRequestSaveResponse,
  ) => void; //for PayRequest/PayRequestSave
  setPayRequestDoFirstFlowResponse: (
    payRequestDoFirstFlowResponse: PayRequestDoFirstFlowResponse,
  ) => void; //for PayRequest/doFirstFlow
  setPayRequestDelResponse: (
    payRequestDelResponse: PayRequestDelResponse,
  ) => void; //for PayRequest/del
  setPayRequestDtlRemoveInvoiceResponse: (
    payRequestDtlRemoveInvoiceResponse: PayRequestDtlAddRemoveInvoiceResponse,
  ) => void; //for PayRequest/DtlRemoveInvoice
  setPayRequestDtlAddInvoiceResponse: (
    payRequestDtlAddInvoiceResponse: PayRequestDtlAddRemoveInvoiceResponse,
  ) => void; //for PayRequest/DtlAddInvoice
}
