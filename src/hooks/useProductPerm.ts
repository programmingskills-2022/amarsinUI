import {
  useMutation,
  useQuery,
  useQueryClient,
  //useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "../api/axios";
import { useProductPermStore } from "../store/productPermStore";
import {
  ProductPermDoFirstFlowRequest,
  ProductPermDtlHistoryResponse,
  ProductPermListRequest,
  ProductPermResponse,
  ProductPermSaveRequest,
} from "../types/productPerm";

export function useProductPerm() {
  const queryClient = useQueryClient();

  const {
    id,
    yearId,
    systemId,
    systemIdDtl,
    yearIdDtl,
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
    pIdTrigger,
    //productPermResponse,
    setProductPermResponse,
    setProductPermListResponse,
    //for productPerm/dtlHistory
    setProductPermDtlHistoryResponse,
    //for productPerm/save
    setProductPermSaveResponse,
    //for productPerm/del
    setProductPermDelResponse,
    //for productPerm/doFirstFlow
    setProductPermDoFirstFlowResponse,
  } = useProductPermStore();
  //for productOffer
  const query = useQuery<
    ProductPermResponse,
    Error,
    ProductPermResponse,
    unknown[]
  >({
    queryKey: [
      "productPerm",
      yearId,
      systemId,
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
        yearId,
        systemId,
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
      const url = `/api/ProductPerm/productPerm?YearId=${
        params.yearId
      }&SystemId=${params.systemId}&State=${
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
      console.log("ProductPerm url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemId!==-1 && yearId!== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setProductPermResponse(data);
    },
  } as UseQueryOptions<ProductPermResponse, Error, ProductPermResponse, unknown[]>);

  //for productOfferDtl
  const queryDtl = useQuery<
    ProductPermResponse,
    Error,
    ProductPermResponse,
    unknown[]
  >({
    queryKey: [
      "productPermDtl",
      id,
      systemIdDtl,
      yearIdDtl,
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
        systemIdDtl,
        yearIdDtl,
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
      const url = `/api/ProductPerm/ProductPerm?Id=${params.id}&Acc_Year=${
        params.yearIdDtl
      }&Acc_System=${params.systemIdDtl}&State=${
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
      console.log("ProductPermDtl url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemIdDtl!==-1 && yearIdDtl!== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setProductPermResponse(data);
    },
  } as UseQueryOptions<ProductPermResponse, Error, ProductPermResponse, unknown[]>);

  // for productOffer/showProductList
  const addList = useMutation({
    mutationFn: async (request: ProductPermListRequest) => {
      const url: string = `api/ProductPerm/productList `;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setProductPermListResponse(data);
    },
  });
  // for productPerm/dtlHistory
  const productPermDtlHistory = useQuery<
    ProductPermDtlHistoryResponse,
    Error,
    ProductPermDtlHistoryResponse,
    unknown[]
  >({
    queryKey: ["productPermDtlHistory", pId, pIdTrigger],
    queryFn: async () => {
      const url = `/api/ProductPerm/dtlHistory?PId=${pId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: pId!==-1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setProductPermDtlHistoryResponse(data);
    },
  } as UseQueryOptions<ProductPermDtlHistoryResponse, Error, ProductPermDtlHistoryResponse, unknown[]>);
  // for productOffer/productOfferSave
  const productPermSave = useMutation({
    mutationFn: async (request: ProductPermSaveRequest) => {
      const url: string = `api/ProductPerm/save`;
      const response = await api.post(url, request);

      return response.data;
    },
    onSuccess: (data: any) => {
      setProductPermSaveResponse(data);
      //console.log(data, "data");
      queryClient.invalidateQueries({ queryKey: ["productPerm"] });
      queryClient.invalidateQueries({ queryKey: ["productPermDtl"] });
    },
  });
  //for productPerm/productPermDoFirstFlow
  const productPermDoFirstFlow = useMutation({
    mutationFn: async (request: ProductPermDoFirstFlowRequest) => {
      const url: string = `api/ProductPerm/doFirstFlow?ChartId=${
        request.chartId
      }&Acc_System=${request.systemId}&Acc_Year=${request.yearId}&Id=${
        request.id
      }&Dsc=${encodeURIComponent(request.dsc)}`;
      console.log(request, "request", url, "url");
      const response = await api.post(url);

      return response.data;
    },
    onSuccess: (data: any) => {
      setProductPermDoFirstFlowResponse(data);
      queryClient.invalidateQueries({ queryKey: ["productPerm"] });
    },
  });
  //for productPerm/productPermDel
  const productPermDel = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await api.delete(`api/ProductPerm/del`, {
        params: {
          id: requestId,
        },
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      setProductPermDelResponse(data);
      queryClient.invalidateQueries({ queryKey: ["productPerm"] });
    },
  });
  return {
    //for productPerm
    refetch: query.refetch,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    productPerm: query.data?.data.result.productPerms,
    productPermMeta: query.data?.meta,
    productPermTotalCount: query.data?.data.result.total_count,
    //for productPermDtl
    refetchProductPermDtl: queryDtl.refetch,
    isLoadingDtl: queryDtl.isLoading,
    errorDtl: queryDtl.error,
    productPermDtl: queryDtl.data?.data.result.productPermDtls,
    productPermDtlData: queryDtl.data?.data.result,
    //for productPerm/productList
    isLoadingAddList: addList.isPending,
    errorAddList: addList.error,
    addProductList: addList.mutateAsync,
    //for productPerm/dtlHistory
    isLoadingDtlHistory: productPermDtlHistory.isLoading,
    errorDtlHistory: productPermDtlHistory.error,
    productPermDtlHistory: productPermDtlHistory.data?.data.result,
    //for productPerm/productPermSave
    isLoadingProductPermSave: productPermSave.isPending,
    errorProductPermSave: productPermSave.error,
    productPermSave: productPermSave.mutateAsync,
    productPermSaveResponse: productPermSave.data,
    //for productPerm/productPermDel
    isLoadingProductPermDel: productPermDel.isPending,
    errorProductPermDel: productPermDel.error,
    productPermDel: productPermDel.mutateAsync,
    productPermDelResponse: productPermDel.data,
    //for productPerm/productPermDoFirstFlow
    isLoadingProductPermDoFirstFlow: productPermDoFirstFlow.isPending,
    errorProductPermDoFirstFlow: productPermDoFirstFlow.error,
    productPermDoFirstFlow: productPermDoFirstFlow.mutateAsync,
    productPermDoFirstFlowResponse: productPermDoFirstFlow.data ?? {},
  };
}
