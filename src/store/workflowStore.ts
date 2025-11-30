import { create } from "zustand";
import {
  WorkFlowDoFlowResponse,
  WorkFlowFlowMapBeforeAftersResponse,
  WorkFlowFlowMapCodeSearchResponse,
  WorkFlowFlowMapsResponse,
  WorkFlowFlowMapsSearchResponse,
  WorkFlowFlowNosSearchResponse,
  WorkFlowFlowsResponse,
  WorkFlowFormSearchResponse,
  WorkFlowIfOperationFlowMapAddResponse,
  WorkflowRowSelectResponse,
  WorkFlowScriptSearchResponse,
  WorkFlowState,
  WorkFlowStatusSearchResponse,
  WorkFlowWebAPISearchResponse,
} from "../types/workflow";
import { WorkTable } from "../types/workflow";

export const useWorkflowStore = create<WorkFlowState>()((set) => ({
  chartId: -1,
  systemId: -1,
  page: 1,
  pageSize: 10,
  flowMapId: -1,
  title: "",
  dateTime: "",
  code: "",
  cost: "",
  name: "",
  dsc: "",
  workFlowResponse: {
    err: 0,
    msg: "",
    totalCount: 0,
    flowMapTitles: [],
    workTables: [],
  },
  //api/WFMS/WorkTableRowSelect?WorkTableId=994000&ChartId=7
  workTableId: -1,
  workTableIdTrigger: 0,
  workFlowRowSelectResponse: {
    err: 0,
    msg: "",
    workTableRow: {
      id: 0,
      regFDate: "",
      regTime: "",
      regDateTime: "",
    } as WorkTable,
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
  //doFlow
  workFlowDoFlowResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: {
      result: {
        id: 0,
        err: 0,
        msg: "",
        formAfterClick: {
          id: 0,
          title: null,
          viewPath: null,
        },
        workTable: {
          id: 0,
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
        } as WorkTable,
        workTableRowSelect: {
          id: 0,
          err: 0,
          msg: "",
          formAfterClick: {
            id: 0,
            title: null,
            viewPath: null,
          },
          workTableForms: {
            form1Title: "",
            form1ViewPath: "",
            canEditForm1: false,
            canEditForm1Mst1: false,
            canEditForm1Mst2: false,
            canEditForm1Mst3: false,
          },
          flowDescriptions: [],
          flowButtons: [],
        },
      },
    },
  },
  //api/WFMS/flows?WorkTableId=
  workTableIdFlows: -1,
  formIdFlows: 0,
  flowNoFlows: 0,
  searchFlows: "",
  pageFlows: 1,
  workFlowFlowsResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: {
      result: [],
      total_count: 0,
    },
  },
  //api/WFMS/flowNosSearch?systemId=4&page=1&lastId=0
  systemIdFlowNosSearch: -1,
  pageFlowNosSearch: 1,
  lastIdFlowNosSearch: 0,
  searchFlowNosSearch: "",
  workFlowFlowNosSearchResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [], total_count: 0 },
  },
  //api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
  flowNoIdFlowMaps: -1,
  systemIdFlowMaps: -1,
  workFlowFlowMapsResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [] },
  },

  //api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
  flowMapIdBeforeAfters: -1,
  systemIdBeforeAfters: -1,
  workFlowFlowMapBeforeAftersResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: { flowMapBefores: [], flowMapAfters: [] } },
  },
  //api/WFMS/flowMapCodeSearch?systemId=4&page=1&lastId=0
  systemIdFlowMapCodeSearch: -1,
  pageFlowMapCodeSearch: 1,
  lastIdFlowMapCodeSearch: 0,
  searchFlowMapCodeSearch: "",
  workFlowFlowMapCodeSearchResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [], total_count: 0 },
  },
  //api/WFMS/formSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  systemIdFormSearch: -1,
  flowNoIdFormSearch: -1,
  pageFormSearch: 1,
  lastIdFormSearch: 0,
  searchFormSearch: "",
  workFlowFormSearchResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [], total_count: 0 },
  },
  //api/WFMS/scriptSearch?systemId=4&flowNoId=220200300&kind=-1&page=1&lastId=0
  systemIdScriptSearch: -1,
  flowNoIdScriptSearch: -1,
  kindScriptSearch: -1,
  pageScriptSearch: 1,
  lastIdScriptSearch: 0,
  searchScriptSearch: "",
  workFlowScriptSearchResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [], total_count: 0 },
  },
  //api/WFMS/webAPISearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  systemIdWebAPISearch: -1,
  flowNoIdWebAPISearch: -1,
  pageWebAPISearch: 1,
  lastIdWebAPISearch: 0,
  searchWebAPISearch: "",
  workFlowWebAPISearchResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [], total_count: 0 },
  },
  //api/WFMS/statusSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  systemIdStatusSearch: -1,
  flowNoIdStatusSearch: -1,
  pageStatusSearch: 1,
  lastIdStatusSearch: 0,
  searchStatusSearch: "",
  workFlowStatusSearchResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [], total_count: 0 },
  },
  //api/WFMS/flowMapsSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  systemIdFlowMapsSearch: -1,
  flowNoIdFlowMapsSearch: -1,
  pageFlowMapsSearch: 1,
  lastIdFlowMapsSearch: 0,
  searchFlowMapsSearch: "",
  workFlowFlowMapsSearchResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [], total_count: 0 },
  },
  //api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
  workFlowIfOperationFlowMapAddResponse: {
    meta: { errorCode: 0, message: null, type: "" },
    data: { result: [] },
  },
  setField: (field: string | number | symbol, value: any) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
  updatedWorkFlowRowSelectResponse: null,
  setUpdatedWorkFlowRowSelectResponse: (
    updatedWorkFlowRowSelectResponse: WorkflowRowSelectResponse | null
  ) => set({ updatedWorkFlowRowSelectResponse }),
  setWorkFlowRowSelectResponse: (workFlowRowSelectResponse) =>
    set({ workFlowRowSelectResponse }),
  setWorkFlowDoFlowResponse: (workFlowDoFlowResponse: WorkFlowDoFlowResponse) =>
    set({ workFlowDoFlowResponse }), //for doFlow
  setWorkFlowResponse: (workFlowResponse) => set({ workFlowResponse }),
  setWorkFlowFlowsResponse: (workFlowFlowsResponse: WorkFlowFlowsResponse) =>
    set({ workFlowFlowsResponse }),
  setWorkFlowFlowNosSearchResponse: (
    //api/WFMS/flowNosSearch?systemId=4&page=1&lastId=0
    workFlowFlowNosSearchResponse: WorkFlowFlowNosSearchResponse
  ) => set({ workFlowFlowNosSearchResponse }),
  setWorkFlowFlowMapsResponse: (
    workFlowFlowMapsResponse: WorkFlowFlowMapsResponse
  ) => set({ workFlowFlowMapsResponse }), //api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
  setWorkFlowFlowMapBeforeAftersResponse: (
    workFlowFlowMapBeforeAftersResponse: WorkFlowFlowMapBeforeAftersResponse
  ) => set({ workFlowFlowMapBeforeAftersResponse }), //api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
  setWorkFlowFlowMapCodeSearchResponse: (
    workFlowFlowMapCodeSearchResponse: WorkFlowFlowMapCodeSearchResponse
  ) => set({ workFlowFlowMapCodeSearchResponse }), //api/WFMS/flowMapCodeSearch?systemId=4&page=1&lastId=0
  setWorkFlowFormSearchResponse: (
    workFlowFormSearchResponse: WorkFlowFormSearchResponse
  ) => set({ workFlowFormSearchResponse }), //api/WFMS/formSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  setWorkFlowScriptSearchResponse: (
    workFlowScriptSearchResponse: WorkFlowScriptSearchResponse
  ) => set({ workFlowScriptSearchResponse }), //api/WFMS/scriptSearch?systemId=4&flowNoId=220200300&kind=-1&page=1&lastId=0
  setWorkFlowWebAPISearchResponse: (
    workFlowWebAPISearchResponse: WorkFlowWebAPISearchResponse
  ) => set({ workFlowWebAPISearchResponse }), //api/WFMS/webAPISearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  setWorkFlowStatusSearchResponse: (
    workFlowStatusSearchResponse: WorkFlowStatusSearchResponse
  ) => set({ workFlowStatusSearchResponse }), //api/WFMS/statusSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  setWorkFlowFlowMapsSearchResponse: (
    workFlowFlowMapsSearchResponse: WorkFlowFlowMapsSearchResponse
  ) => set({ workFlowFlowMapsSearchResponse }), //api/WFMS/flowMapsSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  setWorkFlowIfOperationFlowMapAddResponse: (
    workFlowIfOperationFlowMapAddResponse: WorkFlowIfOperationFlowMapAddResponse
  ) => set({ workFlowIfOperationFlowMapAddResponse }), //api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
}));
