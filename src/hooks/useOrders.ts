import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useOrderStore } from "../store/orderStore";
import {
  DtlUpdateRequest,
  DtlUpdateResponse,
  OrderCupListResponse,
  orderRegRequest,
  OrderRegResponse,
  OrderRegShowResponse,
  OrderSalesPricesResponse,
} from "../types/order";

export function useOrders() {
  const {
    orderId,
    orderIdForSalesPrice,
    setOrderRegShowResponse,
    setOrderRegResponse,
    salesPriceId,
    setOrderSalesPricesResponse,
    setOrderCupListResponse,
    setDtlUpdateResponse,
    OrderDtlId,
    OrderDtlIdTrigger,
    WarehauseId,
  } = useOrderStore();
  const queryClient = useQueryClient();
  //for Order/orderCupList
  const orderCupListQuery = useQuery<
    OrderCupListResponse,
    Error,
    OrderCupListResponse,
    unknown[]
  >({
    queryKey: ["orderCupList", OrderDtlId, OrderDtlIdTrigger, WarehauseId],
    queryFn: async () => {
      const url = `/api/Order/orderCupList?OrderDtlId=${OrderDtlId}&WarehauseId=${WarehauseId}`;
      console.log(url, "url");
      const response = await api.get(url);
      console.log(response.data)
      return response.data;
    },
    onSuccess: (data: any) => {
      setOrderCupListResponse(data);
    },
    enabled: OrderDtlId !== -1 && WarehauseId !== -1, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
  } as UseQueryOptions<OrderCupListResponse, Error, OrderCupListResponse, unknown[]>);
  //for Order/orderSalesPrices
  const orderSalesPricesQuery = useQuery<
    OrderSalesPricesResponse,
    Error,
    OrderSalesPricesResponse,
    unknown[]
  >({
    queryKey: ["orderSalesPrices", orderIdForSalesPrice, salesPriceId],
    queryFn: async () => {
      const url = `/api/Order/orderSalesPrices?OrderId=${orderIdForSalesPrice}&SalesPriceId=${salesPriceId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: orderIdForSalesPrice !== -1 && salesPriceId !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setOrderSalesPricesResponse(data);
    },
  } as UseQueryOptions<OrderSalesPricesResponse, Error, OrderSalesPricesResponse, unknown[]>);
  //for Order/orderReg
  const orderRegfn = useMutation({
    mutationFn: async (request: orderRegRequest) => {
      const url: string = `api/Order/orderReg `;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: OrderRegResponse) => {
      console.log(data, "data in order reg");
      setOrderRegResponse(data);
    },
  });
  //for Order/DtlUpdate
  const dtlUpdatefn = useMutation({
    mutationFn: async (request: DtlUpdateRequest) => {
      const url: string = `/api/Order/DtlUpdate`;
      const response = await api.put(url, request);
      return response.data;
    },
    onSuccess: (data: DtlUpdateResponse) => {
      console.log(data, "data in dtl update");
      setDtlUpdateResponse(data);
      queryClient.invalidateQueries({ queryKey: ["orders", orderId]  });
    },
  });
  //for Order/orderRegShow
  const orderRegShowQuery = useQuery<
    OrderRegShowResponse,
    Error,
    OrderRegShowResponse,
    unknown[]
  >({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const url = `/api/Order/orderRegShow?OrderId=${orderId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: orderId !== 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setOrderRegShowResponse(data);
    },
  } as UseQueryOptions<OrderRegShowResponse, Error, OrderRegShowResponse, unknown[]>);

  return {
    //output for Order/orderCupList
    isLoadingOrderCupList: orderCupListQuery.isLoading,
    errorOrderCupList: orderCupListQuery.error,
    orderCupListResponse: orderCupListQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          err: 0,
          msg: "",
          orderCupLists: [],
        },
      },
    },
    //output for Order/orderSalesPrices
    isLoadingOrderSalesPrices: orderSalesPricesQuery.isLoading,
    errorOrderSalesPrices: orderSalesPricesQuery.error,
    orderSalesPricesResponse: orderSalesPricesQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          err: 0,
          msg: "",
          orderSalesPrices: [],
        },
      },
    },
    //output for Order/orderReg
    isLoadingOrderReg: orderRegfn.isPending,
    errorOrderReg: orderRegfn.error,
    orderReg: orderRegfn.mutateAsync,
    orderRegResponse: orderRegfn.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          id: 0,
          err: 0,
          msg: "",
          dtlErrMsgs: [],
        },
      },
    },
    //output for Order/DtlUpdate
    isLoadingDtlUpdate: dtlUpdatefn.isPending,
    errorDtlUpdate: dtlUpdatefn.error,
    dtlUpdate: dtlUpdatefn.mutateAsync,
    dtlUpdateResponse: dtlUpdatefn.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: 0,
      },
    },
    //output for Order/orderRegShow
    refetchOrderRegShow: () => orderRegShowQuery.refetch(),
    isLoadingOrderRegShow: orderRegShowQuery.isLoading,
    errorOrderRegShow: orderRegShowQuery.error,
    orderRegShowResponse: orderRegShowQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          err: 0,
          msg: "",
          defaultWarehouseId: 0,
          warehouseName: "",
          defaultPriceId: 0,
          priceTitle: "",
          orderMst: {
            id: 0,
            dat: "",
            tim: "",
            cId: 0,
            srName: "",
            blackList: false,
            exp: "",
            footerDescTxt: "",
            dsc: "",
            cash: false,
            customerDcrmntPrcnt: 0,
            byPhone: false,
            urgency: false,
          },
          orderDtls: [],
        },
      },
    },
  };
}
