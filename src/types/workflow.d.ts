import { Meta, SearchItem } from "./general";
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
  workTable: WorkflowResponse;
  workTableRowSelect: WorkflowRowSelectResponse;
}

///api/WFMS/flows?WorkTableId=994047&FormId=0&FlowNo=0&page=1
export interface WorkFlowFlowsRequest {
  workTableIdFlows: number;
  workTableIdFlowsTrigger: number;
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

///api/WFMS/flowMapCodeSearch?systemId=4&page=1&lastId=0
export interface WorkFlowFlowMapCodeSearchRequest {
  systemIdFlowMapCodeSearch: number;
  pageFlowMapCodeSearch: number;
  lastIdFlowMapCodeSearch: number;
  searchFlowMapCodeSearch: string;
}

interface WorkFlowFlowMapCodeSearchResponse {
  meta: Meta;
  data: {
    result: SearchItem[];
    total_count: number;
  };
}
///api/WFMS/formSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
export interface WorkFlowFormSearchRequest {
  systemIdFormSearch: number;
  flowNoIdFormSearch: number;
  pageFormSearch: number;
  lastIdFormSearch: number;
  searchFormSearch: string;
}
interface WorkFlowFormSearchResponse {
  meta: Meta;
  data: {
    result: SearchItem[];
    total_count: number;
  };
}
///api/WFMS/scriptSearch?systemId=4&flowNoId=220200300&kind=-1&page=1&lastId=0
export interface WorkFlowScriptSearchRequest {
  systemIdScriptSearch: number;
  flowNoIdScriptSearch: number;
  kindScriptSearch: number;
  pageScriptSearch: number;
  lastIdScriptSearch: number;
  searchScriptSearch: string;
}

interface WorkFlowScriptSearchResponse {
  meta: Meta;
  data: {
    result: SearchItem[];
    total_count: number;
  };
}

//api/WFMS/webAPISearch?systemId=4&flowNoId=220200300&page=1&lastId=0
export interface WorkFlowWebAPISearchRequest {
  systemIdWebAPISearch: number;
  flowNoIdWebAPISearch: number;
  pageWebAPISearch: number;
  lastIdWebAPISearch: number;
  searchWebAPISearch: string;
}
interface WorkFlowWebAPISearchResponse {
  meta: Meta;
  data: {
    result: SearchItem[];
    total_count: number;
  };
}
///api/WFMS/statusSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
export interface WorkFlowStatusSearchRequest {
  systemIdStatusSearch: number;
  flowNoIdStatusSearch: number;
  pageStatusSearch: number;
  lastIdStatusSearch: number;
  searchStatusSearch: string;
}
interface WorkFlowStatusSearchResponse {
  meta: Meta;
  data: {
    result: SearchItem[];
    total_count: number;
  };
}
///api/WFMS/flowMapsSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
export interface WorkFlowFlowMapsSearchRequest {
  systemIdFlowMapsSearch: number;
  flowNoIdFlowMapsSearch: number;
  flowNoIdTrigger: number;
  pageFlowMapsSearch: number;
  lastIdFlowMapsSearch: number;
  searchFlowMapsSearch: string;
}
interface WorkFlowFlowMapsSearchResponse {
  meta: Meta;
  data: {
    result: SearchItem[];
    total_count: number;
  };
}
//api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
export interface WorkFlowIfOperationFlowMapAddRequest {
  flowMapIdIfOperationFlowMapAdd: number;
  ifOperationFlowMapIdIfOperationFlowMapAdd: number;
}

interface WorkFlowIfOperationFlowMapAddResponse {
  meta: Meta;
  data: {
    result: UpdateResult;
  };
}
//for deleteapi/WFMS/flowMapBeforeAfter/734
export interface WorkFlowFlowMapBeforeAfterDeleteRequest {
  flowMapIdBeforeAfterDelete: number;
  idempotencyKey: string;
}
interface WorkFlowFlowMapBeforeAfterDeleteResponse {
  meta: Meta;
  data: {
    result: UpdateResult;
  };
}
// for delete api/WFMS/flowMap/220200301?systemId=4&idempotencyKey=234343
export interface WorkFlowFlowMapDeleteRequest {
  flowMapIdDelete: number;
  systemIdDelete: number;
  idempotencyKeyDelete: string;
}
interface WorkFlowFlowMapDeleteResponse {
  meta: Meta;
  data: {
    result: UpdateResult;
  };
}
//for load edit data : /api/WFMS/flowMapLoad/205000020
export interface WorkFlowFlowMapLoadResponse {
  meta: Meta;
  data: DataWorkFlowFlowMapLoad;
}
interface DataWorkFlowFlowMapLoad {
  result: FlowMapLoadResult;
}
interface FlowMapLoadResult {
  id: number;
  name: string;
  fChart: number;
  fChartName: string;
  tChart: number;
  tChartName: string;
  codeId: number;
  codeTitle: string;
  code: string;
  formNo1: number;
  form1Title: string;
  formNo2: number;
  form2Title: string;
  scriptId: number;
  scriptTitle: string;
  webAPIId: number;
  webAPITitle: string;
  scriptBeforeId: number;
  scriptBeforeTitle: string;
  scriptValidatorId: number;
  scriptValidatorTitle: string;
  statusId: number;
  statusTitle: string;
  canEditForm: boolean;
  canEditForm1: boolean;
  canEditForm1Dtl1: boolean;
  canEditForm1Dtl2: boolean;
  canEditForm1Dtl3: boolean;
  canEditForm1DtlDel: boolean;
  canEditForm1Mst1: boolean;
  canEditForm1Mst2: boolean;
  canEditForm1Mst3: boolean;
  formAfterClick: number;
  formAfterClickTitle: string;
  idempotencyKey: string;
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
// api/WFMS/flowMapSave
export interface WorkFlowMapSaveResponse {
  meta: Meta;
  data: {
    result: UpdateResult;
  };
}
export interface WorkFlowState
  extends WorkFlowRequest,
    WorkFlowRowSelectRequest,
    WorkFlowFlowsRequest,
    WorkFlowFlowNosSearchRequest,
    WorkFlowFlowMapsRequest,
    WorkFlowFlowMapBeforeAftersRequest,
    // for api/WFMS/flowMapCodeSearch?systemId=4&page=1&lastId=0
    WorkFlowFlowMapCodeSearchRequest,
    // for api/WFMS/formSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    WorkFlowFormSearchRequest,
    // for api/WFMS/scriptSearch?systemId=4&flowNoId=220200300&kind=-1&page=1&lastId=0
    WorkFlowScriptSearchRequest,
    // for api/WFMS/webAPISearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    WorkFlowWebAPISearchRequest,
    // for api/WFMS/statusSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    WorkFlowStatusSearchRequest,
    // for api/WFMS/flowMapsSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
    WorkFlowFlowMapsSearchRequest {
  workFlowResponse: WorkflowResponse;
  setField: (field: string | number | symbol, value: any) => void;
  setWorkFlowResponse: (workFlowResponse: WorkflowResponse) => void;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  workFlowDoFlowResponse: WorkFlowDoFlowResponse; // for doFlow
  workFlowFlowsResponse: WorkFlowFlowsResponse; //api/WFMS/flows?WorkTableId=
  workFlowFlowNosSearchResponse: WorkFlowFlowNosSearchResponse; //api/WFMS/flowNosSearch?systemId=4&page=1&lastId=0
  workFlowFlowMapsResponse: WorkFlowFlowMapsResponse; //api/WFMS/flowMaps?FlowNoId=4030207&SystemId=4
  workFlowFlowMapBeforeAftersResponse: WorkFlowFlowMapBeforeAftersResponse; //api/WFMS/flowMapBeforeAfters?FlowMapId=205000045&SystemId=4
  workFlowFlowMapCodeSearchResponse: WorkFlowFlowMapCodeSearchResponse; //api/WFMS/flowMapCodeSearch?systemId=4&page=1&lastId=0
  workFlowFormSearchResponse: WorkFlowFormSearchResponse; //api/WFMS/formSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  workFlowScriptSearchResponse: WorkFlowScriptSearchResponse; //api/WFMS/scriptSearch?systemId=4&flowNoId=220200300&kind=-1&page=1&lastId=0
  workFlowWebAPISearchResponse: WorkFlowWebAPISearchResponse; //api/WFMS/webAPISearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  workFlowStatusSearchResponse: WorkFlowStatusSearchResponse; //api/WFMS/statusSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  workFlowFlowMapsSearchResponse: WorkFlowFlowMapsSearchResponse; //api/WFMS/flowMapsSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  workFlowIfOperationFlowMapAddResponse: WorkFlowIfOperationFlowMapAddResponse; //api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
  workFlowFlowMapBeforeAfterDeleteResponse: WorkFlowFlowMapBeforeAfterDeleteResponse; //api/WFMS/flowMapBeforeAfter/734
  workFlowFlowMapDeleteResponse: WorkFlowFlowMapDeleteResponse; //api/WFMS/flowMap/220200301?systemId=4&idempotencyKey=234343
  idFlowMapLoad: number; // for load edit data : /api/WFMS/flowMapLoad/205000020
  idFlowMapLoadTrigger:number;
  workFlowFlowMapLoadResponse: WorkFlowFlowMapLoadResponse; //for load edit data : /api/WFMS/flowMapLoad/205000020
  workFlowMapSaveResponse: WorkFlowMapSaveResponse; //api/WFMS/flowMapSave
  setWorkFlowScriptSearchResponse: (
    workFlowScriptSearchResponse: WorkFlowScriptSearchResponse
  ) => void; //api/WFMS/scriptSearch?systemId=4&flowNoId=220200300&kind=-1&page=1&lastId=0
  setWorkFlowFormSearchResponse: (
    workFlowFormSearchResponse: WorkFlowFormSearchResponse
  ) => void; //api/WFMS/formSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  setWorkFlowFlowMapCodeSearchResponse: (
    workFlowFlowMapCodeSearchResponse: WorkFlowFlowMapCodeSearchResponse
  ) => void; //api/WFMS/flowMapCodeSearch?systemId=4&page=1&lastId=0
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
  setWorkFlowWebAPISearchResponse: (
    workFlowWebAPISearchResponse: WorkFlowWebAPISearchResponse
  ) => void; //api/WFMS/webAPISearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  setWorkFlowStatusSearchResponse: (
    workFlowStatusSearchResponse: WorkFlowStatusSearchResponse
  ) => void; //api/WFMS/statusSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  setWorkFlowFlowMapsSearchResponse: (
    workFlowFlowMapsSearchResponse: WorkFlowFlowMapsSearchResponse
  ) => void; //api/WFMS/flowMapsSearch?systemId=4&flowNoId=220200300&page=1&lastId=0
  setWorkFlowIfOperationFlowMapAddResponse: (
    workFlowIfOperationFlowMapAddResponse: WorkFlowIfOperationFlowMapAddResponse
  ) => void; //api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
  setWorkFlowFlowMapBeforeAfterDeleteResponse: (
    workFlowFlowMapBeforeAfterDeleteResponse: WorkFlowFlowMapBeforeAfterDeleteResponse
  ) => void; //api/WFMS/flowMapBeforeAfter/734
  setWorkFlowFlowMapDeleteResponse: (
    workFlowFlowMapDeleteResponse: WorkFlowFlowMapDeleteResponse
  ) => void; //api/WFMS/flowMap/220200301?systemId=4&idempotencyKey=234343
  setWorkFlowFlowMapLoadResponse: (
    workFlowFlowMapLoadResponse: WorkFlowFlowMapLoadResponse
  ) => void; //for load edit data : /api/WFMS/flowMapLoad/205000020
  setWorkFlowMapSaveResponse: (
    workFlowMapSaveResponse: WorkFlowMapSaveResponse
  ) => void; //api/WFMS/flowMapSave
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
