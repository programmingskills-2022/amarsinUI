import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { usePayRequestStore } from "../store/payRequestStore";
import {
  ChequeBookDtlByIdResponse,
  ChequeBookDtlSearchResponse,
  ChequeBookSearchResponse,
  PayRequestInvoicesResponse,
  PayRequestResponse,
  PayRequestSaveRequest,
} from "../types/payRequest";
import { RpCustomerBillsResponse } from "../types/sales";

export function usePayRequest() {
  const {
    id,
    acc_year,
    acc_system,
    setPayRequestResponse,
    payRequestId,
    systemIdPayRequestInvoice,
    yearIdPayRequestInvoice,
    customerId,
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
  } = usePayRequestStore();
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
      console.log(
        `/api/SaleReport/RpCustomerBills?SystemId=${systemIdRpCustomerBills}&YearId=${yearIdRpCustomerBills}&CustomerId=${customerIdRpCustomerBills}&FDate=${encodeURIComponent(
          fDateRpCustomerBills
        )}&TDate=${encodeURIComponent(tDateRpCustomerBills)}`
      );
      const response = await api.get(
        `/api/SaleReport/RpCustomerBills?SystemId=${systemIdRpCustomerBills}&YearId=${yearIdRpCustomerBills}&CustomerId=${customerIdRpCustomerBills}&FDate=${encodeURIComponent(
          fDateRpCustomerBills
        )}&TDate=${encodeURIComponent(tDateRpCustomerBills)}`
      );
      return response.data;
    },
    onSuccess: (data: any) => {
      console.log(data, "data");
      setRpCustomerBillsResponse(data);
    },
    enabled:
      customerIdRpCustomerBills !== 0 &&
      systemIdRpCustomerBills !== 0 &&
      yearIdRpCustomerBills !== 0,
  } as UseQueryOptions<RpCustomerBillsResponse, Error, RpCustomerBillsResponse, unknown[]>);

  //for PayRequest/PayRequest
  const payRequestQuery = useQuery<
    PayRequestResponse,
    Error,
    PayRequestResponse,
    unknown[]
  >({
    queryKey: ["payRequest", id, acc_year, acc_system],
    queryFn: async () => {
      console.log(
        `/api/PayRequest/PayRequest?Id=${id}&Acc_Year=${acc_year}&Acc_System=${acc_system}`
      );
      const response = await api.get(
        `/api/PayRequest/PayRequest?Id=${id}&Acc_Year=${acc_year}&Acc_System=${acc_system}`
      );
      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestResponse(data);
    },
    enabled: id !== 0 && acc_year !== 0 && acc_system !== 0,
  } as UseQueryOptions<PayRequestResponse, Error, PayRequestResponse, unknown[]>);

  //for PayRequest/PayRequestInvoices
  const payRequestInvoicesQuery = useQuery<
    PayRequestInvoicesResponse,
    Error,
    PayRequestInvoicesResponse,
    unknown[]
  >({
    queryKey: [
      "payRequestInvoices",
      payRequestId,
      systemIdPayRequestInvoice,
      yearIdPayRequestInvoice,
      customerId,
    ],
    queryFn: async () => {
      const response = await api.get(
        `/api/PayRequest/PayRequestInvoices?PayRequestId=${payRequestId}&SystemId=${systemIdPayRequestInvoice}&YearId=${yearIdPayRequestInvoice}&CustomerId=${customerId}`
      );
      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestInvoicesResponse(data);
    },
    enabled:
      payRequestId !== 0 &&
      systemIdPayRequestInvoice !== 0 &&
      yearIdPayRequestInvoice !== 0 &&
      customerId !== 0,
  } as UseQueryOptions<PayRequestInvoicesResponse, Error, PayRequestInvoicesResponse, unknown[]>);

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
      const url = `http://apitest.dotis.ir/api/Payment/chequeBookSearch?search=${encodeURIComponent(
        searchChequeBookSearch
      )}&page=${pageChequeBookSearch}&lastId=${lastIdChequeBookSearch}&Acc_System=${acc_systemChequeBookSearch}`;
      console.log(url, "url in chequeBookSearchQuery");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setChequeBookSearchResponse(data);
    },
    enabled: acc_systemChequeBookSearch !== 0,
  } as UseQueryOptions<ChequeBookSearchResponse, Error, ChequeBookSearchResponse, unknown[]>);
  //for Payment/chequeBookDtlSearch
  /*console.log(
    chequeBookIdChequeBookDtlSearch,
    "chequeBookIdChequeBookDtlSearch"
  );*/
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
      console.log(searchChequeBookDtlSearch, "searchChequeBookDtlSearch");
      const url = `http://apitest.dotis.ir/api/Payment/chequeBookDtlSearch?ChequeBookId=${chequeBookIdChequeBookDtlSearch}&page=${pageChequeBookDtlSearch}${
        searchChequeBookDtlSearch
          ? `&search=${encodeURIComponent(searchChequeBookDtlSearch)}`
          : ""
      }&lastId=${lastIdChequeBookDtlSearch}`;
      console.log(url, "url in chequeBookDtlSearchQuery");
      const response = await api.get(url);
      //console.log(response.data, "data in chequeBookDtlSearchQuery");
      setChequeBookDtlSearchResponse(response.data);
      return response.data;
    },
    /* onSuccess: (data: any) => {
      console.log(data, "data in chequeBookDtlSearchQuery");
      setChequeBookDtlSearchResponse(data);
    },*/
    enabled: chequeBookIdChequeBookDtlSearch !== 0,
  } as UseQueryOptions<ChequeBookDtlSearchResponse, Error, ChequeBookDtlSearchResponse, unknown[]>);
  //for Payment/chequeBookDtlById
  const chequeBookDtlByIdQuery = useQuery<
    ChequeBookDtlByIdResponse,
    Error,
    ChequeBookDtlByIdResponse,
    unknown[]
  >({
    queryKey: ["chequeBookDtlById", chequeBookDtlId],
    queryFn: async () => {
      const url = `http://apitest.dotis.ir/api/Payment/chequeBookDtlById?ChequeBookDtlId=${chequeBookDtlId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setChequeBookDtlByIdResponse(data);
    },
    enabled: chequeBookDtlId !== 0,
  } as UseQueryOptions<ChequeBookDtlByIdResponse, Error, ChequeBookDtlByIdResponse, unknown[]>);
  //for PayRequest/PayRequestSave
  const payRequestSaveFn = useMutation({
    mutationFn: async (request: PayRequestSaveRequest) => {
      const response = await api.post(
        `/api/PayRequest/PayRequestSave`,
        request
      );
      return response.data;
    },
    onSuccess: (data: any) => {
      setPayRequestSaveResponse(data);
    },
  });
  return {
    //output for PayRequest/PayRequest
    isLoadingPayRequest: payRequestQuery.isLoading,
    errorPayRequest: payRequestQuery.error,
    payRequestResponse: payRequestQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          err: 0,
          msg: "",
          payRequests: [],
          payRequestDtls: [],
          invcs: [],
        },
      },
    },
    //output for PayRequest/PayRequestInvoices
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
    //output for PayRequest/PayRequestSave
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
  };
}
