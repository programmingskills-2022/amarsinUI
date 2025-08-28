type DefinitionInvironment = {
  years: Year[];
  systems: System[];
  charts: Chart[];
  yearId: number;
  systemId: number;
  chartId: number;
  curDate: string;
  curYear: number;
  curMonth: number;
  curDay: number;
  curTime: string;
  curMYear: number;
  curMMonth: number;
  curMDay: number;
};

interface Year {
  id: number;
  code: string;
}

interface System {
  id: number;
  title: string;
}

interface Chart {
  id: number;
  name: string;
}

interface DefinitionDateTime {
  date: string;
  time: string;
}

export interface DefinitionInvironmentState {
  definitionDateTime: DefinitionDateTime;
  definitionInvironment: DefinitionInvironment;
  setDefinitionInvironment: (definitionInvironment: DefinitionInvironment) => void;
  setDefinitionDateTime: (definitionDateTime: DefinitionDateTime) => void;
}
