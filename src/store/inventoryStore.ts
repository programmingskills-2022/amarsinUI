import { create } from "zustand";
import { InventoryState } from "../types/inventory";

export const useInventoryStore = create<InventoryState>()((set) => ({
  inventoryList: { err: 0, msg: "", rpProviderInventories: [] },
  accSystem: -1, // Provide a default value for accSystem
  accYear: -1, // Provide a default value for accYear
  brandId: -1, // Provide a default value for brandId
  //for Inventory/detail
  id: -1,
  inventoryDetailResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        id: -1,
        title: "",
        wName: "",
        pCode: "",
        pName: "",
        cnt: 0,
        code: "",
        irc: "",
        uid: "",
        status: 0,
        cupIdOther: 0,
        uidOther: "",
        statusOther: 0,
        stock: 0,
        cost: 0,
        cupId: 0,
        issue: 0,
      },
    },
  },
  //for api/Inventory/updateIssue?id=4537&issue=3
  inventoryUpdateIssueResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { id: 0, err: 0, msg: "", hasFlow: false, systemId: 0 } },
  },
  //for api/Inventory/updateCost?id=4537&cost=123000
  inventoryUpdateCostResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { id: 0, err: 0, msg: "", hasFlow: false, systemId: 0 } },
  },
  //for api/Inventory/productFlow?DId=5267
  dId: -1, //for api/Inventory/productFlow
  inventoryProductFlowResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: [] },
  },
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setInventoryList: (inventoryList) => set({ inventoryList }),
  setInventoryDetailResponse: (inventoryDetailResponse) =>
    set({ inventoryDetailResponse }), //for Inventory/detail
  setInventoryUpdateIssueResponse: (inventoryUpdateIssueResponse) =>
    set({ inventoryUpdateIssueResponse }), //for api/Inventory/updateIssue
  setInventoryUpdateCostResponse: (inventoryUpdateCostResponse) =>
    set({ inventoryUpdateCostResponse }), //for api/Inventory/updateCost
  setInventoryProductFlowResponse: (inventoryProductFlowResponse) =>
    set({ inventoryProductFlowResponse }), //for api/Inventory/productFlow
}));
