import { Meta } from "./general";

///api/CupboardsReport/report?systemId=4&yearId=15&err=false&errId=0&existsCupboards=true&recent=false&pageNumber=1&sortCode=0&sortFullCode=0&sortFullName=0&sortTtac=0&sortADProdDate=0&sortADExpDate=0&sortProductGTIN=0&sortProductIRC=0&sortUID=0
export interface CupboardsReportRequest {
  systemId: number;
  yearId: number;
  err: boolean;
  errId: number;
  existsCupboards: boolean;
  recent: boolean;
  pageNumber: number;
  srchCode: string;
  srchFullCode: string;
  srchFullName: string;
  srchTtac: string;
  srchADProdDate: string;
  srchADExpDate: string;
  srchProductGTIN: string;
  srchProductIRC: string;
  srchUID: string;
  sortCode: number;
  sortFullCode: number;
  sortFullName: number;
  sortTtac: number;
  sortADProdDate: number;
  sortADExpDate: number;
  sortProductGTIN: number;
  sortProductIRC: number;
  sortUID: number;
}

interface ResultCupboardsReport {
  id: number;
  code: string;
  fullCode: string;
  fullName: string;
  ttac: boolean;
  prodDate: string;
  expDate: string;
  gtin: string;
  irc: string;
  uid: string;
  tmp: number;
  inc: number;
  outc: number;
  stck: number;
  status: number;
}

interface DataCupboardsReport {
  result: ResultCupboardsReport[];
  total_count: number;
}
export interface CupboardsReportResponse {
  meta: Meta;
  data: DataCupboardsReport;
}

export interface CupboardsReportState extends CupboardsReportRequest {
    cupboardsReportResponse: CupboardsReportResponse;
    setField: (field: string, value: any) => void;
    setCupboardsReportResponse: (
      cupboardsReportResponse: CupboardsReportResponse
    ) => void;
  }
