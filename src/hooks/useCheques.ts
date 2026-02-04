import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../api/axios";

import {
  LoadPaymentResponse,
  SayadChequeInquiryByPaymentIdResponse,
  SayadiChequeAcceptByPaymentIdResponse,
  SayadiChequeRejectByPaymentIdRequest,
  UpdateFieldsRequest,
} from "../types/cheque";
import { useChequeStore } from "../store/chequeStore";
import { useWorkflowStore } from "../store/workflowStore";

export function useCheques() {
  const {
    id,
    paymentAttachmentFormId,
    loadPaymentFormId,
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
    sayadiPaymentId,
    setCashPosSystemSearchResponse,
    setPaymentAttachmentResponse,
    setSayadChequeInquiryByPaymentIdResponse,
    paymentIdTrigger, //for Payment/sayadChequeInquiryByPaymentId

    paymentIdAccept,//for Payment/sayadiChequeAcceptByPaymentId
    paymentIdAcceptTrigger,
    descriptionAccept,
    idempotencyKeyAccept,
    setSayadiChequeAcceptByPaymentIdResponse,

    //for Payment/sayadiChequeAcceptByPaymentId
    setSayadiChequeRejectByPaymentIdResponse
  } = useChequeStore();

  const {
    chartId,
    systemId: systemIdWorkFlow,
    page: pageWorkFlow,
    pageSize,
    flowMapId,
    title,
    dateTime,
    code,
    cost,
    name,
    dsc,
  } = useWorkflowStore();

  const queryClient = useQueryClient();
  //for Payment/updateFields
  const updateFields = useMutation({
    mutationFn: async (request: UpdateFieldsRequest) => {
      const url: string = `api/Payment/updateFields?id=${id}&fieldName=${request.fieldName
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
      if (data.meta.errorCode <= 0 && (request.fieldName === "Dsc" || request.fieldName === "Prsn" || request.fieldName === "AmountT")) {
        queryClient.refetchQueries({
          queryKey: [
            "workflow",
            chartId,
            systemIdWorkFlow,
            pageWorkFlow,
            pageSize,
            flowMapId,
            title,
            dateTime,
            code,
            cost,
            name,
            dsc,
          ],
        });
      }
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
  //for api/Payment/cashPosSystemSearch
  const cashPosSystemSearch = useQuery({
    queryKey: ["cashPosSystemSearch", search, page, lastId, systemId, payKind],
    queryFn: async () => {
      const url: string = `/api/Payment/cashPosSystemSearch?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""
        }&lastId=${lastId}&systemId=${systemId}&payKind=${payKind}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: payKind !== -1 && systemId !== -1,
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
    queryKey: [
      "paymentAttachment",
      actCode,
      curId,
      includeBase64,
      paymentAttachmentFormId,
    ],
    queryFn: async () => {
      //console.log(formId, "formId in paymentAttachment");
      const url: string = `/api/Payment/attachment?id=${paymentAttachmentFormId}&actCode=${encodeURIComponent(
        actCode
      )}&curId=${curId}&includeBase64=${includeBase64}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: paymentAttachmentFormId !== -1,
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
    queryKey: ["loadPayment", loadPaymentFormId],
    queryFn: async () => {
      const url: string = `/api/Payment/load/${loadPaymentFormId}`;
      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: loadPaymentFormId !== -1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setLoadPaymentResponse(data);
    },
  } as UseQueryOptions<LoadPaymentResponse, Error, LoadPaymentResponse, unknown[]>);

  //for Payment/sayadChequeInquiryByPaymentId
  const sayadChequeInquiryByPaymentIdQuery = useQuery<
    SayadChequeInquiryByPaymentIdResponse,
    Error,
    SayadChequeInquiryByPaymentIdResponse,
    unknown[]
  >({
    queryKey: [
      "sayadChequeInquiryByPaymentId",
      sayadiPaymentId,
      paymentIdTrigger,
    ],
    queryFn: async () => {
      const url: string = `/api/Payment/sayadChequeInquiryByPaymentId?PaymentId=${sayadiPaymentId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: sayadiPaymentId !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setSayadChequeInquiryByPaymentIdResponse(data);
    },
  } as UseQueryOptions<SayadChequeInquiryByPaymentIdResponse, Error, SayadChequeInquiryByPaymentIdResponse, unknown[]>);

  //for Payment/sayadiChequeAcceptByPaymentId?PaymentId=
  const sayadiChequeAcceptByPaymentIdQuery = useQuery<
    SayadiChequeAcceptByPaymentIdResponse,
    Error,
    SayadiChequeAcceptByPaymentIdResponse,
    unknown[]
  >({
    queryKey: [
      "sayadiChequeAcceptByPaymentId",
      paymentIdAccept,
      paymentIdAcceptTrigger,
      descriptionAccept,
      idempotencyKeyAccept,
    ],
    queryFn: async () => {
      const url: string = `/api/Payment/sayadiChequeAcceptByPaymentId?PaymentId=${paymentIdAccept}&Description=${descriptionAccept}&idempotencyKey=${idempotencyKeyAccept}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: paymentIdAccept !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setSayadiChequeAcceptByPaymentIdResponse(data);
    },
  } as UseQueryOptions<SayadiChequeAcceptByPaymentIdResponse, Error, SayadiChequeAcceptByPaymentIdResponse, unknown[]>);


  const sayadiChequeRejectByPaymentId = useMutation({
    mutationFn: async (request: SayadiChequeRejectByPaymentIdRequest) => {
      const url: string = `/api/Payment/sayadiChequeRejectByPaymentId?PaymentId=${request.paymentIdReject}&Description=${request.descriptionReject}&idempotencyKey=${request.idempotencyKeyReject}`;
      console.log(url, "url");
      const response = await api.delete(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setSayadiChequeRejectByPaymentIdResponse(data);
    },
  });
  return {
    //Payment/attachment
    getPaymentAttachment: () => paymentAttachment.refetch(),
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
    updateFieldsResponse: updateFields.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          id: 0,
          errorCode: 0,
          message: "",
          details: [],
        },
      },
    },
    //for Payment/load
    getPayment: () => query.refetch(),
    isLoading: query.isLoading,
    error: query.error,
    loadPaymentResponse: query.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          id: 0,
          customerId: 0,
          acc_System: 0,
          systemTitle: "",
          acc_Year: 0,
          yearTitle: "",
          srName: "",
          marketerSrName: "",
          kind: 0,
          payKind: -1,
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
          eCheck: false,
          delayAdvanceDays: 0,
          sayadiAcceptStatus: 0,
        },
      },
    },
    //for Payment/sayadChequeInquiryByPaymentId
    getSayadChequeInquiryByPaymentId: () =>
      sayadChequeInquiryByPaymentIdQuery.refetch(),
    isLoadingSayadChequeInquiryByPaymentId:
      sayadChequeInquiryByPaymentIdQuery.isLoading,
    errorSayadChequeInquiryByPaymentId:
      sayadChequeInquiryByPaymentIdQuery.error,
    sayadChequeInquiryByPaymentIdResponse:
      sayadChequeInquiryByPaymentIdQuery.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: {
          result: {
            err: 0,
            sayadiStatus: -10,
            msg: "",
            response: {
              amountDiscrepancy: 0,
              dateDiscrepancy: "",
              reasonDiscrepancy: "",
            },
          },
        },
      },
    //for Payment/sayadiChequeAcceptByPaymentId
    getSayadiChequeAcceptByPaymentId: () =>
      sayadiChequeAcceptByPaymentIdQuery.refetch(),
    isLoadingSayadiChequeAcceptByPaymentId:
      sayadiChequeAcceptByPaymentIdQuery.isLoading,
    errorSayadiChequeAcceptByPaymentId:
      sayadiChequeAcceptByPaymentIdQuery.error,
    sayadiChequeAcceptByPaymentIdResponse:
      sayadiChequeAcceptByPaymentIdQuery.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: {
          result: {
            state: -10
          },
        },
      },
    //////////////////////////////////////////////////////////////
    //output for /api/ProcurementAttachment/delete
    deleteSayadiChequeRejectByPaymentId: sayadiChequeRejectByPaymentId.mutate,
    LoadingSayadiChequeRejectByPaymentId: sayadiChequeRejectByPaymentId.isPending,
    errorSayadiChequeRejectByPaymentId: sayadiChequeRejectByPaymentId.error,
    successSayadiChequeRejectByPaymentId:
      sayadiChequeRejectByPaymentId.isSuccess,     
    sayadiChequeRejectByPaymentIdResponse: sayadiChequeRejectByPaymentId.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: {
          result: { state: -10 },
        },
      },      
  };
}
