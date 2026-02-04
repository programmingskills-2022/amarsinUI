// تیتک -> ارسال به تیتک
//کارشناس خرید -> تیتک
import React, { useEffect, useState } from "react";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useDelivery } from "../../hooks/useDelivery";
import DeliveryShowTable from "./DeliveryShowTable";
import DeliveryShowHeader from "./DeliveryShowHeader";
import { useDeliveryStore } from "../../store/deliveryStore";
import { useTTacStore } from "../../store/ttacStore";
import { useWarehouseStore } from "../../store/warehouseStore";
import { DeliveryShowResponse } from "../../types/delivery";
import { useWarehouse } from "../../hooks/useWarehouse";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  isDeliveryForm: boolean;
};

const DeliveryShow = ({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
  isDeliveryForm,
}: Props) => {
  const { setField, id } = useDeliveryStore();
  const { setField: setTTacField } = useTTacStore();
  const { setField: setWarehouseField, formIdWarehouseTemporaryReceiptTitac } =
    useWarehouseStore();
  const {
    deliveryShowResponse,
    isLoadingDeliveryShowQuery,
    refetchDeliveryShowQuery,
  } = useDelivery();

  const {
    warehouseTemporaryReceiptTitacShowResponse,
    refetchWarehouseTemporaryReceiptTitacShow,
    isLoadingWarehouseTemporaryReceiptTitacShow,
    warehouseSearchResponse,
  } = useWarehouse();
  const canEditForm = workFlowRowSelectResponse.workTableForms.canEditForm2;
  const isLoading =
    isLoadingDeliveryShowQuery || isLoadingWarehouseTemporaryReceiptTitacShow;
  const [response, setResponse] = useState<DeliveryShowResponse>({
    meta: { errorCode: 0, message: "", type: "" },
    data: {
      result: {
        err: 0,
        msg: "",
        wId: 0,
        wName: "",
        deliveryMst: {
          id: 0,
          formId: 0,
          code: "",
          dat: "",
          tim: "",
          cId: 0,
          srName: "",
          gln: "",
          blackList: false,
          exp: "",
          guid: "",
          status: 0,
          msg: "",
        },
        deliveryDtls: [],
      },
    },
  });

  //fetch Delivery/:id data
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      if (isDeliveryForm) {
        refetchDeliveryShowQuery();
      } else {
        refetchWarehouseTemporaryReceiptTitacShow();
      }
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  // for Delivery/:id
  if (id !== workFlowRowSelectResponse.workTableRow.formId && isDeliveryForm) {
    console.log(
      workFlowRowSelectResponse.workTableRow.formId,
      "workFlowRowSelectResponse.workTableRow.formId"
    );
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
    setWarehouseField("formIdWarehouseTemporaryReceipt", -1); // Disable indentShow query
    setWarehouseField("formIdWarehouseTemporaryReceiptTitac", -1); // Disable titacShow query
    setWarehouseField("iocId", -1); // Disable indentList query
    setWarehouseField("receiptPurchaseId", -1); // Disable purchaseShow query
    setWarehouseField("id", -1); // Disable salesPrices query
    setWarehouseField("idReg", -1); // Disable purchaseReg query
    setWarehouseField("page", -1); //  Disable salesPrices query
    setTTacField("ttacRequestId", -1); // Disable ttac request query
    setTTacField("systemId", -1); // Disable ttac system query
    setTTacField("yearId", -1); // Disable ttac year query
  }
  if (
    formIdWarehouseTemporaryReceiptTitac !==
      workFlowRowSelectResponse.workTableRow.formId &&
    !isDeliveryForm
  ) {
    console.log(
      workFlowRowSelectResponse.workTableRow.formId,
      "formIdWarehouseTemporaryReceiptTitac"
    );
    setWarehouseField(
      "formIdWarehouseTemporaryReceiptTitac",
      workFlowRowSelectResponse.workTableRow.formId
    );
    setWarehouseField("receiptPurchaseId", -1);
    setWarehouseField("formIdWarehouseTemporaryReceipt", -1); // Disable indentShow query
    setWarehouseField("idReg", -1); // Disable purchaseReg query
    setWarehouseField("page", -1); //  Disable salesPrices query
    setWarehouseField("iocId", -1); //  Disable salesPrices query
    setWarehouseField("page", -1); //  Disable salesPrices query
    setWarehouseField("salesPriceId",0);
    setTTacField("ttacRequestId", -1); 
    setTTacField("systemId", -1);
    setTTacField("yearId", -1);
  }

  // Update loading state
  /*useEffect(() => {
    if (
      workFlowRowSelectResponse.workTableRow.formId !==
      formIdWarehouseTemporaryReceiptTitac && !isDeliveryForm
    ) {
      setWarehouseField(
        "formIdWarehouseTemporaryReceiptTitac",
        workFlowRowSelectResponse.workTableRow.formId
      );
    setTTacField("ttacRequestId", -1);
    setTTacField("systemId", -1);
    setTTacField("yearId", -1);
    }
  }, [workFlowRowSelectResponse.workTableRow.formId]);*/

  // Update response when delivery data loads
  useEffect(() => {
    if (isDeliveryForm && !isLoadingDeliveryShowQuery && deliveryShowResponse) {
      setResponse(deliveryShowResponse);
    }
  }, [isDeliveryForm, isLoadingDeliveryShowQuery, deliveryShowResponse]);

  // Update response when warehouse data loads
  useEffect(() => {
    if (
      !isDeliveryForm &&
      !isLoadingWarehouseTemporaryReceiptTitacShow &&
      warehouseTemporaryReceiptTitacShowResponse?.data?.result
        ?.warehouseTemporaryReceiptMst
    ) {
      const wtrMst =
        warehouseTemporaryReceiptTitacShowResponse.data.result
          .warehouseTemporaryReceiptMst;
      const wtrDtls =
        warehouseTemporaryReceiptTitacShowResponse.data.result
          .warehouseTemporaryReceiptDtls;

      const responseTemp: DeliveryShowResponse = {
        meta: warehouseTemporaryReceiptTitacShowResponse.meta,
        data: {
          result: {
            err: 0,
            msg: "",
            wId: warehouseTemporaryReceiptTitacShowResponse.data.result.wId,
            wName: warehouseTemporaryReceiptTitacShowResponse.data.result.wName,
            deliveryMst: {
              id: wtrMst.id,
              formId: wtrMst.formId,
              code: wtrMst.code,
              dat: wtrMst.dat,
              tim: wtrMst.tim,
              cId: wtrMst.cId,
              srName: wtrMst.srName,
              gln: wtrMst.gln,
              blackList: false,
              exp: wtrMst.exp,
              guid: wtrMst.guid,
              status: wtrMst.status,
              msg: wtrMst.msg,
            },
            deliveryDtls: wtrDtls.map((dtl) => ({
              id: dtl.id,
              iocId: dtl.iocId,
              pCode: dtl.pCode,
              pName: dtl.pName,
              cnt: dtl.cnt,
              cost: dtl.cost,
              hasUID: dtl.hasUID,
              uid: dtl.uid,
              statusCode: 0,
              code: dtl.code,
              expire: dtl.expire,
            })),
          },
        },
      };
      //console.log(responseTemp, "responseTemp");
      setResponse(responseTemp);
    }
  }, [
    isLoadingWarehouseTemporaryReceiptTitacShow,
    warehouseTemporaryReceiptTitacShowResponse?.data?.result
      ?.warehouseTemporaryReceiptMst?.id,
  ]);
  return (
    <div>
      <DeliveryShowHeader
        deliveryShowResponse={response.data.result}
        warehouseSearchResponse={warehouseSearchResponse}
        canEditForm={canEditForm}
      />
      <div className="flex items-center w-full justify-between gap-2 py-1">
        <p className="px-2 text-sm">اقلام</p>
        <hr className="w-full border-2 border-gray-300" />
      </div>
      <DeliveryShowTable
        isLoading={isLoading}
        deliveryShowResponse={response}
        canEditForm={canEditForm}
      />
    </div>
  );
};

export default DeliveryShow;
