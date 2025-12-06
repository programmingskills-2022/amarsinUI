import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { usePaymentStore } from "../store/paymentStore";
import {
  ChequeBookGetByIdResponse,
  PaymentKindSearchRequest,
  PaymentKindSearchResponse,
  PosListResponse,
} from "../types/payment";

export function usePayment() {
  const {
    paymentKindSearch,
    paymentKindSearchPage,
    paymentKindSearchLastId,
    setPaymentKindSearchResponse,
    setPosListResponse,
    setChequeBookGetByIdResponse,
    checkBookId,
    posSystemId,
  } = usePaymentStore();

  const paymentKindSearchQuery = useQuery<
    PaymentKindSearchResponse,
    Error,
    PaymentKindSearchResponse,
    unknown[]
  >({
    queryKey: [
      "paymentKindSearch",
      paymentKindSearch,
      paymentKindSearchPage,
      paymentKindSearchLastId,
    ],
    queryFn: async () => {
      const params: PaymentKindSearchRequest = {
        paymentKindSearch,
        paymentKindSearchPage,
        paymentKindSearchLastId,
      };

      const url: string = `/api/Payment/KindSearch?search=${encodeURIComponent(
        params.paymentKindSearch
      )}&page=${params.paymentKindSearchPage}&lastId=${
        params.paymentKindSearchLastId
      }`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: paymentKindSearchPage !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setPaymentKindSearchResponse(data);
    },
  } as UseQueryOptions<PaymentKindSearchResponse, Error, PaymentKindSearchResponse, unknown[]>);

  // api/Payment/posList
  const posListQuery = useQuery<
    PosListResponse,
    Error,
    PosListResponse,
    unknown[]
  >({
    queryKey: ["posList",posSystemId],
    queryFn: async () => {
      const url: string = `api/Payment/posList`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: posSystemId !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setPosListResponse(data);
    },
  } as UseQueryOptions<PosListResponse, Error, PosListResponse, unknown[]>);
  // api/Payment/chequeBookGetById?id=190
  const chequeBookGetByIdQuery = useQuery<
    ChequeBookGetByIdResponse,
    Error,
    ChequeBookGetByIdResponse,
    unknown[]
  >({
    queryKey: ["chequeBookGetById", checkBookId],
    queryFn: async () => {
      const url: string = `api/Payment/chequeBookGetById?id=${checkBookId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: checkBookId!==undefined && checkBookId!==-1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setChequeBookGetByIdResponse(data);
    },
  } as UseQueryOptions<ChequeBookGetByIdResponse, Error, ChequeBookGetByIdResponse, unknown[]>);

  return {
    //getInventoryList: () => query.refetch(), // Optional manual trigger
    isLoading: paymentKindSearchQuery.isLoading,
    error: paymentKindSearchQuery.error,
    paymentKinds: paymentKindSearchQuery.data?.data.result ?? [],

    //api/Payment/posList
    isLoadingPosList: posListQuery.isLoading,
    errorPosList: posListQuery.error,
    posList: posListQuery.data?.data.result ?? [],

    //api/Payment/chequeBookGetById?id=190
    isLoadingChequeBookGetById: chequeBookGetByIdQuery.isLoading,
    errorChequeBookGetById: chequeBookGetByIdQuery.error,
    chequeBookGetById: chequeBookGetByIdQuery.data?.data.result ?? {
      fixChqNo: "",
      chequeBookDtlId: 0,
      cheqNo: "",
      chqBkNo: "",
      bnkId: 0,
      bnk: "",
      brnchId: 0,
      brnch: "",
      sheba: "",
    },
  };
}
