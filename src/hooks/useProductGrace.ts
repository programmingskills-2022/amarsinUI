import {
    useMutation,
    useQuery,
    useQueryClient,
    //useQueryClient,
    UseQueryOptions,
  } from "@tanstack/react-query";
  import api from "../api/axios";
  import { useProductGraceStore } from "../store/productGraceStore";
  import {
    ProductGraceDoFirstFlowRequest,
    ProductGraceDtlHistoryResponse,
    ProductGraceSaveRequest,
    ProductGraceResponse,
  } from "../types/productGrace";
import { ShowProductListRequest } from "../types/productOperation";
  
  export function useProductGrace() {
    const queryClient = useQueryClient();
  
    const {
      id,
      idTrigger,
      yearId,
      systemId,
      yearIdDtl,
      systemIdDtl,
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
      //productGraceResponse,
      setProductGraceResponse,
      setProductGraceListResponse,
      //for productGrace/dtlHistory
      setProductGraceDtlHistoryResponse,
      //for productPerm/save
      setProductGraceSaveResponse,
      //for productGrace/del
      setProductGraceDelResponse,
      //for productGrace/doFirstFlow
      setProductGraceDoFirstFlowResponse,
    } = useProductGraceStore();
    //for productOffer
    const query = useQuery<
      ProductGraceResponse,
      Error,
      ProductGraceResponse,
      unknown[]
    >({
      queryKey: [
        "productGrace",
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
        const url = `/api/ProductGrace?YearId=${
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
        console.log("ProductGrace url", url);
        const response = await api.get(url);
        return response.data;
      },
      enabled: systemId!==-1 && yearId!==-1,
      refetchOnWindowFocus: false, // Refetch data when the window is focused
      refetchOnReconnect: false, // Refetch data when the network reconnects
      onSuccess: (data: any) => {
        setProductGraceResponse(data);
      },
    } as UseQueryOptions<ProductGraceResponse, Error, ProductGraceResponse, unknown[]>);
  
    //for productOfferDtl
    const queryDtl = useQuery<
      ProductGraceResponse,
      Error,
      ProductGraceResponse,
      unknown[]
    >({
      queryKey: [
        "productGraceDtl",
        id,
        idTrigger,
        yearIdDtl,
        systemIdDtl,
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
          yearIdDtl,
          systemIdDtl,
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
        const url = `/api/ProductGrace?Id=${params.id}&YearId=${
          params.yearIdDtl
        }&SystemId=${params.systemIdDtl}&State=${
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
        console.log("ProductGraceDtl url", url);
        const response = await api.get(url);
        return response.data;
      },
      enabled: systemIdDtl!==-1 && yearIdDtl!==-1 && id!==-1,
      refetchOnWindowFocus: false, // Refetch data when the window is focused
      refetchOnReconnect: false, // Refetch data when the network reconnects
      onSuccess: (data: any) => {
        setProductGraceResponse(data);
      },
    } as UseQueryOptions<ProductGraceResponse, Error, ProductGraceResponse, unknown[]>);
  
    // for productGrace/showProductList
    const addList = useMutation({
      mutationFn: async (request: ShowProductListRequest) => {
        const url: string = `api/ProductGrace/showProductList `;
        const response = await api.post(url, request);
        return response.data;
      },
      onSuccess: (data: any) => {
        setProductGraceListResponse(data);
      },
    });
    // for productGrace/dtlHistory
    const productGraceDtlHistory = useQuery<
      ProductGraceDtlHistoryResponse,
      Error,
      ProductGraceDtlHistoryResponse,
      unknown[]
    >({
      queryKey: ["productGraceDtlHistory", pId, pIdTrigger],
      queryFn: async () => {
        const url = `/api/ProductGrace/dtlHistory?PId=${pId}`;
        console.log(url, "url");
        const response = await api.get(url);
        return response.data;
      },
      enabled: pId!==-1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (data: any) => {
        setProductGraceDtlHistoryResponse(data);
      },
    } as UseQueryOptions<ProductGraceDtlHistoryResponse, Error, ProductGraceDtlHistoryResponse, unknown[]>);
    // for productGrace/Save
    const productGraceSave = useMutation({
      mutationFn: async (request: ProductGraceSaveRequest) => {
        const url: string = `api/ProductGrace/Save`;
        const response = await api.post(url, request);
  
        return response.data;
      },
      onSuccess: (data: any) => {
        setProductGraceSaveResponse(data);
        queryClient.invalidateQueries({ queryKey: ["productGrace"] });
        queryClient.invalidateQueries({ queryKey: ["productGraceDtl"] });
        //console.log(data, "data");
      },
    });
    //for productPerm/productPermDoFirstFlow
    const productGraceDoFirstFlow = useMutation({
      mutationFn: async (request: ProductGraceDoFirstFlowRequest) => {
        const url: string = `api/ProductGrace/doFirstFlow?SystemId=${request.acc_System}&YearId=${request.acc_Year}&Id=${
          request.id
        }&Dsc=${encodeURIComponent(request.dsc)}&ChartId=${request.chartId}`;
        console.log(request, "request", url, "url");
        const response = await api.post(url);
  
        return response.data;
      },
      onSuccess: (data: any) => {
        setProductGraceDoFirstFlowResponse(data);
        queryClient.invalidateQueries({ queryKey: ["productGrace"] });
      },
    });
    //for productGrace/Del
    const productGraceDel = useMutation({
      mutationFn: async (requestId: number) => {
        const response = await api.delete(`api/ProductGrace/Del`, {
          params: {
            id: requestId,
          },
        });
        return response.data;
      },
      onSuccess: (data: any) => {
        setProductGraceDelResponse(data);
        queryClient.invalidateQueries({ queryKey: ["productGrace"] }); 
      },
    });
    return {
      //for productGrace
      refetch: query.refetch,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error,
      productGrace: query.data?.data.result.productGraces,
      productGraceMeta: query.data?.meta,
      productGraceTotalCount: query.data?.data.result.total_count,
      //for productGraceDtl
      refetchProductGraceDtl: queryDtl.refetch,
      isLoadingDtl: queryDtl.isLoading,
      errorDtl: queryDtl.error,
      productGraceDtl: queryDtl.data?.data.result.productGraceDtls,
      productGraceDtlData: queryDtl.data?.data.result,
      //for productGrace/showProductList
      isLoadingAddList: addList.isPending,
      errorAddList: addList.error,
      addProductList: addList.mutateAsync,
      //for productGrace/dtlHistory
      isLoadingDtlHistory: productGraceDtlHistory.isLoading,
      errorDtlHistory: productGraceDtlHistory.error,
      productGraceDtlHistory: productGraceDtlHistory.data?.data.result,
      //for productGrace/Save
      isLoadingProductGraceSave: productGraceSave.isPending,
      errorProductGraceSave: productGraceSave.error,
      productGraceSave: productGraceSave.mutateAsync,
      productGraceSaveResponse: productGraceSave.data,
      //for productGrace/Del
      isLoadingProductGraceDel: productGraceDel.isPending,
      errorProductGraceDel: productGraceDel.error,
      productGraceDel: productGraceDel.mutateAsync,
      productGraceDelResponse: productGraceDel.data,
      //for productGrace/DoFirstFlow
      isLoadingProductGraceDoFirstFlow: productGraceDoFirstFlow.isPending,
      errorProductGraceDoFirstFlow: productGraceDoFirstFlow.error,
      productGraceDoFirstFlow: productGraceDoFirstFlow.mutateAsync,
      productGraceDoFirstFlowResponse: productGraceDoFirstFlow.data ?? {},
    };
  }
  