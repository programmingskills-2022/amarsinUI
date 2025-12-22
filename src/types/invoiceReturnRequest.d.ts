//api/InvoiceReturnRequest/show?Id=2778
interface InvoiceReturnRequest {
  id: number;
  ordr: number;
  dat: string;
  cId: number;
  srName: string;
  dsc: string;
  usrName: string;
  flwId: number;
  flowMapName: string;
  canEdit: number;
  attachCount: number;
}

interface InvoiceReturnRequestDtl {
  id: number;
  pId: number;
  product: string;
  cupCode: string;
  uid: string;
  pDateFormat: number;
  prodYear: string;
  prodMonth: string;
  prodDay: string;
  expireYear: string;
  expireMonth: string;
  expireDay: string;
  cnt: number;
  appearance: boolean;
  factorNo: string;
  dtlDsc: string;
  regedCnt: string;
  regedOffer: string;
}


interface Diagnosis{
  id:number;
  err:number;
  msg:string;
}

interface ResultInvoiceReturnRequestShow {
  invoiceReturnRequest: InvoiceReturnRequest;
  invoiceReturnRequestDtls: InvoiceReturnRequestDtl[];
  diagnosises: Diagnosis[]; // Replace 'any' with a specific type if diagnoses have a structure
}

interface DataInvoiceReturnRequestShow {
  result: ResultInvoiceReturnRequestShow;
}

interface InvoiceReturnRequestShowResponse {
  meta: Meta;
  data: DataInvoiceReturnRequestShow;
}
//http://apitest.dotis.ir/api/InvoiceReturnRequest/invoiceList?Id=3712
interface InvoiceReturnRequestInvoiceDtl {
  invoiceDtlId: number;
  factorNo: string;
  cnt: number;
  offer: number;
  rCnt: number;
  rOffer: number;
}

interface InvoiceReturnRequestInvoiceDtlCup {
  invoiceDtlId: number;
  iocId: number;
  cupCode: string;
  cnt: number;
  cost: number;
  rCnt: number;
}

interface InvoiceReturnRequestInvoiceListResult {
  invoiceReturnRequestInvoiceDtls: InvoiceReturnRequestInvoiceDtl[];
  invoiceReturnRequestInvoiceDtlCups: InvoiceReturnRequestInvoiceDtlCup[];
}

interface InvoiceReturnRequestInvoiceListData {
  result: InvoiceReturnRequestInvoiceListResult;
}

interface InvoiceReturnRequestInvoiceListResponse {
  meta: Meta;
  data: InvoiceReturnRequestInvoiceListData;
}
//http://apitest.dotis.ir/api/InvoiceReturnRequest/registerDtl?InvoiceReturnRequestDtlId=3712
export interface InvoiceReturnRequestRegisterDtlRequest {
  invoiceDtlId: number;
  iocId: number;
  cnt: number;
  offer: number;
}
interface InvoiceReturnRequestRegisterDtlResult {
  id: number;
  factorNo: string;
  cnt: number;
  offer: number;
  diagnosis: Diagnosis[]; 
}

interface InvoiceReturnRequestRegisterDtlData {
  result: InvoiceReturnRequestRegisterDtlResult;
}

interface InvoiceReturnRequestRegisterDtlResponse {
  meta: Meta;
  data: InvoiceReturnRequestRegisterDtlData;
}
///////////////////////////////////////////////////////////////
export interface InvoiceReturnRequestState {
  invoiceListId: number;
  invoiceListIdTrigger: number;
  invoiceReturnRequestId: number;//api/InvoiceReturnRequest/show?Id=2778
  invoiceReturnRequestDtlId: number;//api/InvoiceReturnRequest/registerDtl?InvoiceReturnRequestDtlId=3712
  invoiceReturnRequestShowResponse: InvoiceReturnRequestShowResponse;
  invoiceReturnRequestInvoiceListResponse: InvoiceReturnRequestInvoiceListResponse;// api/InvoiceReturnRequest/invoiceList?Id=3712
  invoiceReturnRequestRegisterDtlResponse: InvoiceReturnRequestRegisterDtlResponse;// api/InvoiceReturnRequest/registerDtl?InvoiceReturnRequestDtlId=3712
  setInvoiceReturnRequestShowResponse: (
    invoiceReturnRequestShowResponse: InvoiceReturnRequestShowResponse
  ) => void;
  setInvoiceReturnRequestInvoiceListResponse: (
    invoiceReturnRequestInvoiceListResponse: InvoiceReturnRequestInvoiceListResponse
  ) => void;
  setInvoiceReturnRequestRegisterDtlResponse: (
    invoiceReturnRequestRegisterDtlResponse: InvoiceReturnRequestRegisterDtlResponse
  ) => void;
  setField: (field: string, value: any) => void;
}
