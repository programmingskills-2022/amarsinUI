import WorkflowRowSelectHeader from "./WorkflowRowSelectHeader";
import { Skeleton } from "@mui/material";
import {
  WorkFlowDoFlowRequest,
  WorkFlowDoFlowResponse,
  WorkflowResponse,
  WorkflowRowSelectResponse,
} from "../../types/workflow";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { SearchItem } from "../../types/general";
import { DefinitionDateTime, DefinitionInvironment } from "../../types/definitionInvironment";
import { useState } from "react";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  doFlow: UseMutateAsyncFunction<any, Error, WorkFlowDoFlowRequest, unknown>;
  workFlowDoFlowResponse: WorkFlowDoFlowResponse;
  isLoadingdoFlow:boolean;
  isLoading: boolean;
  error: Error | null;
  //refetchWorkTable: () => void;
  //refetchWorkTableRowSelect:() => void;
  //selectedId: number;
  //setSelectedId: React.Dispatch<React.SetStateAction<number>>
  definitionInvironment:DefinitionInvironment;
  definitionDateTime: DefinitionDateTime ;
  isLoadingBanks:boolean;
  banks: SearchItem[]
  cashPosSystemSearch: SearchItem[];
  setWorkFlowResponse: React.Dispatch<React.SetStateAction<WorkflowResponse>>;
  //setWorkFlowRowSelectResponse: React.Dispatch<React.SetStateAction<WorkflowRowSelectResponse>>;
};

const WorkflowRowSelect = ({
  workFlowRowSelectResponse,
  doFlow,
  workFlowDoFlowResponse,
  isLoadingdoFlow,
  isLoading,
  error,
  //refetchWorkTable,
  //refetchWorkTableRowSelect,
  //selectedId,
  //setSelectedId,
  definitionInvironment,
  definitionDateTime,
  isLoadingBanks,
  banks,
  cashPosSystemSearch,
  setWorkFlowResponse,
  //setWorkFlowRowSelectResponse,
}: Props) => {
  const [showPathMessage, setShowPathMessage] = useState(false);
  if (error) return <div>Error: {error.message} </div>;
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : workFlowRowSelectResponse.err !== 0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {workFlowRowSelectResponse.msg}
        </p>
      ) : (
        <div className="w-full mt-2">
          <WorkflowRowSelectHeader
            workFlowRowSelectResponse={workFlowRowSelectResponse}
            workFlowDoFlowResponse={workFlowDoFlowResponse}
            doFlow={doFlow}
            isLoadingdoFlow={isLoadingdoFlow}
            //refetchWorkTable={refetchWorkTable}
            //refetchWorkTableRowSelect={refetchWorkTableRowSelect}
            //selectedId={selectedId}
            //setSelectedId={setSelectedId}
            definitionInvironment={definitionInvironment}
            definitionDateTime={definitionDateTime}
            isLoadingBanks={isLoadingBanks}
            banks={banks}
            cashPosSystemSearch={cashPosSystemSearch}
            showPathMessage={showPathMessage}
            setShowPathMessage={setShowPathMessage}
            setWorkFlowResponse={setWorkFlowResponse}
            //setWorkFlowRowSelectResponse={setWorkFlowRowSelectResponse} // for updating worktableRowSelect in WorkflowRowSelectHeader.tsx
          />
        </div>
      )}
    </div>
  );
};

export default WorkflowRowSelect;
