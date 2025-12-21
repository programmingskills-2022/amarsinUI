import { Meta } from "./general";
//for /api/TTAC/GetInventoryBalance?SystemId=4&YearId=15&SortId=0&SortIRC=0&SortLotNumber=0&SortWStock=0&SortCnt=0&SortNotSent=0&SortTCnt=0&PageNumber=1
interface GetInventoryBalanceRequest {
  systemId: number;
  yearId: number;
  hasErr: boolean;
  srchIRC: string;
  srchLotNumber: string;
  sortId: number;
  sortIRC: number;
  sortLotNumber: number;
  sortWStock: number;
  sortCnt: number;
  sortNotSent: number;
  sortTCnt: number;
  pageNumber: number;
}
interface GetInventoryBalanceItem {
  id: number;
  irc: string;
  lotNumber: string;
  wStock: number;
  cnt: number;
  notSent: number;
  tCnt: number;
}

interface GetInventoryBalanceData {
  result: GetInventoryBalanceItem[];
  total_count: number;
}

interface GetInventoryBalanceResponse {
  meta: Meta;
  data: GetInventoryBalanceData;
}
//http://apitest.dotis.ir/api/TTAC/FlowProductsSendAll?SystemId=4&YearId=15&Date=1404%2F02%2F08&ttacSent=false&PageNumber=1&SortId=0&SortFId=0&SortTId=0&SortPId=0&SortIRC=0&SortPName=0&SortEventId=0&SortErr=0&SortMsg=0&SortTitle=0&SortCode=0&SortDat=0&SortSrName=0&SortLotNumber=0&SortCnt=0&SortSuccessed=0&SortIsCancel=0&SortFlowMapName=0&SortCompleteDate=0
interface FlowProductsSendAllRequest {
  sendSystemId: number;
  sendYearId: number;
  sendDate: string;
  sendTtacSent: boolean;
  sendPageNumber: number;
  sendSrchCode: string;
  sendSrchIRC: string;
  sendSrchPName: string;
  sendSrchEventId: string;
  sendSrchMsg: string;
  sendSrchTitle: string;
  sendSrchDat: string;
  sendSrchSrName: string;
  sendSrchLotNumber: string;
  sendSrchSuccessed: string;
  sendSrchIsCancel: string;
  sendSrchFlowMapName: string;
  sendSrchCompleteDate: string;
  sendSortId: number;
  sendSortFId: number;
  sendSortTId: number;
  sendSortPId: number;
  sendSortIRC: number;
  sendSortPName: number;
  sendSortEventId: number;
  sendSortErr: number;
  sendSortMsg: number;
  sendSortTitle: number;
  sendSortCode: number;
  sendSortDat: number;
  sendSortSrName: number;
  sendSortLotNumber: number;
  sendSortCnt: number;
  sendSortSuccessed: number;
  sendSortIsCancel: number;
  sendSortFlowMapName: number;
  sendSortCompleteDate: number;
}
interface FlowProductsSendAllResult {
  id: number;
  fId: number;
  tId: number;
  pId: number;
  irc: string;
  pName: string;
  eventId: string;
  err: number;
  msg: string;
  title: string;
  code: string;
  dat: string;
  srName: string;
  lotNumber: string;
  cnt: string;
  successed: number;
  isCancel: number;
  flowMapName: string;
  completeDate: string;
}

interface FlowProductsSendAllData {
  result: FlowProductsSendAllResult[];
  total_count: number;
}

export interface FlowProductsSendAllResponse {
  meta: Meta;
  data: FlowProductsSendAllData;
}
//api/TTAC/CupboardCapture?Id=3936018&CurrentDateTime=false
//request in state:
/*interface CupboardCaptureRequest {
  id: number;
  currentDateTime: boolean;
}*/
interface Result {
  id: number;
  err: number;
  status: number;
  successed: number;
  msg: string;
  formId: number;
  logId: number;
  eventId: string;
  stockQuantity: number;
}

interface DataCupboardCapture {
  result: Result;
}
export interface CupboardCaptureResponse {
  meta: Meta;
  data: DataCupboardCapture;
}

///api/TTAC/ImportTtacStatus?SystemId=4&ltId=620871
//request in state:
/*interface ImportTTacStatusRequest {
  systemId: number;
  ltId: number;
}*/
interface ImportTTacStatusResponse {
  meta: Meta;
  data: ImportTTacStatusData;
}
interface ImportTTacStatusData {
  result: Result;
}
//  http://apitest.dotis.ir/api/TTAC/Titac?Id=1123156
export interface TTacResponse{
  meta: Meta;
  data: DataTitac;
}
interface DataTitac {
  result: Result;
}

export interface ttacState
  extends GetInventoryBalanceRequest,
    FlowProductsSendAllRequest {
  cupboardCaptureId: number; //for api/TTAC/CupboardCapture
  cupboardCaptureCurrentDateTime: boolean; //for api/TTAC/CupboardCapture
  cupboardCaptureIdempotencyKey: string; //for api/TTAC/CupboardCapture
  importTTacStatusSystemId: number; //for api/TTAC/ImportTTacStatus
  importTTacStatusLtId: number; //for api/TTAC/ImportTTacStatus
  importTTacStatusTrigger: number; //for api/TTAC/ImportTTacStatus - triggers refetch
  ttacRequestId:number; // for /api/TTAC/Titac?Id=1123156
  ttacRequestIdTrigger:number;// for /api/TTAC/Titac?Id=1123156
  getInventoryBalanceResponse: GetInventoryBalanceResponse;
  flowProductsSendAllResponse: FlowProductsSendAllResponse;
  cupboardCaptureResponse: CupboardCaptureResponse; //for api/TTAC/CupboardCapture
  importTTacStatusResponse: ImportTTacStatusResponse; //for api/TTAC/ImportTTacStatus
  ttacResponse: TTacResponse; // for /api/TTAC/Titac?Id=1123156
  setField: (field: string | number | symbol, value: any) => void;
  setGetInventoryBalanceResponse: (
    getInventoryBalanceResponse: GetInventoryBalanceResponse
  ) => void;
  setFlowProductsSendAllResponse: (
    flowProductsSendAllResponse: FlowProductsSendAllResponse
  ) => void;
  setCupboardCaptureResponse: (
    cupboardCaptureResponse: CupboardCaptureResponse
  ) => void;
  setImportTTacStatusResponse: (
    importTTacStatusResponse: ImportTTacStatusResponse
  ) => void;
  setTTacResponse: (
    ttacResponse: TTacResponse
  ) => void;
}
