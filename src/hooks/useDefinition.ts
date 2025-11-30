import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { ChartSearchResponse } from "../types/definition";
import { useDefinitionStore } from "../store/definitionStore";

export function useDefinition() {
  const {
    //api/Definition/chartSearch?search=%DB%8C&systemId=4&page=1&lastId=0
    searchChartSearch,
    systemIdChartSearch,
    pageChartSearch,
    lastIdChartSearch,
    setChartSearchResponse,
  } = useDefinitionStore();

  //api/Definition/chartSearch?search=%DB%8C&systemId=4&page=1&lastId=0
  const queryChartSearch = useQuery<
    ChartSearchResponse,
    Error,
    ChartSearchResponse,
    unknown[]
  >({
    queryKey: [
      "chartSearch",
      searchChartSearch,
      systemIdChartSearch,
      pageChartSearch,
      lastIdChartSearch,
    ],
    queryFn: async () => {
      const url = `/api/Definition/chartSearch?search=${encodeURIComponent(
        searchChartSearch
      )}&systemId=${systemIdChartSearch}&page=${pageChartSearch}&lastId=${lastIdChartSearch}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemIdChartSearch !== -1, // Only run query if authenticated AND not on login page
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: ChartSearchResponse) => {
      setChartSearchResponse(data);
    },
  } as UseQueryOptions<ChartSearchResponse, Error, ChartSearchResponse, unknown[]>);

  return {
    //getDefinitionInvironment: () => query.refetch(), // Optional manual trigger
    isLoading: queryChartSearch.isLoading,
    error: queryChartSearch.error,
    chartSearchResponse: queryChartSearch.data ?? {
      meta: { errorCode: 0, message: null, type: "" },
      data: { result: [], total_count: 0 },
    },
  };
}
