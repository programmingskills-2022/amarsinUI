//http://apitest.dotis.ir/api/Payment/invoiceOutStanding?PaymentId=376363&SystemId=4&YearId=15

interface InvoiceOutStandingRequest {
  paymentId: number;
  systemId: number;
  yearId: number;
}

interface InvoiceOutstanding {
  id: number;
  psId: number;
  sanadKind: number;
  sanadKindT: string;
  factorNo: string;
  dat: string; // Date as string, format: "YYYY/MM/DD"
  rgd: number;
  payDat: string; // Empty string or date
  fact: number;
  dcrmnt: number;
  pls: number;
  mns: number;
  valueTax: number;
  total: number;
  otherPay: number;
  pdPrcnt: number;
  pd: number;
  opd: number;
  rem: number;
  amnt: number;
  settlement: number;
  checked: boolean;
}

interface InvoiceOutstandingWithIndex extends InvoiceOutstanding {
  index: number;
  check: boolean;
}

interface Meta {
  errorCode: number;
  message: string;
  type: string;
}

interface Data {
  invoiceOutstandings: InvoiceOutstanding[];
  err: number;
  msg: string;
  rem: number;
  dsc: string;
  kind: number;
}

export interface InvoiceOutStandingResponse {
  meta: Meta;
  data: Data;
}

// for Payment/paymentInvoicesSave
interface PaymentInvoice {
  id: number;
  psId: number;
  value: string;
  prcnt: number;
  dscnt: number;
}

interface PaymentInvoicesSaveRequest {
  usrId: number;
  paymentId: number;
  paymentInvoices: PaymentInvoice[];
}

interface PaymentInvoicesSaveResponse {
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
      dtlErrMsgs: any[]; // Assuming array of any type; specify types if known
    };
  };
}
///api/Payment/settlementAverages

interface SettlementAveragesResult {
  id: number;
  minSum: number;
  maxSum: number;
  days: number;
}
export interface SettlementAveragesResponse {
  meta: Meta;
  data: {
    result: SettlementAveragesResult[];
  };
}
export interface InvoiceOutStandingState
  extends InvoiceOutStandingRequest,
    PaymentInvoicesSaveRequest {
  dsc: string;
  rem: number;
  invoiceOutStandingResponse: InvoiceOutStandingResponse;
  paymentInvoicesSaveResponse: PaymentInvoicesSaveResponse;
  settlementAveragesResponse: SettlementAveragesResponse;//for Payment/settlementAverages
  setField: (
    field: keyof InvoiceOutStandingRequest | "dsc" | "rem",
    value: any
  ) => void;
  setInvoiceOutStandingResponse: (
    invoiceOutStandingResponse: InvoiceOutStandingResponse
  ) => void;
  setPaymentInvoicesSaveResponse: (
    paymentInvoicesSaveResponse: PaymentInvoicesSaveResponse
  ) => void;
  setSettlementAveragesResponse: (
    settlementAveragesResponse: SettlementAveragesResponse
  ) => void;
}
