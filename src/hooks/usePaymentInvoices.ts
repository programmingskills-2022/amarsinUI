import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { usePaymentInvoiceStore } from "../store/paymentInvoiceStore";
import {
  InvoiceOutStandingRequest,
  InvoiceOutStandingResponse,
  PaymentInvoicesSaveRequest,
  PaymentInvoicesSaveResponse,
} from "../types/paymentInvoice";

export function usePaymentInvoices() {
  const queryClient = useQueryClient();
  const {
    paymentId,
    systemId,
    yearId,
    setInvoiceOutStandingResponse,
    setPaymentInvoicesSaveResponse,
  } = usePaymentInvoiceStore();

  //for Payment/paymentInvoicesSave
  const paymentInvoicesSavefn = useMutation({
    mutationFn: async (request: PaymentInvoicesSaveRequest) => {
      const url: string = `api/Payment/paymentInvoicesSave `;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: PaymentInvoicesSaveResponse) => {
      queryClient.invalidateQueries({ queryKey: ["paymentInvoices"] });
      setPaymentInvoicesSaveResponse(data);
    },
  });
  // for Payment/invoiceOutStanding
  const query = useQuery<
    InvoiceOutStandingResponse,
    Error,
    InvoiceOutStandingResponse,
    unknown[]
  >({
    queryKey: ["paymentInvoices", paymentId, systemId, yearId],
    queryFn: async () => {
      const params: InvoiceOutStandingRequest = {
        paymentId,
        systemId,
        yearId,
      };

      const url: string = `/api/Payment/invoiceOutStanding?PaymentId=${params.paymentId}&SystemId=${params.systemId}&YearId=${params.yearId}`;

      console.log(url, "url");

      const response = await api.get(url);
      console.log(response.data, "response.data");
      return response.data;
    },
    enabled: !!paymentId && !!systemId && !!yearId, // Only fetch if params are available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setInvoiceOutStandingResponse(data);
    },
  } as UseQueryOptions<InvoiceOutStandingResponse, Error, InvoiceOutStandingResponse, unknown[]>);

  return {
    //output for Payment/paymentInvoicesSave
    isLoadingPaymentInvoicesSave: paymentInvoicesSavefn.isPending,
    errorPaymentInvoicesSave: paymentInvoicesSavefn.error,
    paymentInvoicesSave: paymentInvoicesSavefn.mutateAsync,
    paymentInvoicesSaveResponse: paymentInvoicesSavefn.data,

    //getInvoiceOutStanding: () => query.refetch(),
    isLoading: query.isLoading,
    error: query.error,
    invoiceOutStandingResponse: query.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        invoiceOutstandings: [],
        err: 0,
        msg: "",
        rem: 0,
        dsc: "",
        kind: 0,
      },
    },
  };
}
