//کمک حسابداری
import { useEffect, useState } from "react";
import { useCheques } from "../../hooks/useCheques";
import { useChequeStore } from "../../store/chequeStore";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import RegRecievedChequeImg from "./RegRecievedChequeImg";
import RegRecievedChequeInfo from "./RegRecievedChequeInfo";
import { DefinitionInvironment } from "../../types/definitionInvironment";
import { SearchItem } from "../../types/general";
import ModalForm from "../layout/ModalForm";
import PayRequestAttachment from "../payRequest/PayRequestAttachment";
import { v4 as uuidv4 } from "uuid";

type Props = {
  canEditForm: boolean;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  definitionInvironment: DefinitionInvironment;
  banks: SearchItem[];
  isLoadingBanks: boolean;
  cashPosSystemSearch: SearchItem[];
};

const RegRecievedCheque = ({
  canEditForm,
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
  definitionInvironment,
  banks,
  isLoadingBanks,
  cashPosSystemSearch,
}: Props) => {
  const { setField, loadPaymentFormId } = useChequeStore();
  //const canEditForm = workFlowRowSelectResponse.workTableForms.canEditForm1;
  const [showAttachment, setShowAttachment] = useState(false);
  //for PayRequestAttachment.tsx
  const [guid, setGuid] = useState<string>("");
  //for PayRequestShowHeader props
  const [cnt, setCnt] = useState(0);
  // Set formId BEFORE useCheques hook runs to prevent stale queries
  if (loadPaymentFormId !== workFlowRowSelectResponse.workTableRow.formId) {
    setField(
      "loadPaymentFormId",
      workFlowRowSelectResponse.workTableRow.formId
    );
    //setField("payKind", -1);
    setField("sayadiPaymentId", -1);
    setField("paymentIdAccept", -1);
    //form cheque image attachment
    setField(
      "paymentAttachmentFormId",
      workFlowRowSelectResponse.workTableRow.formId ?? -1
    );
  }

  const {
    loadPaymentResponse,
    isLoading: isLoadingLoadPayment,
    updateFields,
    updateFieldsResponse,
    isLoadingUpdateFields,
    //cashPosSystemSearch,
    paymentAttachmentResponse,
    isLoadingPaymentAttachment,
    getPaymentAttachment,
    getPayment,
    sayadChequeInquiryByPaymentIdResponse,
    isLoadingSayadChequeInquiryByPaymentId,
    sayadiChequeAcceptByPaymentIdResponse,
    isLoadingSayadiChequeAcceptByPaymentId,
    deleteSayadiChequeRejectByPaymentId,
    sayadiChequeRejectByPaymentIdResponse
  } = useCheques();

  // refetch getPayment if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      setField(
        "paymentAttachmentFormId",
        workFlowRowSelectResponse.workTableRow.formId ?? -1
      );
      setField("sayadiPaymentId", -1);
      setField("paymentIdAccept", -1);
      //setField("payKind", -1);
      getPayment();
      getPaymentAttachment();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////////
  /*useEffect(() => {
    if(chequeFormId!==workFlowRowSelectResponse.workTableRow.formId){
      setField("formId", workFlowRowSelectResponse.workTableRow.formId);
    }
  }, [workFlowRowSelectResponse.workTableRow.formId, setField,chequeFormId]);*/

  ////////////////////////////////////////////////////////for defining guid
  useEffect(() => {
    setGuid(uuidv4());
    console.log(cnt);
  }, []);
  //handle close attachment
  const handleCloseAttachment = () => {
    setShowAttachment(false);
    getPaymentAttachment();
  };
  return (
    <div className="flex flex-col md:flex-row w-full text-sm gap-2 text-gray-600">
      <RegRecievedChequeInfo
        canEditForm={canEditForm}
        workFlowRowSelectResponse={workFlowRowSelectResponse}
        loadPaymentResponse={loadPaymentResponse}
        isLoadingLoadPayment={isLoadingLoadPayment}
        updateFields={updateFields}
        updateFieldsResponse={updateFieldsResponse}
        isLoadingUpdateFields={isLoadingUpdateFields}
        cashPosSystemSearch={cashPosSystemSearch}
        sayadChequeInquiryByPaymentIdResponse={
          sayadChequeInquiryByPaymentIdResponse
        }
        isLoadingSayadChequeInquiryByPaymentId={isLoadingSayadChequeInquiryByPaymentId}
        sayadiChequeAcceptByPaymentIdResponse={
          sayadiChequeAcceptByPaymentIdResponse
        }
        isLoadingSayadiChequeAcceptByPaymentId={isLoadingSayadiChequeAcceptByPaymentId}
        deleteSayadiChequeRejectByPaymentId={deleteSayadiChequeRejectByPaymentId}
        sayadiChequeRejectByPaymentIdResponse={sayadiChequeRejectByPaymentIdResponse}
        definitionInvironment={definitionInvironment}
        banks={banks}
        isLoadingBanks={isLoadingBanks}
      />
      <RegRecievedChequeImg
        paymentAttachmentResponse={paymentAttachmentResponse}
        isLoadingPaymentAttachment={isLoadingPaymentAttachment}
        setField={setField}
        setShowAttachment={setShowAttachment}
      />
      <ModalForm
        isOpen={showAttachment}
        onClose={handleCloseAttachment}
        title="تصویر چک"
        width="1/2"
      >
        <PayRequestAttachment
          formId={loadPaymentFormId}
          prefix="Trsry"
          setCnt={setCnt}
          guid={guid}
        />
      </ModalForm>
    </div>
  );
};

export default RegRecievedCheque;
