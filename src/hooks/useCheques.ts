import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../api/axios";

import { LoadPaymentResponse, UpdateFieldsRequest } from "../types/cheque";
import { useChequeStore } from "../store/chequeStore";

export function useCheques() {
  const {
    id,
    formId,
    actCode,
    curId,
    payKind,
    includeBase64,
    setLoadPaymentResponse,
    setUpdateFieldsResponse,
    updateStatus,
    setUpdateStatus,
    search,
    page,
    lastId,
    systemId,
    setCashPosSystemSearchResponse,
    setPaymentAttachmentResponse,
  } = useChequeStore();

  const queryClient = useQueryClient();
  //for Payment/updateFields
  const updateFields = useMutation({
    mutationFn: async (request: UpdateFieldsRequest) => {
      const url: string = `api/Payment/updateFields?id=${id}&fieldName=${
        request.fieldName
      }&value=${encodeURIComponent(request.value)}&value2=${request.value2}`;
      console.log(url);
      setUpdateStatus(
        Object.fromEntries(
          Object.entries(updateStatus).map(([key, value]) =>
            key ===
            request.fieldName.charAt(0).toLowerCase() +
              request.fieldName.slice(1) +
              "Id"
              ? [key, { ...value, isUpdating: true, validationError: false }]
              : [key, { ...value, isUpdating: false }]
          )
        )
      );
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: (data: any, request: UpdateFieldsRequest) => {
      queryClient.invalidateQueries({ queryKey: ["workflow"] });
      setUpdateFieldsResponse(data);
      const fieldName =
        request.fieldName.charAt(0).toLowerCase() + request.fieldName.slice(1);
      setUpdateStatus({
        ...updateStatus,
        [fieldName]: {
          ...updateStatus[fieldName],
          errorCode: data.meta.errorCode,
          message: data.meta.message,
        },
      });
    },
  });
  //for Payment/cashPosSystemSearch
  const cashPosSystemSearch = useQuery({
    queryKey: [
      "cashPosSystemSearch",
      search,
      page,
      lastId,
      systemId,
      payKind,
    ],
    queryFn: async () => {
      const url: string = `/api/Payment/cashPosSystemSearch?page=${page}${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }&lastId=${lastId}&systemId=${systemId}&payKind=${
        payKind
      }`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: payKind!==-1 && systemId!==0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Handle success for cashPosSystemSearch
  useEffect(() => {
    if (cashPosSystemSearch.data) {
      setCashPosSystemSearchResponse(cashPosSystemSearch.data);
    }
  }, [cashPosSystemSearch.data, setCashPosSystemSearchResponse]);

  //for Payment/attachment
  const paymentAttachment = useQuery({
    queryKey: ["paymentAttachment", actCode, curId, includeBase64, formId],
    queryFn: async () => {
      //console.log(formId, "formId in paymentAttachment");
      const url: string = `/api/Payment/attachment?id=${formId}&actCode=${encodeURIComponent(
        actCode
      )}&curId=${curId}&includeBase64=${includeBase64}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: formId!==0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Handle success for paymentAttachment
  useEffect(() => {
    if (paymentAttachment.data) {
      setPaymentAttachmentResponse(paymentAttachment.data);
    }
  }, [paymentAttachment.data, setPaymentAttachmentResponse]);

  //for Payment/load
  const query = useQuery<
    LoadPaymentResponse,
    Error,
    LoadPaymentResponse,
    unknown[]
  >({
    queryKey: ["loadPayment",formId],
    queryFn: async () => {
      const url: string = `/api/Payment/load/${formId}`;

      //const {workFlowRowSelectResponse}=useWorkflowRowSelectStore()

      //console.log(workFlowRowSelectResponse, "workFlowRowSelectResponse");
      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: formId!==0,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setLoadPaymentResponse(data);
    },
  } as UseQueryOptions<LoadPaymentResponse, Error, LoadPaymentResponse, unknown[]>);

  return {
    //Payment/attachment
    paymentAttachmentResponse: paymentAttachment.data,
    isLoadingPaymentAttachment: paymentAttachment.isLoading,
    errorPaymentAttachment: paymentAttachment.error,
    //for Payment/cashPosSystemSearch
    cashPosSystemSearch: cashPosSystemSearch.data?.results ?? [],
    isLoadingCashPosSystemSearch: cashPosSystemSearch.isLoading,
    errorCashPosSystemSearch: cashPosSystemSearch.error,
    //for Payment/updateFields
    isLoadingUpdateFields: updateFields.isPending,
    errorUpdateFields: updateFields.error,
    updateFields: updateFields.mutateAsync,
    //for Payment/load
    getPayment: () => query.refetch(),
    isLoading: query.isLoading,
    error: query.error,
    loadPaymentResponse: query.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          err: 0,
          msg: "",
          payment: {
            id: 0,
            customerId: 0,
            acc_System: 0,
            systemTitle: "",
            acc_Year: 0,
            yearTitle: "",
            srName: "",
            marketerSrName: "",
            kind: 0,
            payKind: 0,
            dat: "",
            sayadi: "",
            sarDate: "",
            usrId: 0,
            prsn: "",
            bankId: 0,
            bankName_Partners: "",
            fixSerial: "",
            no: "",
            transferenceOwner: "",
            cash_PosSystem: 0,
            cash_PosSystemTitle: "",
            dsc: "",
            partner: 0,
            accNo: "",
            amount: "",
            attachCount: 0,
            canEdit: false,
            acc_BankAccountId: 0,
            assignedAccountName: "",
            sanadNum: "",
            sanadDate: "",
            sayadiStatus: 0,
            sayadiMessage: "",
          },
        },
      },
    },
  };
}
