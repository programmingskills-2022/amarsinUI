import { useEffect } from "react";
import { useGeneralContext } from "../../context/GeneralContext";
import { useWorkflowRowSelectStore } from "../../store/workflowStore";
import { useWorkflowStore } from "../../store/workflowStore";
import { useWorkflowRowSelect } from "../../hooks/useWorkflow";
import WorkflowRowSelect from "./WorkflowRowSelect";
import WorkflowComponent from "./WorkflowComponent";
import { WorkflowResponse } from "../../types/workflow";

type Props = {
  selectedId: number;
  workFlowResponse: WorkflowResponse;
};

export const WorkflowChild = ({
  selectedId,
  workFlowResponse,
}: Props) => {
  //const [currentSelectedId, setCurrentSelectedId] = useState(selectedId);
  const { chartId, systemId } = useGeneralContext();
  const { setField } = useWorkflowRowSelectStore();
  const { page, pageSize, dateTime, code, cost, flowMapId, name, dsc } =
    useWorkflowStore();
  const { workFlowRowSelectResponse, isLoading, error } =
    useWorkflowRowSelect();

  useEffect(() => {
    setField("chartId", chartId);
  
    // Set workTableId based on priority:
    // 1. If selectedId is provided and valid, use it
    // 2. If workflow parameters changed and no valid selection, use first record
    // 3. If no data available, use 0
    if (selectedId !== 0) {
      //console.log(selectedId,"selectedId in child")
      setField("workTableId", selectedId);
    } else if ( workFlowResponse.workTables.length > 0) {
      setField("workTableId", workFlowResponse.workTables[0].id);
    } else if (workFlowResponse.workTables.length === 0) {
      setField("workTableId", 0);
    }

  }, [
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
  ]);

  return (
    <>
      {workFlowResponse.err === 0 && workFlowResponse.workTables.length > 0 && (
        <WorkflowRowSelect
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          isLoading={isLoading}
          error={error}
        />
      )}
      <WorkflowComponent
        workFlowRowSelectResponse={workFlowRowSelectResponse}
      />
    </>
  );
};
