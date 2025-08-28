import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useInvoiceReceiptStore } from "../store/invoiceReceiptStore";
import { IndentMrsResponse } from "../types/invoiceReceipt";


export function useInvoiceReceipt() {
  const { mrsId, setIndentMrsResponse } = useInvoiceReceiptStore();

  const query = useQuery<
    IndentMrsResponse,
    Error,
    IndentMrsResponse,
    unknown[]
  >({
    queryKey: ["invoiceReceipt", mrsId],
    queryFn: async () => {
      const url: string = `/api/Indent/showMrs/${mrsId}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: mrsId!==0 ? true : false, // Only fetch if param is available
    refetchOnWindowFocus: true, // Refetch data when the window is focused
    refetchOnReconnect: true, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setIndentMrsResponse(data);
    },
  } as UseQueryOptions<IndentMrsResponse, Error, IndentMrsResponse, unknown[]>);

  return {
    getIndentMrsResponse: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    indentMrsResponse: query.data ?? {
      err: 0,
      msg: '',
      indents: [],
      indentDtls: [],      
    },
  };
}
