import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useProductOfferStore } from "../store/productOfferStore";
import {
  ProductOfferDtlHistoryResponse,
  ProductOfferRequest,
  ProductOfferResponse,
  ProductOfferSaveRequest,
  ShowProductListRequest,
} from "../types/productOffer";

export function useProductOffer() {
  const {
    id,
    acc_Year,
    acc_System,
    state,
    regFDate,
    regTDate,
    fDate,
    tDate,
    pId,
    setProductOfferDtlHistoryResponse,
    setProductOfferResponse,
    setShowProductListResponse,
    setProductOfferSaveResponse,
  } = useProductOfferStore();

  //for productOffer
  const query = useQuery<
    ProductOfferResponse,
    Error,
    ProductOfferResponse,
    unknown[]
  >({
    queryKey: [
      "productOffer",
      acc_Year,
      acc_System,
      state,
      regFDate,
      regTDate,
      fDate,
      tDate,
    ],
    queryFn: async () => {
      const params = {
        acc_Year,
        acc_System,
        state,
        regFDate,
        regTDate,
        fDate,
        tDate,
      };
      const url = `/api/ProductOffer/ProductOffer?Acc_Year=${
        params.acc_Year
      }&Acc_System=${params.acc_System}&State=${
        params.state
      }&RegFDate=${encodeURIComponent(
        params.regFDate ?? ""
      )}&RegTDate=${encodeURIComponent(
        params.regTDate ?? ""
      )}&FDate=${encodeURIComponent(
        params.fDate ?? ""
      )}&TDate=${encodeURIComponent(params.tDate ?? "")}`;
      console.log("ProductOffer url", url);
      const response = await api.get(url);
      return response.data;
    },
    //enabled: !acc_Year || !acc_System,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setProductOfferResponse(data);
    },
  } as UseQueryOptions<ProductOfferResponse, Error, ProductOfferResponse, unknown[]>);
  //for productOfferDtl
  const queryDtl = useQuery<
    ProductOfferResponse,
    Error,
    ProductOfferResponse,
    unknown[]
  >({
    queryKey: [
      "productOfferDtl",
      id,
      acc_Year,
      acc_System,
      state,
      regFDate,
      regTDate,
      fDate,
      tDate,
    ],
    queryFn: async () => {
      const params: ProductOfferRequest = {
        id,
        acc_Year,
        acc_System,
        state,
        regFDate,
        regTDate,
        fDate,
        tDate,
      };
      const url = `/api/ProductOffer/ProductOffer?Id=${params.id}&Acc_Year=${
        params.acc_Year
      }&Acc_System=${params.acc_System}&State=${
        params.state
      }&RegFDate=${encodeURIComponent(
        params.regFDate ?? ""
      )}&RegTDate=${encodeURIComponent(
        params.regTDate ?? ""
      )}&FDate=${encodeURIComponent(
        params.fDate ?? ""
      )}&TDate=${encodeURIComponent(params.tDate ?? "")}`;
      console.log("ProductOfferDtl url", url);
      const response = await api.get(url);
      return response.data;
    },
    //enabled: !acc_Year || !acc_System,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setProductOfferResponse(data);
    },
  } as UseQueryOptions<ProductOfferResponse, Error, ProductOfferResponse, unknown[]>);
  
  //for productOffer/productOfferDtlHistory
  const productOfferDtlHistory = useQuery<
    ProductOfferDtlHistoryResponse,
    Error,
    ProductOfferDtlHistoryResponse,
    unknown[]
  >({
    queryKey: ["productOfferDtlHistory", pId],
    queryFn: async () => {
      const url = `/api/ProductOffer/PrductOfferDtlHistory?PId=${pId}`;
      console.log("productOfferDtlHistory url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!pId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setProductOfferDtlHistoryResponse(data);
    },
  } as UseQueryOptions<ProductOfferDtlHistoryResponse, Error, ProductOfferDtlHistoryResponse, unknown[]>);

  // for productOffer/showProductList
  const addList = useMutation({
    mutationFn: async (request: ShowProductListRequest) => {
      const url: string = `api/ProductOffer/ShowProductList `;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setShowProductListResponse(data);
    },
  });
  // for productOffer/productOfferSave
  const queryClient=useQueryClient()
  const productOfferSave = useMutation({
    mutationFn: async (request: ProductOfferSaveRequest) => {
      const url: string = `api/ProductOffer/ProductOfferSave`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setProductOfferSaveResponse(data);
      queryClient.invalidateQueries({ queryKey: ["productOffer"] });
    },
  });

  return {
    refetch: query.refetch,
    isLoading: query.isLoading,
    error: query.error,
    productOffer: query.data?.data.result.productOffers,
    productOfferMeta: query.data?.meta,
    //
    isLoadingDtl: queryDtl.isLoading,
    errorDtl: queryDtl.error,
    productOfferDtl: queryDtl.data?.data.result.productOfferDtls,
    //for productOffer/showProductList
    isLoadingAddList: addList.isPending,
    errorAddList: addList.error,
    addProductList: addList.mutateAsync,
    //for productOffer/productOfferDtlHistory
    isLoadingProductOfferDtlHistory: productOfferDtlHistory.isLoading,
    errorProductOfferDtlHistory: productOfferDtlHistory.error,
    productOfferDtlHistory: productOfferDtlHistory.data?.data.result,
    //for productOffer/productOfferSave
    isLoadingProductOfferSave: productOfferSave.isPending,
    errorProductOfferSave: productOfferSave.error,
    productOfferSave: productOfferSave.mutateAsync,
  };
}
