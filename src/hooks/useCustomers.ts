import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useCustomerStore } from "../store/customerStore";
import {
  CustomerSearchRequest,
  CustomerSearchResponse,
} from "../types/customer";

export function useCustomers() {
  const {
    systemIdCustomerSearch,
    yearIdCustomerSearch,
    centerType,
    search,
    page,
    lastId,
    usrPerm,
    setCustomerSearchResponse,
  } = useCustomerStore();

  const query = useQuery<
    CustomerSearchResponse,
    Error,
    CustomerSearchResponse,
    unknown[]
  >({
    queryKey: [
      "customers",
      systemIdCustomerSearch,
      yearIdCustomerSearch,
      centerType,
      search,
      page,
      lastId,
      usrPerm,
    ],
    queryFn: async () => {
      const params: CustomerSearchRequest = {
        systemIdCustomerSearch,
        yearIdCustomerSearch,
        centerType,
        lastId,
        page,
        usrPerm,
        search,
      };
      const url = `/api/Customer/search?systemId=${params.systemIdCustomerSearch}&yearId=${
        params.yearIdCustomerSearch
      }&centerType=${params.centerType}&page=${params.page}&lastId=${
        params.lastId
      }&usrPerm=${params.usrPerm}&search=${encodeURIComponent(search ?? "")}`;
      const response = await api.get(url);

      return response.data;
    },
    enabled: systemIdCustomerSearch !== -1 && yearIdCustomerSearch !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setCustomerSearchResponse(data);
    },
  } as UseQueryOptions<CustomerSearchResponse, Error, CustomerSearchResponse, unknown[]>);

  return {
    isLoading: query.isLoading,
    error: query.error,
    customers: query.data?.data.result.searchResults ?? [],
  };
}
