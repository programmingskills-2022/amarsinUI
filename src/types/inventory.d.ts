import { Meta, UpdateResult } from "./general";

export interface InventoryItem {
  id: number | string;
  bn: string;
  fn: string;
  s: string;
  ns: number;
  c: number;
  uid: string;
  gtin: string;
  ed: string;
}
export interface InventoryItemTbl {
  id: string;
  bn: string;
  fn: string;
  s: string;
  ns: string;
  c: string;
  uid: string;
  gtin: string;
  ed: string;
}

export interface InventoryList {
  err: number;
  msg: string;
  rpProviderInventories: InventoryItem[];
}

export interface InventoryGoodListRequest {
  accSystem: number;
  accYear: number;
  brandId: number;
}

//http://apitest.dotis.ir/api/Inventory/detail/4720
export interface InventoryDetailRequest {
  id: number;
}

interface InventoryDetailResult {
  id: number;
  title: string;
  wName: string;
  pCode: string;
  pName: string;
  cnt: number;
  code: string;
  irc: string;
  uid: string;
  status: number;
  cupIdOther: number;
  uidOther: string;
  statusOther: number;
  stock: number;
  cost: number;
  cupId: number;
  issue: number;
}

interface InventoryDetailData {
  result: InventoryDetailResult;
}

interface InventoryDetailResponse {
  meta: Meta;
  data: InventoryDetailData;
}
//for api/Inventory/updateIssue?id=4537&issue=3
interface InventoryUpdateIssueRequest {
  id: number;
  issue: number;
}
interface InventoryUpdateResponse {
  meta: Meta;
  data: { result: UpdateResult };
}
//for /api/Inventory/updateCost?id=4537&cost=123000
interface InventoryUpdateCostRequest {
  id: number;
  cost: string;
}
//response is in line 76

//api/Inventory/productFlow?DId=5267
export interface InventoryProductFlowResponse {
  meta: Meta;
  data: InventoryProductFlowData;
}
export interface InventoryProductFlowData {
  result: InventoryProductFlowItem[];
}
export interface InventoryProductFlowItem {
  id: number;
  strFrm: string;
  code: string;
  dat: string;      // date in format "YYYY/MM/DD" or "YYYY/MM/DD" with Persian calendar
  srName: string;
  iocId: number;
  cupCode: string;
  cnt: number;
  cost: number;
  tCost: number;
}
export interface InventoryState extends InventoryGoodListRequest {
  dId: number; //for api/Inventory/productFlow
  inventoryList: InventoryList;
  id: number; // for Inventory/detail
  inventoryDetailResponse: InventoryDetailResponse; //for Inventory/detail
  inventoryUpdateIssueResponse: InventoryUpdateResponse; //for api/Inventory/updateIssue
  inventoryUpdateCostResponse: InventoryUpdateResponse; //for api/Inventory/updateCost
  inventoryProductFlowResponse: InventoryProductFlowResponse; //for api/Inventory/productFlow
  setField: (field: string, value: any) => void;
  setInventoryList: (inventoryList: InventoryList) => void;
  setInventoryDetailResponse: (
    inventoryDetailResponse: InventoryDetailResponse
  ) => void; // for Inventory/detail
  setInventoryUpdateIssueResponse: (
    inventoryUpdateIssueResponse: InventoryUpdateIssueResponse
  ) => void; //for api/Inventory/updateIssue
  setInventoryUpdateCostResponse: (
    inventoryUpdateCostResponse: InventoryUpdateResponse
  ) => void; //for api/Inventory/updateCost
  setInventoryProductFlowResponse: (
    inventoryProductFlowResponse: InventoryProductFlowResponse
  ) => void; //for api/Inventory/productFlow
}
