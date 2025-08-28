//http://apitest.dotis.ir/api/Attachment/list?formId=1513&prefix=payrequest

export interface AttachmentListRequest {
  systemId: number;
  yearId: number;
  formId: number;
  prefix: string;
  GUID: string;
}

export interface AttachmentListResponse {
  meta: Meta;
  data: DataWrapper;
}

export interface Meta {
  errorCode: number;
  message: string;
  type: string;
}

// Wrapper around the nested result
export interface DataWrapper {
  result: Result[];
}

// The inner result structure
export interface Result {
  ordr: number;
  systemId: number;
  yearId: number;
  id: number;
  dat: string;
  regTime: string;
  usrDisplayName: string;
  dsc: string;
  path: string;
  extension: string;
  hasPrev: boolean;
  hasNext: boolean;
  imagePath: string;
  downloadPath: string;
  base64Path: string;
  base64Data: string;
  fileSize: number;
}

export interface AttachmentResult extends Result {
  index: number;
  isDeleted: boolean;
}
//http://apitest.dotis.ir/api/Attachment/delete?id=16&formId=1513&prefix=payrequest

export interface DeleteRestoreRequest {
  idDeleteRestore:number;
  formIdDeleteRestore: number;
  prefixDeleteRestore: string;
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

//http://apitest.dotis.ir/api/Attachment/save?prefix=payrequest&formId=1513&systemId=1&yearId=1&guid=
export interface AttachmentSaveRequest {
  prefixAttachmentSave: string;
  formIdAttachmentSave: number;
  systemIdAttachmentSave: number;
  yearIdAttachmentSave: number;
  guidAttachmentSave: string;
}

interface ResultAttachmentSave {
  ordr: number;
  id: number;
  formId: number;
  path: string;
  extension: string;
  cnt: number;
  attachLen: number;
}

interface DataAttachmentSave {
  result: ResultAttachmentSave;
}

interface AttachmentSaveResponse {
  meta: Meta;
  data: DataAttachmentSave;
}


export interface AttachmentState extends AttachmentListRequest,DeleteRestoreRequest {
  attachmentListResponse: AttachmentListResponse;
  deleteRestoreResponse:DeleteRestoreResponse,
  attachmentSaveResponse:AttachmentSaveResponse,
  setField: (field: keyof AttachmentListRequest, value: any) => void;
  setAttachmentListResponse: (
    attachmentListResponse: AttachmentListResponse
  ) => void;
  setDeleteRestoreResponse : (deleteRestoreResponse:DeleteRestoreResponse) =>void
  setAttachmentSaveResponse : (attachmentSaveResponse:AttachmentSaveResponse) =>void
}
