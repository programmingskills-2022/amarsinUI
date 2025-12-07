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
    data: { result: { permissions: [] } },
  },
  setField: (field: string | number | symbol, value: any) =>
    set((state) => ({ ...state, [field]: value })),
  setUserListResponse: (userListResponse) => set({ userListResponse }),
  setUserPermsResponse: (userPermsResponse) => set({ userPermsResponse }),
}));
