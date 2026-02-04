import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "../api/axios";
import { usePaymentInvoiceStore } from "../store/paymentInvoiceStore";
import {
  InvoiceOutStandingRequest,
  InvoiceOutStandingResponse,
  PaymentInvoicesSaveRequest,
  PaymentInvoicesSaveResponse,
  SettlementAveragesResponse,
} from "../types/paymentInvoice";

export function usePaymentInvoices() {
  const queryClient = useQueryClient();
  const {
    paymentId,
    systemId,
    yearId,
    setInvoiceOutStandingResponse,
    setPaymentInvoicesSaveResponse,
    setSettlementAveragesResponse, //for Payment/settlementAverages
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
      //console.log(response.data, "response.data");
      return response.data;
    },
    enabled: paymentId!==-1 && systemId!==-1 && yearId!==-1, // Only fetch if params are available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setInvoiceOutStandingResponse(data);
    },
  } as UseQueryOptions<InvoiceOutStandingResponse, Error, InvoiceOutStandingResponse, unknown[]>);

  //for Payment/settlementAverages
  const querySettlementAverages = useQuery<
    SettlementAveragesResponse,
    Error,
    SettlementAveragesResponse,
    unknown[]
  >({
    queryKey: ["settlementAverages"],
    queryFn: async () => {
      const url: string = `/api/Payment/settlementAverages`;
      const response = await api.get(url);
      //console.log(response.data, "response.data");
      return response.data;
    },
    onSuccess: (data: any) => {
      setSettlementAveragesResponse(data);
    },
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
  } as UseQueryOptions<SettlementAveragesResponse, Error, SettlementAveragesResponse, unknown[]>);

  return {
    //output for Payment/paymentInvoicesSave
    isLoadingPaymentInvoicesSave: paymentInvoicesSavefn.isPending,
    errorPaymentInvoicesSave: paymentInvoicesSavefn.error,
    paymentInvoicesSave: paymentInvoicesSavefn.mutateAsync,
    paymentInvoicesSaveResponse: paymentInvoicesSavefn.data,

    //getInvoiceOutStanding: () => query.refetch(),
    refetchInvoiceOutStanding: () => query.refetch(),
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
    //getSettlementAverages: () => querySettlementAverages.refetch(),
    refetchSettlementAverages: () => querySettlementAverages.refetch(),
    isLoadingSettlementAverages: querySettlementAverages.isLoading,
    errorSettlementAverages: querySettlementAverages.error,
    settlementAveragesResponse: querySettlementAverages.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [] },
    },
  };
}
