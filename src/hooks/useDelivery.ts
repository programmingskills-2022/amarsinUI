import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import api from "../api/axios";
import { useDeliveryStore } from "../store/deliveryStore";
import { DeliveryShowResponse } from "../types/delivery";

export function useDelivery() {
  const { id, setDeliveryShowResponse } = useDeliveryStore();
  // for Delivery/:id
  const deliveryShowQuery = useQuery<
    DeliveryShowResponse,
    Error,
    DeliveryShowResponse,
    unknown[]
  >({
    queryKey: ["deliveryShow", id],
    queryFn: async () => {
      const params: { id: number } = {
        id,
      };
      const url = `/api/Delivery/${params.id}`;
      console.log("deliveryShowQuery url", url);
      const response = await api.get(url);
      return response.data;
    },
    enabled: id !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setDeliveryShowResponse(data);
    },
  } as UseQueryOptions<DeliveryShowResponse, Error, DeliveryShowResponse, unknown[]>);

  return {
    //for Delivery/:id
    refetchDeliveryShowQuery: () => deliveryShowQuery.refetch(),
    isLoadingDeliveryShowQuery: deliveryShowQuery.isLoading,
    errorDeliveryShowQuery: deliveryShowQuery.error,
    deliveryShowResponse: deliveryShowQuery.data ?? {
      meta: { errorCode: -1, message: "", type: "" },
      data: {
        result: {
          err: 0,
          msg: "",
          wId: 0,
          wName: "",
          deliveryMst: {
            id: 0,
            formId: 0,
            code: "",
            dat: "",
            tim: "",
            cId: 0,
            srName: "",
            gln: "",
            blackList: false,
            exp: "",
            guid: "",
            status: 0,
            msg: "",
          },
          deliveryDtls: [],
        },
      },
    },
  };
}
