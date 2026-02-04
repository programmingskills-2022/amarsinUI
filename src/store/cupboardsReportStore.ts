import { create } from "zustand";
import { CupboardsReportState } from "../types/cupboardsReport";
export const useCupboardsReportStore = create<CupboardsReportState>()((set) => ({
    systemId: -1,
    yearId: -1,
    err: false,
    errId: 0,
    existsCupboards: false,
    recent: false,
    pageNumber: 1,
    sortCode: 0,
    sortFullCode: 0,
    sortFullName: 0,
    sortTtac: 0,
    sortADProdDate: 0,
    sortADExpDate: 0,
    sortProductGTIN: 0,
    sortProductIRC: 0,
    sortUID: 0,
    srchCode: "",
    srchFullName: "",
    srchTtac: "",
    srchADProdDate: "",
    srchADExpDate: "",
    srchProductGTIN: "",
    srchProductIRC: "",
    srchUID: "",
    srchFullCode: "",
  cupboardsReportResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [], total_count: 0 },
  },
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setCupboardsReportResponse: (cupboardsReportResponse) =>
    set({ cupboardsReportResponse }),
}));
