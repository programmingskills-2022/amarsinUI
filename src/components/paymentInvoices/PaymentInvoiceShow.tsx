//کارشناس بازرگانی => تایید اطلاعات - چک دریافتی
import { useEffect, useState } from "react";
import { usePaymentInvoices } from "../../hooks/usePaymentInvoices";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import PaymentInvoiceShowHeader from "./PaymentInvoiceShowHeader";
import { useCheques } from "../../hooks/useCheques";
import { useChequeStore } from "../../store/chequeStore";
import PaymentInvoiceShowTable from "./PaymentInvoiceShowTable";
import { useGeneralContext } from "../../context/GeneralContext";
import { usePaymentInvoiceStore } from "../../store/paymentInvoiceStore";
import { useAuthStore } from "../../store/authStore";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

const PaymentInvoiceShow = ({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const [dsc, setDsc] = useState("");
  const [rem, setRem] = useState("");
  const [isEqualSum, setIsEqualSum] = useState(false);
  const {
    invoiceOutStandingResponse,
    isLoading,
    paymentInvoicesSave,
    isLoadingPaymentInvoicesSave,
    paymentInvoicesSaveResponse,
    refetchInvoiceOutStanding,
    settlementAveragesResponse,
  } = usePaymentInvoices();
  const { isLoadingUpdateFields, updateFields } = useCheques();
  const { updateFieldsResponse, setField: setPaymentField } = useChequeStore();
  const { systemId, yearId } = useGeneralContext();
  const { setField, paymentId } = usePaymentInvoiceStore();
  const { authApiResponse } = useAuthStore();
  const canEditForm = workFlowRowSelectResponse.workTableForms.canEditForm1;
  const usrId = authApiResponse?.data?.result?.login?.usrId ?? 0;

  // refetch invoiceOutStanding if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchInvoiceOutStanding();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);

  // Set initial payment fields
  if (paymentId !== workFlowRowSelectResponse.workTableRow.formId) {
    setField("paymentId", workFlowRowSelectResponse.workTableRow.formId);
    setField("systemId", systemId);
    setField("yearId", yearId);
    //form cheque image attachment
    setPaymentField(
      "loadPaymentFormId",
      workFlowRowSelectResponse.workTableRow.formId
    );
    setPaymentField("sayadiPaymentId", -1);
    setPaymentField("paymentIdAccept", -1);
    setPaymentField(
      "paymentAttachmentFormId",
      workFlowRowSelectResponse.workTableRow.formId ?? -1
    );
    setPaymentField("payKind", -1);
  }

  //after doFlow set paymentId to updatedWorkFlowRowSelectResponse.workTableRow.formId
  /*useEffect(() => {
    console.log(
      updatedWorkFlowRowSelectResponse,
      "updatedWorkFlowRowSelectResponse in PaymentInvoiceShow"
    );
    if (updatedWorkFlowRowSelectResponse !== null) {
      setField(
        "paymentId",
        updatedWorkFlowRowSelectResponse.workTableRow.formId
      );
      setUpdatedWorkFlowRowSelectResponse(null);
    }
  }, [updatedWorkFlowRowSelectResponse, setField, setUpdatedWorkFlowRowSelectResponse]);*/
  ////////////////////////////////////////////////////////////////
  return (
    <form className="mt-2 p-1 gap-1 bg-gray-200 border border-gray-300 rounded-md w-full text-gray-600 text-sm ">
      <div className="flex flex-col sm:flex-row w-full">
        <PaymentInvoiceShowHeader
          canEditForm={canEditForm}
          isEqualSum={isEqualSum}
          invoiceOutStandingResponse={invoiceOutStandingResponse}
          isLoadingUpdateFields={isLoadingUpdateFields}
          updateFields={updateFields}
          dsc={dsc}
          rem={rem}
          setDsc={setDsc}
          setRem={setRem}
          updateFieldsResponse={updateFieldsResponse}
        />
      </div>
      <PaymentInvoiceShowTable
        setIsEqualSum={setIsEqualSum}
        canEditForm={canEditForm}
        invoiceOutStandingResponse={invoiceOutStandingResponse}
        isLoading={isLoading}
        isEqualSum={isEqualSum}
        usrId={usrId}
        paymentId={workFlowRowSelectResponse.workTableRow.formId}
        paymentInvoicesSave={paymentInvoicesSave}
        isLoadingPaymentInvoicesSave={isLoadingPaymentInvoicesSave}
        paymentInvoicesSaveResponse={paymentInvoicesSaveResponse}
        settlementAveragesResponse={settlementAveragesResponse}
      />
    </form>
  );
};

export default PaymentInvoiceShow;
