import { DefaultOptionType } from "./general";

//api/Definition/chartSearch?search=%DB%8C&systemId=4&page=1&lastId=0
export interface ChartSearchRequest {
  searchChartSearch: string;
  systemIdChartSearch: number;
  pageChartSearch: number;
  lastIdChartSearch: number;
}

export interface ChartSearchResponse {
  meta: Meta;
  data: {
    result: SearchItem[];
    total_count: number;
  };
}

export interface DefinitionState extends ChartSearchRequest {
  chartSearchResponse: ChartSearchResponse;
  setField: (field: string | number | symbol, value: any) => void;
  setChartSearchResponse: (chartSearchResponse: ChartSearchResponse) => void;
}
