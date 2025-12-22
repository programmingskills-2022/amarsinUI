import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useInvoiceReturnRequestStore } from "../store/invoiceReturnRequestStore";
import {
  InvoiceReturnRequestInvoiceListResponse,
  InvoiceReturnRequestRegisterDtlRequest,
  InvoiceReturnRequestRegisterDtlResponse,
  InvoiceReturnRequestShowResponse,
} from "../types/invoiceReturnRequest";

export function useInvoiceReturnRequest() {
  const {
    invoiceReturnRequestId, //api/InvoiceReturnRequest/show?Id=2778
    invoiceListId, //api/InvoiceReturnRequest/invoiceList?Id=3712
    invoiceListIdTrigger, //api/InvoiceReturnRequest/invoiceList?Id=3712
    invoiceReturnRequestDtlId, //api/InvoiceReturnRequest/registerDtl?InvoiceReturnRequestDtlId=3712
    setInvoiceReturnRequestShowResponse,
    setInvoiceReturnRequestInvoiceListResponse,
    setInvoiceReturnRequestRegisterDtlResponse,
  } = useInvoiceReturnRequestStore();

  const queryClient = useQueryClient();
  //api/InvoiceReturnRequest/show?Id=2778
  const invoiceReturnRequestShowQuery = useQuery<
    InvoiceReturnRequestShowResponse,
    Error,
    InvoiceReturnRequestShowResponse,
    unknown[]
  >({
    queryKey: ["invoiceReturnRequestShow", invoiceReturnRequestId],
    queryFn: async () => {
      const url: string = `/api/InvoiceReturnRequest/show?Id=${invoiceReturnRequestId}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: invoiceReturnRequestId !== -1, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setInvoiceReturnRequestShowResponse(data);
    },
  } as UseQueryOptions<InvoiceReturnRequestShowResponse, Error, InvoiceReturnRequestShowResponse, unknown[]>);

  //api/InvoiceReturnRequest/invoiceList?Id=3712
  const invoiceReturnRequestInvoiceListQuery = useQuery<
    InvoiceReturnRequestInvoiceListResponse,
    Error,
    InvoiceReturnRequestInvoiceListResponse,
    unknown[]
  >({
    queryKey: ["invoiceReturnRequestInvoiceList", invoiceListId, invoiceListIdTrigger],
    queryFn: async () => {
      const url: string = `/api/InvoiceReturnRequest/invoiceList?Id=${invoiceListId}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: invoiceListId !== -1, // Only fetch if param is available
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setInvoiceReturnRequestInvoiceListResponse(data);
    },
  } as UseQueryOptions<InvoiceReturnRequestInvoiceListResponse, Error, InvoiceReturnRequestInvoiceListResponse, unknown[]>);
  // for api/InvoiceReturnRequest/registerDtl?InvoiceReturnRequestDtlId=3712
  //for Order/orderReg
  const invoiceReturnRequestRegisterDtlfn = useMutation({
    mutationFn: async (request: InvoiceReturnRequestRegisterDtlRequest[]) => {
      const url: string = `/api/InvoiceReturnRequest/registerDtl?InvoiceReturnRequestDtlId=${invoiceReturnRequestDtlId}`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: InvoiceReturnRequestRegisterDtlResponse) => {
      console.log(data, "data in invoice return request register dtl");
      setInvoiceReturnRequestRegisterDtlResponse(data);
      queryClient.invalidateQueries({ queryKey: ["invoiceReturnRequestShow"] });
    },
  });
  return {
    //api/InvoiceReturnRequest/show?Id=
    refetchInvoiceReturnRequestShow: () =>
      invoiceReturnRequestShowQuery.refetch(), // Optional manual trigger
    isLoadingInvoiceReturnRequestShow: invoiceReturnRequestShowQuery.isLoading,
    errorInvoiceReturnRequestShow: invoiceReturnRequestShowQuery.error,
    invoiceReturnRequestShowResponse: invoiceReturnRequestShowQuery.data ?? {
      meta: {
        errorCode: 0,
        message: "",
        type: "",
      },
      data: {
        result: {
          invoiceReturnRequest: {
            id: 0,
            ordr: 0,
            dat: "",
            cId: 0,
            srName: "",
            dsc: "",
            usrName: "",
            flwId: 0,
            flowMapName: "",
            canEdit: 0,
            attachCount: 0,
          },
          invoiceReturnRequestDtls: [],
          diagnosises: [],
        },
      },
    },
    //api/InvoiceReturnRequest/invoiceList?Id=3712
    refetchInvoiceReturnRequestInvoiceList: () =>
      invoiceReturnRequestInvoiceListQuery.refetch(), // Optional manual trigger
    isLoadingInvoiceReturnRequestInvoiceList:
      invoiceReturnRequestInvoiceListQuery.isLoading,
    errorInvoiceReturnRequestInvoiceList:
      invoiceReturnRequestInvoiceListQuery.error,
    invoiceReturnRequestInvoiceListResponse:
      invoiceReturnRequestInvoiceListQuery.data ?? {
        meta: {
          errorCode: 0,
          message: "",
          type: "",
        },
        data: {
          result: {
            invoiceReturnRequestInvoiceDtls: [],
            invoiceReturnRequestInvoiceDtlCups: [],
          },
        },
      },
    //output for api/InvoiceReturnRequest/registerDtl?InvoiceReturnRequestDtlId=3712
    isLoadingInvoiceReturnRequestRegisterDtl:
      invoiceReturnRequestRegisterDtlfn.isPending,
    errorInvoiceReturnRequestRegisterDtl:
      invoiceReturnRequestRegisterDtlfn.error,
    invoiceReturnRequestRegisterDtl:
      invoiceReturnRequestRegisterDtlfn.mutateAsync,
    invoiceReturnRequestRegisterDtlResponse:
      invoiceReturnRequestRegisterDtlfn.data ?? {
        meta: {
          errorCode: 0,
          message: "",
          type: "",
        },
        data: {
          result: {
            id: 0,
            factorNo: "",
            cnt: 0,
            offer: 0,
            diagnosis: [],
          },
        },
      },
  };
}
