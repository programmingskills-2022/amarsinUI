import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useUserStore } from "../store/userStore";
import {
  UserListRequest,
  UserListResponse,
  UserPermsRequest,
  UserPermsResponse,
} from "../types/user";

export function useUserList() {
  const {
    active,
    isOnline,
    systemId,
    destUsrId,
    setUserListResponse,
    setUserPermsResponse,
  } = useUserStore();

  // for api/User/userList?Active=0&IsOnline=0
  const userListQuery = useQuery<
    UserListResponse,
    Error,
    UserListResponse,
    unknown[]
  >({
    queryKey: ["userList", active, isOnline],
    queryFn: async () => {
      const params: UserListRequest = {
        active,
        isOnline,
      };
      const url: string = `/api/User/userList?Active=${params.active}&IsOnline=${params.isOnline}`;
      console.log(url, "url");
      const response = await api.get(url);
      console.log(response.data, "response.data");
      return response.data;
    },
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setUserListResponse(data);
    },
  } as UseQueryOptions<UserListResponse, Error, UserListResponse, unknown[]>);
  //for api/User/userPerms?SystemId=4&DestUsrId=0
  const userPermsQuery = useQuery<
    UserPermsResponse,
    Error,
    UserPermsResponse,
    unknown[]
  >({
    queryKey: ["userPerms", systemId, destUsrId],
    queryFn: async () => {
      const params: UserPermsRequest = {
        systemId,
        destUsrId,
      };

      const url: string = `/api/User/userPerms?SystemId=${params.systemId}&DestUsrId=${params.destUsrId}`;
      console.log(url, "url");
      const response = await api.get(url);
      console.log(response.data, "response.data");
      return response.data;
    },
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setUserPermsResponse(data);
    },
  } as UseQueryOptions<UserPermsResponse, Error, UserPermsResponse, unknown[]>);

  return {
    //for api/User/userList?Active=0&IsOnline=0
    refetchUserList: () => userListQuery.refetch(), // Optional manual trigger
    isLoadingUserList: userListQuery.isLoading || userListQuery.isFetching,
    errorUserList: userListQuery.error,
    userListResponse: userListQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { users: [] } },
    },
    //for api/User/userPerms?SystemId=4&DestUsrId=0
    refetchUserPerms: () => userPermsQuery.refetch(), // Optional manual trigger
    isLoadingUserPerms: userPermsQuery.isLoading || userPermsQuery.isFetching,
    errorUserPerms: userPermsQuery.error,
    userPermsResponse: userPermsQuery.data ?? {
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
  };
}
export default useUserList;
