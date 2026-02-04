import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useTTacStore } from "../store/ttacStore";
import {
  CupboardCaptureResponse,
  FlowProductsSendAllRequest,
  FlowProductsSendAllResponse,
  GetInventoryBalanceRequest,
  GetInventoryBalanceResponse,
  ImportTTacStatusResponse,
  TTacResponse,
} from "../types/ttac";

export function useTtac() {
  const {
    systemId,
    yearId,
    hasErr,
    srchIRC,
    srchLotNumber,
    sortId,
    sortIRC,
    sortLotNumber,
    sortWStock,
    sortCnt,
    sortNotSent,
    sortTCnt,
    pageNumber,
    setGetInventoryBalanceResponse,
    setFlowProductsSendAllResponse,
    sendSrchCode,
    sendSrchIRC,
    sendSrchPName,
    sendSrchEventId,
    sendSrchMsg,
    sendSrchTitle,
    sendSrchDat,
    sendSrchSrName,
    sendSrchLotNumber,
    sendSrchSuccessed,
    sendSrchIsCancel,
    sendSrchFlowMapName,
    sendSrchCompleteDate,
    sendSystemId,
    sendYearId,
    sendDate,
    sendTtacSent,
    sendPageNumber,
    sendSortId,
    sendSortFId,
    sendSortTId,
    sendSortPId,
    sendSortIRC,
    sendSortPName,
    sendSortEventId,
    sendSortErr,
    sendSortMsg,
    sendSortTitle,
    sendSortCode,
    sendSortDat,
    sendSortSrName,
    sendSortLotNumber,
    sendSortCnt,
    sendSortSuccessed,
    sendSortIsCancel,
    sendSortFlowMapName,
    sendSortCompleteDate,
    cupboardCaptureId, //for api/TTAC/CupboardCapture
    cupboardCaptureCurrentDateTime, //for api/TTAC/CupboardCapture
    cupboardCaptureIdempotencyKey, //for api/TTAC/CupboardCapture
    setCupboardCaptureResponse, // for api/TTAC/CupboardCapture
    importTTacStatusSystemId, //for api/TTAC/ImportTTacStatus
    importTTacStatusLtId, //for api/TTAC/ImportTTacStatus
    importTTacStatusTrigger, //for api/TTAC/ImportTTacStatus
    setImportTTacStatusResponse, //for api/TTAC/ImportTTacStatus
    ttacRequestId, //for  /api/TTAC/Titac?Id=1123156
    ttacRequestIdTrigger,
    setTTacResponse, //for  /api/TTAC/Titac?Id=1123156
  } = useTTacStore();
  //for /api/TTAC/GetInventoryBalance?SystemId=4&YearId=15&SortId=0&SortIRC=0&SortLotNumber=0&SortWStock=0&SortCnt=0&SortNotSent=0&SortTCnt=0&PageNumber=1
  const query = useQuery<
    GetInventoryBalanceResponse,
    Error,
    GetInventoryBalanceResponse,
    unknown[]
  >({
    queryKey: [
      "getInventoryBalance",
      systemId,
      yearId,
      hasErr,
      srchIRC,
      srchLotNumber,
      sortId,
      sortIRC,
      sortLotNumber,
      sortWStock,
      sortCnt,
      sortNotSent,
      sortTCnt,
      pageNumber,
    ],
    queryFn: async () => {
      const params: GetInventoryBalanceRequest = {
        systemId,
        yearId,
        hasErr,
        srchIRC,
        srchLotNumber,
        sortId,
        sortIRC,
        sortLotNumber,
        sortWStock,
        sortCnt,
        sortNotSent,
        sortTCnt,
        pageNumber,
      };

      const url: string = `/api/TTAC/GetInventoryBalance?SystemId=${
        params.systemId
      }&YearId=${params.yearId}&HasErr=${
        params.hasErr
      }&SrchIRC=${encodeURIComponent(
        params.srchIRC
      )}&SrchLotNumber=${encodeURIComponent(params.srchLotNumber)}&SortId=${
        params.sortId
      }&SortIRC=${params.sortIRC}&SortLotNumber=${
        params.sortLotNumber
      }&SortWStock=${params.sortWStock}&SortCnt=${params.sortCnt}&SortNotSent=${
        params.sortNotSent
      }&SortTCnt=${params.sortTCnt}&PageNumber=${params.pageNumber}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemId !== -1 && yearId !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setGetInventoryBalanceResponse(data);
    },
  } as UseQueryOptions<GetInventoryBalanceResponse, Error, GetInventoryBalanceResponse, unknown[]>);
  //
  //for /api/TTAC/FlowProductsSendAll?SystemId=4&YearId=15&Date=1404%2F02%2F08&ttacSent=false&PageNumber=1&SortId=0&SortFId=0&SortTId=0&SortPId=0&SortIRC=0&SortPName=0&SortEventId=0&SortErr=0&SortMsg=0&SortTitle=0&SortCode=0&SortDat=0&SortSrName=0&SortLotNumber=0&SortCnt=0&SortSuccessed=0&SortIsCancel=0&SortFlowMapName=0&SortCompleteDate=0
  const flowProductsSendAllQuery = useQuery<
    FlowProductsSendAllResponse,
    Error,
    FlowProductsSendAllResponse,
    unknown[]
  >({
    queryKey: [
      "flowProductsSendAll",
      sendSrchCode,
      sendSrchIRC,
      sendSrchPName,
      sendSrchEventId,
      sendSrchMsg,
      sendSrchTitle,
      sendSrchDat,
      sendSrchSrName,
      sendSrchLotNumber,
      sendSrchSuccessed,
      sendSrchIsCancel,
      sendSrchFlowMapName,
      sendSrchCompleteDate,
      sendSystemId,
      sendYearId,
      sendDate,
      sendTtacSent,
      sendPageNumber,
      sendSortId,
      sendSortFId,
      sendSortTId,
      sendSortPId,
      sendSortIRC,
      sendSortPName,
      sendSortEventId,
      sendSortErr,
      sendSortMsg,
      sendSortTitle,
      sendSortCode,
      sendSortDat,
      sendSortSrName,
      sendSortLotNumber,
      sendSortCnt,
      sendSortSuccessed,
      sendSortIsCancel,
      sendSortFlowMapName,
      sendSortCompleteDate,
    ],
    queryFn: async () => {
      const params: FlowProductsSendAllRequest = {
        sendSrchCode,
        sendSrchIRC,
        sendSrchPName,
        sendSrchEventId,
        sendSrchMsg,
        sendSrchTitle,
        sendSrchDat,
        sendSrchSrName,
        sendSrchLotNumber,
        sendSrchSuccessed,
        sendSrchIsCancel,
        sendSrchFlowMapName,
        sendSrchCompleteDate,
        sendSystemId,
        sendYearId,
        sendDate,
        sendTtacSent,
        sendPageNumber,
        sendSortId,
        sendSortFId,
        sendSortTId,
        sendSortPId,
        sendSortIRC,
        sendSortPName,
        sendSortEventId,
        sendSortErr,
        sendSortMsg,
        sendSortTitle,
        sendSortCode,
        sendSortDat,
        sendSortSrName,
        sendSortLotNumber,
        sendSortCnt,
        sendSortSuccessed,
        sendSortIsCancel,
        sendSortFlowMapName,
        sendSortCompleteDate,
      };
      const url: string = `/api/TTAC/FlowProductsSendAll?SystemId=${
        params.sendSystemId
      }&YearId=${params.sendYearId}&Date=${params.sendDate}&ttacSent=${
        params.sendTtacSent
      }&PageNumber=${params.sendPageNumber}&SrchCode=${encodeURIComponent(
        params.sendSrchCode
      )}&SrchCompleteDate=${encodeURIComponent(
        params.sendSrchCompleteDate
      )}&SrchDat=${encodeURIComponent(
        params.sendSrchDat
      )}&SrchEventId=${encodeURIComponent(
        params.sendSrchEventId
      )}&SrchFlowMapName=${encodeURIComponent(
        params.sendSrchFlowMapName
      )}&SrchIRC=${encodeURIComponent(
        params.sendSrchIRC
      )}&SrchIsCancel=${encodeURIComponent(
        params.sendSrchIsCancel
      )}&SrchLotNumber=${encodeURIComponent(
        params.sendSrchLotNumber
      )}&SrchMsg=${encodeURIComponent(
        params.sendSrchMsg
      )}&SrchPName=${encodeURIComponent(
        params.sendSrchPName
      )}&SrchSrName=${encodeURIComponent(
        params.sendSrchSrName
      )}&SrchSuccessed=${encodeURIComponent(
        params.sendSrchSuccessed
      )}&SrchTitle=${encodeURIComponent(params.sendSrchTitle)}&SortId=${
        params.sendSortId
      }&SortFId=${params.sendSortFId}&SortTId=${params.sendSortTId}&SortPId=${
        params.sendSortPId
      }&SortIRC=${params.sendSortIRC}&SortPName=${
        params.sendSortPName
      }&SortEventId=${params.sendSortEventId}&SortErr=${
        params.sendSortErr
      }&SortMsg=${params.sendSortMsg}&SortTitle=${
        params.sendSortTitle
      }&SortCode=${params.sendSortCode}&SortDat=${
        params.sendSortDat
      }&SortSrName=${params.sendSortSrName}&SortLotNumber=${
        params.sendSortLotNumber
      }&SortCnt=${params.sendSortCnt}&SortSuccessed=${
        params.sendSortSuccessed
      }&SortIsCancel=${params.sendSortIsCancel}&SortFlowMapName=${
        params.sendSortFlowMapName
      }&SortCompleteDate=${params.sendSortCompleteDate}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: sendDate !== "" && systemId !== -1 && yearId !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setFlowProductsSendAllResponse(data);
    },
  } as UseQueryOptions<FlowProductsSendAllResponse, Error, FlowProductsSendAllResponse, unknown[]>);
  //for api/TTAC/CupboardCapture
  const cupboardCaptureQuery = useQuery<
    CupboardCaptureResponse,
    Error,
    CupboardCaptureResponse,
    unknown[]
  >({
    queryKey: [
      "cupboardCapture",
      cupboardCaptureId,
      cupboardCaptureCurrentDateTime,
    ],
    queryFn: async () => {
      const url: string = `/api/TTAC/CupboardCapture?Id=${cupboardCaptureId}&CurrentDateTime=${cupboardCaptureCurrentDateTime}&IdempotencyKey=${cupboardCaptureIdempotencyKey}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: cupboardCaptureId !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setCupboardCaptureResponse(data);
    },
  } as UseQueryOptions<CupboardCaptureResponse, Error, CupboardCaptureResponse, unknown[]>);

  //for api/TTAC/ImportTTacStatus
  const importTTacStatusQuery = useQuery<
    ImportTTacStatusResponse,
    Error,
    ImportTTacStatusResponse,
    unknown[]
  >({
    queryKey: [
      "importTTacStatus",
      importTTacStatusSystemId,
      importTTacStatusLtId,
      importTTacStatusTrigger,
    ],
    queryFn: async () => {
      const url: string = `/api/TTAC/ImportTTacStatus?SystemId=${importTTacStatusSystemId}&ltId=${importTTacStatusLtId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: importTTacStatusLtId !== -1 && importTTacStatusSystemId !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setImportTTacStatusResponse(data);
    },
  } as UseQueryOptions<ImportTTacStatusResponse, Error, ImportTTacStatusResponse, unknown[]>);

  //for  /api/TTAC/Titac?Id=1123156
  const titacQuery = useQuery<TTacResponse, Error, TTacResponse, unknown[]>({
    queryKey: ["titac", ttacRequestId, ttacRequestIdTrigger],
    queryFn: async () => {
      const url: string = `/api/TTAC/Titac?Id=${ttacRequestId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: ttacRequestId !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setTTacResponse(data);
    },
  } as UseQueryOptions<TTacResponse, Error, TTacResponse, unknown[]>);

  return {
    //output for GetInventoryBalance
    refetchGetInventoryBalance: () => query.refetch(),
    isFetchingGetInventoryBalance: query.isFetching,
    isLoadingGetInventoryBalance: query.isLoading,
    errorGetInventoryBalance: query.error,
    getInventoryBalanceResponse: query.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [], total_count: 0 },
    },
    //output for FlowProductsSendAll
    refetchFlowProductsSendAll: () => flowProductsSendAllQuery.refetch(),
    isFetchingFlowProductsSendAll: flowProductsSendAllQuery.isFetching,
    isLoadingFlowProductsSendAll: flowProductsSendAllQuery.isLoading,
    errorFlowProductsSendAll: flowProductsSendAllQuery.error,
    flowProductsSendAllResponse: flowProductsSendAllQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [], total_count: 0 },
    },
    //output for CupboardCapture
    refetchCupboardCapture: () => cupboardCaptureQuery.refetch(),
    isFetchingCupboardCapture: cupboardCaptureQuery.isFetching,
    isLoadingCupboardCapture:
      cupboardCaptureQuery.isLoading || cupboardCaptureQuery.isPending,
    errorCupboardCapture: cupboardCaptureQuery.error,
    cupboardCaptureResponse: cupboardCaptureQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          id: 0,
          err: 0,
          status: 0,
          successed: 0,
          msg: "",
          formId: 0,
          logId: 0,
          eventId: "",
          stockQuantity: 0,
        },
      },
    },
    //output for ImportTTacStatus
    refetchImportTTacStatus: () => importTTacStatusQuery.refetch(),
    isFetchingImportTTacStatus: importTTacStatusQuery.isFetching,
    isLoadingImportTTacStatus:
      importTTacStatusQuery.isLoading || importTTacStatusQuery.isPending,
    errorImportTTacStatus: importTTacStatusQuery.error,
    importTTacStatusResponse: importTTacStatusQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          id: 0,
          err: 0,
          status: 0,
          successed: 0,
          msg: "",
          formId: 0,
          logId: 0,
          eventId: "",
          stockQuantity: 0,
        },
      },
    },
    //output for ImportTitac
    refetchImportTitac: () => titacQuery.refetch(),
    isFetchingTitac: titacQuery.isFetching,
    isLoadingTitac: titacQuery.isLoading || titacQuery.isPending,
    errorTitac: titacQuery.error,
    titacResponse: titacQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          id: 0,
          err: 0,
          status: -10,
          successed: 0,
          msg: "",
          formId: 0,
          logId: 0,
          eventId: "",
          stockQuantity: 0,
        },
      },
    },
  };
}
