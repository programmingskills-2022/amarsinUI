
import InvoiceReceiptShow from "../invoiceReceipt/InvoiceReceiptShow";
import { useState } from "react";
import { Indent } from "../../types/product";
import { DefinitionDateTime } from "../../types/definitionInvironment";

type Props = {
  selectedIndent: Indent | null;
  isNew: boolean;
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  definitionDateTime:DefinitionDateTime
};
const PurchaseRequestIndentForm = ({
  selectedIndent,
  isNew,
  setIsNew,
  setIsEdit,
  definitionDateTime
}: Props) => {
  ///////////////////////////////////////////////////////
  const [refetchSwitch, setRefetchSwitch] = useState(false);
  const workFlowRowSelectResponse = {
    err: 0,
    msg: "PurchaseRequestIndentForm",
    workTableRow: {
      id: selectedIndent?.id ?? 0,
      regFDate: selectedIndent?.dat ?? "",
      regTime: selectedIndent?.tim ?? "",
      regDateTime: selectedIndent?.dat + " - " + selectedIndent?.tim,
      formId: isNew ? 0 : selectedIndent?.mrsId ?? 0,
      formTitle: "دریافت پیش فاکتور",
      formCode: selectedIndent?.id.toString() ?? "",
      formCost: 0.0,
      fChartName: "مدیر عامل (برنامه نویس)",
      flowMapTitle: "ثبت اولیه",
      dsc: selectedIndent?.dsc ?? "",
      operation: 0,
      wfmS_FlowMapId: 0,
      wfmS_FlowId: selectedIndent?.flwId ?? 0,
      flowNo: 0,
      canEditForm1: true,
      canEditForm2: true,
      printForm1: true,
      printForm2: true,
    },
    flowButtons: [],
    workTableForms: {
      form1Title: "دریافت پیش فاکتور",
      form1ViewPath: "Indent/_CreateIndent",
      canEditForm1: true,
      canEditForm1Mst1: true,
      canEditForm1Mst2: true,
      canEditForm1Mst3: true,
      canEditForm1DtlDel: true,
      canEditForm1Dtl1: false,
      canEditForm1Dtl2: true,
      canEditForm1Dtl3: true,
      form2Title: "",
      form2ViewPath: "",
      canEditForm2: true,
    },
    flowDescriptions: [
      {
        usrName: "برنامه نویس",
        dsc: selectedIndent?.dsc ?? "",
      },
    ],
  };

  
  return (
    <div>
      <InvoiceReceiptShow
        workFlowRowSelectResponse={workFlowRowSelectResponse}
        refetchSwitch={refetchSwitch}
        setRefetchSwitch={setRefetchSwitch}
        isNew={isNew}
        setIsNew={setIsNew}
        setIsEdit={setIsEdit}
        definitionDateTime={definitionDateTime}
        isFromWorkFlow={false}
      />
    </div>
  );
};

export default PurchaseRequestIndentForm;
