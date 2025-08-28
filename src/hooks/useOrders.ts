import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useOrderStore } from "../store/orderStore";
import {
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
    OrderDtlId,
    WarehauseId,
  } = useOrderStore();
  //for Order/orderCupList
  const orderCupListQuery = useQuery<
    OrderCupListResponse,
    Error,
    OrderCupListResponse,
    unknown[]
  >({
    queryKey: ["orderCupList", OrderDtlId, WarehauseId],
    queryFn: async () => {
      console.log(
        `/api/Order/orderCupList?OrderDtlId=${OrderDtlId}&WarehauseId=${WarehauseId}`
      );
      const response = await api.get(
        `/api/Order/orderCupList?OrderDtlId=${OrderDtlId}&WarehauseId=${WarehauseId}`
      );
      return response.data;
    },
    onSuccess: (data: any) => {
      setOrderCupListResponse(data);
    },
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
      console.log(
        `/api/Order/orderSalesPrices?OrderId=${orderIdForSalesPrice}&SalesPriceId=${salesPriceId}`
      );
      const url: string = `api/Order/orderSalesPrices?OrderId=${orderIdForSalesPrice}&SalesPriceId=${salesPriceId}`;
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!orderIdForSalesPrice && !!salesPriceId,
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
  //for Order/orderRegShow
  const orderRegShowQuery = useQuery<
    OrderRegShowResponse,
    Error,
    OrderRegShowResponse,
    unknown[]
  >({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      console.log(`/api/Order/orderRegShow?OrderId=${orderId}`);
      const response = await api.get(
        `/api/Order/orderRegShow?OrderId=${orderId}`
      );
      return response.data;
    },
    enabled: !!orderId,
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

    //output for Order/orderRegShow
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
