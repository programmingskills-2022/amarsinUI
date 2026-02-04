import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useInventoryStore } from "../store/inventoryStore";
import {
  InventoryList,
  InventoryGoodListRequest,
  InventoryDetailResponse,
  InventoryUpdateIssueRequest,
  InventoryUpdateCostRequest,
  InventoryProductFlowResponse,
} from "../types/inventory";

export function useInventory() {
  const {
    accSystem,
    accYear,
    brandId,
    setInventoryList,
    id,
    dId,//for api/Inventory/productFlow
    setInventoryDetailResponse, //for api/Inventory/detail
    setInventoryUpdateIssueResponse, //for api/Inventory/updateIssue
    setInventoryUpdateCostResponse, //for api/Inventory/updateCost
    setInventoryProductFlowResponse, //for api/Inventory/productFlow
  } = useInventoryStore();

  const query = useQuery<InventoryList, Error, InventoryList, unknown[]>({
    queryKey: ["inventoryList", accSystem, accYear, brandId],
    queryFn: async () => {
      const params: InventoryGoodListRequest = {
        accSystem,
        accYear,
        brandId,
      };
      const url: string = `/api/ProviderInventory/list?accSystem=${params.accSystem}&accYear=${params.accYear}&brandId=${params.brandId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: accSystem !== -1 && accYear !== -1 && brandId !== -1, // Only fetch if params are available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setInventoryList(data);
    },
  } as UseQueryOptions<InventoryList, Error, InventoryList, unknown[]>);

  // http://apitest.dotis.ir/api/Inventory/detail/4720
  const inventoryDetailQuery = useQuery<
    InventoryDetailResponse,
    Error,
    InventoryDetailResponse,
    unknown[]
  >({
    queryKey: ["inventoryDetail", id],
    queryFn: async () => {
      const url: string = `/api/Inventory/detail/${id}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: id !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setInventoryDetailResponse(data);
    },
  } as UseQueryOptions<InventoryDetailResponse, Error, InventoryDetailResponse, unknown[]>);

  //for api/Inventory/updateIssue?id=4537&issue=3
  const InventoryUpdateIssue = useMutation({
    mutationFn: async (request: InventoryUpdateIssueRequest) => {
      const url = `/api/Inventory/updateIssue?id=${request.id}&issue=${request.issue}`;
      const response = await api.post(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setInventoryUpdateIssueResponse(data);
    },
  });

  //for api/Inventory/updateCost?id=4537&cost=123000
  const InventoryUpdateCost = useMutation({
    mutationFn: async (request: InventoryUpdateCostRequest) => {
      const url = `/api/Inventory/updateCost?id=${request.id}&cost=${request.cost}`;
      const response = await api.post(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setInventoryUpdateCostResponse(data);
    },
  });
  // for api/Inventory/productFlow?DId=5267
  const inventoryProductFlowQuery = useQuery<
    InventoryProductFlowResponse,
    Error,
    InventoryProductFlowResponse,
    unknown[]
  >({
    queryKey: ["inventoryProductFlow", dId],
    queryFn: async () => {
      const url: string = `/api/Inventory/productFlow?DId=${dId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: dId !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setInventoryProductFlowResponse(data);
    },
  } as UseQueryOptions<InventoryProductFlowResponse, Error, InventoryProductFlowResponse, unknown[]>);
  return {
    //getInventoryList: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    inventoryList: query.data ?? { err: 0, msg: "", rpProviderInventories: [] },
    // for Inventory/detail
    refetchInventoryDetail: inventoryDetailQuery.refetch,
    isLoadingInventoryDetail: inventoryDetailQuery.isLoading,
    errorInventoryDetail: inventoryDetailQuery.error,
    inventoryDetailResponse: inventoryDetailQuery.data ?? {
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
    //for api/Inventory/updateIssue
    inventoryUpdateIssue: InventoryUpdateIssue.mutateAsync,
    isLoadingInventoryUpdateIssue: InventoryUpdateIssue.isPending,
    errorInventoryUpdateIssue: InventoryUpdateIssue.error,
    inventoryUpdateIssueResponse: InventoryUpdateIssue.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { id: 0, err: 0, msg: "", hasFlow: false, systemId: 0 } },
    },

    //for api/Inventory/updateCost
    inventoryUpdateCost: InventoryUpdateCost.mutateAsync,
    isLoadingInventoryUpdateCost: InventoryUpdateCost.isPending,
    errorInventoryUpdateCost: InventoryUpdateCost.error,
    inventoryUpdateCostResponse: InventoryUpdateCost.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { id: 0, err: 0, msg: "", hasFlow: false, systemId: 0 } },
    },
    //for api/Inventory/productFlow
    inventoryProductFlow: inventoryProductFlowQuery.refetch,
    isLoadingInventoryProductFlow: inventoryProductFlowQuery.isLoading,
    errorInventoryProductFlow: inventoryProductFlowQuery.error,
    inventoryProductFlowResponse: inventoryProductFlowQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [] },
    },
  };
}
