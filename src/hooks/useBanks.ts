import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useBankStore } from "../store/bankStore";
import { BankSearchRequest, BankSearchResponse } from "../types/bank";

export function useBanks() {
  const { search, page, lastId, setBanks } = useBankStore();

  const query = useQuery<
    BankSearchResponse,
    Error,
    BankSearchResponse,
    unknown[]
  >({
    queryKey: ["banks", search, page, lastId],
    queryFn: async () => {
      const params: BankSearchRequest = {
        lastId,
        page,
        search,
      };
      const url = `/api/Payment/bankSearch?page=${params.page}&lastId=${
        params.lastId
      }&search=${encodeURIComponent(search ?? "")}`;
      console.log(url, "url");
      const response = await api.get(url);

      return response.data;
    },
    enabled: page !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setBanks(data);
    },
  } as UseQueryOptions<BankSearchResponse, Error, BankSearchResponse, unknown[]>);

  return {
    isLoading: query.isLoading,
    error: query.error,
    banks: query.data?.results ?? [],
  };
}
