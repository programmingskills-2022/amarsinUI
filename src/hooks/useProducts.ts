import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../api/axios";
import { useProductStore } from "../store/productStore";
import {
  IndentDoFirstFlowRequest,
  IndentDtlHistoryResponse,
  IndentResponse,
  IndentSaveRequest,
  IndentShowProductListRequest,
  ProductCatalog,
  ProductSearchRequest,
  ProductSearchResponse,
  SalesPricesSearchRequest,
  SalesPricesSearchResponse,
} from "../types/product";

export function useProducts() {
  const queryClient = useQueryClient();
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
    // for indent/list
    id,
    acc_YearIndentRequest,
    acc_SystemIndentRequest,
    showDeletedInentDtl,
    ordrIdIndentRequest,
    mrsIdIndentRequest,
    state,
    regFDate,
    regTDate,
    fDate,
    tDate,
    pageNumber,
    srchId,
    srchDate,
    srchTime,
    srchDsc,
    srchUsrName,
    srchStep,
    srchSRName,
    srchPayDuration,
    sortId,
    sortDat,
    sortTime,
    sortDsc,
    sortUsrName,
    sortStep,
    sortSRName,
    sortPayDuration,
    //for api/Product/productInstanceCatalog?Id=166717&UID=0&IRC=0
    idProductCatalogRequest,
    uIDProductCatalogRequest,
    iRCProductCatalogRequest,
    setSalesPricesSearchResponse,
    setIndentShowProductListResponse,
    setIndentSaveResponse,
    setIndentDtlHistoryResponse,
    setIndentResponse, // for /api/Indent/list
    setIndentDelResponse, // for delete /api/Indent/6480
    setIndentDoFirstFlowResponse, // for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
    setProductCatalog, // for api/Product/productInstanceCatalog?Id=166717&UID=0&IRC=0
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
      queryClient.invalidateQueries({ queryKey: ["indentList"] });
      queryClient.invalidateQueries({ queryKey: ["indentListDtl"] });
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
    enabled: !!pId && !!mrsId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
    enabled: !!salesPricesSearch && !!salesPricesSearchPage && !!lastId,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
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
          ? `&search=${encodeURIComponent(params.searchTerm ?? "")}`
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

  // for /api/Indent/list?Id=6430&OrdrId=-1&MrsId=0&Acc_Year=0&Acc_System=0&State=0&ShowDeletedInentDtl=false
  const indentListQuery = useQuery<
    IndentResponse,
    Error,
    IndentResponse,
    unknown[]
  >({
    queryKey: [
      "indentList",
      acc_YearIndentRequest,
      acc_SystemIndentRequest,
      showDeletedInentDtl,
      ordrIdIndentRequest,
      state,
      regFDate,
      regTDate,
      fDate,
      tDate,
      pageNumber,
      srchId,
      srchDate,
      srchTime,
      srchDsc,
      srchUsrName,
      srchStep,
      srchSRName,
      srchPayDuration,
      sortId,
      sortDat,
      sortTime,
      sortDsc,
      sortUsrName,
      sortStep,
      sortSRName,
      sortPayDuration,
    ],
    queryFn: async () => {
      const params = {
        acc_YearIndentRequest,
        acc_SystemIndentRequest,
        showDeletedInentDtl,
        ordrIdIndentRequest,
        state,
        regFDate,
        regTDate,
        fDate,
        tDate,
        pageNumber,
        srchId,
        srchDate,
        srchTime,
        srchDsc,
        srchUsrName,
        srchStep,
        srchSRName,
        srchPayDuration,
        sortId,
        sortDat,
        sortTime,
        sortDsc,
        sortUsrName,
        sortStep,
        sortSRName,
        sortPayDuration,
      };
      console.log("enterd");
      const url = `/api/Indent/list?Id=0&OrdrId=${
        params.ordrIdIndentRequest
      }&MrsId=0&Acc_Year=${params.acc_YearIndentRequest}&Acc_System=${
        params.acc_SystemIndentRequest
      }&State=${params.state}&RegFDate=${encodeURIComponent(
        params.regFDate ?? ""
      )}&RegTDate=${encodeURIComponent(
        params.regTDate ?? ""
      )}&FDate=${encodeURIComponent(
        params.fDate ?? ""
      )}&TDate=${encodeURIComponent(params.tDate ?? "")}&PageNumber=${
        params.pageNumber
      }&SrchId=${params.srchId}${
        params.srchPayDuration !== -1
          ? `&SrchPayDuration=${params.srchPayDuration}`
          : ""
      }${
        params.srchDate
          ? `&SrchDate=${encodeURIComponent(params.srchDate)}`
          : ""
      }${
        params.srchTime
          ? `&SrchTime=${encodeURIComponent(params.srchTime)}`
          : ""
      }${
        params.srchDsc ? `&SrchDsc=${encodeURIComponent(params.srchDsc)}` : ""
      }${
        params.srchSRName
          ? `&SrchSRName=${encodeURIComponent(params.srchSRName ?? "")}`
          : ""
      }${
        params.srchUsrName
          ? `&SrchUsrName=${encodeURIComponent(params.srchUsrName ?? "")}`
          : ""
      }${
        params.srchStep
          ? `&SrchStep=${encodeURIComponent(params.srchStep)}`
          : ""
      }&SortId=${params.sortId}&SortDate=${params.sortDat}&SortTime=${
        params.sortTime
      }&SortDsc=${params.sortDsc}&SortSRName=${params.sortSRName}&SortUsrName=${
        params.sortUsrName
      }&SortStep=${
        params.sortStep
      }&ShowDeletedInentDtl=${showDeletedInentDtl}&SortPayDuration=${
        params.sortPayDuration
      }`;
      console.log("IndentList url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled:!!id,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setIndentResponse(data);
    },
  } as UseQueryOptions<IndentResponse, Error, IndentResponse, unknown[]>);

  //for api/Indent/list?Id=6430&OrdrId=-1&MrsId=0&Acc_Year=0&Acc_System=0&State=0&ShowDeletedInentDtl=false
  const indentListDtlQuery = useQuery<
    IndentResponse,
    Error,
    IndentResponse,
    unknown[]
  >({
    queryKey: [
      "indentListDtl",
      id,
      acc_YearIndentRequest,
      acc_SystemIndentRequest,
      showDeletedInentDtl,
      ordrIdIndentRequest,
      mrsIdIndentRequest,
      state,
      regFDate,
      regTDate,
      fDate,
      tDate,
      pageNumber,
      srchId,
      srchDate,
      srchTime,
      srchDsc,
      srchUsrName,
      srchStep,
      srchSRName,
      srchPayDuration,
      /*sortId,
      sortDat,
      sortTime,
      sortDsc,
      sortUsrName,
      sortStep,
      sortSRName,
      sortPayDuration,*/
    ],
    queryFn: async () => {
      const params = {
        id,
        acc_YearIndentRequest,
        acc_SystemIndentRequest,
        showDeletedInentDtl,
        ordrIdIndentRequest,
        mrsIdIndentRequest,
        state,
        regFDate,
        regTDate,
        fDate,
        tDate,
        pageNumber,
        srchId,
        srchDate,
        srchTime,
        srchDsc,
        srchUsrName,
        srchStep,
        srchSRName,
        srchPayDuration,
        sortId,
        sortDat,
        sortTime,
        sortDsc,
        sortUsrName,
        sortStep,
        sortSRName,
        sortPayDuration,
      };
      const url = `/api/Indent/list?Id=${params.id}&OrdrId=${
        params.ordrIdIndentRequest
      }&MrsId=${params.mrsIdIndentRequest}&Acc_Year=${
        params.acc_YearIndentRequest
      }&Acc_System=${params.acc_SystemIndentRequest}&State=${
        params.state
      }&RegFDate=${encodeURIComponent(
        params.regFDate ?? ""
      )}&RegTDate=${encodeURIComponent(
        params.regTDate ?? ""
      )}&FDate=${encodeURIComponent(
        params.fDate ?? ""
      )}&TDate=${encodeURIComponent(params.tDate ?? "")}&PageNumber=${
        params.pageNumber
      }&SrchId=${params.srchId}${
        params.srchPayDuration !== -1
          ? `&SrchPayDuration=${params.srchPayDuration}`
          : ""
      }${
        params.srchDate
          ? `&SrchDate=${encodeURIComponent(params.srchDate)}`
          : ""
      }${
        params.srchTime
          ? `&SrchTime=${encodeURIComponent(params.srchTime)}`
          : ""
      }${
        params.srchDsc ? `&SrchDsc=${encodeURIComponent(params.srchDsc)}` : ""
      }${
        params.srchSRName
          ? `&SrchSRName=${encodeURIComponent(params.srchSRName ?? "")}`
          : ""
      }${
        params.srchUsrName
          ? `&SrchUsrName=${encodeURIComponent(params.srchUsrName ?? "")}`
          : ""
      }${
        params.srchStep
          ? `&SrchStep=${encodeURIComponent(params.srchStep)}`
          : ""
      }&SortId=${params.sortId}&SortDate=${params.sortDat}&SortTime=${
        params.sortTime
      }&SortDsc=${params.sortDsc}&SortSRName=${params.sortSRName}&SortUsrName=${
        params.sortUsrName
      }&SortStep=${params.sortStep}&SortPayDuration=${
        params.sortPayDuration
      }&ShowDeletedInentDtl=${showDeletedInentDtl}`;
      console.log("IndentListDtl url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!id ,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setIndentResponse(data);
    },
  } as UseQueryOptions<IndentResponse, Error, IndentResponse, unknown[]>);

  //for delete /api/Indent/6480
  const indentDelQuery = useMutation({
    mutationFn: async (request: number) => {
      const url: string = `api/Indent/${request}`;
      const response = await api.delete(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setIndentDelResponse(data);
      queryClient.invalidateQueries({ queryKey: ["indentList"] });
      queryClient.invalidateQueries({ queryKey: ["indentListDtl"] });
    },
  });

  //for product catalog: /api/Product/productInstanceCatalog?Id=166717&UID=0&IRC=0
  const productCatalogQuery = useQuery<
    ProductCatalog,
    Error,
    ProductCatalog,
    unknown[]
  >({
    queryKey: [
      "productCatalog",
      idProductCatalogRequest,
      uIDProductCatalogRequest,
      iRCProductCatalogRequest,
    ],
    queryFn: async () => {
      const url: string = `api/Product/productInstanceCatalog?Id=${idProductCatalogRequest}&UID=${uIDProductCatalogRequest}&IRC=${iRCProductCatalogRequest}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    //enabled: productId !== 0 ? true : false, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setProductCatalog(data);
    },
  } as UseQueryOptions<ProductCatalog, Error, ProductCatalog, unknown[]>);
  //for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
  const indentDoFirstFlowQuery = useMutation({
    mutationFn: async (request: IndentDoFirstFlowRequest) => {
      const url: string = `api/Indent/doFirstFlow?Acc_System=${
        request.acc_System
      }&Acc_Year=${request.acc_Year}
      }&MrsId=${request.mrsId}&ChartId=${
        request.chartId
      }&Dsc=${encodeURIComponent(request.dsc)}`;
      console.log("IndentDoFirstFlow url", url);
      const response = await api.post(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setIndentDoFirstFlowResponse(data);
      queryClient.invalidateQueries({ queryKey: ["indentList"] });
      queryClient.invalidateQueries({ queryKey: ["indentListDtl"] });
    },
  });
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
    products: productSearchQuery.data?.data.result.searchResults ?? [],

    isDtHistoryLoading: dtlHistoryQuery.isLoading,
    dtlHistoryError: dtlHistoryQuery.error,
    dtlHistoryResponse:
      dtlHistoryQuery.data?.data.result.indentDtlHistories ?? [],

    //output for  indent/list
    refetchIndentList: indentListQuery.refetch,
    isLoadingIndentList: indentListQuery.isLoading,
    errorIndentList: indentListQuery.error,
    indentList: indentListQuery.data?.data.result.indents ?? [],
    indentListTotalCount: indentListQuery.data?.data.result.total_count ?? 0,
    //output for indent/listDtl
    refetchIndentListDtl: indentListDtlQuery.refetch,
    isLoadingIndentListDtl: indentListDtlQuery.isLoading,
    errorIndentListDtl: indentListDtlQuery.error,
    indentListDtl: indentListDtlQuery.data?.data.result.indentDtls ?? [],
    //output for productCatalog : api/Product/productInstanceCatalog?Id=166717&UID=0&IRC=0
    isLoadingProductCatalog: productCatalogQuery.isLoading,
    errorProductCatalog: productCatalogQuery.error,
    productCatalog: productCatalogQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          data: {
            manufacturing: "",
            expiration: "",
            batchCode: "",
            genericName: "",
            genericCode: "",
            uid: "",
            gtin: "",
            irc: "",
            licenseOwner: "",
            englishProductName: "",
            persianProductName: "",
            productCategory: "",
            productCategoryCode: 0,
            packageCount: 0,
            statusCode: 0,
          },
          statusCode: 0,
          statusMessage: "",
          cupId: 0,
          uid: "",
          irc: "",
          ttac: false,
          systemId: 0,
        },
      },
    },
    //output for delete /api/Indent/6480
    isLoadingIndentDel: indentDelQuery.isPending,
    errorIndentDel: indentDelQuery.error,
    indentDel: indentDelQuery.mutateAsync,
    //output for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
    isLoadingIndentDoFirstFlow: indentDoFirstFlowQuery.isPending,
    errorIndentDoFirstFlow: indentDoFirstFlowQuery.error,
    indentDoFirstFlow: indentDoFirstFlowQuery.mutateAsync,
  };
}
