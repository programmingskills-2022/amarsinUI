import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { usePreInvoiceReturnStore } from "../store/preInvoiceReturnStore";
import {
  ResponsePreInvoiceDtlSearch,
  ResponseWarehouseTemporaryReceiptShow,
  WarehouseTemporaryReceiptSaveRequest,
} from "../types/preInvoiceReturn";

export function usePreInvoiceReturn() {
  const {
    id,
    setResponseWarehouseTemporaryReceiptShow,
    setResponsePreInvoiceDtlSearch,
    setWarehouseTemporaryReceiptSaveResponse,
    searchPreInvoiceDtlSearch,
    preInvoiceDtlId,
    pagePreInvoiceDtlSearch,
  } = usePreInvoiceReturnStore();

  const query = useQuery<
    ResponseWarehouseTemporaryReceiptShow,
    Error,
    ResponseWarehouseTemporaryReceiptShow,
    unknown[]
  >({
    queryKey: ["warehouseTemporaryReceiptShow", id],
    queryFn: async () => {
      const params = {
        id,
      };
      const url = `/api/PreInvoiceReturn/warehouseTemporaryReceiptShow?Id=${params.id}`;
      const response = await api.get(url);
      return response.data;
    },
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setResponseWarehouseTemporaryReceiptShow(data);
    },
  } as UseQueryOptions<ResponseWarehouseTemporaryReceiptShow, Error, ResponseWarehouseTemporaryReceiptShow, unknown[]>);
  //api/WarehouseTemporaryReceipt/preInvoiceDtSearch?PreInvoiceDtlId=4512744&page=1
  const queryPreInvoiceDtlSearch = useQuery<
    ResponsePreInvoiceDtlSearch,
    Error,
    ResponsePreInvoiceDtlSearch,
    unknown[]
  >({
    queryKey: [
      "preInvoiceDtSearch",
      preInvoiceDtlId,
      pagePreInvoiceDtlSearch,
      searchPreInvoiceDtlSearch,
    ],
    queryFn: async () => {
      const params = {
        preInvoiceDtlId,
        page: pagePreInvoiceDtlSearch,
        search: searchPreInvoiceDtlSearch,
      };
      const url = `/api/WarehouseTemporaryReceipt/preInvoiceDtSearch?PreInvoiceDtlId=${params.preInvoiceDtlId}&page=${params.page}&Search=${params.search}`;
      const response = await api.get(url);
      return response.data;
    },
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setResponsePreInvoiceDtlSearch(data);
    },
  } as UseQueryOptions<ResponsePreInvoiceDtlSearch, Error, ResponsePreInvoiceDtlSearch, unknown[]>);
  //api/PreInvoiceReturn/warehouseTemporaryReceiptSave
  const warehouseTemporaryReceiptSave = useMutation({
    mutationFn: async (request: WarehouseTemporaryReceiptSaveRequest) => {
      const url = `/api/PreInvoiceReturn/warehouseTemporaryReceiptSave`;
      const response = await api.post(url, {
        id: request.WarehouseTemporaryReceiptSaveRequestId,
        warehouseTemporaryReceiptDtlId: request.warehouseTemporaryReceiptDtlId,
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      setWarehouseTemporaryReceiptSaveResponse(data);
    },
  });
  return {
    //for responseWarehouseTemporaryReceiptShow
    refetchWarehouseTemporaryReceiptShow:() => query.refetch(),
    isLoading: query.isLoading,
    error: query.error,
    warehouseTemporaryReceiptShowResponse: query.data?.data.result ?? {
      err: 0,
      msg: "",
      preInvoiceReturn: {
        id: 0,
        ordr: 0,
        dat: "",
        cId: 0,
        srName: "",
        exp: "",
      },
      preInvoiceReturnDtls: [],
      diagnosises: [],
    },
    //for responsePreInvoiceDtlSearch
    isLoadingPreInvoiceDtlSearch: queryPreInvoiceDtlSearch.isLoading,
    errorPreInvoiceDtlSearch: queryPreInvoiceDtlSearch.error,
    preInvoiceDtlSearchResponse: queryPreInvoiceDtlSearch.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { total_count: 0, results: [] } },
    },
    //for warehouseTemporaryReceiptSave
    warehouseTemporaryReceiptSave: warehouseTemporaryReceiptSave.mutateAsync,
    isLoadingWarehouseTemporaryReceiptSave:
      warehouseTemporaryReceiptSave.isPending,
    errorWarehouseTemporaryReceiptSave: warehouseTemporaryReceiptSave.error,
    warehouseTemporaryReceiptSaveResponse: warehouseTemporaryReceiptSave.data,
  };
}
