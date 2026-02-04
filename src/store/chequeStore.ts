import { create } from "zustand";
import { ChequeState } from "../types/cheque";

export const useChequeStore = create<ChequeState>()((set) => ({
  loadPaymentResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        id: 0,
        customerId: 0,
        acc_System: 0,
        systemTitle: "",
        acc_Year: 0,
        yearTitle: "",
        srName: "",
        marketerSrName: "",
        kind: 0,
        payKind: -1,
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
        eCheck: false,
        delayAdvanceDays : 0,
        sayadiAcceptStatus: 0
      },
    },
  },
  id: -1,
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
    delayAdvanceDays:{}
  },
  search: "",
  page: 1,
  lastId: 0,
  systemId: -1,
  payKind: -1,
  cashPosSystemSearchResponse: {
    total_count: 0,
    results: [],
  },
  paymentAttachmentResponse: {
    meta: {
      errorCode: 0,
      message: "",
      type: "",
    },
    data: {
      result: {
        ordr: 0,
        id: 0,
        dat: null,
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
        fileSize: 0,
      },
    },
  },
  paymentAttachmentFormId: -1,
  loadPaymentFormId:-1,
  actCode: "Last",
  curId: -1,
  includeBase64: false,
  sayadiPaymentId: -1, //for Payment/sayadChequeInquiryByPaymentId
  paymentIdTrigger: 0, //for Payment/sayadChequeInquiryByPaymentId
  sayadChequeInquiryByPaymentIdResponse: {
    //for Payment/sayadChequeInquiryByPaymentId
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        err: 0,
        sayadiStatus: -10,
        msg: "",
        response: {
          amountDiscrepancy: 0,
          dateDiscrepancy: "",
          reasonDiscrepancy: "",
        },
      },
    },
  },
  //for Payment/sayadiChequeAcceptByPaymentId?PaymentId=
  paymentIdAccept:-1,
  paymentIdAcceptTrigger:0,
  descriptionAccept:"toloo",
  idempotencyKeyAccept:"",
  sayadiChequeAcceptByPaymentIdResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        state: -10
      },
    },
  },
  //for Payment/sayadiChequeRejectByPaymentId?PaymentId=
  paymentIdReject:-1,
  //paymentIdRejectTrigger:0,
  descriptionReject:"toloo",
  idempotencyKeyReject:"",
  sayadiChequeRejectByPaymentIdResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        state: -10
      },
    },
  },
  setCashPosSystemSearchResponse: (cashPosSystemSearchResponse) =>
    set({ cashPosSystemSearchResponse }),
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setLoadPaymentResponse: (loadPaymentResponse) => set({ loadPaymentResponse }),
  setUpdateFieldsResponse: (updateFieldsResponse) =>
    set({ updateFieldsResponse }),
  setUpdateStatus: (updateStatus) => set({ updateStatus }),
  setPaymentAttachmentResponse: (paymentAttachmentResponse) =>
    set({ paymentAttachmentResponse }),
  setSayadChequeInquiryByPaymentIdResponse: (
    sayadChequeInquiryByPaymentIdResponse
  ) => set({ sayadChequeInquiryByPaymentIdResponse }),
  setSayadiChequeAcceptByPaymentIdResponse: (
    sayadiChequeAcceptByPaymentIdResponse:any
  ) => set({ sayadiChequeAcceptByPaymentIdResponse }),
  setSayadiChequeRejectByPaymentIdResponse: (
    sayadiChequeRejectByPaymentIdResponse:any
  ) => set({ sayadiChequeRejectByPaymentIdResponse }),
}));
