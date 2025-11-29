import { Meta } from "./general";
import { WorkTable } from "./workflow.d";
export type FlowMapTitle = {
  id: number;
  name: string;
  count: number;
};

export type WorkFlowTable = {
  id: number;
  regDateTime: string;
  formTitle: string;
  formCode: string;
  formCost: number;
  flowMapTitle: string;
  fChartName: string;
  dsc: string;
};

export type WorkTable = {
  id: number; //parent id
  regFDate: string;
  regTime: string;
  regDateTime: string;
  formId: number;
  formTitle: string;
  formCode: string;
  formCost: number;
  fChartName: string;
  flowMapTitle: string;
  dsc: string;
  operation: number;
  wfmS_FlowMapId: number;
  wfmS_FlowId: number;
  flowNo: number;
  canEditForm1: boolean;
  canEditForm2: boolean;
  printForm1: boolean;
  printForm2: boolean;
};
// is used in doFlow request (coming from Workflow filter params)
export type WorkflowFilterParams = {
  dateTime: string;
  title: string;
  code: string;
  cost: string;
  flowMapId: string;
  name: string;
  dsc: string;
  pageNumber: number;
};

export type WorkflowResponse = {
  err: number;
  msg: string;
  totalCount: number;
  flowMapTitles: FlowMapTitle[];
  workTables: WorkTable[];
};

export interface WorkFlowRequest {
  chartId: number;
  systemId?: number;
  page?: number;
  pageSize?: number;
  flowMapId?: number;
  title?: string;
  dateTime?: string;
  code?: string;
  cost?: string;
  name?: string;
  dsc?: string;
}

export interface FlowButton {
  id: number;
  name: string;
  imageIndex: number;
  formAfterClick: {
    id: number;
    title: string;
    viewPath: string;
  } | null;
}

export interface WorkTableForms {
  form1Title: string;
  form1ViewPath: string;
  canEditForm1: boolean;
  canEditForm1Mst1: boolean;
  canEditForm1Mst2: boolean;
  canEditForm1Mst3: boolean;
  canEditForm1DtlDel: boolean;
  canEditForm1Dtl1: boolean;
  canEditForm1Dtl2: boolean;
  canEditForm1Dtl3: boolean;
  form2Title: string;
  form2ViewPath: string;
  canEditForm2: boolean;
}

export interface FlowDescription {
  usrName: string;
  dsc: string;
}

//api/WFMS/WorkTableRowSelect?WorkTableId=994000&ChartId=7
export interface WorkflowRowSelectResponse {
  err: number;
  msg: string;
  workTableRow: WorkTable;
  flowButtons: FlowButton[];
  workTableForms: WorkTableForms;
  flowDescriptions: FlowDescription[];
}

export interface WorkFlowRowSelectRequest {
  chartId: number;
  workTableId: number;
  workTableIdTrigger: number;
}

//http://apitest.dotis.ir/api/WFMS/doFlow
export interface WorkFlowDoFlowRequest {
  chartId: number;
  systemId: number;
  yearId: number;
  workTableId: number;
  flowMapId: number;
  formId: number;
  flowNo: number;
  flowId: number;
  dsc: string;
  date: string;
  params: string;
  workQueueResult: boolean;
  idempotencyKey: string;
  workTableParam: WorkTableParam;
  idempotencyKey: string;
}

interface WorkFlowDoFlowResponse {
  meta: Meta;
  data: DataWorkFlowDoFlow;
}

interface DataWorkFlowDoFlow {
  result: ResultWorkFlowDoFlow;
}

interface ResultWorkFlowDoFlow {
  id: number;
  err: number;
  msg: string;
  formAfterClick: FormAfterClick;
  workTable: WorkTable;
  workTableRowSelect: WorkTableRowSelect;
}

///api/WFMS/flows?WorkTableId=994047&FormId=0&FlowNo=0&page=1
export interface WorkFlowFlowsRequest {
  workTableIdFlows: number;
  formIdFlows: number;
  flowNoFlows: number;
  searchFlows: string;
  pageFlows: number;
}

interface FlowResult {
  id: number;
  dateTim: string;
  usrName: string;
  fChartName: string;
  flowMapName: string;
  tChartName: string;
  dsc: string;
}

interface WorkFlowFlowsData {
  result: FlowResult[];
  total_count: number;
}

export interface WorkFlowFlowsResponse {
  meta: Meta;
  data: WorkFlowFlowsData;
}
//api/WFMS/flowNosSearch?systemId=4&page=1&lastId=0
export interface WorkFlowFlowNosSearchRequest {
  systemIdFlowNosSearch: number;
  pageFlowNosSearch: number;
  lastIdFlowNosSearch: number;
  searchFlowNosSearch: string;
}

interface DataFlowNosSearch {
  result: SearchItem[];
  total_count: number;
}

export interface WorkFlowFlowNosSearchResponse {
  meta: Meta;
  data: DataFlowNosSearch;
}

//api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
export interface WorkFlowFlowMapsRequest {
  flowNoIdFlowMaps: number;
  systemIdFlowMaps: number;
}

interface WorkFlowFlowMapsResponse {
  meta: Meta;
  data: WorkFlowFlowMapsData;
}

interface WorkFlowFlowMapsData {
  result: FlowMapResult[];
}

interface FlowMapResult {
  ifId: number;
  id: number;
  name: string;
  fChart: number;
  fChartName: string;
  tChart: number;
  tChartName: string;
  f1Title: string;
  f2Title: string;
  sbTitle: string;
  sTitle: string;
  waTitle: string;
  svTitle: string;
}
// for api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
export interface WorkFlowFlowMapBeforeAftersRequest {
  flowMapIdBeforeAfters: number;
  systemIdBeforeAfters: number;
}
export interface WorkFlowFlowMapBeforeAftersResponse {
  meta: Meta;
  data: WorkFlowFlowMapBeforeAftersData;
}

interface WorkFlowFlowMapBeforeAftersData {
  result: FlowMapBeforeAftersResult;
}

interface FlowMapBeforeAftersResult {
  flowMapBefores: FlowMapResult[];
  flowMapAfters: FlowMapResult[];
}

// api/WFMS/flowMapSave
export interface WorkFlowMapSaveRequest {
  usrId: number;
  id: number;
  name: string;
  flowNo: number;
  fChart: number;
  codeId: number;
  tChart: number;
  formNo1: number;
  formNo2: number;
  scriptBeforeId: number;
  scriptId: number;
  webAPIId: number;
  scriptValidatorId: number;
  statusId: number;
  idempotencyKey: string;
}
export interface WorkFlowState
  extends WorkFlowRequest,
    WorkFlowRowSelectRequest,
    WorkFlowFlowsRequest,
    WorkFlowFlowNosSearchRequest,
    WorkFlowFlowMapsRequest,
    WorkFlowFlowMapBeforeAftersRequest {
  workFlowResponse: WorkflowResponse;
  setField: (field: string | number | symbol, value: any) => void;
  setWorkFlowResponse: (workFlowResponse: WorkflowResponse) => void;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  workFlowDoFlowResponse: WorkFlowDoFlowResponse; // for doFlow
  workFlowFlowsResponse: WorkFlowFlowsResponse; //api/WFMS/flows?WorkTableId=
  workFlowFlowNosSearchResponse: WorkFlowFlowNosSearchResponse; //api/WFMS/flowNosSearch?systemId=4&page=1&lastId=0
  workFlowFlowMapsResponse: WorkFlowFlowMapsResponse; //api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
  workFlowFlowMapBeforeAftersResponse: WorkFlowFlowMapBeforeAftersResponse; //api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
  setWorkFlowRowSelectResponse: (
    workFlowRowSelectResponse: WorkflowRowSelectResponse
  ) => void;
  setWorkFlowDoFlowResponse: (
    workFlowDoFlowResponse: WorkFlowDoFlowResponse
  ) => void; //for doFlow
  setWorkFlowFlowsResponse: (
    workFlowFlowsResponse: WorkFlowFlowsResponse
  ) => void; //api/WFMS/flows?WorkTableId=
  setWorkFlowFlowNosSearchResponse: (
    workFlowFlowNosSearchResponse: WorkFlowFlowNosSearchResponse
  ) => void; //api/WFMS/flowNosSearch?systemId=4&page=1&lastId=0
  setWorkFlowFlowMapsResponse: (
    workFlowFlowMapsResponse: WorkFlowFlowMapsResponse
  ) => void; //api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
  setWorkFlowFlowMapBeforeAftersResponse: (
    workFlowFlowMapBeforeAftersResponse: WorkFlowFlowMapBeforeAftersResponse
  ) => void; //api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
  updatedWorkFlowRowSelectResponse: WorkflowRowSelectResponse | null;
  setUpdatedWorkFlowRowSelectResponse: (
    updatedWorkFlowRowSelectResponse: WorkflowRowSelectResponse | null
  ) => void;
}

export interface WorkFlowRowSelectState extends WorkFlowRowSelectRequest {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  workFlowDoFlowResponse: WorkFlowDoFlowResponse; // for doFlow
  setField: (field: string | number | symbol, value: any) => void;
  setWorkFlowRowSelectResponse: (
    workFlowRowSelectResponse: WorkflowRowSelectResponse
  ) => void;
  setWorkFlowDoFlowResponse: (
    workFlowDoFlowResponse: WorkFlowDoFlowResponse
  ) => void; //for doFlow
}
