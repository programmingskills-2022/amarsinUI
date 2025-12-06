import { Meta, SearchItem } from "./general";
//http://apitest.dotis.ir/api/Payment/bankAccountSearch?search=%D8%A2&page=1&lastId=0&SystemId=1
export interface BankAccountSearchRequest {
  search: string;
  page: number;
  lastId: number;
  systemId: number;
}

interface DataBankAccountSearchResponse {
  result: SearchItem[];
}

export interface BankAccountSearchResponse {
  meta: Meta;
  data: DataBankAccountSearchResponse;
}
//http://apitest.dotis.ir/api/Payment/getChequeAssignBankAccount?PaymentId=360944&AsnadId=0
export interface GetChequeAssignBankAccountRequest {
  paymentId: number;
  asnadId: number;
}

interface BankAccountItem {
  id: number;
  name: string;
}

export interface GetChequeAssignBankAccountResponse {
  meta: Meta;
  data: { result: BankAccountItem };
}
//http://apitest.dotis.ir/api/Payment/chequeAssignBankAccount
export interface ChequeAssignBankAccountRequest {
  paymentId: number;
  asnadId: number;
  bankAccountId: number;
}
export interface ChequeAssignBankAccountResponse {
  meta: Meta;
  data: { result: number };
}
///////////////////////////////////////////////////////////////
export interface BankAccountState
  extends BankAccountSearchRequest,
    GetChequeAssignBankAccountRequest {
  bankAccountSearchResponse: BankAccountSearchResponse;
  getChequeAssignBankAccountResponse: GetChequeAssignBankAccountResponse;
  chequeAssignBankAccountResponse: ChequeAssignBankAccountResponse;
  setField: (field: string | number | symbol, value: any) => void;
  setBankAccountSearchResponse: (
    bankAccountSearchResponse: BankAccountSearchResponse
  ) => void;
  setGetChequeAssignBankAccountResponse: (
    getChequeAssignBankAccountResponse: GetChequeAssignBankAccountResponse
  ) => void;
  setChequeAssignBankAccountResponse: (
    chequeAssignBankAccountResponse: ChequeAssignBankAccountResponse
  ) => void;
}
