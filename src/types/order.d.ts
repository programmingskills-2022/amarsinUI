// for /api/Order/orderRegShow?OrderId=1
interface Cup {
  id: number;
  code: string;
  eDate: string;
  cnt: number;
  oCnt: number;
}

interface OrderDtl {
  id: number;
  otId: number;
  pId: number;
  pName: string;
  cnt: number;
  oCnt: number;
  cost: number;
  dcrmntPrcnt: number;
  dcrmnt: number;
  tax: number;
  taxValue: number;
  poId: number;
  s1N: number;
  s1D: number;
  s2N: number;
  s2D: number;
  s3N: number;
  s3D: number;
  s4N: number;
  s4D: number;
  s5N: number;
  s5D: number;
  noOffer: boolean;
  offerNo: number;
  needPerm: boolean;
  roId: number;
  cups: Cup[];
  cupsErr: number;
  rCnt: number;
  roCnt: number;
  offer: number;
  stock: number;
  salePrice: number;
  rEdt: boolean;
}

interface OrderMst {
  id: number;
  dat: string;
  tim: string;
  cId: number;
  srName: string;
  blackList: boolean;
  exp: string;
  footerDescTxt: string;
  dsc: string;
  cash: boolean;
  customerDcrmntPrcnt: number;
  byPhone: boolean;
  urgency: boolean;
}

interface Result {
  err: number;
  msg: string;
  defaultWarehouseId: number;
  warehouseName: string;
  defaultPriceId: number;
  priceTitle: string;
  orderMst: OrderMst;
  orderDtls: OrderDtl[];
}

interface Data {
  result: Result;
}

interface Meta {
  errorCode: number;
  message: string;
  type: string;
}

interface OrderRegShowResponse {
  meta: Meta;
  data: Data;
}

//for /Order/orderReg
interface DtlsItem {
  id: number;
  cnt: number;
  oCnt: number;
  cost: string;
}

interface InOutsItem {
  id: number;
  otId: number;
  cnt: number;
  oCnt: number;
}

interface orderRegRequest {
  usrId: number;
  orderId: number;
  cash: boolean;
  byPhone: boolean;
  urgency: boolean;
  footerDescTxt: string;
  dsc: string;
  dtls: DtlsItem[];
  inOuts: InOutsItem[];
  autoRegistered: boolean;
}

interface OrderRegErrorMessage {
  systemId: number;
  id: number;
  err: number;
  msg: string;
  hasFlow: boolean;
}

interface OrderRegResult {
  id: number;
  err: number;
  msg: string;
  dtlErrMsgs: OrderRegErrorMessage[];
}

interface OrderRegData {
  result: OrderRegResult;
}

interface OrderRegResponse {
  meta: {
    errorCode: number;
    message: string;
    type: string;
  };
  data: OrderRegData;
}

//for /api/Order/orderSalesPrices?OrderId=850706&SalesPriceId=3
interface OrderSalesPrice {
  id: number;
  price: number;
}

interface ResultOrderSalesPrices {
  err: number;
  msg: string;
  orderSalesPrices: OrderSalesPrice[];
}

interface DataOrderSalesPrices {
  result: ResultOrderSalesPrices;
}

interface MetaOrderSalesPrices {
  errorCode: number;
  message: string;
  type: string;
}

interface OrderSalesPricesResponse {
  meta: MetaOrderSalesPrices;
  data: DataOrderSalesPrices;
}

//http://apitest.dotis.ir/api/Order/orderCupList?OrderDtlId=4172334&WarehauseId=8
interface OrderCupListRequest {
  OrderDtlId: number;
  OrderDtlIdTrigger: number;
  WarehauseId: number;
}

interface OrderCupList {
  iocId: number;
  cCode: string;
  fCode: string;
  fDate: string;
  cost: number;
  pDate: string;
  eDate: string;
  cPrice: number;
  cAmnt: number;
}

interface OrderCupListTbl extends OrderCupList {
  index: string;
  cnt: number;
  oCnt: number;
}

interface OrderCupListResponse {
  meta: {
    errorCode: number;
    message: string;
    type: string;
  };
  data: {
    result: {
      err: number;
      msg: string;
      orderCupLists: OrderCupList[];
    };
  };
}

interface InOuts {
  index: string;
  fCode: string;
  fDate: string;
  cCode: string;
  eDate: string;
  cAmnt: number;
  cnt: number;
  oCnt: number;
  iocId: number;
}

// api/Order/DtlUpdate
export interface DtlUpdateRequest {
  otId: number;
  pId: number;
  cnt: string;
  oCnt: string;
  dcrmntPrcnt: string;
  dcrmnt: string;
  cost: string;
  idempotencyKey: string;
}

export interface DtlUpdateResponse {
  meta: Meta;
  data: {
    result: number;
  };
}

export interface OrderState extends OrderCupListRequest {
  orderId: number;
  orderIdForSalesPrice: number;
  salesPriceId: number;
  orderRegShowResponse: OrderRegShowResponse;
  orderSalesPricesResponse: OrderSalesPricesResponse;
  orderCupListResponse: OrderCupListResponse;
  orderRegResponse: OrderRegResponse;
  dtlUpdateResponse:DtlUpdateResponse; //for api/Order/DtlUpdate
  setField: (field: string | number | symbol, value: any) => void;
  setOrderRegShowResponse: (orderRegShowResponse: OrderRegShowResponse) => void;
  setOrderRegResponse: (orderRegResponse: orderRegResponse) => void;
  setOrderSalesPricesResponse: (
    orderSalesPricesResponse: OrderSalesPricesResponse
  ) => void;
  setOrderCupListResponse: (orderCupListResponse: OrderCupListResponse) => void;
  setDtlUpdateResponse: (dtlUpdateResponse: DtlUpdateResponse) => void; //for api/Order/DtlUpdate
}
