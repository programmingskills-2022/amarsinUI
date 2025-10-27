import { SearchItem } from "./general";

/*interface LoadPaymentResponse {
    meta: {
      errorCode: number;
      message: string;
      type: string; // Example: "Payment"
    };
    data: {
      result: {
        err: number;
        msg: string;
        payment: Payment;
      };
    };
  }
  
  interface Payment {
    id: number;
    customerId: number;
    acc_System: number;
    systemTitle: string;
    acc_Year: number;
    yearTitle: string;
    srName: string;
    marketerSrName: string;
    kind: number;
    payKind: number;
    dat: string;    // date in Persian calendar format
    sayadi: string;
    sarDate: string; // date in Persian calendar format
    usrId: number;
    prsn: string;
    bankId: number;
    bankName_Partners: string;
    fixSerial: string;
    no: string;
    transferenceOwner: string;
    cash_PosSystem: number;
    cash_PosSystemTitle: string;
    dsc: string;
    partner: number;
    accNo: string;
    amount: string; // amount as string
    attachCount: number;
    canEdit: boolean;
    acc_BankAccountId: number;
    assignedAccountName: string;
    sanadNum: string;
    sanadDate: string;
    sayadiStatus: number;
    sayadiMessage: string;
  }*/
//api/Payment/load/377211
interface Payment {
  id: number;
  customerId: number;
  acc_System: number;
  systemTitle: string;
  acc_Year: number;
  yearTitle: string;
  srName: string;
  marketerSrName: string;
  kind: number;
  payKind: number;
  eCheck: boolean;
  dat: string;
  sayadi: string;
  sarDate: string;
  usrId: number;
  prsn: string;
  bankId: number;
  bankName_Partners: string;
  fixSerial: string;
  no: string;
  transferenceOwner: string;
  cash_PosSystem: number;
  cash_PosSystemTitle: string;
  dsc: string;
  partner: number;
  accNo: string;
  amount: string;
  attachCount: number;
  canEdit: boolean;
  acc_BankAccountId: number;
  assignedAccountName: string;
  sanadNum: string;
  sanadDate: string;
  sayadiStatus: number;
  sayadiMessage: string;
}

interface DataLoadPayment {
  result: Payment;
}

interface LoadPaymentResponse {
  meta: Meta;
  data: DataLoadPayment;
}

//api/Payment/updateFields
type UpdateFieldsResponse = {
  meta: Meta;
  data: {
    result: {
      id: number;
      errorCode: number;
      message: string;
      details: Array<{
        id: number;
        errorCode: number;
        message: string;
      }>;
    };
  };
};

type UpdateFieldsRequest = {
  fieldName: string;
  value: string;
  value2: string;
};

type UpdateStatus = {
  [key: string]: {
    errorCode?: number;
    isUpdating?: boolean;
    message?: string;
    validationError?: boolean;
  };
};
//api/Payment/sayadChequeInquiryByPaymentId?PaymentId=389456
interface ResponseSayadChequeInquiryByPaymentId {
  amountDiscrepancy: number;
  dateDiscrepancy: string;
  reasonDiscrepancy: string;
}

interface ResultSayadChequeInquiryByPaymentId {
  err: number;
  sayadiStatus: number;
  msg: string;
  response: ResponseSayadChequeInquiryByPaymentId;
}

interface DataSayadChequeInquiryByPaymentId {
  result: ResultSayadChequeInquiryByPaymentId;
}

interface SayadChequeInquiryByPaymentIdResponse {
  meta: Meta;
  data: DataSayadChequeInquiryByPaymentId;
}

//api/Payment/cashPosSystemSearch?page=1&lastId=0&systemId=0&PayKind=0
type CashPosSystemSearchRequest = {
  search: string;
  page: number;
  lastId: number;
  systemId: number;
  payKind: number;
};

/*interface ResultItem {
    id: number;
    text: string;
  }*/

interface CashPosSystemSearchResponse {
  total_count: number;
  results: SearchItem[];
}

//api/Payment/attachment?id=377211&actCode=Last&includeBase64=false
interface PaymentAttachmentResponse {
  meta: Meta;
  data: Data;
}

interface Meta {
  errorCode: number;
  message: string;
  type: string;
}

interface Data {
  result: Result;
}

interface Result {
  ordr: number;
  id: number;
  dat: string | null;
  regTime: string | null;
  usrDisplayName: string | null;
  dsc: string | null;
  path: string;
  extension: string | null;
  hasPrev: boolean;
  hasNext: boolean;
  imagePath: string | null;
  downloadPath: string;
  base64Path: string;
  base64Data: string | null;
  fileSize: number;
}
export interface ChequeState
  extends CashPosSystemSearchRequest,
    ChequeBookSearchRequest {
  id: number;
  //PaymentAttachment request parameters
  formId: number;
  actCode: string;
  curId: number;
  includeBase64: boolean;
  //end PaymentAttachment request parameters
  updateStatus: UpdateStatus;
  paymentId: number; //for Payment/sayadChequeInquiryByPaymentId
  loadPaymentResponse: LoadPaymentResponse;
  sayadChequeInquiryByPaymentIdResponse: SayadChequeInquiryByPaymentIdResponse;//for Payment/sayadChequeInquiryByPaymentId
  updateFieldsResponse: UpdateFieldsResponse;
  cashPosSystemSearchResponse: CashPosSystemSearchResponse;
  paymentAttachmentResponse: paymentAttachmentResponse;

  setField: (field: string, value: any) => void;
  setLoadPaymentResponse: (loadPaymentResponse: LoadPaymentResponse) => void;
  setUpdateFieldsResponse: (updateFieldsResponse: UpdateFieldsResponse) => void;
  setUpdateStatus: (updateStatus: UpdateStatus) => void;
  setCashPosSystemSearchResponse: (
    cashPosSystemSearchResponse: CashPosSystemSearchResponse
  ) => void;
  setPaymentAttachmentResponse: (
    paymentAttachmentResponse: PaymentAttachmentResponse
  ) => void;
  setSayadChequeInquiryByPaymentIdResponse: (
    sayadChequeInquiryByPaymentIdResponse: SayadChequeInquiryByPaymentIdResponse
  ) => void;
}