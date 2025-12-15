import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useUserStore } from "../store/userStore";
import {
  AddRemoveChartPermissionRequest,
  AddRemovePermissionRequest,
  AddRemoveSalesPricePermissionRequest,
  AddRemoveSystemPermissionRequest,
  DisableEnableRequest,
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
    setDisableEnableResponse, //for api/user/disableEnable
    setAddRemovePermissionResponse, //for api/user/addRemovePermission
    setAddRemoveChartPermissionResponse, //for api/user/addRemoveChartPermission
    setAddRemoveSystemPermissionResponse, //for api/user/addRemoveSystemPermission
    setAddRemoveSalesPricePermissionResponse, //for api/user/addRemoveSalesPricePermission
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
      console.log(params, "params");
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
  //for api/user/disableEnable
  const disableEnableMutation = useMutation({
    mutationFn: async (request: DisableEnableRequest) => {
      const url: string = `/api/user/disableEnable`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setDisableEnableResponse(data);
    },
  });
  //for api/user/addRemovePermission
  const addRemovePermissionMutation = useMutation({
    mutationFn: async (request: AddRemovePermissionRequest) => {
      const url: string = `/api/user/addRemovePermission`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setAddRemovePermissionResponse(data);
    },
  });
  //for api/user/addRemoveChartPermission
  const addRemoveChartPermissionMutation = useMutation({
    mutationFn: async (request: AddRemoveChartPermissionRequest) => { 
      const url: string = `/api/user/addRemoveChartPermission`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setAddRemoveChartPermissionResponse(data);
    },
  });
  //for api/user/addRemoveSystemPermission
  const addRemoveSystemPermissionMutation = useMutation({
    mutationFn: async (request: AddRemoveSystemPermissionRequest) => {
      const url: string = `/api/user/addRemoveSystemPermission`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setAddRemoveSystemPermissionResponse(data);
    },
  });
  //for api/user/addRemoveSalesPricePermission
  const addRemoveSalesPricePermissionMutation = useMutation({
    mutationFn: async (request: AddRemoveSalesPricePermissionRequest) => {
      const url: string = `/api/user/addRemoveSalesPricePermission`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setAddRemoveSalesPricePermissionResponse(data);
    },
  });
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
    //for api/user/disableEnable
    isLoadingDisableEnable: disableEnableMutation.isPending,
    errorDisableEnable: disableEnableMutation.error,
    disableEnable: disableEnableMutation.mutateAsync,
    disableEnableResponse: disableEnableMutation.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { err: "", msg: "" } },
    },
    //for api/user/addRemovePermission
    isLoadingAddRemovePermission: addRemovePermissionMutation.isPending,
    errorAddRemovePermission: addRemovePermissionMutation.error,
    addRemovePermission: addRemovePermissionMutation.mutateAsync,
    addRemovePermissionResponse: addRemovePermissionMutation.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { err: "", msg: "" } },
    },
    //for api/user/addRemoveChartPermission
    isLoadingAddRemoveChartPermission: addRemoveChartPermissionMutation.isPending,
    errorAddRemoveChartPermission: addRemoveChartPermissionMutation.error,
    addRemoveChartPermission: addRemoveChartPermissionMutation.mutateAsync,
    addRemoveChartPermissionResponse: addRemoveChartPermissionMutation.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { err: "", msg: "" } },
    },
    //for api/user/addRemoveSystemPermission
    isLoadingAddRemoveSystemPermission: addRemoveSystemPermissionMutation.isPending,
    errorAddRemoveSystemPermission: addRemoveSystemPermissionMutation.error,
    addRemoveSystemPermission: addRemoveSystemPermissionMutation.mutateAsync,
    addRemoveSystemPermissionResponse: addRemoveSystemPermissionMutation.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { err: "", msg: "" } },
    },
    //for api/user/addRemoveSalesPricePermission
    isLoadingAddRemoveSalesPricePermission: addRemoveSalesPricePermissionMutation.isPending,
    errorAddRemoveSalesPricePermission: addRemoveSalesPricePermissionMutation.error,
    addRemoveSalesPricePermission: addRemoveSalesPricePermissionMutation.mutateAsync,
    addRemoveSalesPricePermissionResponse: addRemoveSalesPricePermissionMutation.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { err: "", msg: "" } },
    },
  };
}
export default useUserList;
