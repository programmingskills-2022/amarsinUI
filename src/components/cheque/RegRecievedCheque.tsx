//کمک حسابداری
import { useEffect } from "react";
import { useCheques } from "../../hooks/useCheques";
import { useChequeStore } from "../../store/chequeStore";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import RegRecievedChequeImg from "./RegRecievedChequeImg";
import RegRecievedChequeInfo from "./RegRecievedChequeInfo";
//import RegRecievedChequeInfoSanad from "./RegRecievedChequeInfoSanad";

type Props = {
  canEditForm: boolean;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
};

const RegRecievedCheque = ({
  canEditForm,
  workFlowRowSelectResponse,
}: Props) => {
  const {
    loadPaymentResponse,
    isLoading: isLoadingLoadPayment,
    updateFields,
    isLoadingUpdateFields,
    cashPosSystemSearch,
    paymentAttachmentResponse,
    isLoadingPaymentAttachment,
  } = useCheques();

  const {setField,formId:chequeFormId}=useChequeStore()
  useEffect(() => {
    if(chequeFormId!==workFlowRowSelectResponse.workTableRow.formId){
      setField("formId", workFlowRowSelectResponse.workTableRow.formId);
    }
  }, [workFlowRowSelectResponse.workTableRow.formId, setField,chequeFormId]);
  return (
    <div className="flex flex-col md:flex-row w-full text-sm gap-2 text-gray-600">
      <RegRecievedChequeInfo
        canEditForm={canEditForm}
        workFlowRowSelectResponse={workFlowRowSelectResponse}
        loadPaymentResponse={loadPaymentResponse}
        isLoadingLoadPayment={isLoadingLoadPayment}
        updateFields={updateFields}
        isLoadingUpdateFields={isLoadingUpdateFields}
        cashPosSystemSearch={cashPosSystemSearch}
      />
      <RegRecievedChequeImg
        paymentAttachmentResponse={paymentAttachmentResponse}
        isLoadingPaymentAttachment={isLoadingPaymentAttachment}
        setField={setField}
      />
    </div>
  );
};

export default RegRecievedCheque;
