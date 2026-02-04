import { useState } from "react";
import WorkflowParent from "./WorkflowParent";
import { WorkflowChild } from "./WorkflowChild";
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
import { useBanks } from "../../hooks/useBanks";
import { useCheques } from "../../hooks/useCheques";
import { useWorkflowStore } from "../../store/workflowStore";
import { useChequeStore } from "../../store/chequeStore";

type Props = {
  workFlowResponse: WorkflowResponse;
  error: Error | null;
  isLoading: boolean;
  isLoadingRowSelect: boolean;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  errorRowSelect: Error | null;
  doFlow: UseMutateAsyncFunction<any, Error, WorkFlowDoFlowRequest, unknown>;
  workFlowDoFlowResponse: WorkFlowDoFlowResponse;
  isLoadingdoFlow: boolean;
  //refetchWorkTable: (options?: RefetchOptions) => Promise<QueryObserverResult<WorkflowResponse, Error>>
  //refetchWorkTableRowSelect: () => void;
  isRefetchingWorkTable: boolean;
  isRefetchingWorkTableRowSelect: boolean;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  definitionInvironment: DefinitionInvironment;
  definitionDateTime: DefinitionDateTime;
  setWorkFlowResponse: React.Dispatch<React.SetStateAction<WorkflowResponse>>;
  //setWorkFlowRowSelectResponse: React.Dispatch<React.SetStateAction<WorkflowRowSelectResponse>>;
};

const WorkflowForm = ({
  workFlowResponse,
  error,
  isLoading,
  isLoadingRowSelect,
  workFlowRowSelectResponse,
  errorRowSelect,
  doFlow,
  workFlowDoFlowResponse,
  isLoadingdoFlow,
  //refetchWorkTable,
  //refetchWorkTableRowSelect,
  isRefetchingWorkTable,
  isRefetchingWorkTableRowSelect,
  refetchSwitch,
  setRefetchSwitch,
  definitionInvironment,
  definitionDateTime,
  setWorkFlowResponse,
  //setWorkFlowRowSelectResponse,
}: Props) => {
  const [selectedId, setSelectedId] = useState<number>(-1);
  const { banks, isLoading: isLoadingBanks } = useBanks();
  const { cashPosSystemSearch } = useCheques();
  const { setField: setChequeField } = useChequeStore();
  const [data, setData] = useState<any[]>([]); // data for WorkflowParent
  const { setField } = useWorkflowStore();
  
  const handleSelectedIdChange = (id: number) => {
    if (id!==0 && id!==-1 ) {
      console.log(id, "id in WorkflowForm when clicked on each row");
      setField("workTableId", id);
      setField("workTableIdTrigger", Date.now());
    }
    setSelectedId(id);
    setChequeField("sayadiPaymentId", -1);
    setChequeField("paymentIdAccept", -1);
  };

  return (
    <div className="w-full h-full">
      <WorkflowParent
        selectedId={selectedId}
        setSelectedId={handleSelectedIdChange}
        data={data}
        setData={setData}
        workFlowResponse={workFlowResponse}
        error={error}
        isLoading={isLoading}
        isRefetchingWorkTable={isRefetchingWorkTable}
        isRefetchingWorkTableRowSelect={isRefetchingWorkTableRowSelect}
      />
      <WorkflowChild
        selectedId={selectedId} //{selectedIdRef.current}
        //setSelectedId={setSelectedId}
        workFlowResponse={workFlowResponse}
        workFlowRowSelectResponse={workFlowRowSelectResponse}
        isLoading={isLoading} // for parent table loading
        isLoadingRowSelect={isLoadingRowSelect} // for child table loading
        errorRowSelect={errorRowSelect}
        doFlow={doFlow}
        workFlowDoFlowResponse={workFlowDoFlowResponse}
        isLoadingdoFlow={isLoadingdoFlow}
        //refetchWorkTable={refetchWorkTable}
        //refetchWorkTableRowSelect={refetchWorkTableRowSelect}
        refetchSwitch={refetchSwitch}
        setRefetchSwitch={setRefetchSwitch}
        definitionInvironment={definitionInvironment}
        definitionDateTime={definitionDateTime}
        isLoadingBanks={isLoadingBanks}
        banks={banks}
        cashPosSystemSearch={cashPosSystemSearch}
        setWorkFlowResponse={setWorkFlowResponse}
        //setWorkFlowRowSelectResponse={setWorkFlowRowSelectResponse} // for updating worktableRowSelect in WorkflowRowSelectHeader.tsx
      />
    </div>
  );
};

export default WorkflowForm;
