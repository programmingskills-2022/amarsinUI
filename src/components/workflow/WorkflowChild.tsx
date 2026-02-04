import { useEffect } from "react";
import { useGeneralContext } from "../../context/GeneralContext";
import { useWorkflowStore } from "../../store/workflowStore";
import WorkflowRowSelect from "./WorkflowRowSelect";
import WorkflowComponent from "./WorkflowComponent";
import {
  WorkFlowDoFlowRequest,
  WorkFlowDoFlowResponse,
  WorkflowResponse,
  WorkflowRowSelectResponse,
} from "../../types/workflow";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import {
  DefinitionDateTime,
  DefinitionInvironment,
} from "../../types/definitionInvironment";
import { SearchItem } from "../../types/general";

type Props = {
  isLoading: boolean;
  selectedId: number;
  //setSelectedId: React.Dispatch<React.SetStateAction<number>>;
  workFlowResponse: WorkflowResponse;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  isLoadingRowSelect: boolean;
  errorRowSelect: Error | null;
  doFlow: UseMutateAsyncFunction<any, Error, WorkFlowDoFlowRequest, unknown>;
  workFlowDoFlowResponse: WorkFlowDoFlowResponse;
  isLoadingdoFlow: boolean;
  //refetchWorkTable: () => void;
  //refetchWorkTableRowSelect: () => void;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  definitionInvironment: DefinitionInvironment;
  definitionDateTime: DefinitionDateTime;
  isLoadingBanks: boolean;
  banks: SearchItem[];
  cashPosSystemSearch: SearchItem[];
  setWorkFlowResponse: React.Dispatch<React.SetStateAction<WorkflowResponse>>;
  //setWorkFlowRowSelectResponse: React.Dispatch<React.SetStateAction<WorkflowRowSelectResponse>>;
};

export const WorkflowChild = ({
  isLoading,
  selectedId,
  //setSelectedId,
  workFlowResponse,
  workFlowRowSelectResponse,
  isLoadingRowSelect,
  errorRowSelect,
  doFlow,
  workFlowDoFlowResponse,
  isLoadingdoFlow,
  //refetchWorkTable,
  //refetchWorkTableRowSelect,
  refetchSwitch,
  setRefetchSwitch,
  definitionInvironment,
  definitionDateTime,
  isLoadingBanks,
  banks,
  cashPosSystemSearch,
  setWorkFlowResponse,
}: //setWorkFlowRowSelectResponse, // for updating worktableRowSelect in WorkflowRowSelectHeader.tsx
Props) => {
  //const [currentSelectedId, setCurrentSelectedId] = useState(selectedId);
  const { chartId, systemId } = useGeneralContext();
  const { setField } = useWorkflowStore();
  const {
    page,
    pageSize,
    dateTime,
    code,
    cost,
    flowMapId,
    name,
    dsc,
    workTableId,
  } = useWorkflowStore();

  useEffect(() => {
    console.log(isLoading, "isLoading in child");
    setField("workTableId", -1);
  }, []);

  useEffect(() => {
    setField("chartId", chartId);
    // Set workTableId based on priority:
    // 1. If selectedId is provided and valid, use it
    // 2. If workflow parameters changed and no valid selection, use first record
    // 3. If no data available, use 0
    console.log(
      selectedId,
      chartId,
      systemId,
      page,
      pageSize,
      dateTime,
      code,
      cost,
      flowMapId,
      name,
      dsc,
      "selectedId in child"
    );
    if (selectedId === workTableId) {
      console.log("enter 0", "workTableId", selectedId);
      return;
    }
    if (selectedId !== 0) {
      setField("workTableId", selectedId);
      console.log("enter 1", "workTableId", selectedId);
    } else if (workFlowResponse?.workTables?.length > 0) {
      setField("workTableId", workFlowResponse.workTables[0].id);
      console.log("enter 2", "workTableId", workFlowResponse.workTables[0].id);
    } else if (workFlowResponse?.workTables?.length === 0) {
      setField("workTableId", -1);
      console.log("enter 3", "workTableId", -1);
    }
  }, [
    //selectedId,
    chartId,
    systemId,
    page,
    pageSize,
    dateTime,
    code,
    cost,
    flowMapId,
    name,
    dsc,
    //isLoading,
  ]);

  return (
    <>
      {workFlowResponse?.workTables &&
        workFlowResponse?.err === 0 &&
        workFlowResponse.workTables.length > 0 && (
          <WorkflowRowSelect
            workFlowRowSelectResponse={workFlowRowSelectResponse}
            doFlow={doFlow}
            workFlowDoFlowResponse={workFlowDoFlowResponse}
            isLoadingdoFlow={isLoadingdoFlow}
            isLoading={isLoadingRowSelect}
            error={errorRowSelect}
            definitionInvironment={definitionInvironment}
            definitionDateTime={definitionDateTime}
            isLoadingBanks={isLoadingBanks}
            banks={banks}
            cashPosSystemSearch={cashPosSystemSearch}
            setWorkFlowResponse={setWorkFlowResponse}
          />
        )}
      {workFlowResponse?.workTables &&
        workFlowResponse.workTables.length > 0 && (
          <WorkflowComponent
            doFlow={doFlow}
            workFlowRowSelectResponse={workFlowRowSelectResponse}
            refetchSwitch={refetchSwitch}
            setRefetchSwitch={setRefetchSwitch}
            definitionInvironment={definitionInvironment}
            definitionDateTime={definitionDateTime}
            isLoadingBanks={isLoadingBanks}
            banks={banks}
            cashPosSystemSearch={cashPosSystemSearch}
            setWorkFlowResponse={setWorkFlowResponse}
          />
        )}
    </>
  );
};
