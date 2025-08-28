import { WorkTable } from './workflow.d';
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

export interface WorkFlowState extends WorkFlowRequest {
  workFlowResponse: WorkflowResponse;
  setField: (field: string | number | symbol, value: any) => void;
  setWorkFlowResponse: (workFlowResponse: WorkflowResponse) => void;
}

export interface FlowButton {
  id: number;
  name: string;
  webAPIUrl: string;
  imageIndex: number;
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
}

export interface WorkFlowRowSelectState extends WorkFlowRowSelectRequest {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  setField: (field: string | number | symbol, value: any) => void;
  setWorkFlowRowSelectResponse: (
    workFlowRowSelectResponse: WorkflowRowSelectResponse
  ) => void;
}
