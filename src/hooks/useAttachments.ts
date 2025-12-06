import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "../api/axios";
import { useAttachmentStore } from "../store/attachmentStore";
import {
  AttachmentListRequest,
  AttachmentListResponse,
  DeleteRestoreRequest,
} from "../types/attachment";

export function useAttachments() {
  const {
    formId,
    prefix,
    GUID,
    systemId,
    yearId,
    setAttachmentListResponse,
    setDeleteRestoreResponse,
    setAttachmentSaveResponse,
  } = useAttachmentStore();

  const queryClient = useQueryClient();
  // for api/Attachment/list
  const query = useQuery<
    AttachmentListResponse,
    Error,
    AttachmentListResponse,
    unknown[]
  >({
    queryKey: ["attachments", formId, prefix, GUID, yearId, systemId],
    queryFn: async () => {
      const params: AttachmentListRequest = {
        systemId,
        yearId,
        formId,
        prefix,
        GUID,
      };
      const url = `/api/Attachment/list?formId=${params.formId}&prefix=${params.prefix}&GUID=${params.GUID}&yearId=${params.yearId}&systemId=${params.systemId}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled:  yearId !== -1 && systemId !== -1 && (formId !== 0 || GUID !== ""),
    refetchOnWindowFocus: false, // Refetch data when the window is focused
    refetchOnReconnect: false, // Refetch data when the network reconnects
    onSuccess: (data: any) => {
      setAttachmentListResponse(data);
    },
  } as UseQueryOptions<AttachmentListResponse, Error, AttachmentListResponse, unknown[]>);

  // /api/Attachment/delete?id=16&formId=1513&prefix=payrequest
  const deleteAttachment = useMutation({
    mutationFn: async (request: DeleteRestoreRequest) => {
      const response = await api.delete(`/api/Attachment/delete`, {
        params: {
          id: request.idDeleteRestore,
          formId: request.formIdDeleteRestore,
          prefix: request.prefixDeleteRestore,
        },
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      setDeleteRestoreResponse(data);
    },
  });
  // /api/Attachment/restore?id=16&formId=1513&prefix=payrequest
  const restoreAttachment = useMutation({
    mutationFn: async (request: DeleteRestoreRequest) => {
      const response = await api.post(
        `/api/Attachment/restore?id=${request.idDeleteRestore}&formId=${request.formIdDeleteRestore}&prefix=${request.prefixDeleteRestore}`
      );
      return response.data;
    },
    onSuccess: (data: any) => {
      setDeleteRestoreResponse(data);
    },
  });
  //http://apitest.dotis.ir/api/Attachment/save?prefix=payrequest&formId=1513&systemId=1&yearId=1&guid=
  const saveAttachment = useMutation({
    mutationFn: async (payload: {
      formData: FormData;
      params: URLSearchParams;
    }) => {
      const response = await api.post(
        `/api/Attachment/save?${payload.params.toString()}`,
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
      setAttachmentSaveResponse(data);
      // Refresh the attachments list after success
      console.log("saveAttachment success", GUID, formId, prefix);
      queryClient.invalidateQueries({
        queryKey: ["attachments"],
      });
    },
    onError: (error: any) => {
      console.error("خطای بارگذاری فایل", error);
    },
  });
  return {
    //////////////////////////////////////////////////////////////
    saveAttachment: saveAttachment.mutate,
    saveAttachmentLoading: saveAttachment.isPending,
    saveAttachmentError: saveAttachment.error,
    saveAttachmentSuccess: saveAttachment.isSuccess,
    attachmentSaveResponse: saveAttachment.data,
    //////////////////////////////////////////////////////////////
    restoreAttachment: restoreAttachment.mutate,
    restoreAttachmentLoading: restoreAttachment.isPending,
    restoreAttachmentError: restoreAttachment.error,
    restoreAttachmentSuccess: restoreAttachment.isSuccess,
    //////////////////////////////////////////////////////////////
    deleteAttachment: deleteAttachment.mutate,
    deleteAttachmentLoading: deleteAttachment.isPending,
    deleteAttachmentError: deleteAttachment.error,
    deleteAttachmentSuccess: deleteAttachment.isSuccess,
    //////////////////////////////////////////////////////////////
    refetch: query.refetch,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    error: query.error,
    attachments: query.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: [
          {
            ordr: 0,
            systemId: 0,
            yearId: 0,
            id: 0,
            dat: "",
            regTime: "",
            usrDisplayName: "",
            dsc: "",
            path: "",
            extension: "",
            hasPrev: false,
            hasNext: false,
            imagePath: "",
            downloadPath: "",
            base64Path: "",
            base64Data: "",
            fileSize: 0,
          },
        ],
      },
    },
  };
}
