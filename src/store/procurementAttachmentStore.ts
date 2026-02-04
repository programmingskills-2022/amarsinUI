import { create } from "zustand";
import { ProcurementAttachmentState } from "../types/procurementAttachment";

export const useProcurementAttachmentStore =
  create<ProcurementAttachmentState>()((set) => ({
    procurementAttachmentResponse: {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: [],
      },
    },
    guid: "79f7780b-9c4b-4902-9cd4-bdd3aebb60b3",
    systemId: -1,
    yearId: -1,
    form: "Procurement",
    preProcurementId: -1,
    temporaryReceiptId: 0,
    procurementId: 0,
    receiptId: 0,
    //api/ProcurementAttachment/upload
    procurementAttachmentUploadResponse: {
      meta: { errorCode: 0, message: "", type: "" },
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
    description: "",
    //http://apitest.dotis.ir/api/ProcurementAttachment/delete?id=16&formId=1513&prefix=PreProcurement
    procurementAttachmentdeleteRestoreResponse: {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          ordr: 0,
          cnt: 0,
          err: 0,
          msg: "",
        },
      },
    },
    setProcurementAttachmentDeleteRestoreResponse: (procurementAttachmentdeleteRestoreResponse) =>
      set({ procurementAttachmentdeleteRestoreResponse }),//for Api/ProcurementAttachment/delete
    setField: (field: string, value: any) =>
      set((state) => ({ ...state, [field]: value })),
    setProcurementAttachmentResponse: (procurementAttachmentResponse) =>
      set({ procurementAttachmentResponse }),
    setProcurementAttachmentUploadResponse: (procurementAttachmentUploadResponse) =>
      set({ procurementAttachmentUploadResponse }),//api/ProcurementAttachment/upload
  }));
