import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";

import api from "../api/axios";
import { useClearBookStore } from "../store/clearBookStore";
import {
  ClearBookProductsRequest,
  ClearBookProductsResponse,
  ClearBookProductsSetProductRequest,
} from "../types/clearBook";

export function useClearBook() {
  const {
    systemId,
    yearId,
    brandId,
    setClearBookProductsResponse,
    setClearBookProductsSetProductResponse,
  } = useClearBookStore();

  const query = useQuery<
    ClearBookProductsResponse,
    Error,
    ClearBookProductsResponse,
    unknown[]
  >({
    queryKey: ["clearBookProducts", systemId, yearId, brandId],
    queryFn: async () => {
      const params: ClearBookProductsRequest = {
        systemId,
        yearId,
        brandId,
      };
      const url = `/api/ClearBook/clearBooksProducts?SystemId=${params.systemId}&YearId=${params.yearId}&BrandId=${params.brandId}`;
      const response = await api.get(url);
      console.log(
        url,
        response.data,
        "url,response.data in clearBooksProducts"
      );
      return response.data;
    },
    enabled: yearId !== -1 && systemId !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setClearBookProductsResponse(data);
    },
  } as UseQueryOptions<ClearBookProductsResponse, Error, ClearBookProductsResponse, unknown[]>);
  //http://apitest.dotis.ir/api/ClearBook/setProduct?ClearBookId=64&ProductId=11131&check=false
  const setProduct = useMutation({
    mutationFn: async (request: ClearBookProductsSetProductRequest) => {
      const response = await api.post(
        `/api/ClearBook/setProduct?ClearBookId=${request.clearBookId}&ProductId=${request.productId}&check=${request.check}`
      );
      return response.data;
    },
    onSuccess: (data: any) => {
      setClearBookProductsSetProductResponse(data);
      //queryClient.invalidateQueries({ queryKey: ["clearBookProducts"] });
    },
  });
  return {
    //for clearBookProducts
    refetch: query.refetch,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    error: query.error,
    clearBookProducts: query.data?.data.result ?? {
      err: 0,
      msg: "",
      clearBooks: [],
      clearBookProductsName: [],
    },
    //for clearBookProductsSetProduct
    setProduct: setProduct.mutate,
    setProductLoading: setProduct.isPending,
    setProductError: setProduct.error,
    setProductSuccess: setProduct.isSuccess,
    setProductResponse: setProduct.data,
  };
}
