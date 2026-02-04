import { useState } from "react";
import { useGeneralContext } from "../../../../context/GeneralContext";
import { useWorkflowStore } from "../../../../store/workflowStore";
import { DefaultOptionType } from "../../../../types/general";
import {
  WorkFlowFlowMapsSearchResponse,
  WorkFlowIfOperationFlowMapAddRequest,
} from "../../../../types/workflow";
import AutoCompleteSearch from "../../../controls/AutoCompleteSearch";
import ConfirmCancel from "../../../controls/ConfirmCancel";

type Props = {
  setIsOpenAdd: (isOpen: boolean) => void;
  flowMapId: number;
  processTitle: DefaultOptionType | null;
  workFlowFlowMapsSearchResponse: WorkFlowFlowMapsSearchResponse;
  workFlowIfOperationFlowMapAdd: (
    request: WorkFlowIfOperationFlowMapAddRequest
  ) => void; //for api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
  isPrev: boolean;
};

const WorkflowMapBeforeAfterAdd = ({
  setIsOpenAdd,
  flowMapId,
  processTitle,
  workFlowFlowMapsSearchResponse,
  workFlowIfOperationFlowMapAdd,
  isPrev,
}: Props) => {
  const { setField } = useWorkflowStore();
  const { systemId } = useGeneralContext();
  const [isProcessTitleEntered, setIsProcessTitleEntered] = useState(false);
  const [process, setProcess] = useState<DefaultOptionType | null>(null);
  //for api/WFMS/ifOperationFlowMapAdd?flowMapId=205000045&ifOperationFlowMapId=205000043
  const handleConfirm = () => {
    let request: WorkFlowIfOperationFlowMapAddRequest;
    if (isPrev) {
      request = {
        flowMapIdIfOperationFlowMapAdd: flowMapId,
        ifOperationFlowMapIdIfOperationFlowMapAdd: process?.id ?? 0,
      };
    } else {
      request = {
        flowMapIdIfOperationFlowMapAdd: process?.id ?? 0,
        ifOperationFlowMapIdIfOperationFlowMapAdd: flowMapId,
      };
    }
    console.log(request);
    workFlowIfOperationFlowMapAdd(request);
    setIsOpenAdd(false);
  };
  return (
    <div className="flex flex-col gap-2">
      <AutoCompleteSearch
        label="عنوان فرایند"
        setField={setField}
        fieldValues={[
          { field: "systemIdFlowMapsSearch", value: systemId },
          { field: "pageFlowMapsSearch", value: 1 },
          { field: "lastIdFlowMapsSearch", value: 0 },
          { field: "flowNoIdFlowMapsSearch", value: processTitle?.id ?? 0 },
          { field: "flowNoIdTrigger", value: Date.now() },
        ]}
        fieldSearch="searchFlowMapsSearch"
        selectedOption={process as DefaultOptionType}
        setSelectedOption={(process) =>
          setProcess(process as DefaultOptionType)
        }
        options={workFlowFlowMapsSearchResponse.data.result} //just search items for process title
        isEntered={isProcessTitleEntered}
        setIsEntered={setIsProcessTitleEntered}
      />
      <ConfirmCancel
        onConfirm={handleConfirm}
        onCancel={() => setIsOpenAdd(false)}
      />
    </div>
  );
};

export default WorkflowMapBeforeAfterAdd;
