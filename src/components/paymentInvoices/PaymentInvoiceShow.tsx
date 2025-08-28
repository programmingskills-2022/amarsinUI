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
  canEditForm: boolean;
};

const PaymentInvoiceShow = ({
  workFlowRowSelectResponse,
  canEditForm,
}: Props) => {
  
  const canEditForm1Mst1= workFlowRowSelectResponse.workTableForms.canEditForm1Mst1
  const [dsc, setDsc] = useState("");
  const [rem, setRem] = useState("");
  const [isEqualSum, setIsEqualSum] = useState(false);
  const {
    invoiceOutStandingResponse,
    isLoading,
    paymentInvoicesSave,
    isLoadingPaymentInvoicesSave,
    paymentInvoicesSaveResponse,
  } = usePaymentInvoices();
  const { isLoadingUpdateFields, updateFields } = useCheques();
  const { updateFieldsResponse } = useChequeStore();
  const { systemId, yearId } = useGeneralContext();
  const { setField } = usePaymentInvoiceStore();
  const { authApiResponse } = useAuthStore();

  const usrId = authApiResponse?.data?.result?.login?.usrId ?? 0;

  useEffect(() => {
    setField("paymentId", workFlowRowSelectResponse.workTableRow.formId);
    setField("systemId", systemId);
    setField("yearId", yearId);
  }, [
    workFlowRowSelectResponse.workTableRow.formId,
    setField,
    systemId,
    yearId,
  ]);

  return (
    <form className="mt-2 p-1 gap-1 bg-gray-200 border border-gray-300 rounded-md w-full text-gray-600 text-sm ">
      <div className="flex flex-col sm:flex-row w-full">
        <PaymentInvoiceShowHeader
          canEditForm1Mst1={canEditForm1Mst1}
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
      />
    </form>
  );
};

export default PaymentInvoiceShow;
