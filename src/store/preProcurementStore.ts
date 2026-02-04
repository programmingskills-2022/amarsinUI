import { create } from "zustand";
import { PreProcurementState } from "../types/preProcurement";

export const usePreProcurementStore = create<PreProcurementState>()((set) => ({
  preProcurementResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        err: 0,
        msg: "",
        mst: {
          id: 0,
          systemId: 0,
          systemTitle: "",
          factorNo: "",
          dat: "",
          customerId: 0,
          customerName: "",
          exp: "",
          attachCount: 0,
          canEdit: 0,
        },
        dtls: [],
        diagnosises: [],
      },
    },
  },
  id: -1,
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setPreProcurementResponse: (preProcurementResponse) =>
    set({ preProcurementResponse }),
}));
