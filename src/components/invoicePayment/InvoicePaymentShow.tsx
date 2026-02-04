// خزانه دار-> ثبت فاکتور خرید
import { WorkflowRowSelectResponse } from "../../types/workflow";
import InvoicePaymentShowHeader from "./InvoicePaymentShowHeader";
import { useInvoice } from "../../hooks/useInvoice";
import { useInvoiceStore } from "../../store/invoiceStore";
import InvoicePaymentShowTable from "./InvoicePaymentShowTable";
import { useEffect } from "react";
import { SearchItem } from "../../types/general";
import { useChequeStore } from "../../store/chequeStore";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: (refetchSwitch: boolean) => void;
  banks: SearchItem[];
};

const InvoicePaymentShow = ({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
  banks,
}: Props) => {
  const {
    invoicePaymentResponse,
    isLoadingInvoicePayment,
    invoicePaymentSave,
    isLoadingInvoicePaymentSave,
    invoicePaymentSaveResponse,
    refetchInvoicePayment
  } = useInvoice();
  const { setField: setInvoicePaymentField, invoiceId } = useInvoiceStore();
  const { setField: setChequeField } = useChequeStore();
  ////////////////////////////////////////////////////////////////////////
  // for refetchInvoicePayment if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchInvoicePayment();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (invoiceId === -1 || invoiceId !== workFlowRowSelectResponse?.workTableRow.formId) {
      setInvoicePaymentField("invoiceId", workFlowRowSelectResponse?.workTableRow.formId);
    }
    setChequeField("paymentAttachmentFormId", -1);
  }, [workFlowRowSelectResponse?.workTableRow.formId, invoiceId, setInvoicePaymentField, setChequeField]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center w-full justify-between gap-2 py-1">
        <p className="px-2 text-sm w-32">دریافت/پرداخت</p>
        <hr className="w-full border-2 border-gray-300" />
      </div>
      <InvoicePaymentShowHeader
        invoicePaymentResponse={invoicePaymentResponse}
        canEditForm={workFlowRowSelectResponse.workTableForms.canEditForm1}
        invoicePaymentSave={invoicePaymentSave}
        isLoadingInvoicePaymentSave={isLoadingInvoicePaymentSave}
        invoicePaymentSaveResponse={invoicePaymentSaveResponse}
        banks={banks}
      />
      <div className="flex items-center w-full justify-between gap-2 py-1">
        <p className="px-2 text-sm w-16">لیست</p>
        <hr className="w-full border-2 border-gray-300" />
      </div>
      <InvoicePaymentShowTable
        invoicePaymentResponse={invoicePaymentResponse}
        isLoading={isLoadingInvoicePayment}
      />
    </div>
  );
};

export default InvoicePaymentShow;
