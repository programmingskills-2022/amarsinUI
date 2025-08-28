export interface Meta {
  errorCode: number;
  message: string;
  type: string;
}

interface Data{
    result:Result
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

export interface InvoiceState {
  formId: number;
  invoiceShowIdResponse: InvoiceShowIdResponse;
  setField: (field: string, value: any) => void;
  setInvoiceShowIdResponse: (
    invoiceShowIdResponse: InvoiceShowIdResponse
  ) => void;
}
