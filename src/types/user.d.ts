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
};
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

export interface userState extends UserListRequest, UserPermsRequest{
  userListResponse: UserListResponse;
  userPermsResponse: UserPermsResponse;
  setField: (field: string | number | symbol, value: any) => void;
  setUserListResponse: (userListResponse: UserListResponse) => void;
  setUserPermsResponse: (userPermsResponse: UserPermsResponse) => void;
}
