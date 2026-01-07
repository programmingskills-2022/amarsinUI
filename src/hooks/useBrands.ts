import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useBrandStore } from "../store/brandStore";
import api from "../api/axios";
import { SearchItem } from "../types/general";

interface BrandResponse {
  results: SearchItem[];
}

export function useBrand() {
  const { accSystem, lastId, page, usrPerm, search, setBrands } =
    useBrandStore();
  const query = useQuery<BrandResponse, Error, BrandResponse, unknown[]>({
    queryKey: ["brands", accSystem, lastId, page, usrPerm, search],
    queryFn: async () => {
      const url = `/api/Brand/search?accSystem=${accSystem}&page=${page}&lastId=${lastId}&usrPerm=${usrPerm}&search=${encodeURIComponent(
        search ?? ""
      )}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: accSystem !== -1, // Only run if accSystem exists
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setBrands(data.results);
    },
  } as UseQueryOptions<BrandResponse, Error, BrandResponse, unknown[]>);

  return {
    //getBrands: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    brands: query.data?.results ?? [],
  };
}
