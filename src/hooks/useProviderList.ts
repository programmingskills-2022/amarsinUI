import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import {
  useProviderDetailStore,
  useProviderStore,
} from "../store/providerStore";
import {
  ProviderDetailList,
  ProviderList,
  ProviderListRequest,
  ProvidertDetailListRequest,
} from "../types/provider";

export function useProviderList() {
  const {
    accSystem,
    accYear,
    brandId,
    sanadKind,
    fDate,
    tDate,
    setProviderList,
  } = useProviderStore();

  const query = useQuery<ProviderList, Error, ProviderList, unknown[]>({
    queryKey: [
      "providerList",
      accSystem,
      accYear,
      brandId,
      sanadKind,
      fDate,
      tDate,
    ],
    queryFn: async () => {
      const params: ProviderListRequest = {
        accSystem,
        accYear,
        brandId,
        sanadKind,
        fDate,
        tDate,
      };

      const url: string = `/api/ProviderReport/list?accSystem=${
        params.accSystem
      }&accYear=${params.accYear}&brandId=${params.brandId}&sanadKind=${
        params.sanadKind
      }&fDate=${encodeURIComponent(params.fDate)}&tDate=${encodeURIComponent(
        params.tDate
      )}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: accSystem!==-1 && accYear!==-1 && brandId!==-1 && sanadKind!==-1, // Only fetch if params are available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setProviderList(data);
    },
  } as UseQueryOptions<ProviderList, Error, ProviderList, unknown[]>);

  return {
    //getInventoryList: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    providerList: query.data ?? { err: 0, msg: "", rpProviders: [] },
  };
}

export function useProviderDetailList() {
  const {
    setProviderDetailList,
    productId,
    accSystem,
    accYear,
    brandId,
    sanadKind,
    fDate,
    tDate,
  } = useProviderDetailStore();

  const query = useQuery<
    ProviderDetailList,
    Error,
    ProviderDetailList,
    unknown[]
  >({
    queryKey: [
      "providerDetailList",
      productId,
      accSystem,
      accYear,
      brandId,
      sanadKind,
      fDate,
      tDate,
    ],
    queryFn: async () => {
      const params: ProvidertDetailListRequest = {
        accSystem,
        accYear,
        brandId,
        sanadKind,
        fDate,
        tDate,
        productId,
      };
      const url: string = `/api/ProviderReport/details?productId=${
        params.productId
      }&accSystem=${params.accSystem}&accYear=${params.accYear}&brandId=${
        params.brandId
      }&sanadKind=${params.sanadKind}&fDate=${encodeURIComponent(
        params.fDate
      )}&tDate=${encodeURIComponent(params.tDate)}`;

      console.log("url", url);
      const response = await api.get(url);
      console.log(response.data, "response.data");
      return response.data;
    },
    enabled:
      accSystem!==-1 && accYear!==-1 && brandId!==-1 && sanadKind!==-1 && productId!==-1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setProviderDetailList(data);
    },
  } as UseQueryOptions<ProviderDetailList, Error, ProviderDetailList, unknown[]>);

  return {
    //getInventoryList: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    providerDetailList: query.data ?? {
      err: 0,
      msg: "",
      rpProviderDetails: [],
    },
  };
}
