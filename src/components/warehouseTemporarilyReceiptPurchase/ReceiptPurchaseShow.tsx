//کارشناس خرید -> تایید فاکتور خرید

import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useEffect } from "react";
import ReceiptPurchaseShowHeader from "./ReceiptPurchaseShowHeader";
import ReceiptPurchaseShowTable from "./ReceiptPurchaseShowTable";
import { useWarehouse } from "../../hooks/useWarehouse";
import { useWarehouseStore } from "../../store/warehouseStore";
import { DefinitionDateTime } from "../../types/definitionInvironment";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  definitionDateTime: DefinitionDateTime;
};

const ReceiptPurchaseShow = ({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
  definitionDateTime,
}: Props) => {
  const canEditForm1Mst2 =
    workFlowRowSelectResponse.workTableForms.canEditForm1Mst2;
  const { setField: setWarehouseField, receiptPurchaseId } =
    useWarehouseStore();
  const {
    warehouseTemporaryReceiptPurchaseShowResponse,
    isLoadingWarehouseTemporaryReceiptPurchaseShow,
    isLoadingWarehouseTemporaryReceiptSalesPrices,
    warehouseTemporaryReceiptSalesPricesResponse,
    isLoadingWarehouseTemporaryReceiptPurchaseReg,
    warehouseTemporaryReceiptPurchaseRegResponse,
    refetchWarehouseTemporaryReceiptPurchaseShow,
  } = useWarehouse();

  // refetch warehouseTemporaryReceiptPurchaseShow if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchWarehouseTemporaryReceiptPurchaseShow();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  if (receiptPurchaseId !== workFlowRowSelectResponse?.workTableRow.formId) {
    setWarehouseField("formIdWarehouseTemporaryReceiptTitac",-1)
    setWarehouseField("formIdWarehouseTemporaryReceipt",-1)
    setWarehouseField(
      "receiptPurchaseId",
      workFlowRowSelectResponse?.workTableRow.formId
    );
  }
  /*useEffect(() => {
    console.log(workFlowRowSelectResponse?.workTableRow.formId);
    setWarehouseField("formIdWarehouseTemporaryReceiptTitac",-1)
    setWarehouseField(
      "receiptPurchaseId",
      workFlowRowSelectResponse?.workTableRow.formId
    );
  }, [workFlowRowSelectResponse.workTableRow.formId]);*/

  return (
    <div className="w-full flex flex-col">
      <ReceiptPurchaseShowHeader
        warehouseTemporaryReceiptPurchaseShowResponse={
          warehouseTemporaryReceiptPurchaseShowResponse
        }
        canEditForm1Mst2={canEditForm1Mst2}
      />
      <div className="flex items-center w-full justify-between gap-2 py-1">
        <p className="px-2 text-sm">اقلام</p>
        <hr className="w-full border-2 border-gray-300" />
      </div>
      <ReceiptPurchaseShowTable
        warehouseTemporaryReceiptPurchaseShowResponse={
          warehouseTemporaryReceiptPurchaseShowResponse
        }
        isLoadingWarehouseTemporaryReceiptPurchaseShow={
          isLoadingWarehouseTemporaryReceiptPurchaseShow
        }
        isLoadingWarehouseTemporaryReceiptSalesPrices={
          isLoadingWarehouseTemporaryReceiptSalesPrices
        }
        warehouseTemporaryReceiptSalesPricesResponse={
          warehouseTemporaryReceiptSalesPricesResponse
        }
        isLoadingWarehouseTemporaryReceiptPurchaseReg={
          isLoadingWarehouseTemporaryReceiptPurchaseReg
        }
        warehouseTemporaryReceiptPurchaseRegResponse={
          warehouseTemporaryReceiptPurchaseRegResponse
        }
        definitionDateTime={definitionDateTime}
      />
    </div>
  );
};

export default ReceiptPurchaseShow;
