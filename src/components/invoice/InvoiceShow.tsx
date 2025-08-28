import InvoiceShowHeader from "./InvoiceShowHeader";
import InvoiceShowTable from "./InvoiceShowTable";
import { WorkflowRowSelectResponse } from "../../types/workflow";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
};

const InvoiceShow = ({ workFlowRowSelectResponse }: Props) => {
  return (
    <div className="w-full flex flex-col">
      <InvoiceShowHeader workFlowRowSelectResponse={workFlowRowSelectResponse} />
      <p className="mt-2 px-2 text-sm">اقلام</p>
      <InvoiceShowTable />
    </div>
  );
};

export default InvoiceShow;
