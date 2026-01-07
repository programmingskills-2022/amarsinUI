import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";
import api from "../api/axios";
import { useInvoiceReceiptStore } from "../store/invoiceReceiptStore";
import { IndentMrsResponse } from "../types/invoiceReceipt";

// Create a stable default object outside the hook to prevent recreation on every render
const DEFAULT_RESPONSE: IndentMrsResponse = {
  meta: {
    errorCode: 0,
    message: '',
    type: '',
  },
  data: {
    result: {
      totalCount: 0,
      indents: [],
      indentDtls: [],
    },
  },
};

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
    enabled: mrsId!==-1 && mrsId!==0 , // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setIndentMrsResponse(data);
    },
  } as UseQueryOptions<IndentMrsResponse, Error, IndentMrsResponse, unknown[]>);

  // Memoize the response to prevent unnecessary re-renders
  const indentMrsResponse = useMemo(() => {
    return query.data ?? DEFAULT_RESPONSE;
  }, [query.data]);

  return {
    getIndentMrsResponse: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    indentMrsResponse,
  };
}
