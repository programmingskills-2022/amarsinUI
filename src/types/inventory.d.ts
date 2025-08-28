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


export interface InventoryState extends InventoryGoodListRequest{
    inventoryList:InventoryList
    setField: (field: keyof InventoryGoodListRequest, value: any) => void;
    setInventoryList:(inventoryList:InventoryList) =>void
    
}