import { create } from "zustand";
import { ChartSearchResponse, DefinitionState } from "../types/definition";

export const useDefinitionStore = create<DefinitionState>()((set) => ({
    //api/Definition/chartSearch?search=%DB%8C&systemId=4&page=1&lastId=0
    searchChartSearch: "",
    systemIdChartSearch: -1,
    pageChartSearch: 1,
    lastIdChartSearch: 0,
    chartSearchResponse: {
        meta: { errorCode: 0, message: null, type: "" },
        data: { result: [], total_count: 0 }
    },
    setField: (field: string | number | symbol, value: any) => set({ [field]: value }),
    setChartSearchResponse: (chartSearchResponse: ChartSearchResponse) => set({ chartSearchResponse }),
}));
