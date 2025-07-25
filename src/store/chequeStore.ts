import { create } from "zustand";
import { ChequeState } from "../types/cheque";

export const useChequeStore = create<ChequeState>()((set) => ({
  loadPaymentResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        err: 0,
        msg: "",
        payment: {
          id: 0,
          customerId: 0,
          acc_System: 0,
          systemTitle: "",
          acc_Year: 0,
          yearTitle: "",
          srName: "",
          marketerSrName: "",
          kind: 0,
          payKind: 0,
          dat: "",
          sayadi: "",
          sarDate: "",
          usrId: 0,
          prsn: "",
          bankId: 0,
          bankName_Partners: "",
          fixSerial: "",
          no: "",
          transferenceOwner: "",
          cash_PosSystem: 0,
          cash_PosSystemTitle: "",
          dsc: "",
          partner: 0,
          accNo: "",
          amount: "",
          attachCount: 0,
          canEdit: false,
          acc_BankAccountId: 0,
          assignedAccountName: "",
          sanadNum: "",
          sanadDate: "",
          sayadiStatus: 0,
          sayadiMessage: "",
        },
      },
    },
  },
  id: 0,
  updateFieldsResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        id: 0,
        errorCode: 0,
        message: "",
        details: [],
      },
    },
  },
  updateStatus: {
    prsn: {},
    sayadi: {},
    srName: {},
    marketerSrName: {},
    transferenceOwner: {},
    sarDate: {},
    accNo: {},
    no: {},
    amountT: {},
    dsc: {},
    systemId: {},
    yearId: {},
    bankId: {},
    sayadiMessage: {},
    cash_PosSystem: {},
  },
  search: "",
  page: 1,
  lastId: 0,
  systemId: 0,
  PayKind: 0,
  cashPosSystemSearchResponse: {
    total_count: 0,
    results: [],
  },
  paymentAttachmentResponse:{
    meta:{
      errorCode: 0,
      message: "",
      type: ""
    },
    data: 
      {result:{
        ordr: 0,
        id: 0,
        dat:  null,
        regTime: null,
        usrDisplayName: null,
        dsc: null,
        path: "",
        extension: null,
        hasPrev: false,
        hasNext: false,
        imagePath: null,
        downloadPath: "",
        base64Path: "",
        base64Data: null,
        fileSize: 0
      }}
  },
  formId: 0,
  actCode: "",
  curId: 0,
  includeBase64: false,
  setCashPosSystemSearchResponse: (cashPosSystemSearchResponse) =>
    set({ cashPosSystemSearchResponse }),
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setLoadPaymentResponse: (loadPaymentResponse) => set({ loadPaymentResponse }),
  setUpdateFieldsResponse: (updateFieldsResponse) =>
    set({ updateFieldsResponse }),
  setUpdateStatus: (updateStatus) => set({ updateStatus }),
  setPaymentAttachmentResponse:  (paymentAttachmentResponse) =>
    set({ paymentAttachmentResponse }),
}));
