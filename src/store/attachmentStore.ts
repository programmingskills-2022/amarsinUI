import { create } from "zustand";
import { AttachmentState } from "../types/attachment";
export const useAttachmentStore = create<AttachmentState>()((set) => ({
  attachmentListResponse: {
    meta: { errorCode: -1, message: "", type: "" },
    data: {
      result: [{
        ordr: 0,
        systemId: 0,
        yearId: 0,
        id: 0,
        dat: "",
        regTime: "",
        usrDisplayName: "",
        dsc: "",
        path: "",
        extension: "",
        hasPrev: false,
        hasNext: false,
        imagePath: "",
        downloadPath: "",
        base64Path: "",
        base64Data: "",
        fileSize: 0,
      }],
    },
  },
  systemId: -1,
  yearId: -1,
  formId: 0,
  prefix: "",
  GUID: "",  
  // api/Attachment/delete?id=16&formId=1513&prefix=payrequest
  deleteRestoreResponse: {
    meta: {
      errorCode: -1,
      message: "",
      type: "AttachmentDelete",
    },
    data: {
      result: {
        ordr: 0,
        cnt: 0,
        err: 0,
        msg: "",
      },
    },
  },
  idDeleteRestore:0,
  formIdDeleteRestore:0,
  prefixDeleteRestore:"",
  //http://apitest.dotis.ir/api/Attachment/save?prefix=payrequest&formId=1513&systemId=1&yearId=1&guid=
  attachmentSaveResponse: {
    meta: {
      errorCode: -1,
      message: "",
      type: "AttachmentSave",
    },
    data: {
      result: {
        ordr: 0,
        id: 0,
        formId: 0,
        path: "",
        extension: "",
        cnt: 0,
        attachLen: 0,
      },
    },
  },
  idAttachmentSave:0,
  formIdAttachmentSave:0,
  prefixAttachmentSave:"",
  systemIdAttachmentSave:0,
  yearIdAttachmentSave:0,
  guidAttachmentSave:"",
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setAttachmentListResponse: (attachmentListResponse) =>
    set({ attachmentListResponse }), //api/Attachment/list
  setDeleteRestoreResponse:(deleteRestoreResponse)=> set({deleteRestoreResponse}), //api/Attachment/delete
  setAttachmentSaveResponse:(attachmentSaveResponse)=> set({attachmentSaveResponse}), //api/Attachment/save
}));
