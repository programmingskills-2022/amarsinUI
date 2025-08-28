import { ReactNode } from "react";

// for api/Indent/showMrs
export interface IndentMrsResponse {
  err: number;
  msg: string;
  indents: Indents[];
  indentDtls: IndentDtl[];
}

interface Indents {
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
  customer: string;
  pId: number;
  bName: string;
  productCode: string;
  product: string;
  sumCompanyCnt: number;
  sumStoreCnt: number;
  lbDate: string;
  companyStock: number;
  storeStock: number;
  productExp: string;
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
  isDeleted:boolean;
}

export interface IndentDtlTable extends IndentDtl {
  index:number;

}

export interface InvoiceReceiptState {
  mrsId: number;
  indentMrsResponse: IndentMrsResponse;
  setIndentMrsResponse: (indentMrsResponse: IndentMrsResponse) => void;
  setField: (field: string, value: any) => void;
}
