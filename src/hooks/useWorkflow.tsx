import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import {
  useWorkflowRowSelectStore,
  useWorkflowStore,
} from "../store/workflowStore";
import {
  WorkFlowRequest,
  WorkflowResponse,
  WorkFlowRowSelectRequest,
  WorkflowRowSelectResponse,
} from "../types/workflow";

export function useWorkflow() {
  const {
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
    setWorkFlowResponse,
  } = useWorkflowStore();

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
    enabled: systemId !== 0 && chartId !== 0 ? true : false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    /*staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Continue refetching even when tab is not active*/
    onSuccess: (data: any) => {
      setWorkFlowResponse(data);
    },
  } as UseQueryOptions<WorkflowResponse, Error, WorkflowResponse, unknown[]>);

  return {
    getWorkTable: query.refetch,
    isLoading: query.isLoading,
    error: query.error,
    workFlowResponse: query.data ?? {
      err: 0,
      msg: "",
      totalCount: 0,
      flowMapTitles: [],
      workTables: [],
    },
  };
}
//for RowSelect
export function useWorkflowRowSelect() {
  const { chartId, workTableId, setWorkFlowRowSelectResponse } =
    useWorkflowRowSelectStore();

  const queryRowSelect = useQuery<
    WorkflowRowSelectResponse,
    Error,
    WorkflowRowSelectResponse,
    unknown[]
  >({
    queryKey: ["workflowRowSelect", chartId, workTableId],
    queryFn: async () => {
      const params: WorkFlowRowSelectRequest = {
        chartId,
        workTableId,
      };

      const url: string = `api/WFMS/WorkTableRowSelect?WorkTableId=${params.workTableId}&chartId=${params.chartId}`;

      console.log(url, "url");

      const response = await api.get(url);
      return response.data;
    },
    enabled: workTableId !== 0 && chartId !== 0 ? true : false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data: any) => {
      setWorkFlowRowSelectResponse(data);
    },
  } as UseQueryOptions<WorkflowRowSelectResponse, Error, WorkflowRowSelectResponse, unknown[]>);

  return {
    getWorkTableRowSelect: queryRowSelect.refetch,
    isLoading: queryRowSelect.isLoading,
    error: queryRowSelect.error,
    workFlowRowSelectResponse: queryRowSelect.data ?? {
      err: 0,
      msg: "",
      workTableRow: {
        id: 148201, //parent id
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
  };
}
