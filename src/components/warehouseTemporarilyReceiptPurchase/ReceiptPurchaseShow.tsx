//کارشناس خرید -> تایید فاکتور خرید

import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useEffect } from "react";
import ReceiptPurchaseShowHeader from "./ReceiptPurchaseShowHeader";
import ReceiptPurchaseShowTable from "./ReceiptPurchaseShowTable";
import { useWarehouse } from "../../hooks/useWarehouse";
import { useWarehouseStore } from "../../store/warehouseStore";
import { DefinitionDateTime } from "../../types/definitionInvironment";
import { useProductStore } from "../../store/productStore";
import { useProductPermStore } from "../../store/productPermStore";
import { useProductOfferStore } from "../../store/productOfferStore";
import { useProductGraceStore } from "../../store/productGraceStore";
import { useProductPriceStore } from "../../store/productPriceStore";
import { useCustomerStore } from "../../store/customerStore";

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
    warehouseSearchResponse,
  } = useWarehouse();

  const {setField: setProductField} = useProductStore()
  const {setField:setProductPermField}=useProductPermStore()
  const {setField:setProductOfferField}=useProductOfferStore()
  const {setField:setProductGraceField}=useProductGraceStore()
  const {setField:setProductPriceField}=useProductPriceStore()
  const {setField:setCustomerField}=useCustomerStore()
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
    setWarehouseField("iocId",-1) // Disable indentList query
    setWarehouseField("id",-1) // to not fetching warehouseTemporaryReceiptSalesPricesQuery
    setWarehouseField("idReg",-1) // Disable purchaseReg query
    setWarehouseField("page",-1) //  Disable salesPrices query
    setWarehouseField("salesPriceId",0)
    setProductField("salesPricesSearchPage",-1)
    setProductField("productSearchAccYear",-1)
    if (!canEditForm1Mst2) setCustomerField("yearIdCustomerSearch",-1) // to not fetching CustomerSearchQuery
    setProductPermField("yearId",-1)
    setProductPermField("yearIdDtl",-1)
    setProductOfferField("acc_Year",-1)
    setProductOfferField("acc_YearDtl",-1)
    setProductGraceField("yearId",-1)
    setProductGraceField("yearIdDtl",-1)
    setProductPriceField("yearId",-1)
    setProductPriceField("yearIdDtl",-1)
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
        warehouseSearchResponse={warehouseSearchResponse}
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
