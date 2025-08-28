import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useInventoryStore } from "../store/inventoryStore";
import { InventoryList, InventoryGoodListRequest } from "../types/inventory";

export function useInventoryGoodList() {
  const { accSystem, accYear, brandId, setInventoryList } = useInventoryStore();

  const query = useQuery<InventoryList, Error, InventoryList, unknown[]>({
    queryKey: ["inventoryList", accSystem, accYear, brandId],
    queryFn: async () => {
      const params: InventoryGoodListRequest = {
        accSystem,
        accYear,
        brandId,
      };
      const url: string = `/api/ProviderInventory/list?accSystem=${params.accSystem}&accYear=${params.accYear}&brandId=${params.brandId}`;
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!accSystem && !!accYear && !!brandId, // Only fetch if params are available
    refetchOnWindowFocus: true, // Refetch data when the window is focused
    refetchOnReconnect: true, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setInventoryList(data);
    },
  } as UseQueryOptions<InventoryList, Error, InventoryList, unknown[]>);

  return {
    //getInventoryList: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    inventoryList: query.data ?? { err: 0, msg: "", rpProviderInventories: [] },
  };
}

// import { useInventoryStore } from "../store/inventoryStore";
// import {  InventoryListRequest } from "../types/inventory";
// import { useMutation } from "@tanstack/react-query";
// import api from "../api/axios";

// export function useInventory() {
//   const { accSystem,accYear,brandId,setInventoryList } =
//     useInventoryStore();

//   const inventoryMutation = useMutation({
//     mutationFn: async () => {
//       const params: InventoryListRequest = {
//         accSystem,
//         accYear,
//         brandId
//       };
//       const url:string= `/api/ProviderInventory/list?accSystem=${params.accSystem}&accYear=${params.accYear}&brandId=${params.brandId}`
//       const response = await api.get(url)
//       return response.data;
//     },
//     onSuccess: (data) => {
//       //Successful
//       setInventoryList(data);
//     },
//   });

//   return {
//     getInventoryList: inventoryMutation.mutate,
//     isLoading: inventoryMutation.isPending,
//     error: inventoryMutation.error,
//   };
// }
