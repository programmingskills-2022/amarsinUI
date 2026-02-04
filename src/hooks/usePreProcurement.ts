import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { usePreProcurementStore } from "../store/preProcurementStore";
import { PreProcurementResponse } from "../types/preProcurement";

export function usePreProcurement() {
  const { id, setPreProcurementResponse } = usePreProcurementStore();

  const preProcurementquery = useQuery<
    PreProcurementResponse,
    Error,
    PreProcurementResponse,
    unknown[]
  >({
    queryKey: ["preProcurement", id],
    queryFn: async () => {
      const url: string = `/api/PreProcurement/${id}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: id!==-1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setPreProcurementResponse(data);
    },
  } as UseQueryOptions<PreProcurementResponse, Error, PreProcurementResponse, unknown[]>);

  return {
    refetchPreProcurement: () => preProcurementquery.refetch(),
    isLoadingPreProcurement: preProcurementquery.isLoading,
    errorPreProcurement: preProcurementquery.error,
    preProcurementResponse: preProcurementquery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          err: 0,
          msg: "",
          mst: {
            id: -1,
            systemId: 0,
            systemTitle: "",
            factorNo: "",
            dat: "",
            customerId: 0,
            customerName: "",
            exp: "",
            attachCount: 0,
            canEdit: 0,
          },
          dtls: [],
          diagnosises: [],
        },
      },
    },
  };
}
