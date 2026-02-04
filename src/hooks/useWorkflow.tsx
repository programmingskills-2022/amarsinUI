import {
  //QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "../api/axios";
import { useWorkflowStore } from "../store/workflowStore";
import {
  WorkFlowDoFlowRequest,
  WorkFlowFlowMapBeforeAfterDeleteRequest,
  WorkFlowFlowMapBeforeAftersResponse,
  WorkFlowFlowMapCodeSearchResponse,
  WorkFlowFlowMapDeleteRequest,
  WorkFlowFlowMapLoadResponse,
  WorkFlowFlowMapsResponse,
  WorkFlowFlowMapsSearchResponse,
  WorkFlowFlowNosSearchRequest,
  WorkFlowFlowNosSearchResponse,
  WorkFlowFlowsRequest,
  WorkFlowFlowsResponse,
  WorkFlowFormSearchResponse,
  WorkFlowIfOperationFlowMapAddRequest,
  WorkFlowMapSaveRequest,
  WorkFlowRequest,
  WorkflowResponse,
  WorkFlowRowSelectRequest,
  WorkflowRowSelectResponse,
  WorkFlowScriptSearchResponse,
  WorkFlowStatusSearchResponse,
  WorkFlowWebAPISearchResponse,
} from "../types/workflow";

export function useWorkflow() {
  const {
    systemId,
    page,
    pageSize,
    flowMapId,
    title,
    dateTime,
    code,
    cost,
    name,
    dsc,
    setWorkFlowResponse,
    chartId,
    workTableId,
    setWorkFlowRowSelectResponse,
    setWorkFlowDoFlowResponse,
    //for api/WFMS/flows?WorkTableId=
    workTableIdFlows,
    workTableIdFlowsTrigger,
    formIdFlows,
    flowNoFlows,
    searchFlows,
    pageFlows,
    setWorkFlowFlowsResponse,
    //for api/WFMS/flowNosSearch?systemId=4&page=1&lastId=0
    systemIdFlowNosSearch,
    pageFlowNosSearch,
    lastIdFlowNosSearch,
    searchFlowNosSearch,
    setWorkFlowFlowNosSearchResponse,
    //for api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
    flowNoIdFlowMaps,
    systemIdFlowMaps,
    setWorkFlowFlowMapsResponse,
    workTableIdTrigger, // for doFlow to call queryRowSelect
    //for api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
    flowMapIdBeforeAfters,
    systemIdBeforeAfters,
    setWorkFlowFlowMapBeforeAftersResponse,
    //for api/WFMS/flowMapCodeSearch?systemId=4&page=1&lastId=0
    systemIdFlowMapCodeSearch,
    pageFlowMapCodeSearch,
    lastIdFlowMapCodeSearch,
    searchFlowMapCodeSearch,
    setWorkFlowFlowMapCodeSearchResponse,
    //for api/WFMS/formSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    systemIdFormSearch,
    flowNoIdFormSearch,
    pageFormSearch,
    lastIdFormSearch,
    searchFormSearch,
    setWorkFlowFormSearchResponse,
    //for api/WFMS/scriptSearch?systemId=4&flowNoId=220200300&kind=-1&page=1&lastId=0
    systemIdScriptSearch,
    flowNoIdScriptSearch,
    kindScriptSearch,
    pageScriptSearch,
    lastIdScriptSearch,
    searchScriptSearch,
    setWorkFlowScriptSearchResponse,
    //for api/WFMS/webAPISearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    systemIdWebAPISearch,
    flowNoIdWebAPISearch,
    pageWebAPISearch,
    lastIdWebAPISearch,
    searchWebAPISearch,
    setWorkFlowWebAPISearchResponse,
    //for api/WFMS/statusSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    systemIdStatusSearch,
    flowNoIdStatusSearch,
    pageStatusSearch,
    lastIdStatusSearch,
    searchStatusSearch,
    setWorkFlowStatusSearchResponse,
    //for api/WFMS/flowMapsSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    systemIdFlowMapsSearch,
    flowNoIdFlowMapsSearch,
    flowNoIdTrigger,
    pageFlowMapsSearch,
    lastIdFlowMapsSearch,
    searchFlowMapsSearch,
    setWorkFlowFlowMapsSearchResponse,
    //for api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
    setWorkFlowIfOperationFlowMapAddResponse,
    //for api/WFMS/flowMapBeforeAfter/734
    setWorkFlowFlowMapBeforeAfterDeleteResponse,
    //for api/WFMS/flowMap/220200301?systemId=4&idempotencyKey=234343
    setWorkFlowFlowMapDeleteResponse,
    //for api/WFMS/flowMapLoad/205000020
    idFlowMapLoad,
    idFlowMapLoadTrigger,
    setWorkFlowFlowMapLoadResponse,
    //for api/WFMS/flowMapSave
    setWorkFlowMapSaveResponse,
  } = useWorkflowStore();

  //const queryClient = new QueryClient();
  const queryClient = useQueryClient();
  const query = useQuery<WorkflowResponse, Error, WorkflowResponse, unknown[]>({
    queryKey: [
      "workflow",
      chartId,
      systemId,
      page,
      pageSize,
      flowMapId,
      title,
      dateTime,
      code,
      cost,
      name,
      dsc,
    ],
    queryFn: async ({ signal }) => {
      const params: WorkFlowRequest = {
        chartId,
        systemId,
        page,
        pageSize,
        flowMapId,
        title,
        dateTime,
        code,
        cost,
        name,
        dsc,
      };

      const url: string = `api/WFMS/WorkTables?chartId=${
        params.chartId
      }&systemId=${params.systemId}&page=${params.page}&pageSize=${
        params.pageSize
      }&flowMapId=${params.flowMapId}&title=${encodeURIComponent(
        params.title ?? ""
      )}&dateTime=${encodeURIComponent(
        params.dateTime ?? ""
      )}&code=${encodeURIComponent(
        params.code ?? ""
      )}&cost=${encodeURIComponent(
        params.cost ?? ""
      )}&name=${encodeURIComponent(params.name ?? "")}&dsc=${encodeURIComponent(
        params.dsc ?? ""
      )}`;

      console.log(url, "url");
      const response = await api.get(url, { signal });
      return response.data;
    },
    enabled: systemId !== -1 && chartId !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    /*staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Continue refetching even when tab is not active*/
    onSuccess: (data: any) => {
      setWorkFlowResponse(data);
      //queryClient.invalidateQueries({ queryKey: ["workflowRowSelect"] });
    },
  } as UseQueryOptions<WorkflowResponse, Error, WorkflowResponse, unknown[]>);

  const queryRowSelect = useQuery<
    WorkflowRowSelectResponse,
    Error,
    WorkflowRowSelectResponse,
    unknown[]
  >({
    queryKey: ["workflowRowSelect", chartId, workTableId, workTableIdTrigger],
    queryFn: async () => {
      const params: WorkFlowRowSelectRequest = {
        chartId,
        workTableId,
        workTableIdTrigger,
      };
      const url: string = `api/WFMS/WorkTableRowSelect?WorkTableId=${params.workTableId}&chartId=${params.chartId}`;

      console.log(url, "url");

      const response = await api.get(url);
      setWorkFlowRowSelectResponse(response.data);
      return response.data;
    },
    enabled: workTableId !== -1 && chartId !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    //staleTime: 0, // Data is immediately considered stale, forcing refetch
    onSuccess: (data: any) => {
      console.log(data, "data in useWorkflow queryRowSelect");
      setWorkFlowRowSelectResponse(data);
    },
  } as UseQueryOptions<WorkflowRowSelectResponse, Error, WorkflowRowSelectResponse, unknown[]>);
  //for api/WFMS/flows?WorkTableId=
  const workFlowFlowsQuery = useQuery<
    WorkFlowFlowsResponse,
    Error,
    WorkFlowFlowsResponse,
    unknown[]
  >({
    queryKey: [
      "workFlowFlows",
      workTableIdFlows,
      workTableIdFlowsTrigger,
      formIdFlows,
      flowNoFlows,
      searchFlows,
      pageFlows,
    ],
    queryFn: async () => {
      const params: WorkFlowFlowsRequest = {
        workTableIdFlows,
        workTableIdFlowsTrigger,
        formIdFlows,
        flowNoFlows,
        searchFlows,
        pageFlows,
      };
      const url: string = `api/WFMS/flows?WorkTableId=${
        params.workTableIdFlows
      }&FormId=${params.formIdFlows}&FlowNo=${
        params.flowNoFlows
      }&search=${encodeURIComponent(params.searchFlows)}&page=${
        params.pageFlows
      }`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: workTableIdFlows !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowFlowsResponse(data);
    },
  } as UseQueryOptions<WorkFlowFlowsResponse, Error, WorkFlowFlowsResponse, unknown[]>);
  //for api/WFMS/flowNosSearch?systemId=4&page=1&lastId=0
  const workFlowFlowNosSearchQuery = useQuery<
    WorkFlowFlowNosSearchResponse,
    Error,
    WorkFlowFlowNosSearchResponse,
    unknown[]
  >({
    queryKey: [
      "workFlowFlowNosSearch",
      systemIdFlowNosSearch,
      pageFlowNosSearch,
      lastIdFlowNosSearch,
      searchFlowNosSearch,
    ],
    queryFn: async () => {
      const params: WorkFlowFlowNosSearchRequest = {
        systemIdFlowNosSearch,
        pageFlowNosSearch,
        lastIdFlowNosSearch,
        searchFlowNosSearch,
      };
      const url: string = `api/WFMS/flowNosSearch?systemId=${
        params.systemIdFlowNosSearch
      }&page=${params.pageFlowNosSearch}&lastId=${
        params.lastIdFlowNosSearch
      }&search=${encodeURIComponent(params.searchFlowNosSearch)}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemIdFlowNosSearch !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowFlowNosSearchResponse(data);
    },
  } as UseQueryOptions<WorkFlowFlowNosSearchResponse, Error, WorkFlowFlowNosSearchResponse, unknown[]>);
  //for api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
  const workFlowFlowMapsQuery = useQuery<
    WorkFlowFlowMapsResponse,
    Error,
    WorkFlowFlowMapsResponse,
    unknown[]
  >({
    queryKey: ["workFlowFlowMaps", systemIdFlowMaps, flowNoIdFlowMaps],
    queryFn: async () => {
      const url: string = `api/WFMS/flowMaps?FlowNoId=${flowNoIdFlowMaps}&SystemId=${systemIdFlowMaps}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: flowNoIdFlowMaps !== -1 && systemIdFlowMaps !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowFlowMapsResponse(data);
    },
  } as UseQueryOptions<WorkFlowFlowMapsResponse, Error, WorkFlowFlowMapsResponse, unknown[]>);
  //for api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
  const workFlowFlowMapBeforeAftersQuery = useQuery<
    WorkFlowFlowMapBeforeAftersResponse,
    Error,
    WorkFlowFlowMapBeforeAftersResponse,
    unknown[]
  >({
    queryKey: [
      "workFlowFlowMapBeforeAfters",
      flowMapIdBeforeAfters,
      systemIdBeforeAfters,
    ],
    queryFn: async () => {
      const url: string = `api/WFMS/flowMapBeforeAfters?FlowMapId=${flowMapIdBeforeAfters}&SystemId=${systemIdBeforeAfters}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    onSuccess: (data: any) => {
      setWorkFlowFlowMapBeforeAftersResponse(data);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: flowMapIdBeforeAfters !== -1 && systemIdBeforeAfters !== -1,
  } as UseQueryOptions<WorkFlowFlowMapBeforeAftersResponse, Error, WorkFlowFlowMapBeforeAftersResponse, unknown[]>);

  //for api/WFMS/flowMapCodeSearch?systemId=4&page=1&lastId=0
  const workFlowFlowMapCodeSearchQuery = useQuery<
    WorkFlowFlowMapCodeSearchResponse,
    Error,
    WorkFlowFlowMapCodeSearchResponse,
    unknown[]
  >({
    queryKey: [
      "workFlowFlowMapCodeSearch",
      systemIdFlowMapCodeSearch,
      pageFlowMapCodeSearch,
      lastIdFlowMapCodeSearch,
      searchFlowMapCodeSearch,
    ],
    queryFn: async () => {
      const url: string = `api/WFMS/flowMapCodeSearch?systemId=${systemIdFlowMapCodeSearch}&page=${pageFlowMapCodeSearch}&lastId=${lastIdFlowMapCodeSearch}&search=${encodeURIComponent(
        searchFlowMapCodeSearch
      )}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemIdFlowMapCodeSearch !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowFlowMapCodeSearchResponse(data);
    },
  } as UseQueryOptions<WorkFlowFlowMapCodeSearchResponse, Error, WorkFlowFlowMapCodeSearchResponse, unknown[]>);
  //for api/WFMS/formSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  const workFlowFormSearchQuery = useQuery<
    WorkFlowFormSearchResponse,
    Error,
    WorkFlowFormSearchResponse,
    unknown[]
  >({
    queryKey: [
      "workFlowFormSearch",
      systemIdFormSearch,
      flowNoIdFormSearch,
      pageFormSearch,
      lastIdFormSearch,
      searchFormSearch,
    ],
    queryFn: async () => {
      const url: string = `api/WFMS/formSearch?systemId=${systemIdFormSearch}&flowNoId=${flowNoIdFormSearch}&page=${pageFormSearch}&lastId=${lastIdFormSearch}&search=${encodeURIComponent(
        searchFormSearch
      )}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemIdFormSearch !== -1 && flowNoIdFormSearch !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowFormSearchResponse(data);
    },
  } as UseQueryOptions<WorkFlowFormSearchResponse, Error, WorkFlowFormSearchResponse, unknown[]>);

  //for api/WFMS/scriptSearch?systemId=4&flowNoId=220200300&kind=-1&page=1&lastId=0
  const workFlowScriptSearchQuery = useQuery<
    WorkFlowScriptSearchResponse,
    Error,
    WorkFlowScriptSearchResponse,
    unknown[]
  >({
    queryKey: [
      "workFlowScriptSearch",
      systemIdScriptSearch,
      flowNoIdScriptSearch,
      kindScriptSearch,
      pageScriptSearch,
      lastIdScriptSearch,
      searchScriptSearch,
    ],
    queryFn: async () => {
      const url: string = `api/WFMS/scriptSearch?systemId=${systemIdScriptSearch}&flowNoId=${flowNoIdScriptSearch}&kind=${kindScriptSearch}&page=${pageScriptSearch}&lastId=${lastIdScriptSearch}&search=${encodeURIComponent(
        searchScriptSearch
      )}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemIdScriptSearch !== -1 && flowNoIdScriptSearch !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowScriptSearchResponse(data);
    },
  } as UseQueryOptions<WorkFlowScriptSearchResponse, Error, WorkFlowScriptSearchResponse, unknown[]>);
  // for api/WFMS/webAPISearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  const workFlowWebAPISearchQuery = useQuery<
    WorkFlowWebAPISearchResponse,
    Error,
    WorkFlowWebAPISearchResponse,
    unknown[]
  >({
    queryKey: [
      "workFlowWebAPISearch",
      systemIdWebAPISearch,
      flowNoIdWebAPISearch,
      pageWebAPISearch,
      lastIdWebAPISearch,
      searchWebAPISearch,
    ],
    queryFn: async () => {
      const url: string = `api/WFMS/webAPISearch?systemId=${systemIdWebAPISearch}&flowNoId=${flowNoIdWebAPISearch}&page=${pageWebAPISearch}&lastId=${lastIdWebAPISearch}&search=${encodeURIComponent(
        searchWebAPISearch
      )}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemIdWebAPISearch !== -1 && flowNoIdWebAPISearch !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowWebAPISearchResponse(data);
    },
  } as UseQueryOptions<WorkFlowWebAPISearchResponse, Error, WorkFlowWebAPISearchResponse, unknown[]>);
  //for api/WFMS/statusSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  const workFlowStatusSearchQuery = useQuery<
    WorkFlowStatusSearchResponse,
    Error,
    WorkFlowStatusSearchResponse,
    unknown[]
  >({
    queryKey: [
      "workFlowStatusSearch",
      systemIdStatusSearch,
      flowNoIdStatusSearch,
      pageStatusSearch,
      lastIdStatusSearch,
      searchStatusSearch,
    ],
    queryFn: async () => {
      const url: string = `api/WFMS/statusSearch?systemId=${systemIdStatusSearch}&flowNoId=${flowNoIdStatusSearch}&page=${pageStatusSearch}&lastId=${lastIdStatusSearch}&search=${encodeURIComponent(
        searchStatusSearch
      )}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemIdStatusSearch !== -1 && flowNoIdStatusSearch !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowStatusSearchResponse(data);
    },
  } as UseQueryOptions<WorkFlowStatusSearchResponse, Error, WorkFlowStatusSearchResponse, unknown[]>);
  //for api/WFMS/flowMapsSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  const workFlowFlowMapsSearchQuery = useQuery<
    WorkFlowFlowMapsSearchResponse,
    Error,
    WorkFlowFlowMapsSearchResponse,
    unknown[]
  >({
    queryKey: [
      "workFlowFlowMapsSearch",
      systemIdFlowMapsSearch,
      flowNoIdFlowMapsSearch,
      flowNoIdTrigger,
      pageFlowMapsSearch,
      lastIdFlowMapsSearch,
      searchFlowMapsSearch,
    ],
    queryFn: async () => {
      const url: string = `api/WFMS/flowMapsSearch?systemId=${systemIdFlowMapsSearch}&flowNoId=${flowNoIdFlowMapsSearch}&page=${pageFlowMapsSearch}&lastId=${lastIdFlowMapsSearch}&search=${encodeURIComponent(
        searchFlowMapsSearch
      )}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: systemIdFlowMapsSearch !== -1 && flowNoIdFlowMapsSearch !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowFlowMapsSearchResponse(data);
    },
  } as UseQueryOptions<WorkFlowFlowMapsSearchResponse, Error, WorkFlowFlowMapsSearchResponse, unknown[]>);
  //for api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
  const workFlowIfOperationFlowMapAdd = useMutation({
    mutationFn: async (request: WorkFlowIfOperationFlowMapAddRequest) => {
      const url: string = `api/WFMS/ifOperationFlowMapAdd?flowMapId=${request.flowMapIdIfOperationFlowMapAdd}&ifOperationFlowMapId=${request.ifOperationFlowMapIdIfOperationFlowMapAdd}`;
      console.log(url, "url");
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: async (data: any) => {
      setWorkFlowIfOperationFlowMapAddResponse(data);
      queryClient.refetchQueries({
        queryKey: [
          "workFlowFlowMapBeforeAfters",
          flowMapIdBeforeAfters,
          systemIdBeforeAfters,
        ],
      });
    },
  });
  //for delete api/WFMS/flowMapBeforeAfter/734
  const workFlowFlowMapBeforeAfterDelete = useMutation({
    mutationFn: async (request: WorkFlowFlowMapBeforeAfterDeleteRequest) => {
      const url: string = `api/WFMS/flowMapBeforeAfter/${request.flowMapIdBeforeAfterDelete}?IdempotencyKey=${request.idempotencyKey}`;
      console.log(url, "url");
      const response = await api.delete(url);
      return response.data;
    },
    onSuccess: async (data: any) => {
      setWorkFlowFlowMapBeforeAfterDeleteResponse(data);
      queryClient.refetchQueries({
        queryKey: [
          "workFlowFlowMapBeforeAfters",
          flowMapIdBeforeAfters,
          systemIdBeforeAfters,
        ],
      });
    },
  });
  // for delete api/WFMS/flowMap/220200301?systemId=4&idempotencyKey=234343
  const workFlowFlowMapDelete = useMutation({
    mutationFn: async (request: WorkFlowFlowMapDeleteRequest) => {
      const url: string = `api/WFMS/flowMap/${request.flowMapIdDelete}?SystemId=${request.systemIdDelete}&IdempotencyKey=${request.idempotencyKeyDelete}`;
      const response = await api.delete(url);
      return response.data;
    },
    onSuccess: async (data: any) => {
      setWorkFlowFlowMapDeleteResponse(data);
    },
  });
  //for api/WFMS/flowMapSave
  const workFlowFlowMapSave = useMutation({
    mutationFn: async (request: WorkFlowMapSaveRequest) => {
      const url: string = `api/WFMS/flowMapSave`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: async (data: any) => {
      setWorkFlowMapSaveResponse(data);
    },
  });
  //for api/WFMS/flowMapLoad/205000020
  const workFlowFlowMapLoadQuery = useQuery<
    WorkFlowFlowMapLoadResponse,
    Error,
    WorkFlowFlowMapLoadResponse,
    unknown[]
  >({
    queryKey: ["workFlowFlowMapLoad", idFlowMapLoad,idFlowMapLoadTrigger],
    queryFn: async () => {
      const url: string = `api/WFMS/flowMapLoad/${idFlowMapLoad}`;
      console.log(url, "url");
      const response = await api.get(url);
      return response.data;
    },
    enabled: idFlowMapLoad !== -1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowFlowMapLoadResponse(data);
    },
  } as UseQueryOptions<WorkFlowFlowMapLoadResponse, Error, WorkFlowFlowMapLoadResponse, unknown[]>);
  //for doFlow
  const doFlow = useMutation({
    mutationFn: async (request: WorkFlowDoFlowRequest) => {
      const url: string = `api/WFMS/doFlow`;
      const response = await api.post(url, request);
      return response.data;
    },
    onSuccess: async (data: any) => {
      // Refetch only the current query with exact parameters, not all workflow queries
      /*if (data.meta.errorCode <= 0) {
        await queryClient.refetchQueries({
          queryKey: [
            "workflow",
            chartId,
            systemId,
            page,
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
      }*/
      setWorkFlowDoFlowResponse(data);
    },
  });

  return {
    refetchWorkTable: query.refetch,
    isRefetchingWorkTable: query.isRefetching,
    isLoading: query.isLoading,
    error: query.error,
    workFlowResponse: query.data ?? {
      err: 0,
      msg: "",
      totalCount: 0,
      flowMapTitles: [],
      workTables: [],
    },

    refetchWorkTableRowSelect: queryRowSelect.refetch,
    isRefetchingWorkTableRowSelect: queryRowSelect.isRefetching,
    isLoadingRowSelect: queryRowSelect.isLoading,
    errorRowSelect: queryRowSelect.error,
    workFlowRowSelectResponse: queryRowSelect.data ?? {
      err: 0,
      msg: "",
      workTableRow: {
        id: -1, //parent id
        regFDate: "",
        regTime: "",
        regDateTime: "",
        formId: 0,
        formTitle: "",
        formCode: "",
        formCost: 0,
        fChartName: "",
        flowMapTitle: "",
        dsc: "",
        operation: 0,
        wfmS_FlowMapId: 0,
        wfmS_FlowId: 0,
        flowNo: 0,
        canEditForm1: false,
        canEditForm2: false,
        printForm1: false,
        printForm2: false,
      },
      flowButtons: [],
      workTableForms: {
        form1Title: "",
        form1ViewPath: "",
        canEditForm1: false,
        canEditForm1Mst1: false,
        canEditForm1Mst2: false,
        canEditForm1Mst3: false,
        canEditForm1DtlDel: false,
        canEditForm1Dtl1: false,
        canEditForm1Dtl2: false,
        canEditForm1Dtl3: false,
        form2Title: "",
        form2ViewPath: "",
        canEditForm2: false,
      },
      flowDescriptions: [],
    },
    // for api/WFMS/flows?WorkTableId=
    refetchWorkFlowFlows: workFlowFlowsQuery.refetch,
    isRefetchingWorkFlowFlows: workFlowFlowsQuery.isRefetching,
    isLoadingWorkFlowFlows: workFlowFlowsQuery.isLoading,
    errorWorkFlowFlows: workFlowFlowsQuery.error,
    workFlowFlowsResponse: workFlowFlowsQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: [],
        total_count: 0,
      },
    },
    // for doFlow
    isLoadingdoFlow: doFlow.isPending,
    errordoFlow: doFlow.error,
    doFlow: doFlow.mutateAsync,
    workFlowDoFlowResponse: doFlow.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          id: 0,
          err: 0,
          msg: "",
          formAfterClick: {
            id: 0,
            title: null,
            viewPath: "-1",
          },
        },
      },
    },
    //for api/WFMS/flowNosSearch?systemId=4&page=1&lastId=0
    refetchWorkFlowFlowNosSearch: workFlowFlowNosSearchQuery.refetch,
    isRefetchingWorkFlowFlowNosSearch: workFlowFlowNosSearchQuery.isRefetching,
    isLoadingWorkFlowFlowNosSearch: workFlowFlowNosSearchQuery.isLoading,
    errorWorkFlowFlowNosSearch: workFlowFlowNosSearchQuery.error,
    workFlowFlowNosSearchResponse: workFlowFlowNosSearchQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [], total_count: 0 },
    },
    //for api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
    refetchWorkFlowFlowMaps: workFlowFlowMapsQuery.refetch,
    isRefetchingWorkFlowFlowMaps: workFlowFlowMapsQuery.isRefetching,
    isLoadingWorkFlowFlowMaps: workFlowFlowMapsQuery.isLoading,
    errorWorkFlowFlowMaps: workFlowFlowMapsQuery.error,
    workFlowFlowMapsResponse: workFlowFlowMapsQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [] },
    },
    //for api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
    refetchWorkFlowFlowMapBeforeAfters:
      workFlowFlowMapBeforeAftersQuery.refetch,
    isRefetchingWorkFlowFlowMapBeforeAfters:
      workFlowFlowMapBeforeAftersQuery.isRefetching,
    isLoadingWorkFlowFlowMapBeforeAfters:
      workFlowFlowMapBeforeAftersQuery.isLoading,
    errorWorkFlowFlowMapBeforeAfters: workFlowFlowMapBeforeAftersQuery.error,
    workFlowFlowMapBeforeAftersResponse:
      workFlowFlowMapBeforeAftersQuery.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: { result: { flowMapBefores: [], flowMapAfters: [] } },
      },
    //for api/WFMS/flowMapCodeSearch?systemId=4&page=1&lastId=0
    refetchWorkFlowFlowMapCodeSearch: workFlowFlowMapCodeSearchQuery.refetch,
    isRefetchingWorkFlowFlowMapCodeSearch:
      workFlowFlowMapCodeSearchQuery.isRefetching,
    isLoadingWorkFlowFlowMapCodeSearch:
      workFlowFlowMapCodeSearchQuery.isLoading,
    errorWorkFlowFlowMapCodeSearch: workFlowFlowMapCodeSearchQuery.error,
    workFlowFlowMapCodeSearchResponse: workFlowFlowMapCodeSearchQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [], total_count: 0 },
    },
    //for api/WFMS/formSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    refetchWorkFlowFormSearch: workFlowFormSearchQuery.refetch,
    isRefetchingWorkFlowFormSearch: workFlowFormSearchQuery.isRefetching,
    isLoadingWorkFlowFormSearch: workFlowFormSearchQuery.isLoading,
    errorWorkFlowFormSearch: workFlowFormSearchQuery.error,
    workFlowFormSearchResponse: workFlowFormSearchQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [], total_count: 0 },
    },
    //for api/WFMS/scriptSearch?systemId=4&flowNoId=220200300&kind=-1&page=1&lastId=0
    refetchWorkFlowScriptSearch: workFlowScriptSearchQuery.refetch,
    isRefetchingWorkFlowScriptSearch: workFlowScriptSearchQuery.isRefetching,
    isLoadingWorkFlowScriptSearch: workFlowScriptSearchQuery.isLoading,
    errorWorkFlowScriptSearch: workFlowScriptSearchQuery.error,
    workFlowScriptSearchResponse: workFlowScriptSearchQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [], total_count: 0 },
    },
    //for api/WFMS/webAPISearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    refetchWorkFlowWebAPISearch: workFlowWebAPISearchQuery.refetch,
    isRefetchingWorkFlowWebAPISearch: workFlowWebAPISearchQuery.isRefetching,
    isLoadingWorkFlowWebAPISearch: workFlowWebAPISearchQuery.isLoading,
    errorWorkFlowWebAPISearch: workFlowWebAPISearchQuery.error,
    workFlowWebAPISearchResponse: workFlowWebAPISearchQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [], total_count: 0 },
    },
    //for api/WFMS/statusSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    refetchWorkFlowStatusSearch: workFlowStatusSearchQuery.refetch,
    isRefetchingWorkFlowStatusSearch: workFlowStatusSearchQuery.isRefetching,
    isLoadingWorkFlowStatusSearch: workFlowStatusSearchQuery.isLoading,
    errorWorkFlowStatusSearch: workFlowStatusSearchQuery.error,
    workFlowStatusSearchResponse: workFlowStatusSearchQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [], total_count: 0 },
    },
    //for api/WFMS/flowMapsSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    refetchWorkFlowFlowMapsSearch: workFlowFlowMapsSearchQuery.refetch,
    isRefetchingWorkFlowFlowMapsSearch:
      workFlowFlowMapsSearchQuery.isRefetching,
    isLoadingWorkFlowFlowMapsSearch: workFlowFlowMapsSearchQuery.isLoading,
    errorWorkFlowFlowMapsSearch: workFlowFlowMapsSearchQuery.error,
    workFlowFlowMapsSearchResponse: workFlowFlowMapsSearchQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: [], total_count: 0 },
    },
    //for api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
    isLoadingWorkFlowIfOperationFlowMapAdd:
      workFlowIfOperationFlowMapAdd.isPending,
    errorWorkFlowIfOperationFlowMapAdd: workFlowIfOperationFlowMapAdd.error,
    workFlowIfOperationFlowMapAdd: workFlowIfOperationFlowMapAdd.mutateAsync,
    workFlowIfOperationFlowMapAddResponse:
      workFlowIfOperationFlowMapAdd.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: {
          result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false },
        },
      },
    //for api/WFMS/flowMapBeforeAfter/734
    isLoadingWorkFlowFlowMapBeforeAfterDelete:
      workFlowFlowMapBeforeAfterDelete.isPending,
    errorWorkFlowFlowMapBeforeAfterDelete:
      workFlowFlowMapBeforeAfterDelete.error,
    workFlowFlowMapBeforeAfterDelete:
      workFlowFlowMapBeforeAfterDelete.mutateAsync,
    workFlowFlowMapBeforeAfterDeleteResponse:
      workFlowFlowMapBeforeAfterDelete.data ?? {
        meta: { errorCode: 0, message: "", type: "" },
        data: {
          result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false },
        },
      },
    //for api/WFMS/flowMap/220200301?systemId=4&idempotencyKey=234343
    isLoadingWorkFlowFlowMapDelete: workFlowFlowMapDelete.isPending,
    errorWorkFlowFlowMapDelete: workFlowFlowMapDelete.error,
    workFlowFlowMapDelete: workFlowFlowMapDelete.mutateAsync,
    workFlowFlowMapDeleteResponse: workFlowFlowMapDelete.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
    },
    //for api/WFMS/flowMapSave
    isLoadingWorkFlowMapSave: workFlowFlowMapSave.isPending,
    errorWorkFlowMapSave: workFlowFlowMapSave.error,
    workFlowFlowMapSave: workFlowFlowMapSave.mutateAsync,
    workFlowFlowMapSaveResponse: workFlowFlowMapSave.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
    },
    //for api/WFMS/flowMapLoad/205000020
    isLoadingWorkFlowFlowMapLoad: workFlowFlowMapLoadQuery.isLoading,
    errorWorkFlowFlowMapLoad: workFlowFlowMapLoadQuery.error,
    workFlowFlowMapLoadResponse: workFlowFlowMapLoadQuery.data ?? {
      meta: { errorCode: 0, message: "", type: "" },
      data: {
        result: {
          id: 0,
          name: "",
          fChart: 0,
          fChartName: "",
          tChart: 0,
          tChartName: "",
          codeId: 0,
          codeTitle: "",
          code: "",
          formNo1: 0,
          form1Title: "",
          formNo2: 0,
          form2Title: "",
          scriptId: 0,
          scriptTitle: "",
          webAPIId: 0,
          webAPITitle: "",
          scriptBeforeId: 0,
          scriptBeforeTitle: "",
          scriptValidatorId: 0,
          scriptValidatorTitle: "",
          statusId: 0,
          statusTitle: "",
          canEditForm: false,
          canEditForm1: false,
          canEditForm1Dtl1: false,
          canEditForm1Dtl2: false,
          canEditForm1Dtl3: false,
          canEditForm1DtlDel: false,
          canEditForm1Mst1: false,
          canEditForm1Mst2: false,
          canEditForm1Mst3: false,
          formAfterClick: 0,
          formAfterClickTitle: "",
          idempotencyKey: "",
        },
      },
    },
  };
}
