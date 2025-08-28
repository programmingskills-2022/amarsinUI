import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axios";
import { useDefinitionInvironmentStore } from "../store/definitionInvironmentStore";
import {
  DefinitionDateTime,
  DefinitionInvironment,
} from "../types/definitionInvironment";

export function useDefinitionInvironment() {
  const { setDefinitionInvironment, setDefinitionDateTime } =
    useDefinitionInvironmentStore();

  const query = useQuery<
    DefinitionInvironment,
    Error,
    DefinitionInvironment,
    unknown[]
  >({
    queryKey: ["definitionInvironment"],
    queryFn: async () => {
      const response = await api.get(`/api/Definition/Environment`);
      return response.data;
    },

    refetchOnWindowFocus: true, // Refetch data when the window is focused
    refetchOnReconnect: true, // Refetch data when the network reconnects
    onSuccess: (data: DefinitionInvironment) => {
      setDefinitionInvironment(data);
    },
  } as UseQueryOptions<DefinitionInvironment, Error, DefinitionInvironment, unknown[]>);

  //http://apitest.dotis.ir/api/Definition/DateTime
  const queryDateTime = useQuery<
    DefinitionDateTime,
    Error,
    DefinitionDateTime,
    unknown[]
  >({
    queryKey: ["definitionDateTime"],
    queryFn: async () => {
      const response = await api.get(`/api/Definition/DateTime`);
      return response.data;
    },
    refetchOnWindowFocus: true, // Refetch data when the window is focused
    refetchOnReconnect: true, // Refetch data when the network reconnects
    onSuccess: (data: DefinitionDateTime) => {
      setDefinitionDateTime(data);
    },
  } as UseQueryOptions<DefinitionDateTime, Error, DefinitionDateTime, unknown[]>);

  return {
    //getDefinitionInvironment: () => query.refetch(), // Optional manual trigger
    isLoading: query.isLoading,
    error: query.error,
    definitionInvironment: query.data ?? {
      years: [],
      systems: [],
      charts: [],
      yearId: 0,
      systemId: 0,
      chartId: 0,
      curDate: "",
      curYear: 0,
      curMonth: 0,
      curDay: 0,
      curTime: "",
      curMYear: 0,
      curMMonth: 0,
      curMDay: 0,
    },
    definitionDateTime: queryDateTime.data ?? { date: "", time: "" },
  };
}
