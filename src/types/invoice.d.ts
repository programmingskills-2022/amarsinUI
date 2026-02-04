export interface Meta {
  errorCode: number;
  message: string;
  type: string;
}

interface Data {
  result: Result;
}

interface InvoiceShowIdResponse {
  meta: Meta;
  data: Data;
}

interface Result {
  invoice: Invoice;
  invoiceDtls: InvoiceDetail[];
  diagnosises: Diagnosis[];
}

interface Invoice {
  id: number;
  ordr: number;
  dat: string;
  cId: number;
  srName: string;
  exp: string;
  usrName: string;
  flwId: number;
  flowMapName: string;
  canEdit: number;
}

interface InvoiceDetail {
  id: number;
  pId: number;
  product: string;
  cnt: number;
  offer: number;
  cost: number;
  valueTax: number;
  total: number;
}

interface Diagnosis {
  id: number;
  err: number;
  msg: string;
}

//http://apitest.dotis.ir/api/Invoice/payment?invoiceId=925142
interface Payment {
  id: number;
  dat: string;
  usrName: string;
  kindT: string;
  payKindT: string;
  no: string;
  exp: string;
  dsc: string;
  amnt: number;
  rem: number;
  attachCount: number;
}
interface ResultInvoicePayment {
  customerId: number;
  srName: string;
  dat: string;
  dsc: string;
  amnt: string;
  payments: Payment[];
}
interface InvoicePaymentResponse {
  meta: Meta;
  data: {
    result: ResultInvoicePayment;
  };
}

// api/Invoice/paymentSave
interface InvoicePaymentSaveRequest {
  dat:string;
  customerId: number;
  invoiceId: number;
  paymentId: number;
  systemId: number;
  kind: number;
  payKind: number;
  yearId: number;
  sayadi: string;
  prsn: string;
  bankId: number;
  bankName_Partners: string;
  fixSerial: string;
  no: string;
  transferenceOwner: string;
  cash_PosSystem: number;
  accNo: string;
  acc_DefCheq: number;
  sarDate: string;
  amount: string;
  dsc: string;
  updateAcepted: boolean;
  idempotencyKey: string;
}

interface InvoicePaymentSaveResponse {
  meta: Meta;
  data: InvoicePaymentSaveResponseData;
}

interface InvoicePaymentSaveResponseData {
  result: InvoicePaymentSaveResponseResult;
}

interface InvoicePaymentSaveResponseResult {
  customerId: number;
  srName: string;
  dat: string;
  dsc: string;
  amnt: string;
  payments: Payment[];
}

export interface InvoiceState {
  formId: number;
  invoiceId: number; // for Invoice/payment
  invoicePaymentResponse: InvoicePaymentResponse; // for Invoice/payment
  invoicePaymentSaveResponse: InvoicePaymentSaveResponse; // api/Invoice/paymentSave
  setInvoicePaymentResponse: (
    // for Invoice/payment
    invoicePaymentResponse: InvoicePaymentResponse
  ) => void;
  invoiceShowIdResponse: InvoiceShowIdResponse;
  setField: (field: string, value: any) => void;
  setInvoiceShowIdResponse: (
    invoiceShowIdResponse: InvoiceShowIdResponse
  ) => void;
  setInvoicePaymentSaveResponse: (
    invoicePaymentSaveResponse: InvoicePaymentSaveResponse // api/Invoice/paymentSave
  ) => void;
}
