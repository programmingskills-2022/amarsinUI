import { SearchItem } from "./general";
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
  delayAdvanceDays: number;
  sayadiAcceptStatus: number
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

//api/Payment/sayadiChequeAcceptByPaymentId?PaymentId=399947&Description=toloo
interface SayadiChequeAcceptByPaymentIdRequest{
  paymentIdAccept:number;
  paymentIdAcceptTrigger:number;
  descriptionAccept:string;
  idempotencyKeyAccept:string;
}

interface SayadiChequeAcceptByPaymentIdResponse{
  meta:Meta;
  data:{
    result:{
      state:number;
    }
  }
}
//api/Payment/sayadiChequeRejectByPaymentId?PaymentId=399947&Description=toloo
interface SayadiChequeRejectByPaymentIdRequest{
  paymentIdReject:number;
  //paymentIdRejectTrigger:number;
  descriptionReject:string;
  idempotencyKeyReject:string;
}

export interface ChequeState
  extends CashPosSystemSearchRequest,SayadiChequeAcceptByPaymentIdRequest,SayadiChequeRejectByPaymentIdRequest,
    ChequeBookSearchRequest {
  id: number;
  //PaymentAttachment request parameters
  paymentAttachmentFormId: number;
  loadPaymentFormId: number;
  actCode: string;
  curId: number;
  includeBase64: boolean;
  //end PaymentAttachment request parameters
  updateStatus: UpdateStatus;
  sayadiPaymentId: number; //for Payment/sayadChequeInquiryByPaymentId
  paymentIdTrigger: number; //for Payment/sayadChequeInquiryByPaymentId
  loadPaymentResponse: LoadPaymentResponse;
  sayadChequeInquiryByPaymentIdResponse: SayadChequeInquiryByPaymentIdResponse;//for Payment/sayadChequeInquiryByPaymentId
  sayadiChequeAcceptByPaymentIdResponse: SayadiChequeAcceptByPaymentIdResponse;///Payment/sayadiChequeAcceptByPaymentId?PaymentId=
  sayadiChequeRejectByPaymentIdResponse: SayadiChequeAcceptByPaymentIdResponse;///api/Payment/sayadiChequeRejectByPaymentId
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
  setSayadiChequeAcceptByPaymentIdResponse: (
    sayadiChequeAcceptByPaymentIdResponse: SayadiChequeAcceptByPaymentIdResponse
  ) => void;
  setSayadiChequeRejectByPaymentIdResponse: (
    sayadiChequeRejectByPaymentIdResponse: SayadiChequeRejectByPaymentIdResponse
  ) => void;
}