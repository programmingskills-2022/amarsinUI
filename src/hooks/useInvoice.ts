import {
  useMutation,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../api/axios";
import { useInvoiceStore } from "../store/invoiceStore";
import {
  InvoicePaymentResponse,
  InvoicePaymentSaveRequest,
  InvoicePaymentSaveResponse,
  InvoiceShowIdResponse,
} from "../types/invoice";

export function useInvoice() {
  const {
    formId,
    setInvoiceShowIdResponse,
    invoiceId,
    setInvoicePaymentResponse,
    setInvoicePaymentSaveResponse,
  } = useInvoiceStore();

  const queryClient = useQueryClient();

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
    enabled: formId !== -1, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setInvoiceShowIdResponse(data);
    },
  } as UseQueryOptions<InvoiceShowIdResponse, Error, InvoiceShowIdResponse, unknown[]>);

  // for Invoice/payment
  const invoicePaymentQuery = useQuery<
    InvoicePaymentResponse,
    Error,
    InvoicePaymentResponse,
    unknown[]
  >({
    queryKey: ["invoicePayment", invoiceId],
    queryFn: async () => {
      const url: string = `/api/Invoice/payment?invoiceId=${invoiceId}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: invoiceId !== -1, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setInvoicePaymentResponse(data);
    },
  } as UseQueryOptions<InvoicePaymentResponse, Error, InvoicePaymentResponse, unknown[]>);

  // api/Invoice/paymentSave
  const invoicePaymentSave = useMutation({
    mutationFn: async (request: InvoicePaymentSaveRequest) => {
      const response = await api.post(`/api/Invoice/paymentSave`, request);
      return response.data;
    },
    onSuccess: (data: InvoicePaymentSaveResponse) => {
      setInvoicePaymentSaveResponse(data);
      if (data.meta.errorCode <= 0)
        queryClient.invalidateQueries({ queryKey: ["invoicePayment"] });
    },
  });
  return {
    //getInventoryList: () => query.refetch(), // Optional manual trigger
    refetchInvoiceShowId: () => query.refetch(),
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
    // for Invoice/payment
    refetchInvoicePayment: () => invoicePaymentQuery.refetch(),
    isLoadingInvoicePayment: invoicePaymentQuery.isLoading,
    errorInvoicePayment: invoicePaymentQuery.error,
    invoicePaymentResponse: invoicePaymentQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          customerId: 0,
          srName: "",
          dat: "",
          dsc: "",
          amnt: "",
          payments: [],
        },
      },
    },

    //output for api/Invoice/paymentSave
    isLoadingInvoicePaymentSave: invoicePaymentSave.isPending,
    errorInvoicePaymentSave: invoicePaymentSave.error,
    invoicePaymentSave: invoicePaymentSave.mutateAsync,
    invoicePaymentSaveResponse: invoicePaymentSave.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          customerId: 0,
          srName: "",
          dat: "",
          dsc: "",
          amnt: "",
          payments: [],
        },
      },
    },
  };
}
