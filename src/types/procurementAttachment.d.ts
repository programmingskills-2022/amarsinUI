///api/ProcurementAttachment/attachments?GUID=79f7780b-9c4b-4902-9cd4-bdd3aebb60b3&SystemId=4&YearId=15&Form=PreProcurement&PreProcurementId=924069&TemporaryReceiptId=0&ProcurementId=0&ReceiptId=0
interface ProcurementAttachmentRequest {
  guid: string;
  systemId: number;
  yearId: number;
  form: string;
  preProcurementId: number;
  temporaryReceiptId: number;
  procurementId: number;
  receiptId: number;
}

interface ProcurementAttachment {
  id: number;
  dat: string;
  dsc: string;
  path: string;
  extension: string;
}

interface DataProcurementAttachment {
  result: ProcurementAttachment[];
}

export interface ProcurementAttachmentResponse {
  meta: Meta;
  data: DataProcurementAttachment;
}
//api/ProcurementAttachment/upload?Form=PreProcurement&SystemId=4&YearId=15&GUID=13e77bfb-c854-43b5-92bc-6b2811fc0387&PreProcurementId=0&TemporaryReceiptId=0&ProcurementId=0&ReceiptId=0&Description=%D8%AA%D9%88%D8%B6%DB%8C%D8%AD%D8%A7%D8%AA
interface ProcurementAttachmentUploadRequest {
  form: string;
  systemId: number;
  yearId: number;
  guid: string;
  preProcurementId: number;
  temporaryReceiptId: number;
  procurementId: number;
  receiptId: number;
  description: string;
}
interface ProcurementAttachmentUploadResponse {
  meta: Meta;
  data: DataProcurementAttachmentUpload;
}
interface ResultProcurementAttachmentUpload {
    ordr: number;
    id: number;
    formId: number;
    path: string;
    extension: string;
    cnt: number;
    attachLen: number;
}
interface DataProcurementAttachmentUpload {
  result: ResultProcurementAttachmentUpload;
}

//http://apitest.dotis.ir/api/ProcurementAttachment/delete?id=16&formId=1513&prefix=PreProcurement
export interface DeleteRestoreRequest {
    idDeleteRestore:number;
    formIdDeleteRestore: number;
    prefixDeleteRestore: string;
    temporaryReceiptId: number;
    procurementId: number;
    receiptId: number;
  }
  
  
  interface ResultDeleteRestore {
    ordr: number;
    cnt: number;
    err: number;
    msg: string;
  }
  
  interface DataDeleteRestore {
    result: ResultDeleteRestore;
  }
  
  interface DeleteRestoreResponse {
    meta: Meta;
    data: DataDeleteRestore;
  }
export interface ProcurementAttachmentState extends ProcurementAttachmentUploadRequest {
  procurementAttachmentResponse: ProcurementAttachmentResponse;
  procurementAttachmentUploadResponse: ProcurementAttachmentUploadResponse;
  procurementAttachmentdeleteRestoreResponse:DeleteRestoreResponse;
  setField: (field: string, value: any) => void;
  setProcurementAttachmentResponse: (
    procurementAttachmentResponse: ProcurementAttachmentResponse
  ) => void;
  setProcurementAttachmentUploadResponse: (
    procurementAttachmentUploadResponse: ProcurementAttachmentUploadResponse
  ) => void;
  setProcurementAttachmentDeleteRestoreResponse: (
    deleteRestoreResponse: DeleteRestoreResponse
  ) => void;
}