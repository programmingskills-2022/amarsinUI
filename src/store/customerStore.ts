import { create } from "zustand";
import { CustomerState } from "../types/customer";
export const useCustomerStore = create<CustomerState>()((set) => ({
  customerSearchResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: { total_count: 0, err: 0, msg: null, searchResults: [] } },
  },
  systemId: 0,
  yearId: 0,
  centerType: 0,
  search: "",
  page: 1, // Provide a default value for page
  lastId: 0, // Provide a default value for lastId
  usrPerm: false, // Provide a default value for usrPerm
  setField: (field: string, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setCustomerSearchResponse: (customerSearchResponse) =>
    set({ customerSearchResponse }),
}));
