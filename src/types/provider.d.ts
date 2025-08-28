  export type ProviderItem = {
    id: number;
    name: string;
    cnt: number;
    total: number;
    offerCnt: number;
  };

export type ProviderItemTbl = {
  id: string;
  index: string;
  cnt: string;
  total: string;
  offerCnt: string;
};

export type ProviderList = {
  err: number;
  msg: string;
  rpProviders: ProviderItem[];
};

export interface ProviderListRequest {
  accSystem: number;
  accYear: number;
  brandId: number;
  sanadKind: number;
  fDate: string;
  tDate: string;
}

type CupInfo = {
  iocId: number;
  code: string;
  expDate: string;
};

interface ProviderDetail {
  id: number;
  kind: string;
  factorNo: string;
  dat: string; // date in "YYYY/MM/DD" format
  customerId: number;
  srName: string;
  nId: string;
  productId: number;
  bName: string;
  cnt: number;
  offerCnt: number;
  cost: number;
  dcrmnt: number;
  valueTax: number;
  total: number;
  shRId: number;
  shRDate: string; // date in "YYYY/MM/DD" format
  cupInfoes: CupInfo[];
}

interface ProviderDetailTable {
  id: number;
  kind: string;
  factorNo: string;
  dat: string; // date in "YYYY/MM/DD" format
  customerId: number;
  srName: string;
  nId: string;
  productId: number;
  bName: string;
  cnt: number;
  offerCnt: number;
  cost: number;
  dcrmnt: number;
  valueTax: number;
  total: number;
  shRId: number;
  shRDate: string; // date in "YYYY/MM/DD" format
  cupInfoes: string
}
interface ProviderDetailTbl {
  id: string;
  kind: string;
  factorNo: string;
  dat: string; // date in "YYYY/MM/DD" format
  customerId: string;
  srName: string;
  nId: string;
  productId: string;
  bName: string;
  cnt: string;
  offerCnt: string;
  cost: string;
  dcrmnt: string;
  valueTax: string;
  total: string;
  shRId: string;
  shRDate: string; // date in "YYYY/MM/DD" format
  cupInfoes: string
}

export type ProviderDetailList = {
  err: number;
  msg: string;
  rpProviderDetails: ProviderDetail[];
};

export type ProvidertDetailListRequest = ProviderListRequest & {
  productId: number;
};

export interface ProviderState extends ProviderListRequest {
  providerList: ProviderList;
  setField: (field: keyof ProviderListRequest, value: any) => void;
  setProviderList: (providerList: RpProviderListResponse) => void;
}

export interface ProviderDetailState {
  productId: number;
  sanadKind: number;
  fDate: string;
  tDate: string;
  providerList: ProviderList;
  accSystem: number;
  accYear: number;
  brandId: number;
  providerDetailList: ProviderDetailList;
  setField: (field: string | number | symbol, value: any) => void;
  setProviderDetailList: (providerDetailList: ProviderDetailList) => void;
}
