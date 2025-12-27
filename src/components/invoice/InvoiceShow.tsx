//کارشناس خرید-> دریافت اصل فاکتور*****************
import InvoiceShowHeader from "./InvoiceShowHeader";
import InvoiceShowTable from "./InvoiceShowTable";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useInvoice } from "../../hooks/useInvoice";
import { useInvoiceStore } from "../../store/invoiceStore";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  caption: string;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

const InvoiceShow = ({
  workFlowRowSelectResponse,
  caption,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const { isLoading, invoiceShowIdResponse ,refetchInvoiceShowId} = useInvoice();
  const {formId,setField} = useInvoiceStore();

  if (formId !== workFlowRowSelectResponse.workTableRow.formId) {
    setField("formId", workFlowRowSelectResponse.workTableRow.formId);
  }
  return (
    <div className="w-full flex flex-col">
      <InvoiceShowHeader
        invoiceShowIdResponse={invoiceShowIdResponse}
      />
      <p className="mt-2 px-2 text-sm">اقلام</p>
      <InvoiceShowTable
        caption={caption}
        refetchSwitch={refetchSwitch}
        setRefetchSwitch={setRefetchSwitch}
        invoiceShowIdResponse={invoiceShowIdResponse}
        refetchInvoiceShowId={refetchInvoiceShowId}
        isLoading={isLoading}
      />
    </div>
  );
};

export default InvoiceShow;
