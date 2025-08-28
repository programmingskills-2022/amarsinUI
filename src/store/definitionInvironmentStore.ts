import { create } from "zustand";
import { DefinitionDateTime, DefinitionInvironment, DefinitionInvironmentState } from "../types/definitionInvironment";

export const useDefinitionInvironmentStore = create<DefinitionInvironmentState>()((set) => ({
  definitionInvironment: {
    years: [],
    systems: [],
    charts: [],
    yearId: 0,
    systemId: 0,
    chartId: 0,
    curDate: '',
    curYear: 0,
    curMonth: 0,
    curDay: 0,
    curTime: '',
    curMYear: 0,
    curMMonth: 0,
    curMDay: 0
  },
  //http://apitest.dotis.ir/api/Definition/DateTime
  definitionDateTime: {
    date: '',
    time: ''
  },
  setDefinitionInvironment: (definitionInvironment: DefinitionInvironment) => set({ definitionInvironment }),
  setDefinitionDateTime: (definitionDateTime: DefinitionDateTime) => set({ definitionDateTime: definitionDateTime }),
}));
