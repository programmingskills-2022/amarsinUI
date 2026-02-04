import { create } from "zustand";
import { ttacState } from "../types/ttac";

export const useTTacStore = create<ttacState>()((set) => ({
  //for GetInventoryBalance
  systemId: -1,
  yearId: -1,
  hasErr: false,
  srchIRC: "",
  srchLotNumber: "",
  sortId: 0,
  sortIRC: 0,
  sortLotNumber: 0,
  sortWStock: 0,
  sortCnt: 0,
  sortNotSent: 0,
  sortTCnt: 0,
  pageNumber: 1,
  getInventoryBalanceResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: [], total_count: 0 },
  },
  //for FlowProductsSendAll
  sendSystemId: -1,
  sendYearId: -1,
  sendDate: "",
  sendTtacSent: false,
  sendPageNumber: 1,
  sendSrchCode: "",
  sendSrchIRC: "",
  sendSrchPName: "",
  sendSrchEventId: "",
  sendSrchMsg: "",
  sendSrchTitle: "",
  sendSrchDat: "",
  sendSrchSrName: "",
  sendSrchLotNumber: "",
  sendSrchSuccessed: "",
  sendSrchIsCancel: "",
  sendSrchFlowMapName: "",
  sendSrchCompleteDate: "",
  sendSortId: 0,
  sendSortFId: 0,
  sendSortTId: 0,
  sendSortPId: 0,
  sendSortIRC: 0,
  sendSortPName: 0,
  sendSortEventId: 0,
  sendSortErr: 0,
  sendSortMsg: 0,
  sendSortTitle: 0,
  sendSortCode: 0,
  sendSortDat: 0,
  sendSortSrName: 0,
  sendSortLotNumber: 0,
  sendSortCnt: 0,
  sendSortSuccessed: 0,
  sendSortIsCancel: 0,
  sendSortFlowMapName: 0,
  sendSortCompleteDate: 0,
  flowProductsSendAllResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: [], total_count: 0 },
  },
  //for api/TTAC/CupboardCapture
  cupboardCaptureId: -1,
  cupboardCaptureCurrentDateTime: false,
  cupboardCaptureIdempotencyKey: "550e8400-e29b-41d4-a716-446655440000",
  cupboardCaptureResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        id: 0,
        err: 0,
        status: -10,
        successed: 0,
        msg: "",
        formId: 0,
        logId: 0,
        eventId: "",
        stockQuantity: 0,
      },
    },
  },
  //for api/TTAC/ImportTTacStatus
  importTTacStatusSystemId: -1,
  importTTacStatusLtId: -1,
  importTTacStatusTrigger: 0,
  importTTacStatusResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        id: 0,
        err: 0,
        status: 0,
        successed: 0,
        msg: "",
        formId: 0,
        logId: 0,
        eventId: "",
        stockQuantity: 0,
      },
    },
  },
  //for /api/TTAC/Titac?Id=1123156
  ttacRequestId: -1,
  ttacRequestIdTrigger:0,
  ttacResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        id: 0,
        err: 0,
        status: 0,
        successed: 0,
        msg: "",
        formId: 0,
        logId: 0,
        eventId: "",
        stockQuantity: 0,
      },
    },
  },
  setTTacResponse: (ttacResponse) => //for /api/TTAC/Titac?Id=1123156
    set({ ttacResponse }),
  setImportTTacStatusResponse: (importTTacStatusResponse) =>
    set({ importTTacStatusResponse }),
  setCupboardCaptureResponse: (cupboardCaptureResponse) =>
    set({ cupboardCaptureResponse }),
  setField: (field: string | number | symbol, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setGetInventoryBalanceResponse: (getInventoryBalanceResponse) =>
    set({ getInventoryBalanceResponse }),
  setFlowProductsSendAllResponse: (flowProductsSendAllResponse) =>
    set({ flowProductsSendAllResponse }),
}));
