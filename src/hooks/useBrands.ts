import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useBrandStore } from "../store/brandStore";
import { Brand, BrandRequest } from "../types/brand";
import api from "../api/axios";


interface BrandResponse {
  results: Brand[];
}

export function useBrand() {
  const { accSystem, lastId, page, usrPerm, search, setBrands } = useBrandStore();

  const query = useQuery<BrandResponse, Error, BrandResponse, unknown[]>({
    queryKey: ["brands", accSystem, lastId, page, usrPerm, search],
    queryFn: async () => {
      const params: BrandRequest = {
        accSystem,
        lastId,
        page,
        usrPerm,
        search,
      };
      const response = await api.get(
        `/api/Brand/search?accSystem=${params.accSystem}&page=${params.page}&lastId=${params.lastId}&usrPerm=${params.usrPerm}&search=${encodeURIComponent(search ?? "")}`
      );

      return response.data;
    },
    enabled: !!accSystem, // Only run if accSystem exists
    refetchOnWindowFocus: true, // Refetch data when the window is focused
    refetchOnReconnect: true, // Refetch data when the network reconnects
    onSuccess: (data:any) => {
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


