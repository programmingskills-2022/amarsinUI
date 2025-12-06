import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useBankAccountStore } from "../store/bankAccountStore";
import {
  BankAccountSearchRequest,
  BankAccountSearchResponse,
  ChequeAssignBankAccountRequest,
  GetChequeAssignBankAccountRequest,
  GetChequeAssignBankAccountResponse,
} from "../types/bankAccount";

export function useBankAccount() {
  const {
    systemId,
    lastId,
    page,
    search,
    setBankAccountSearchResponse,
    paymentId,
    asnadId,
    setGetChequeAssignBankAccountResponse,
    setChequeAssignBankAccountResponse,
  } = useBankAccountStore();

  //for api/Payment/bankAccountSearch?search=%D8%A2&page=1&lastId=0&SystemId=1
  const bankAccountSearchQuery = useQuery<
    BankAccountSearchResponse,
    Error,
    BankAccountSearchResponse,
    unknown[]
  >({
    queryKey: ["bankAccountSearch", systemId, lastId, page, search],
    queryFn: async () => {
      const params: BankAccountSearchRequest = {
        systemId,
        lastId,
        page,
        search,
      };
      const url = `/api/Payment/bankAccountSearch?SystemId=${params.systemId}&LastId=${params.lastId}&Page=${params.page}&Search=${params.search}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemId !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setBankAccountSearchResponse(data);
    },
  } as UseQueryOptions<BankAccountSearchResponse, Error, BankAccountSearchResponse, unknown[]>);

  //for api/Payment/getChequeAssignBankAccount?PaymentId=360944&AsnadId=0
  const getChequeAssignBankAccountQuery = useQuery<
    GetChequeAssignBankAccountResponse,
    Error,
    GetChequeAssignBankAccountResponse,
    unknown[]
  >({
    queryKey: ["getChequeAssignBankAccount", paymentId, asnadId],
    queryFn: async () => {
      const params: GetChequeAssignBankAccountRequest = {
        paymentId,
        asnadId,
      };
      const url = `/api/Payment/getChequeAssignBankAccount?PaymentId=${params.paymentId}&AsnadId=${params.asnadId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: paymentId !== -1 && asnadId !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setGetChequeAssignBankAccountResponse(data);
    },
  } as UseQueryOptions<GetChequeAssignBankAccountResponse, Error, GetChequeAssignBankAccountResponse, unknown[]>);

  //for http://apitest.dotis.ir/api/Payment/chequeAssignBankAccount
  const chequeAssignBankAccountQuery = useMutation({
    mutationFn: async (request: ChequeAssignBankAccountRequest) => {
      const url = `/api/Payment/chequeAssignBankAccount`;
      const response = await api.post(url, {
        paymentId: request.paymentId,
        asnadId: request.asnadId,
        bankAccountId: request.bankAccountId,
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      setChequeAssignBankAccountResponse(data);
      //queryClient.invalidateQueries({ queryKey: ["clearBookProducts"] });
    },
  });
  return {
    //for  bankAccountSearch
    refetchBankAccountSearch: bankAccountSearchQuery.refetch,
    isLoadingBankAccountSearch: bankAccountSearchQuery.isLoading,
    errorBankAccountSearch: bankAccountSearchQuery.error,
    bankAccountSearchResponse: bankAccountSearchQuery.data?.data.result ?? [],
    //for getChequeAssignBankAccount
    refetchGetChequeAssignBankAccount: getChequeAssignBankAccountQuery.refetch,
    isLoadingGetChequeAssignBankAccount:
      getChequeAssignBankAccountQuery.isLoading,
    errorGetChequeAssignBankAccount: getChequeAssignBankAccountQuery.error,
    getChequeAssignBankAccountResponse: getChequeAssignBankAccountQuery.data
      ?.data.result ?? { id: 0, name: "" },
    //for chequeAssignBankAccount
    chequeAssignBankAccount: chequeAssignBankAccountQuery.mutate,
    isLoadingChequeAssignBankAccount: chequeAssignBankAccountQuery.isPending,
    errorChequeAssignBankAccount: chequeAssignBankAccountQuery.error,
    chequeAssignBankAccountResponse: chequeAssignBankAccountQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: 0 },
    },
  };
}
