import { create } from "zustand";
import { userState } from "../types/user";

export const useUserStore = create<userState>()((set) => ({
  // api/User/userList?Active=0&IsOnline=0
  active: -1,
  isOnline: -1,
  userListResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { users: [] } },
  },
  // api/User/userPerms?SystemId=4&DestUsrId=0
  systemId: -1,
  destUsrId: 0,
  userPermsResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        permissions: [],
        systemUserPerms: [],
        usrChartsPerms: [],
        salesPriceUserPerms: [],
      },
    },
  },
  // api/user/disableEnable
  disableEnableResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: "", msg: "" } }, 
  },
  // api/user/addRemovePermission
  addRemovePermissionResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: "", msg: "" } },
  },
  // api/user/addRemoveChartPermission
  addRemoveChartPermissionResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: "", msg: "" } },
  },
  // api/user/addRemoveSystemPermission
  addRemoveSystemPermissionResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: "", msg: "" } },
  },
  // api/user/addRemoveSalesPricePermission
  addRemoveSalesPricePermissionResponse: {
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { err: "", msg: "" } },
  },
  setField: (field: string | number | symbol, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setUserListResponse: (userListResponse) => set({ userListResponse }),
  setUserPermsResponse: (userPermsResponse) => set({ userPermsResponse }),
  setDisableEnableResponse: (disableEnableResponse) =>
    set({ disableEnableResponse }),
  setAddRemovePermissionResponse: (addRemovePermissionResponse) =>
    set({ addRemovePermissionResponse }),
  setAddRemoveChartPermissionResponse: (addRemoveChartPermissionResponse) =>
    set({ addRemoveChartPermissionResponse }),
  setAddRemoveSystemPermissionResponse: (addRemoveSystemPermissionResponse) =>
    set({ addRemoveSystemPermissionResponse }),
  setAddRemoveSalesPricePermissionResponse: (addRemoveSalesPricePermissionResponse) =>
    set({ addRemoveSalesPricePermissionResponse }),
}));
