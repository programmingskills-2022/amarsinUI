import { create } from "zustand";
import { BankAccountState } from "../types/bankAccount";
export const useBankAccountStore = create<BankAccountState>()((set) => ({
  //bankAccountSearch
  systemId: -1,
  search: "",
  page: 1,
  lastId: 0,
  bankAccountSearchResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [] },
  },
  //getChequeAssignBankAccount
  paymentId: -1,
  asnadId: -1,
  getChequeAssignBankAccountResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: { id: 0, name: "" } },
  },
  //chequeAssignBankAccount
  chequeAssignBankAccountResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: 0 },
  },
  setField: (field: string | number | symbol, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setBankAccountSearchResponse: (bankAccountSearchResponse) =>
    set({ bankAccountSearchResponse }),
  setGetChequeAssignBankAccountResponse: (getChequeAssignBankAccountResponse) =>
    set({ getChequeAssignBankAccountResponse }),
  setChequeAssignBankAccountResponse: (chequeAssignBankAccountResponse) =>
    set({ chequeAssignBankAccountResponse }),
}));
