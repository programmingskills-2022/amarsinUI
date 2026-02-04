import PageTitle from "../../components/layout/PageTitle";
import Add32 from "../../assets/images/GrayThem/add32.png";
import FormFlow24 from "../../assets/images/GrayThem/FormFlow24.png";
import SentForm24 from "../../assets/images/GrayThem/SentForm24.png";
import Refresh32 from "../../assets/images/GrayThem/rfrsh32.png";
//import { useWorkflow } from "../hooks/useWorkflow";
import WorkflowForm from "../../components/workflow/WorkflowForm";
import { useWorkflow } from "../../hooks/useWorkflow";
import { useEffect, useState } from "react";
import {
  DefinitionDateTime,
  DefinitionInvironment,
} from "../../types/definitionInvironment";
import ModalForm from "../../components/layout/ModalForm";
import WorkFlowFlows from "../../components/workflow/WorkFlowFlows";
import { useWorkflowStore } from "../../store/workflowStore";
import { WorkflowResponse } from "../../types/workflow";

type Props = {
  definitionInvironment: DefinitionInvironment;
  definitionDateTime: DefinitionDateTime;
};

export default function Workflow({
  definitionInvironment,
  definitionDateTime,
}: Props) {
  const {
    workFlowResponse:workFlowResponseFromHook,
    error,
    isLoading,
    isLoadingRowSelect,
    workFlowRowSelectResponse,//:workFlowRowSelectResponseFromHook,
    errorRowSelect,
    doFlow,
    workFlowDoFlowResponse,
    isLoadingdoFlow,
    refetchWorkTable,
    refetchWorkTableRowSelect,
    isRefetchingWorkTable,
    isRefetchingWorkTableRowSelect,
    workFlowFlowsResponse,
    isLoadingWorkFlowFlows,
    refetchWorkFlowFlows,
    isRefetchingWorkFlowFlows,
  } = useWorkflow();
  const { setField: setWorkTableField , workTableId} = useWorkflowStore();
  //const { systemId } = useGeneralContext();

  const [refetchSwitch, setRefetchSwitch] = useState(false);
  const [flowClicked, setFlowClicked] = useState(false);
  const [workFlowResponse,setWorkFlowResponse] = useState<WorkflowResponse>(workFlowResponseFromHook);
  //const [workFlowRowSelectResponse,setWorkFlowRowSelectResponse] = useState<WorkflowRowSelectResponse>(workFlowRowSelectResponseFromHook);
  //const { definitionInvironment } = useDefinitionInvironment();

  useEffect(() => {
    setWorkFlowResponse(workFlowResponseFromHook);
  }, [workFlowResponseFromHook]);

  /*useEffect(() => {
    setWorkFlowRowSelectResponse(workFlowRowSelectResponseFromHook);
  }, [workFlowRowSelectResponseFromHook]);*/

  const refetchWorkTables = () => {
    refetchWorkTable();
    refetchWorkTableRowSelect();
    setRefetchSwitch(true);
  };

  const handleFlowClick = () => {
    //for api/WFMS/flows?WorkTableId=
    setWorkTableField("workTableIdFlows", workTableId);
    setWorkTableField("workTableIdFlowsTrigger", Date.now());
    setFlowClicked(true);
  };
  return (
    <div className="h-[calc(100vh-72px)] overflow-y-scroll flex flex-col bg-gray-200 pt-2">
      {/* Top blue header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-2">
        <PageTitle definitionInvironment={definitionInvironment} />
        <div className="flex px-4 items-center gap-2">
          <div className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1">
            <img src={Add32} alt="Add32" className="w-6 h-6" />
            <p className="text-xs">جدید</p>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1">
            <img src={SentForm24} alt="SentForm24" className="w-6 h-6" />
            <p className="text-xs">ارسال شده ها</p>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
            onClick={handleFlowClick}
          >
            <img src={FormFlow24} alt="FormFlow24" className="w-6 h-6" />
            <p className="text-xs">گردش</p>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer hover:font-bold hover:bg-gray-300 rounded-md p-1"
            onClick={refetchWorkTables}
          >
            {/*onClick={()=>getWorkTable()}>*/}
            <img src={Refresh32} alt="Refresh32" className="w-6 h-6" />
            <p className="text-xs">بازخوانی</p>
          </div>
        </div>
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-2">
        <WorkflowForm
          workFlowResponse={workFlowResponse}
          error={error}
          isLoading={isLoading}
          isLoadingRowSelect={isLoadingRowSelect}
          workFlowRowSelectResponse={workFlowRowSelectResponse}
          errorRowSelect={errorRowSelect}
          doFlow={doFlow}
          isLoadingdoFlow={isLoadingdoFlow}
          //refetchWorkTable={refetchWorkTable}
          //refetchWorkTableRowSelect={refetchWorkTableRowSelect}
          isRefetchingWorkTable={isRefetchingWorkTable}
          isRefetchingWorkTableRowSelect={isRefetchingWorkTableRowSelect}
          refetchSwitch={refetchSwitch}
          setRefetchSwitch={setRefetchSwitch}
          workFlowDoFlowResponse={workFlowDoFlowResponse}
          definitionInvironment={definitionInvironment}
          definitionDateTime={definitionDateTime}
          setWorkFlowResponse={setWorkFlowResponse} // for updating workFlowResponse in WorkflowRowSelectHeader.tsx
          //setWorkFlowRowSelectResponse={setWorkFlowRowSelectResponse} // for updating worktableRowSelect in WorkflowRowSelectHeader.tsx
        />
        {/*open WorkFlowFlows if flowClicked is true*/}
        <ModalForm
          isOpen={flowClicked}
          onClose={() => setFlowClicked(false)}
          title="گردش"
          width="1"
        >
          <WorkFlowFlows
            workFlowFlowsResponse={workFlowFlowsResponse}
            isLoadingWorkFlowFlows={isLoadingWorkFlowFlows || isRefetchingWorkFlowFlows}
            refetchWorkFlowFlows={refetchWorkFlowFlows}
          />
        </ModalForm>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
