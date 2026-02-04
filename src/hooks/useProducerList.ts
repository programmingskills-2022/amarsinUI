import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useProducerStore } from "../store/producerStore";
import { ProducerList, ProducerListRequest } from "../types/producer";


export function useProducerList() {
  const { accSystem, accYear, brandId, sanadKind, fDate,tDate,setProducerList } = useProducerStore();

  const query = useQuery<ProducerList, Error, ProducerList, unknown[]>({
    queryKey: ["producerList", accSystem, accYear, brandId,sanadKind,fDate,tDate],
    queryFn: async () => {
      const params: ProducerListRequest = {
        accSystem,
        accYear,
        brandId,
        sanadKind,
        fDate,
        tDate,
      };

      const url: string = `/api/ProducerReport/list?accSystem=${params.accSystem}&accYear=${params.accYear}&brandId=${params.brandId}&sanadKind=${params.sanadKind}&fDate=${encodeURIComponent(params.fDate)}&tDate=${encodeURIComponent(params.tDate)}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: accSystem!==-1 && accYear!==-1, // Only fetch if params are available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {

      setProducerList(data);
    },
  } as UseQueryOptions<ProducerList, Error, ProducerList, unknown[]>);

  return {
    //getInventoryList: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    producerList: query.data ?? { err: 0, msg: "", producers: [], rpProducts: [] },
  };
}

