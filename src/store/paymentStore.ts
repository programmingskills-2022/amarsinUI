import { create } from "zustand";
import {
  ChequeBookGetByIdResponse,
  PaymentKindSearchResponse,
  PaymentState,
  PosListResponse,
} from "../types/payment";

export const usePaymentStore = create<PaymentState>()((set) => ({
  //api/Payment/paymentKindSearch
  paymentKindSearch: "",
  paymentKindSearchPage: -1,
  paymentKindSearchLastId: 0,
  paymentKindSearchResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { total_count: 0, result: [] },
  },
  // api/Payment/posList
  posListResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: [] },
  },
  // api/Payment/chequeBookGetById?id=190
  checkBookId:-1,
  chequeBookGetByIdResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        fixChqNo: "",
        chequeBookDtlId: 0,
        cheqNo: "",
        chqBkNo: "",
        bnkId: 0,
        bnk: "",
        brnchId: 0,
        brnch: "",
        sheba: "",
      },
    },
  },
  posSystemId:-1,
  setChequeBookGetByIdResponse: (
    chequeBookGetByIdResponse: ChequeBookGetByIdResponse
  ) => set({ chequeBookGetByIdResponse }),
  setPosListResponse: (posListResponse: PosListResponse) =>
    set({ posListResponse }), // api/Payment/posList
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setPaymentKindSearchResponse: (
    //api/Payment/paymentKindSearch
    paymentKindSearchResponse: PaymentKindSearchResponse
  ) => set({ paymentKindSearchResponse }),
}));
