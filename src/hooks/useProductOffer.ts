import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "../api/axios";
import { useProductOfferStore } from "../store/productOfferStore";
import {
  ProductOfferDoFirstFlowResponse,
  ProductOfferDtlHistoryResponse,
  ProductOfferResponse,
  ProductOfferSaveRequest,
  ShowProductListRequest,
} from "../types/productOffer";

export function useProductOffer() {
  const queryClient = useQueryClient();

  const {
    id,
    acc_Year,
    acc_System,
    acc_YearDtl,
    acc_SystemDtl,
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
    srchAccepted,
    srchUsrName,
    srchStep,
    sortId,
    sortDat,
    sortTime,
    sortDsc,
    sortAccepted,
    sortUsrName,
    sortStep,
    pId,
    pIdTrigger,//for history not cashing
    //for productOffer/productOfferDoFirstFlow
    chartIdProductOfferDoFirstFlow,
    acc_SystemProductOfferDoFirstFlow,
    acc_YearProductOfferDoFirstFlow,
    idProductOfferDoFirstFlow,
    dscProductOfferDoFirstFlow,
    setProductOfferDtlHistoryResponse,
    setProductOfferResponse,
    setShowProductListResponse,
    setProductOfferSaveResponse,
    setProductOfferDoFirstFlowResponse, //for productOffer/productOfferDoFirstFlow
    setProductOfferDelResponse, //for productOffer/productOfferDel
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
      pageNumber,
      srchId,
      srchDate,
      srchTime,
      srchDsc,
      srchAccepted,
      srchUsrName,
      srchStep,
      sortId,
      sortDat,
      sortTime,
      sortDsc,
      sortAccepted,
      sortUsrName,
      sortStep,
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
        pageNumber,
        srchId,
        srchDate,
        srchTime,
        srchDsc,
        srchAccepted,
        srchUsrName,
        srchStep,
        sortId,
        sortDat,
        sortTime,
        sortDsc,
        sortAccepted,
        sortUsrName,
        sortStep,
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
      )}&TDate=${encodeURIComponent(params.tDate ?? "")}&PageNumber=${
        params.pageNumber
      }&SrchId=${params.srchId}${
        params.srchDate
          ? `&SrchDate=${encodeURIComponent(params.srchDate)}`
          : ""
      }${
        params.srchTime
          ? `&SrchTime=${encodeURIComponent(params.srchTime)}`
          : ""
      }${
        params.srchDsc ? `&SrchDsc=${encodeURIComponent(params.srchDsc)}` : ""
      }&SrchAccepted=${params.srchAccepted}${
        params.srchUsrName
          ? `&SrchUsrName=${encodeURIComponent(params.srchUsrName ?? "")}`
          : ""
      }${
        params.srchStep
          ? `&SrchStep=${encodeURIComponent(params.srchStep)}`
          : ""
      }&SortId=${params.sortId}&SortDat=${params.sortDat}&SortTime=${
        params.sortTime
      }&SortDsc=${params.sortDsc}&SortAccepted=${
        params.sortAccepted
      }&SortUsrName=${params.sortUsrName}&SortStep=${params.sortStep}`;
      console.log("ProductOffer url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled: acc_Year !== -1 && acc_System !== -1,
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
      acc_YearDtl,
      acc_SystemDtl,
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
      srchAccepted,
      srchUsrName,
      srchStep,
      sortId,
      sortDat,
      sortTime,
      sortDsc,
      sortAccepted,
      sortUsrName,
      sortStep,
    ],
    queryFn: async () => {
      const params = {
        id,
        acc_YearDtl,
        acc_SystemDtl,
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
        srchAccepted,
        srchUsrName,
        srchStep,
        sortId,
        sortDat,
        sortTime,
        sortDsc,
        sortAccepted,
        sortUsrName,
        sortStep,
      };
      const url = `/api/ProductOffer/ProductOffer?Id=${params.id}&Acc_Year=${
        params.acc_YearDtl
      }&Acc_System=${params.acc_SystemDtl}&State=${
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
        params.srchDate
          ? `&SrchDate=${encodeURIComponent(params.srchDate)}`
          : ""
      }${
        params.srchTime
          ? `&SrchTime=${encodeURIComponent(params.srchTime)}`
          : ""
      }${
        params.srchDsc ? `&SrchDsc=${encodeURIComponent(params.srchDsc)}` : ""
      }&SrchAccepted=${params.srchAccepted}${
        params.srchUsrName
          ? `&SrchUsrName=${encodeURIComponent(params.srchUsrName ?? "")}`
          : ""
      }${
        params.srchStep
          ? `&SrchStep=${encodeURIComponent(params.srchStep)}`
          : ""
      }&SortId=${params.sortId}&SortDat=${params.sortDat}&SortTime=${
        params.sortTime
      }&SortDsc=${params.sortDsc}&SortAccepted=${
        params.sortAccepted
      }&SortUsrName=${params.sortUsrName}&SortStep=${params.sortStep}`;
      console.log("ProductOfferDtl url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled:  acc_YearDtl !== -1 && acc_SystemDtl !== -1,
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
    queryKey: ["productOfferDtlHistory", pId, pIdTrigger],
    queryFn: async () => {
      const url = `/api/ProductOffer/dtlHistory?PId=${pId}`;
      console.log("productOfferDtlHistory url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled: pId!==-1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setProductOfferDtlHistoryResponse(data);
    },
  } as UseQueryOptions<ProductOfferDtlHistoryResponse, Error, ProductOfferDtlHistoryResponse, unknown[]>);

  // for productOffer/showProductList
  const addList = useMutation({
    mutationFn: async (request: ShowProductListRequest) => {
      const url: string = `api/ProductOffer/productList `;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setShowProductListResponse(data);
    },
  });
  // for productOffer/productOfferSave
  const productOfferSave = useMutation({
    mutationFn: async (request: ProductOfferSaveRequest) => {
      const url: string = `api/ProductOffer/save`;
      const response = await api.post(url, request);

      return response.data;
    },
    onSuccess: (data: any) => {
      setProductOfferSaveResponse(data);
      //console.log(data, "data");
      queryClient.invalidateQueries({ queryKey: ["productOffer"] });
      queryClient.invalidateQueries({ queryKey: ["productOfferDtl"] });
    },
  });
  //for productOffer/productOfferDel
  const productOfferDel = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await api.delete(`api/ProductOffer/del`, {
        params: {
          id: requestId,
        },
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      setProductOfferDelResponse(data);
      queryClient.invalidateQueries({ queryKey: ["productOffer"] });
    },
  });
  //for productOffer/productOfferDoFirstFlow
  const productOfferDoFirstFlow = useQuery<
    ProductOfferDoFirstFlowResponse,
    Error,
    ProductOfferDoFirstFlowResponse,
    unknown[]
  >({
    queryKey: [
      "productOfferDoFirstFlow",
      chartIdProductOfferDoFirstFlow,
      acc_SystemProductOfferDoFirstFlow,
      acc_YearProductOfferDoFirstFlow,
      idProductOfferDoFirstFlow,
      dscProductOfferDoFirstFlow,
    ],
    queryFn: async () => {
      const url = `/api/ProductOffer/doFirstFlow?ChartId=${chartIdProductOfferDoFirstFlow}&Acc_System=${acc_SystemProductOfferDoFirstFlow}&Acc_Year=${acc_YearProductOfferDoFirstFlow}&Id=${idProductOfferDoFirstFlow}&Dsc=${dscProductOfferDoFirstFlow}`;
      console.log("productOfferDoFirstFlow url", url);
      const response = await api.get(url);
      queryClient.invalidateQueries({ queryKey: ["productOffer"] });
      return response.data;
    },
    enabled:acc_SystemProductOfferDoFirstFlow!==-1 && acc_YearProductOfferDoFirstFlow!==-1 && chartIdProductOfferDoFirstFlow!==-1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setProductOfferDoFirstFlowResponse(data);
    },
  } as UseQueryOptions<ProductOfferDoFirstFlowResponse, Error, ProductOfferDoFirstFlowResponse, unknown[]>);
  return {
    refetch: query.refetch,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    error: query.error,
    productOffer: query.data?.data.result.productOffers,
    productOfferMeta: query.data?.meta,
    productOfferTotalCount: query.data?.data.result.total_count,
    // for productOfferDtl
    refetchProductOfferDtl: queryDtl.refetch,
    isLoadingDtl: queryDtl.isLoading,
    errorDtl: queryDtl.error,
    productOfferDtl: queryDtl.data?.data.result.productOfferDtls,
    productOfferDtlData: queryDtl.data?.data.result,
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
    productOfferSaveResponse: productOfferSave.data,
    //for productOffer/productOfferDoFirstFlow
    isLoadingProductOfferDoFirstFlow: productOfferDoFirstFlow.isLoading,
    errorProductOfferDoFirstFlow: productOfferDoFirstFlow.error,
    productOfferDoFirstFlow: productOfferDoFirstFlow.data,
    //for productOffer/productOfferDel
    isLoadingProductOfferDel: productOfferDel.isPending,
    errorProductOfferDel: productOfferDel.error,
    productOfferDel: productOfferDel.mutateAsync,
    productOfferDelResponse: productOfferDel.data,
  };
}
