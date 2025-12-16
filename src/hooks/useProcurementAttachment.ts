import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "../api/axios";
import { useProcurementAttachmentStore } from "../store/procurementAttachmentStore";
import {
  DeleteRestoreRequest,
  ProcurementAttachmentRequest,
  ProcurementAttachmentResponse,
} from "../types/procurementAttachment";

export function useProcurementAttachment() {
  const {
    guid,
    systemId,
    yearId,
    form,
    preProcurementId,
    temporaryReceiptId,
    procurementId,
    receiptId,
    setProcurementAttachmentResponse, //api/ProcurementAttachment/attachments
    setProcurementAttachmentUploadResponse, //api/ProcurementAttachment/upload
    setProcurementAttachmentDeleteRestoreResponse, //api/ProcurementAttachment/delete
  } = useProcurementAttachmentStore();
  const queryClient = useQueryClient();
  //api/ProcurementAttachment/attachments?GUID=79f7780b-9c4b-4902-9cd4-bdd3aebb60b3&SystemId=4&YearId=15&Form=PreProcurement&PreProcurementId=924069&TemporaryReceiptId=0&ProcurementId=0&ReceiptId=0
  const procurementAttachmentQuery = useQuery<
    ProcurementAttachmentResponse,
    Error,
    ProcurementAttachmentResponse,
    unknown[]
  >({
    queryKey: [
      "ProcurementAttachment",
      guid,
      systemId,
      yearId,
      form,
      preProcurementId,
      temporaryReceiptId,
      procurementId,
      receiptId,
    ],
    queryFn: async () => {
      const params: ProcurementAttachmentRequest = {
        guid,
        systemId,
        yearId,
        form,
        preProcurementId,
        temporaryReceiptId,
        procurementId,
        receiptId,
      };

      const url: string = `/api/ProcurementAttachment/attachments?GUID=${params.guid}&SystemId=${params.systemId}&YearId=${params.yearId}&Form=${params.form}&PreProcurementId=${params.preProcurementId}&TemporaryReceiptId=${params.temporaryReceiptId}&ProcurementId=${params.procurementId}&ReceiptId=${params.receiptId}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: yearId!==-1 && systemId!==-1,
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setProcurementAttachmentResponse(data);
    },
  } as UseQueryOptions<ProcurementAttachmentResponse, Error, ProcurementAttachmentResponse, unknown[]>);
  //for api/ProcurementAttachment/upload
  const procurementAttachmentUpload = useMutation({
    mutationFn: async (payload: {
      formData: FormData;
      params: URLSearchParams;
    }) => {
      console.log(payload, "payload");
      const response = await api.post(
        `/api/ProcurementAttachment/upload?${payload.params.toString()}`,
        payload.formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data: any) => {
      setProcurementAttachmentUploadResponse(data);
      // Refresh the attachments list after success
      console.log(
        "procurementAttachmentUpload success",
        guid,
        form,
        preProcurementId,
        temporaryReceiptId,
        procurementId,
        receiptId
      );
      queryClient.invalidateQueries({
        queryKey: [
          "ProcurementAttachment",
          guid,
          systemId,
          yearId,
          form,
          preProcurementId,
          temporaryReceiptId,
          procurementId,
          receiptId,
        ],
      });
    },
    onError: (error: any) => {
      console.error("خطای بارگذاری فایل", error);
      // Optional: Add user feedback (e.g., toast notification)
    },
  });
  //api/ProcurementAttachment/delete?Id=42&Form=PreProcurement&PreProcurementId=925139&TemporaryReceiptId=0&ProcurementId=0&ReceiptId=0
  const procurementAttachmentdelete = useMutation({
    mutationFn: async (request: DeleteRestoreRequest) => {
      const url = `/api/ProcurementAttachment/delete?Id=${request.idDeleteRestore}&PreProcurementId=${request.formIdDeleteRestore}&Form=${request.prefixDeleteRestore}&TemporaryReceiptId=${request.temporaryReceiptId}&ProcurementId=${request.procurementId}&ReceiptId=${request.receiptId}`;
      console.log(url, "url");
      const response = await api.delete(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setProcurementAttachmentDeleteRestoreResponse(data);
    },
  });
  // /api/Attachment/restore?id=16&formId=1513&prefix=payrequest
  const restoreProcurementAttachment = useMutation({
    mutationFn: async (request: DeleteRestoreRequest) => {
      const url = `/api/ProcurementAttachment/restore?Id=${request.idDeleteRestore}&PreProcurementId=${request.formIdDeleteRestore}&Form=${request.prefixDeleteRestore}&TemporaryReceiptId=${request.temporaryReceiptId}&ProcurementId=${request.procurementId}&ReceiptId=${request.receiptId}`;
      console.log(url, "url");
      const response = await api.post(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setProcurementAttachmentDeleteRestoreResponse(data);
    },
  });
  return {
    refetchProcurementAttachment: () => procurementAttachmentQuery.refetch(),
    isFetchingProcurementAttachment: procurementAttachmentQuery.isFetching,
    isLoadingProcurementAttachment: procurementAttachmentQuery.isLoading,
    errorProcurementAttachment: procurementAttachmentQuery.error,
    procurementAttachmentResponse: procurementAttachmentQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: [],
      },
    },
    //////////////////////////////////////////////////////////////
    //output for /api/ProcurementAttachment/upload
    procurementAttachmentUpload: procurementAttachmentUpload.mutate,
    LoadingProcurementAttachmentUpload: procurementAttachmentUpload.isPending,
    errorProcurementAttachmentUpload: procurementAttachmentUpload.error,
    successSaveAttachmenprocurementAttachmentUpload:
      procurementAttachmentUpload.isSuccess,
    procurementAttachmentUploadResponse: procurementAttachmentUpload.data,
    //////////////////////////////////////////////////////////////
    //output for /api/ProcurementAttachment/restore
    restoreProcurementAttachment: restoreProcurementAttachment.mutate,
    LoadingProcurementAttachmentRestore: restoreProcurementAttachment.isPending,
    errorProcurementAttachmentRestore: restoreProcurementAttachment.error,
    successSaveProcurementAttachmentRestore:
      restoreProcurementAttachment.isSuccess,
    //////////////////////////////////////////////////////////////
    //output for /api/ProcurementAttachment/delete
    deleteProcurementAttachment: procurementAttachmentdelete.mutate,
    LoadingProcurementAttachmentDelete: procurementAttachmentdelete.isPending,
    errorProcurementAttachmentDelete: procurementAttachmentdelete.error,
    successSaveProcurementAttachmentDelete:
      procurementAttachmentdelete.isSuccess,
    //////////////////////////////////////////////////////////////
  };
}
