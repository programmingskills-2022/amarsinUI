import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useInvoiceStore } from "../store/invoiceStore";
import { InvoiceShowIdResponse } from "../types/invoice";

export function useInvoice() {
  const { formId, setInvoiceShowIdResponse } = useInvoiceStore();

  const query = useQuery<
    InvoiceShowIdResponse,
    Error,
    InvoiceShowIdResponse,
    unknown[]
  >({
    queryKey: ["invoiceShowId", formId],
    queryFn: async () => {
      const url: string = `/api/Invoice/show/${formId}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: formId!==0 ? true : false , // Only fetch if param is available
    refetchOnWindowFocus: true, // Refetch data when the window is focused
    refetchOnReconnect: true, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setInvoiceShowIdResponse(data);
    },
  } as UseQueryOptions<InvoiceShowIdResponse, Error, InvoiceShowIdResponse, unknown[]>);

  return {
    //getInventoryList: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    invoiceShowIdResponse: query.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          invoice: {
            id: 0,
            ordr: 0,
            dat: "",
            cId: 0,
            srName: "",
            exp: "",
            usrName: "",
            flwId: 0,
            flowMapName: "",
            canEdit: 0,
          },
          invoiceDtls: [],
          diagnosises: [],
        },
      },
    },
  };
}
