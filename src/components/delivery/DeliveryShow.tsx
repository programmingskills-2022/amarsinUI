// تیتک -> ارسال به تیتک
import React, { useEffect } from "react";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useDelivery } from "../../hooks/useDelivery";
import DeliveryShowTable from "./DeliveryShowTable";
import DeliveryShowHeader from "./DeliveryShowHeader";
import { useDeliveryStore } from "../../store/deliveryStore";
import { useTTacStore } from "../../store/ttacStore";
import { useWarehouseStore } from "../../store/warehouseStore";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeliveryShow = ({ workFlowRowSelectResponse, refetchSwitch, setRefetchSwitch }: Props) => {
  const { setField, id } = useDeliveryStore();
  const { setField:setTTacField } = useTTacStore();
  const {setField:setWarehouseField }=useWarehouseStore();
  const { deliveryShowResponse, isLoadingDeliveryShowQuery, refetchDeliveryShowQuery } = useDelivery();
  const canEditForm = workFlowRowSelectResponse.workTableForms.canEditForm2;

  //fetch Delivery/:id data
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchDeliveryShowQuery();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  // for Delivery/:id
  if (id !== workFlowRowSelectResponse.workTableRow.formId) {
    console.log(workFlowRowSelectResponse.workTableRow.formId,"workFlowRowSelectResponse.workTableRow.formId");
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
    setWarehouseField("formIdWarehouseTemporaryReceipt",-1)
    setTTacField("ttacRequestId", -1);
    setTTacField("systemId", -1);
    setTTacField("yearId", -1);
  }
  /*useEffect(() => {
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
    setWarehouseField("formIdWarehouseTemporaryReceipt",-1)
    setTTacField("ttacRequestId", -1);
    setTTacField("systemId", -1);
    setTTacField("yearId", -1);

  }, [workFlowRowSelectResponse.workTableRow.formId]);*/

  return (
    <div>
      <DeliveryShowHeader
        deliveryShowResponse={deliveryShowResponse.data.result}
        canEditForm={canEditForm}
      />
      <div className="flex items-center w-full justify-between gap-2 py-1">
        <p className="px-2 text-sm">اقلام</p>
        <hr className="w-full border-2 border-gray-300" />
      </div>
      <DeliveryShowTable
        isLoading={isLoadingDeliveryShowQuery}
        deliveryShowResponse={deliveryShowResponse}
        canEditForm={canEditForm}
      />
    </div>
  );
};

export default DeliveryShow;
