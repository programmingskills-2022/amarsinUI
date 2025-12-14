import { Meta } from "./general";
//api/User/userList?ParentId=104&Active=-1&IsOnline=-1
interface UserListRequest {
  active: number;
  isOnline: number;
}
type User = {
  id: number;
  userName: string;
  nam: string;
  pass: string;
  parent: number;
  pDisplayName: string;
  displayName: string;
  active: boolean;
};
interface UserListResponse {
  meta: Meta;
  data: {
    result: {
      users: User[];
    };
  };
}
//api/User/userPerms?SystemId=4&DestUsrId=0

interface UserPermsRequest {
  systemId: number;
  destUsrId: number;
}
interface UserPermsResponse {
  meta: Meta;
  data: {
    result: {
      permissions: UserPerms[];
      systemUserPerms: SystemUserPerms[];
      usrChartsPerms: UsrChartsPerms[];
      salesPriceUserPerms: SalesPriceUserPerms[];
    };
  };
}
interface UserPerms {
  progpartId: number;
  parent: number;
  nam: string;
  usrId: number;
  checked: boolean;
}

interface SystemUserPerms {
  id: number;
  parent: number;
  title: string;
  slct: boolean; // 0: false, 1: true for checked
  acc_System: number;
}

interface UsrChartsPerms {
  id: number;
  parent: number;
  name: string;
  slct: boolean; // 0: false, 1: true for checked
  chart: number;
  chartId: number;
}

interface SalesPriceUserPerms {
  salesPriceId: number;
  title: string;
  slct: boolean; // 0: false, 1: true for checked
}
// api/user/disableEnable
interface DisableEnableRequest {
  userId: number;
  active: boolean;
  sourceCall: string;
  idempotencyKey: string;
}

interface DisableEnableResponse {
  meta: Meta;
  data: {
    result: {
      err: string;
      msg: string;
    };
  };
}
interface AddRemoveRequest {
  systemId: number;
  usrId: number;
  sourceCall: string;
  sourceCallLogId: number;
  idempotencyKey: string;
}
///api/User/addRemovePermission
interface AddRemovePermissionRequest extends AddRemoveRequest {
  progPartId: number;
}
interface AddRemovePermissionResponse {
  meta: Meta;
  data: {
    result: { err: string; msg: string };
  };
}
///api/User/addRemoveChartPermission
interface AddRemoveChartPermissionRequest extends AddRemoveRequest {
  chartId: number;
}
interface AddRemoveChartPermissionResponse {
  meta: Meta;
  data: {
    result: { err: string; msg: string };
  };
}
///api/User/addRemoveSystemPermission
interface AddRemoveSystemPermissionRequest extends AddRemoveRequest {
  targetSystemId: number;
}
interface AddRemoveSystemPermissionResponse {
  meta: Meta;
  data: {
    result: { err: string; msg: string };
  };
}
///api/User/addRemoveSalesPricePermission
interface AddRemoveSalesPricePermissionRequest extends AddRemoveRequest {
  salesPriceId: number;
}
interface AddRemoveSalesPricePermissionResponse {
  meta: Meta;
  data: {
    result: { err: string; msg: string };
  };
}
export interface userState extends UserListRequest, UserPermsRequest {
  userListResponse: UserListResponse;
  userPermsResponse: UserPermsResponse;
  disableEnableResponse: DisableEnableResponse;
  addRemovePermissionResponse: AddRemovePermissionResponse;
  addRemoveChartPermissionResponse: AddRemoveChartPermissionResponse;
  addRemoveSystemPermissionResponse: AddRemoveSystemPermissionResponse;
  addRemoveSalesPricePermissionResponse: AddRemoveSalesPricePermissionResponse;
  setField: (field: string | number | symbol, value: any) => void;
  setUserListResponse: (userListResponse: UserListResponse) => void;
  setUserPermsResponse: (userPermsResponse: UserPermsResponse) => void;
  setDisableEnableResponse: (
    disableEnableResponse: DisableEnableResponse
  ) => void;
  setAddRemovePermissionResponse: (
    addRemovePermissionResponse: AddRemovePermissionResponse
  ) => void;
  setAddRemoveChartPermissionResponse: (
    addRemoveChartPermissionResponse: AddRemoveChartPermissionResponse
  ) => void;
  setAddRemoveSystemPermissionResponse: (
    addRemoveSystemPermissionResponse: AddRemoveSystemPermissionResponse
  ) => void;
  setAddRemoveSalesPricePermissionResponse: (
    addRemoveSalesPricePermissionResponse: AddRemoveSalesPricePermissionResponse
  ) => void;
}
