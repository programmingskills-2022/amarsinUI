//کارشناس خرید -> ثبت شمارش
import { WorkflowRowSelectResponse } from "../../../types/workflow";
import { useInventoryStore } from "../../../store/inventoryStore";
import { useInventory } from "../../../hooks/useInventory";
import { useEffect, useState } from "react";
import InventoryDetailShowHeader from "./InventoryDetailShowHeader";
import ModalMessage from "../../layout/ModalMessage";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

const InventoryDetailShow = ({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const { setField,id } = useInventoryStore();
  const {
    inventoryDetailResponse,
    inventoryUpdateIssue,
    inventoryUpdateCost,
    isLoadingInventoryUpdateCost,
    isLoadingInventoryUpdateIssue,
    inventoryUpdateIssueResponse,
    inventoryUpdateCostResponse,
    refetchInventoryDetail,
    inventoryProductFlowResponse,
    isLoadingInventoryProductFlow,
  } = useInventory();

  const [isModalOpenCost, setIsModalOpenCost] = useState(false);
  const [isModalOpenIssue, setIsModalOpenIssue] = useState(false);
  /////////////////////////////////////////////////////////////////
  if (id!==workFlowRowSelectResponse.workTableRow.formId)
  {
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }
  /*useEffect(() => {
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }, [workFlowRowSelectResponse.workTableRow.formId]);*/

  /////////////////////////////////////////////////////////////////
  //refetch inventoryDetailResponse if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchInventoryDetail();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  /////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpenCost || isModalOpenIssue) {
      timeoutId = setTimeout(() => {
        setIsModalOpenCost(false);
        setIsModalOpenIssue(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpenCost, isModalOpenIssue]);

  return (
    <div>
      <InventoryDetailShowHeader
        inventoryDetailShowResponse={inventoryDetailResponse}
        inventoryUpdateIssue={inventoryUpdateIssue}
        inventoryUpdateCost={inventoryUpdateCost}
        setIsModalOpenCost={setIsModalOpenCost}
        setIsModalOpenIssue={setIsModalOpenIssue}
        inventoryProductFlowResponse={inventoryProductFlowResponse}
        isLoading={isLoadingInventoryProductFlow}
      />
      {!isLoadingInventoryUpdateIssue && (
        <ModalMessage
          isOpen={isModalOpenIssue}
          backgroundColor={
            inventoryUpdateIssueResponse.meta.errorCode <= 0
              ? "bg-green-200"
              : "bg-red-200"
          }
          bgColorButton={
            inventoryUpdateIssueResponse.meta.errorCode <= 0
              ? "bg-green-500"
              : "bg-red-500"
          }
          bgColorButtonHover={
            inventoryUpdateIssueResponse.meta.errorCode <= 0
              ? "bg-green-600"
              : "bg-red-600"
          }
          color="text-white"
          onClose={() => setIsModalOpenIssue(false)}
          message={inventoryUpdateIssueResponse.meta.message ?? ""}
          visibleButton={false}
        />
      )}
      {!isLoadingInventoryUpdateCost && (
        <ModalMessage
          isOpen={isModalOpenCost}
          backgroundColor={
            inventoryUpdateCostResponse.meta.errorCode <= 0
              ? "bg-green-200"
              : "bg-red-200"
          }
          bgColorButton={
            inventoryUpdateCostResponse.meta.errorCode <= 0
              ? "bg-green-500"
              : "bg-red-500"
          }
          bgColorButtonHover={
            inventoryUpdateCostResponse.meta.errorCode <= 0
              ? "bg-green-600"
              : "bg-red-600"
          }
          color="text-white"
          onClose={() => setIsModalOpenCost(false)}
          message={inventoryUpdateCostResponse.meta.message ?? ""}
          visibleButton={false}
        />
      )}
    </div>
  );
};

export default InventoryDetailShow;
