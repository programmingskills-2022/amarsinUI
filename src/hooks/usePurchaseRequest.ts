import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "../api/axios";
import { usePurchaseRequestStore } from "../store/purchaseRequestStore";
import {
  IndentDoFirstFlowRequest,
  IndentDtlHistoryResponse,
  IndentResponse,
  IndentSaveRequest,
  IndentShowProductListRequest,
} from "../types/purchaseRequest";

export function usePurchaseRequest() {
  const queryClient = useQueryClient();
  const {
    pId,
    mrsId,
    mrsIdTrigger,
    // for indent/list
    id,
    acc_YearIndentRequest,
    acc_SystemIndentRequest,
    acc_YearIndentDtlRequest,
    acc_SystemIndentDtlRequest,
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
    setIndentShowProductListResponse,
    setIndentSaveResponse,
    setIndentResponse, // for /api/Indent/list
    setIndentDelResponse, // for delete /api/Indent/6480
    setIndentDoFirstFlowResponse, // for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
  } = usePurchaseRequestStore();
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
    queryKey: ["dtlHistory", pId, mrsId, mrsIdTrigger],
    queryFn: async () => {
      const url: string = `api/Indent/dtlHistory?PId=${pId}&MrsId=${mrsId}`;
      console.log(url, "url");
      const response = await api.get<IndentDtlHistoryResponse>(url);
      return response.data;
    },
    enabled: pId !== -1 && mrsId !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

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
      const url = `/api/Indent/list?Id=0&OrdrId=${
        params.ordrIdIndentRequest
      }&MrsId=0&Acc_Year=${params.acc_YearIndentRequest}&Acc_System=${
        params.acc_SystemIndentRequest
      }&State=${params.state}&RegFDate=${encodeURIComponent(
        params.regFDate ?? "",
      )}&RegTDate=${encodeURIComponent(
        params.regTDate ?? "",
      )}&FDate=${encodeURIComponent(
        params.fDate ?? "",
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
    enabled: acc_YearIndentRequest !== -1 && acc_SystemIndentRequest !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setIndentResponse(data);
    },
  } as UseQueryOptions<IndentResponse, Error, IndentResponse, unknown[]>);

  const indentListDtlQuery = useQuery<
    IndentResponse,
    Error,
    IndentResponse,
    unknown[]
  >({
    queryKey: [
      "indentListDtl",
      id,
      acc_YearIndentDtlRequest,
      acc_SystemIndentDtlRequest,
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
        acc_YearIndentDtlRequest,
        acc_SystemIndentDtlRequest,
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
        params.acc_YearIndentDtlRequest
      }&Acc_System=${params.acc_SystemIndentDtlRequest}&State=${
        params.state
      }&RegFDate=${encodeURIComponent(
        params.regFDate ?? "",
      )}&RegTDate=${encodeURIComponent(
        params.regTDate ?? "",
      )}&FDate=${encodeURIComponent(
        params.fDate ?? "",
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
    enabled:
      acc_YearIndentDtlRequest !== -1 &&
      acc_SystemIndentDtlRequest !== -1 &&
      mrsIdIndentRequest !== 0 &&
      mrsIdIndentRequest !== -1,
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

  //for /api/Indent/doFirstFlow?Acc_System=4&Acc_Year=15&WFMS_FlowMapId=403020201&Id=6482&FlowNo=403020200&ChartId=1&Dsc=%D9%84%D8%A7%D9%84%DB%8C%D8%B3%D8%B3%D8%A8%D9%84%D8%A7%D8%A7
  const indentDoFirstFlowQuery = useMutation({
    mutationFn: async (request: IndentDoFirstFlowRequest) => {
      const url: string = `api/Indent/doFirstFlow?Acc_System=${request.acc_System}&Acc_Year=${request.acc_Year}
        }&MrsId=${request.mrsId}&ChartId=${request.chartId}&Dsc=${encodeURIComponent(request.dsc)}`;
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
    addProductListResponse: addList.data,

    //output for indent/save
    isLoadingSaveList: saveList.isPending,
    errorSaveList: saveList.error,
    saveList: saveList.mutateAsync,
    saveListResponse: saveList.data,

    //for Indent/dtlHistory
    isDtHistoryLoading: dtlHistoryQuery.isLoading,
    dtlHistoryError: dtlHistoryQuery.error,
    dtlHistoryResponse:
      dtlHistoryQuery.data?.data.result.indentDtlHistories ?? [],

    //output for  indent/list
    refetchIndentList: indentListQuery.refetch,
    isFetchingIndentList: indentListQuery.isFetching,
    isLoadingIndentList: indentListQuery.isLoading,
    errorIndentList: indentListQuery.error,
    indentListMeta: indentListQuery.data?.meta,
    indentList: indentListQuery.data?.data.result.indents ?? [],
    indentListTotalCount: indentListQuery.data?.data.result.total_count ?? 0,
    //output for indent/listDtl
    refetchIndentListDtl: indentListDtlQuery.refetch,
    isLoadingIndentListDtl: indentListDtlQuery.isLoading,
    errorIndentListDtl: indentListDtlQuery.error,
    indentListDtl: indentListDtlQuery.data?.data.result.indentDtls ?? [],
    indentListDtlData: indentListDtlQuery.data?.data.result,
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
