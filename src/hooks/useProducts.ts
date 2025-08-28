import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../api/axios";
import { useProductStore } from "../store/productStore";
import {
  IndentDtlHistoryResponse,
  IndentSaveRequest,
  IndentShowProductListRequest,
  ProductSearchRequest,
  ProductSearchResponse,
  SalesPricesSearchRequest,
  SalesPricesSearchResponse,
} from "../types/product";

export function useProducts() {
  const {
    accYear,
    accSystem,
    searchTerm,
    page,
    setProductSearchResponse,
    salesPricesSearch,
    salesPricesSearchPage,
    lastId,
    pId,
    mrsId,
    setSalesPricesSearchResponse,
    setIndentShowProductListResponse,
    setIndentSaveResponse,
    setIndentDtlHistoryResponse,
  } = useProductStore();
  //for indent/showProductList
  const addList = useMutation({
    mutationFn: async (request: IndentShowProductListRequest) => {
      const url: string = `api/Indent/showProductList `;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setIndentShowProductListResponse(data);
    },
  });
  //for indent/save
  const saveList = useMutation({
    mutationFn: async (request: IndentSaveRequest) => {
      const url: string = `api/Indent/save `;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setIndentSaveResponse(data);
    },
  });

  //for Indent/dtlHistory
  const dtlHistoryQuery = useQuery<IndentDtlHistoryResponse>({
    queryKey: ["dtlHistory", pId, mrsId],
    queryFn: async () => {
      const url: string = `api/Indent/dtlHistory?PId=${pId}&MrsId=${mrsId}`;
      const response = await api.get<IndentDtlHistoryResponse>(url);
      return response.data;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!pId && !!mrsId,
  });

  useEffect(() => {
    if (dtlHistoryQuery.data) {
      setIndentDtlHistoryResponse(dtlHistoryQuery.data);
    }
  }, [dtlHistoryQuery.data, setIndentDtlHistoryResponse]);
  //for salesPricesSearch req
  const salesPricesSearchQuery = useQuery<
    SalesPricesSearchResponse,
    Error,
    SalesPricesSearchResponse,
    unknown[]
  >({
    queryKey: [
      "salesPricesSearch",
      salesPricesSearch,
      salesPricesSearchPage,
      lastId,
    ],
    queryFn: async () => {
      const params: SalesPricesSearchRequest = {
        salesPricesSearch,
        salesPricesSearchPage,
        lastId,
      };
      const response = await api.get(
        `/api/Product/salesPricesSearch?page=${
          params.salesPricesSearchPage
        }&lastId=${params.lastId}&Search=${encodeURIComponent(
          params.salesPricesSearch ?? ""
        )}`
      );
      return response.data;
    },
    refetchOnWindowFocus: true, // Refetch data when the window is focused
    refetchOnReconnect: true, // Refetch data when the network reconnects
  } as UseQueryOptions<SalesPricesSearchResponse, Error, SalesPricesSearchResponse, unknown[]>);

  useEffect(() => {
    if (salesPricesSearchQuery.data) {
      setSalesPricesSearchResponse(salesPricesSearchQuery.data);
    }
  }, [salesPricesSearchQuery.data, setSalesPricesSearchResponse]);

  //for productSearch req
  const productSearchQuery = useQuery<
    ProductSearchResponse,
    Error,
    ProductSearchResponse,
    unknown[]
  >({
    queryKey: ["products", accYear, accSystem, searchTerm, page],
    queryFn: async () => {
      const params: ProductSearchRequest = {
        accYear,
        accSystem,
        searchTerm,
        page,
      };
      const url = `/api/Product/search?accYear=${params.accYear}&accSystem=${
        params.accSystem
      }&page=${params.page}${
        params.searchTerm
          ? `&searchTerm=${encodeURIComponent(params.searchTerm ?? "")}`
          : ""
      }`;
      console.log(url, "url in useProducts");
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!accSystem && !!accYear, // Only run if accSystem exists
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      console.log(data, "response.data in useProducts");
      setProductSearchResponse(data);
    },
  } as UseQueryOptions<ProductSearchResponse, Error, ProductSearchResponse, unknown[]>);

  return {
    //output for indent/showProductList
    isLoadingAddList: addList.isPending,
    errorAddList: addList.error,
    addProductList: addList.mutateAsync,

    //output for indent/save
    isLoadingSaveList: saveList.isPending,
    errorSaveList: saveList.error,
    saveList: saveList.mutateAsync,

    isSalesPricesSearchLoading: salesPricesSearchQuery.isLoading,
    salesPricesSearchError: salesPricesSearchQuery.error,
    salesPricesSearchResponse: salesPricesSearchQuery.data?.searchResults ?? [],

    isProductSearchLoading: productSearchQuery.isLoading,
    productSearchError: productSearchQuery.error,
    products: productSearchQuery.data?.data.result ?? [],

    isDtHistoryLoading: dtlHistoryQuery.isLoading,
    dtlHistoryError: dtlHistoryQuery.error,
    dtlHistoryResponse:
      dtlHistoryQuery.data?.data.result.indentDtlHistories ?? [],
  };
}
