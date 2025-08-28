import { create } from "zustand";
import { WorkFlowRowSelectState, WorkFlowState } from "../types/workflow";
import { WorkTable } from "../types/workflow";

export const useWorkflowStore = create<WorkFlowState>()((set) => ({
  chartId:0,
  systemId: 0,
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
  setField: (field: string | number | symbol, value: any) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
  setWorkFlowResponse: (workFlowResponse) => set({ workFlowResponse }),
}));

export const useWorkflowRowSelectStore = create<WorkFlowRowSelectState>()(
  (set) => ({
    chartId: 0,
    workTableId: 0,
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
        form1Title: '',
        form1ViewPath: '',
        canEditForm1: false,
        canEditForm1Mst1: false,
        canEditForm1Mst2: false,
        canEditForm1Mst3: false,
        canEditForm1DtlDel: false,
        canEditForm1Dtl1: false,
        canEditForm1Dtl2: false,
        canEditForm1Dtl3: false,
        form2Title: '',
        form2ViewPath: '',
        canEditForm2: false
      },
      flowDescriptions: [],
    },
    setField: (field: string | number | symbol, value: any) =>
      set((state) => ({
        ...state,
        [field]: value,
      })),
    setWorkFlowRowSelectResponse: (workFlowRowSelectResponse) => set({ workFlowRowSelectResponse }),
  })
);
