import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "../api/axios";
import { usePayRequestStore } from "../store/payRequestStore";
import {
  ChequeBookDtlByIdResponse,
  ChequeBookDtlSearchResponse,
  ChequeBookSearchResponse,
  PayRequestDoFirstFlowRequest,
  PayRequestDtlAddInvoiceRequest,
  PayRequestDtlAddRemoveInvoiceResponse,
  PayRequestDtlRemoveInvoiceRequest,
  PayRequestInvoicesResponse,
  PayRequestResponse,
  PayRequestSaveRequest,
} from "../types/payRequest";
import { RpCustomerBillsResponse } from "../types/sales";

export function usePayRequest() {
  const {
    id,
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
    srchSrName,
    srchAmount,
    sortSrName,
    sortAmount,
    setPayRequestResponse,
    payRequestId,
    systemIdPayRequestInvoice,
    yearIdPayRequestInvoice,
    customerId,
    payRequestDtlId,
    payRequestDtlIdTrigger,
    setPayRequestInvoicesResponse,
    setRpCustomerBillsResponse,
    customerIdRpCustomerBills,
    systemIdRpCustomerBills,
    yearIdRpCustomerBills,
    fDateRpCustomerBills,
    tDateRpCustomerBills,
    // for Payment/chequeBookSearch
    setChequeBookSearchResponse,
    acc_systemChequeBookSearch,
    searchChequeBookSearch,
    pageChequeBookSearch,
    lastIdChequeBookSearch,
    // for Payment/chequeBookDtlSearch
    chequeBookIdChequeBookDtlSearch,
    pageChequeBookDtlSearch,
    lastIdChequeBookDtlSearch,
    searchChequeBookDtlSearch,
    setChequeBookDtlSearchResponse,
    // for Payment/chequeBookDtlById
    chequeBookDtlId,
    setChequeBookDtlByIdResponse,
    // for PayRequest/PayRequestSave
    setPayRequestSaveResponse,
    // for PayRequest/DoFirstFlow
    setPayRequestDoFirstFlowResponse,
    // for PayRequest/Del
    setPayRequestDelResponse,
    // for PayRequest/DtlRemoveInvoice
    setPayRequestDtlRemoveInvoiceResponse,
    // for PayRequest/DtlAddInvoice
    setPayRequestDtlAddInvoiceResponse,
  } = usePayRequestStore();
  const queryClient = useQueryClient();
  //for SaleReport/RpCustomerBills
  const rpCustomerBillsQuery = useQuery<
    RpCustomerBillsResponse,
    Error,
    RpCustomerBillsResponse,
    unknown[]
  >({
    queryKey: [
      "rpCustomerBills",
      customerIdRpCustomerBills,
      systemIdRpCustomerBills,
      yearIdRpCustomerBills,
      fDateRpCustomerBills,
      tDateRpCustomerBills,
    ],
    queryFn: async () => {
      const url = `/api/SaleReport/RpCustomerBills?SystemId=${systemIdRpCustomerBills}&YearId=${yearIdRpCustomerBills}&CustomerId=${customerIdRpCustomerBills}&FDate=${encodeURIComponent(
        fDateRpCustomerBills,
      )}&TDate=${encodeURIComponent(tDateRpCustomerBills)}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setRpCustomerBillsResponse(data);
    },
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    enabled:
      customerIdRpCustomerBills !== -1 && customerIdRpCustomerBills !== 0 &&
      systemIdRpCustomerBills !== -1 &&
      yearIdRpCustomerBills !== -1,
  } as UseQueryOptions<
    RpCustomerBillsResponse,
    Error,
    RpCustomerBillsResponse,
    unknown[]
  >);
  //for PayRequest
  const payRequest = useQuery<
    PayRequestResponse,
    Error,
    PayRequestResponse,
    unknown[]
  >({
    queryKey: [
      "payRequest",
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
      srchSrName,
      srchAmount,
      sortSrName,
      sortAmount,
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
        srchSrName,
        srchAmount,
        sortSrName,
        sortAmount,
      };
      const url = `/api/PayRequest?YearId=${params.yearId}&SystemId=${
        params.systemId
      }&State=${params.state}&RegFDate=${encodeURIComponent(
        params.regFDate ?? "",
      )}&RegTDate=${encodeURIComponent(
        params.regTDate ?? "",
      )}&FDate=${encodeURIComponent(
        params.fDate ?? "",
      )}&TDate=${encodeURIComponent(params.tDate ?? "")}&PageNumber=${
        params.pageNumber
      }&SrchSrName=${encodeURIComponent(params.srchSrName)}&SrchAmount=${
        params.srchAmount
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
      }${params.srchAccepted ? `&SrchAccepted=${params.srchAccepted}` : ""}${
        params.srchUsrName
          ? `&SrchUsrName=${encodeURIComponent(params.srchUsrName ?? "")}`
          : ""
      }${
        params.srchStep
          ? `&SrchStep=${encodeURIComponent(params.srchStep)}`
          : ""
      }&SortId=${params.sortId}&SortDat=${params.sortDat}&SortTime=${
        params.sortTime
      }&SortDsc=${params.sortDsc}&SortAccepted=${params.sortAccepted}${
        params.sortUsrName ? `&SortUsrName=${params.sortUsrName}` : ""
      }${params.sortStep ? `&SortStep=${params.sortStep}` : ""}&SortSrName=${
        params.sortSrName
      }&SortAmount=${params.sortAmount}`;
      console.log("PayRequest url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled: yearId !== -1 && systemId !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setPayRequestResponse(data);
    },
  } as UseQueryOptions<
    PayRequestResponse,
    Error,
    PayRequestResponse,
    unknown[]
  >);

  //for payRequestDtl
  const payRequestDtl = useQuery<
    PayRequestResponse,
    Error,
    PayRequestResponse,
    unknown[]
  >({
    queryKey: [
      "payRequestDtl",
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
      srchSrName,
      srchAmount,
      sortSrName,
      sortAmount,
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
        srchSrName,
        srchAmount,
        sortSrName,
        sortAmount,
      };
      const url = `/api/PayRequest?Id=${params.id}&YearId=${
        params.yearIdDtl
      }&SystemId=${params.systemIdDtl}&State=${
        params.state
      }&RegFDate=${encodeURIComponent(
        params.regFDate ?? "",
      )}&RegTDate=${encodeURIComponent(
        params.regTDate ?? "",
      )}&FDate=${encodeURIComponent(
        params.fDate ?? "",
      )}&TDate=${encodeURIComponent(params.tDate ?? "")}&PageNumber=${
        params.pageNumber
      }&SrchSrName=${encodeURIComponent(params.srchSrName)}&SrchAmount=${
        params.srchAmount
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
      }${params.srchAccepted ? `&SrchAccepted=${params.srchAccepted}` : ""}${
        params.srchUsrName
          ? `&SrchUsrName=${encodeURIComponent(params.srchUsrName ?? "")}`
          : ""
      }${
        params.srchStep
          ? `&SrchStep=${encodeURIComponent(params.srchStep)}`
          : ""
      }&SortId=${params.sortId}&SortDat=${params.sortDat}&SortTime=${
        params.sortTime
      }&SortDsc=${params.sortDsc}&SortAccepted=${params.sortAccepted}${
        params.sortUsrName ? `&SortUsrName=${params.sortUsrName}` : ""
      }${params.sortStep ? `&SortStep=${params.sortStep}` : ""}&SortSrName=${
        params.sortSrName
      }&SortAmount=${params.sortAmount}`;
      console.log("PayRequestDtl url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled: id !== -1 && yearIdDtl !== -1 && systemIdDtl !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setPayRequestResponse(data);
    },
  } as UseQueryOptions<
    PayRequestResponse,
    Error,
    PayRequestResponse,
    unknown[]
  >);

  //for /api/PayRequest/Invoices
  const payRequestInvoicesQuery = useQuery<
    PayRequestInvoicesResponse,
    Error,
    PayRequestInvoicesResponse,
    unknown[]
  >({
    queryKey: [
      "payRequestInvoices",
      //payRequestDtlIdTrigger,
      payRequestId,
      systemIdPayRequestInvoice,
      yearIdPayRequestInvoice,
      customerId,
      //payRequestDtlId,
    ],
    queryFn: async () => {
      const url = `/api/PayRequest/Invoices?PayRequestId=${payRequestId}&SystemId=${systemIdPayRequestInvoice}&YearId=${yearIdPayRequestInvoice}&CustomerId=${customerId}`;
      //change to below
      //const url = `/api/PayRequest/DtlInvoices?PayRequestDtlId=${payRequestDtlId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestInvoicesResponse(data);
    },
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    enabled:
      payRequestId !== -1 &&
      systemIdPayRequestInvoice !== -1 &&
      yearIdPayRequestInvoice !== -1 &&
      customerId !== -1 &&
      customerId !== 0,
    //payRequestDtlId !== -1,
  } as UseQueryOptions<
    PayRequestInvoicesResponse,
    Error,
    PayRequestInvoicesResponse,
    unknown[]
  >);
  //for PayRequest/DtlInvoices
  const payRequestInvoicesWorkFlowQuery = useQuery<
    PayRequestInvoicesResponse,
    Error,
    PayRequestInvoicesResponse,
    unknown[]
  >({
    queryKey: [
      "payRequestInvoicesWorkFlow",
      payRequestDtlIdTrigger,
      //payRequestId,
      //systemIdPayRequestInvoice,
      //yearIdPayRequestInvoice,
      //customerId,
      payRequestDtlId,
    ],
    queryFn: async () => {
      //const url = `/api/PayRequest/Invoices?PayRequestId=${payRequestId}&SystemId=${systemIdPayRequestInvoice}&YearId=${yearIdPayRequestInvoice}&CustomerId=${customerId}`;
      //change to below
      const url = `/api/PayRequest/DtlInvoices?PayRequestDtlId=${payRequestDtlId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestInvoicesResponse(data);
    },
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    enabled:
      /*payRequestId !== -1 &&
      systemIdPayRequestInvoice !== -1 &&
      yearIdPayRequestInvoice !== -1 &&
      customerId !== -1 &&
      customerId !== 0,*/
      payRequestDtlId !== -1,
  } as UseQueryOptions<
    PayRequestInvoicesResponse,
    Error,
    PayRequestInvoicesResponse,
    unknown[]
  >);

  //for Payment/chequeBookSearch
  const chequeBookSearchQuery = useQuery<
    ChequeBookSearchResponse,
    Error,
    ChequeBookSearchResponse,
    unknown[]
  >({
    queryKey: [
      "chequeBookSearch",
      acc_systemChequeBookSearch,
      searchChequeBookSearch,
      pageChequeBookSearch,
      lastIdChequeBookSearch,
    ],
    queryFn: async () => {
      const url = `/api/Payment/chequeBookSearch?search=${encodeURIComponent(
        searchChequeBookSearch,
      )}&page=${pageChequeBookSearch}&lastId=${lastIdChequeBookSearch}&Acc_System=${acc_systemChequeBookSearch}`;
      console.log(url, "url in chequeBookSearchQuery");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setChequeBookSearchResponse(data);
    },
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    enabled: acc_systemChequeBookSearch !== -1,
  } as UseQueryOptions<
    ChequeBookSearchResponse,
    Error,
    ChequeBookSearchResponse,
    unknown[]
  >);
  //for Payment/chequeBookDtlSearch
  const chequeBookDtlSearchQuery = useQuery<
    ChequeBookDtlSearchResponse,
    Error,
    ChequeBookDtlSearchResponse,
    unknown[]
  >({
    queryKey: [
      "chequeBookDtlSearch",
      chequeBookIdChequeBookDtlSearch,
      pageChequeBookDtlSearch,
      lastIdChequeBookDtlSearch,
      searchChequeBookDtlSearch,
    ],
    queryFn: async () => {
      const url = `/api/Payment/chequeBookDtlSearch?ChequeBookId=${chequeBookIdChequeBookDtlSearch}&page=${pageChequeBookDtlSearch}${
        searchChequeBookDtlSearch
          ? `&search=${encodeURIComponent(searchChequeBookDtlSearch)}`
          : ""
      }&lastId=${lastIdChequeBookDtlSearch}`;
      console.log(url, "url in chequeBookDtlSearchQuery");
      const response = await api.get(url);
      setChequeBookDtlSearchResponse(response.data);
      return response.data;
    },
    /* onSuccess: (data: any) => {
      console.log(data, "data in chequeBookDtlSearchQuery");
      setChequeBookDtlSearchResponse(data);
    },*/
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    enabled:
      chequeBookIdChequeBookDtlSearch !== -1 &&
      chequeBookIdChequeBookDtlSearch !== undefined,
  } as UseQueryOptions<
    ChequeBookDtlSearchResponse,
    Error,
    ChequeBookDtlSearchResponse,
    unknown[]
  >);
  //for Payment/chequeBookDtlById
  const chequeBookDtlByIdQuery = useQuery<
    ChequeBookDtlByIdResponse,
    Error,
    ChequeBookDtlByIdResponse,
    unknown[]
  >({
    queryKey: ["chequeBookDtlById", chequeBookDtlId],
    queryFn: async () => {
      const url = `/api/Payment/chequeBookDtlById?ChequeBookDtlId=${chequeBookDtlId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setChequeBookDtlByIdResponse(data);
    },
    enabled: chequeBookDtlId !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
  } as UseQueryOptions<
    ChequeBookDtlByIdResponse,
    Error,
    ChequeBookDtlByIdResponse,
    unknown[]
  >);
  //for PayRequest/Save
  const payRequestSaveFn = useMutation({
    mutationFn: async (request: PayRequestSaveRequest) => {
      const response = await api.post(`/api/PayRequest/Save`, request);
      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestSaveResponse(data);
      if (data.meta.errorCode <= 0) {
        queryClient.invalidateQueries({ queryKey: ["payRequest"] });
        queryClient.invalidateQueries({ queryKey: ["payRequestDtl"] });
      }
    },
  });
  //for payRequest/DoFirstFlow
  const payRequestDoFirstFlow = useMutation({
    mutationFn: async (request: PayRequestDoFirstFlowRequest) => {
      const url: string = `api/PayRequest/doFirstFlow?ChartId=${
        request.chartId
      }&Acc_System=${request.systemId}&Acc_Year=${request.yearId}&Id=${
        request.id
      }&Dsc=${encodeURIComponent(request.dsc)} &FlowNo=${
        request.flowNo
      }&WFMS_FlowMapId=${request.wFMS_FlowMapId}`;
      console.log(request, "request", url, "url");
      const response = await api.post(url);

      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestDoFirstFlowResponse(data);
      queryClient.invalidateQueries({ queryKey: ["payRequest"] });
    },
  });
  //for payRequest/Del
  const payRequestDel = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await api.delete(`api/PayRequest/del`, {
        params: {
          id: requestId,
        },
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestDelResponse(data);
      queryClient.invalidateQueries({ queryKey: ["payRequest"] });
    },
  });
  //for PayRequest/DtlRemoveInvoice
  const payRequestDtlRemoveInvoice = useMutation({
    mutationFn: async (request: PayRequestDtlRemoveInvoiceRequest) => {
      const url: string = `api/PayRequest/DtlRemoveInvoice?PayRequestDtlId=${request.payRequestDtlId}&InvoiceId=${request.invoiceId}`;
      console.log(url, "url in payRequestDtlRemoveInvoice");
      const response = await api.delete(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestDtlRemoveInvoiceResponse(
        data as PayRequestDtlAddRemoveInvoiceResponse,
      );
      queryClient.invalidateQueries({ queryKey: ["payRequestDtl"] });
    },
  });
  //for PayRequest/DtlAddInvoice
  const payRequestDtlAddInvoice = useMutation({
    mutationFn: async (request: PayRequestDtlAddInvoiceRequest) => {
      const url: string = `api/PayRequest/DtlAddInvoice?PayRequestDtlId=${request.payRequestDtlId}&InvoiceId=${request.invoiceId}&Settlement=${request.settlement}`;
      console.log(url, "url in payRequestDtlAddInvoice");
      const response = await api.post(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestDtlAddInvoiceResponse(
        data as PayRequestDtlAddRemoveInvoiceResponse,
      );
      queryClient.invalidateQueries({ queryKey: ["payRequestDtl"] });
    },
  });
  return {
    //output for PayRequest (using fpr PayRequestShow)
    refetch: payRequest.refetch,
    isLoadingPayRequest: payRequest.isLoading,
    isFetchingPayRequest: payRequest.isFetching,
    errorPayRequest: payRequest.error,
    payRequest: payRequest.data?.data.result.payRequest.payRequests,
    payRequestMeta: payRequest.data?.meta,
    payRequestTotalCount: payRequest.data?.data.result.payRequest.total_count,
    //for PayRequestDtl
    refetchPayRequestDtl:payRequestDtl.refetch,
    isLoadingDtl: payRequestDtl.isLoading,
    errorDtl: payRequestDtl.error,
    payRequestDtl: payRequestDtl.data?.data.result.payRequestDtls,
    payRequestDtlData: payRequestDtl.data?.data.result,
    payRequestResponse: payRequestDtl.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          err: 0,
          msg: "",
          payRequest: {
            total_count: 0,
            payRequests: [],
          },
          payRequests: [],
          payRequestDtls: [],
          invcs: [],
        },
      },
    },
    //output for PayRequest/Invoices
    isLoadingPayRequestInvoices: payRequestInvoicesQuery.isLoading,
    errorPayRequestInvoices: payRequestInvoicesQuery.error,
    payRequestInvoicesResponse: payRequestInvoicesQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          err: 0,
          msg: "",
          invoices: [],
        },
      },
    },
    //output for PayRequest/Invoices
    isLoadingPayRequestInvoicesWorkFlow:
      payRequestInvoicesWorkFlowQuery.isLoading,
    errorPayRequestInvoicesWorkFlow: payRequestInvoicesWorkFlowQuery.error,
    payRequestInvoicesWorkFlowResponse:
      payRequestInvoicesWorkFlowQuery.data ?? {
        meta: {
          errorCode: 0,
          message: "",
          type: "",
        },
        data: {
          result: {
            err: 0,
            msg: "",
            invoices: [],
          },
        },
      },
    //output for SaleReport/RpCustomerBills
    isLoadingRpCustomerBills: rpCustomerBillsQuery.isLoading,
    errorRpCustomerBills: rpCustomerBillsQuery.error,
    rpCustomerBillsResponse: rpCustomerBillsQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: [],
      },
    },
    //output for Payment/chequeBookSearch
    isLoadingChequeBookSearch: chequeBookSearchQuery.isLoading,
    errorChequeBookSearch: chequeBookSearchQuery.error,
    chequeBookSearchResponse: chequeBookSearchQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          total_count: 0,
          results: [],
        },
      },
    },
    //output for Payment/chequeBookDtlSearch
    isLoadingChequeBookDtlSearch: chequeBookDtlSearchQuery.isLoading,
    errorChequeBookDtlSearch: chequeBookDtlSearchQuery.error,
    chequeBookDtlSearchResponse: chequeBookDtlSearchQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          total_count: 0,
          results: [],
        },
      },
    },
    //output for Payment/chequeBookDtlById
    isLoadingChequeBookDtlById: chequeBookDtlByIdQuery.isLoading,
    errorChequeBookDtlById: chequeBookDtlByIdQuery.error,
    chequeBookDtlByIdResponse: chequeBookDtlByIdQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          err: 0,
          msg: "",
          checkBookDtl: {
            id: 0,
            chqBkNo: "",
          },
        },
      },
    },
    //output for PayRequest/Save
    isLoadingPayRequestSave: payRequestSaveFn.isPending,
    errorPayRequestSave: payRequestSaveFn.error,
    payRequestSave: payRequestSaveFn.mutateAsync,
    payRequestSaveResponse: payRequestSaveFn.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          id: 0,
          err: 0,
          msg: "",
          dtlErrMsgs: [],
        },
      },
    },
    //for PayRequest/DoFirstFlow
    isLoadingPayRequestDoFirstFlow: payRequestDoFirstFlow.isPending,
    errorPayRequestDoFirstFlow: payRequestDoFirstFlow.error,
    payRequestDoFirstFlow: payRequestDoFirstFlow.mutateAsync,
    payRequestDoFirstFlowResponse: payRequestDoFirstFlow.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          systemId: 0,
          id: 0,
          err: 0,
          msg: "",
          hasFlow: false,
        },
      },
    },
    //for PayRequest/Del
    isLoadingPayRequestDel: payRequestDel.isPending,
    errorPayRequestDel: payRequestDel.error,
    payRequestDel: payRequestDel.mutateAsync,
    payRequestDelResponse: payRequestDel.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          systemId: 0,
          id: 0,
          err: 0,
          msg: "",
          hasFlow: false,
        },
      },
    },
    //for PayRequest/DtlRemoveInvoice
    isLoadingPayRequestDtlRemoveInvoice: payRequestDtlRemoveInvoice.isPending,
    errorPayRequestDtlRemoveInvoice: payRequestDtlRemoveInvoice.error,
    payRequestDtlRemoveInvoice: payRequestDtlRemoveInvoice.mutateAsync,
    payRequestDtlRemoveInvoiceResponse: payRequestDtlRemoveInvoice.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: 0,
      },
    },
    //for PayRequest/DtlAddInvoice
    isLoadingPayRequestDtlAddInvoice: payRequestDtlAddInvoice.isPending,
    errorPayRequestDtlAddInvoice: payRequestDtlAddInvoice.error,
    payRequestDtlAddInvoice: payRequestDtlAddInvoice.mutateAsync,
    payRequestDtlAddInvoiceResponse: payRequestDtlAddInvoice.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: 0,
      },
    },
  };
}
