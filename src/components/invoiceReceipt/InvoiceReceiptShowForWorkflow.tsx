import { useEffect, useState } from "react";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useGeneralContext } from "../../context/GeneralContext";
import { DefinitionDateTime } from "../../types/definitionInvironment";
import { useProductStore } from "../../store/productStore";
import { useBrandStore } from "../../store/brandStore";
import { usePurchaseRequest } from "../../hooks/usePurchaseRequest";
import { usePurchaseRequestStore } from "../../store/purchaseRequestStore";
import { Indent } from "../../types/purchaseRequest";
import InvoiceReceiptShow1 from "./InvoiceReceiptShow1";
import { useInvoiceReceipt } from "../../hooks/useInvoiceReceipt";
import { useInvoiceReceiptStore } from "../../store/invoiceReceiptStore";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  definitionDateTime: DefinitionDateTime;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

const InvoiceReceiptShowForWorkflow = ({
  workFlowRowSelectResponse,
  definitionDateTime,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const {
    indentListDtl,
    indentListDtlData,
    indentList,
    addProductList,
    dtlHistoryResponse,
    isDtHistoryLoading,
    saveList,
    isLoadingSaveList,
    saveListResponse,
  } = usePurchaseRequest();

  const { indentMrsResponse,getIndentMrsResponse } =  useInvoiceReceipt();
  const {  setField: setInvoiceReceiptField } = useInvoiceReceiptStore();

  const { setField, mrsIdIndentRequest } = usePurchaseRequestStore();
  const { setField: setProductField } = useProductStore();
  const { setField: setBrandField } = useBrandStore();

  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedIndent, setSelectedIndent] = useState<Indent | null>(null);

  const { yearId, systemId } = useGeneralContext();
  if (mrsIdIndentRequest !== workFlowRowSelectResponse.workTableRow.formId) {
    console.log("enter...");
    setField("acc_YearIndentRequest", -1);
    setField("acc_SystemIndentRequest", -1);
    setField("acc_YearIndentDtlRequest", yearId);
    setField("acc_SystemIndentDtlRequest", systemId);
    setField(
      "mrsIdIndentRequest",
      workFlowRowSelectResponse.workTableRow.formId,
    );
    setProductField("salesPricesSearchPage", -1); // for not fetching salesPrice in useProduct()
    setProductField("acc_YearIndentRequest", -1);
    setInvoiceReceiptField("mrsId", -1);
  }

  ////////////////////////////////////////////////////////////////////////
  //refetch refetchProductPriceDtl if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      getIndentMrsResponse();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log(
      "enter..",
      workFlowRowSelectResponse.workTableRow.formId,
      indentList,
      indentListDtl,
      indentListDtlData,
    );
    console.log(
      indentListDtlData?.indents?.find(
        (item) => item.mrsId === workFlowRowSelectResponse.workTableRow.formId,
      ) || null,
    );
    if (workFlowRowSelectResponse.workTableRow.formId !== 0) {
      setSelectedIndent(
        indentListDtlData?.indents?.find(
          (item) =>
            item.mrsId === workFlowRowSelectResponse.workTableRow.formId,
        ) || null,
      );
      setSelectedId(
        indentListDtlData?.indents?.find(
          (item) =>
            item.mrsId === workFlowRowSelectResponse.workTableRow.formId,
        )?.id || 0,
      );
      setProductField("salesPricesSearchPage", -1); // for not fetching salesPrice in useProduct()
      setProductField("acc_YearIndentRequest", -1);
      setBrandField("accSystem", -1);
    }
  }, [
    workFlowRowSelectResponse.workTableRow.formId,
    indentListDtlData?.indents,
  ]);

  return (
    <div className="w-full h-full py-2">
      <InvoiceReceiptShow1
        canEditForm1={workFlowRowSelectResponse.workTableForms.canEditForm1}
        addProductList={addProductList}
        dtlHistoryResponse={dtlHistoryResponse || []}
        isDtHistoryLoading={isDtHistoryLoading}
        saveList={saveList}
        saveListResponse={saveListResponse}
        isLoadingSaveList={isLoadingSaveList}
        selectedIndent={selectedIndent} //for check if selectedProductPrice.flwId===0 new else edit && sending selectedProductPrice.id in edit
        indentList={indentList}
        indentListDtl={indentListDtl}
        isNew={false} //for check if isNew new else edit
        setIsNew={() => false}
        setIsEdit={() => true}
        fromWorkFlow={true} //for going to editting in product grace form as default
        selectedId={selectedId}
        definitionDateTime={definitionDateTime}
        mrsId={workFlowRowSelectResponse.workTableRow.formId}
        indentMrsResponse={indentMrsResponse}
        getIndentMrsResponse={getIndentMrsResponse}
      />
    </div>
  );
};

export default InvoiceReceiptShowForWorkflow;
