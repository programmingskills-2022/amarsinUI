import { useEffect, useState } from "react";
import { useProductGrace } from "../../hooks/useProductGrace";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import ProductGraceForm from "./ProductGraceForm";
import { ProductGrace } from "../../types/productGrace";
import { useProductGraceStore } from "../../store/productGraceStore";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
};

const ProductGraceForWorkFlow = ({
  workFlowRowSelectResponse,
}: Props) => {
  const {
    productGraceDtl,
    productGraceDtlData,
    addProductList,
    productGraceDtlHistory,
    isLoadingDtlHistory,
    productGraceSave,
    isLoadingProductGraceSave,
  } = useProductGrace();

  const { setField } = useProductGraceStore();

  const [selectedProductGrace, setSelectedProductGrace] =
    useState<ProductGrace | null>(null);

  useEffect(() => {
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }, [workFlowRowSelectResponse.workTableRow.formId]);

  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    workFlowRowSelectResponse.workTableRow.formId !== 0 &&
      setSelectedProductGrace(
        productGraceDtlData?.productGraces?.find(
          (item) => item.id === workFlowRowSelectResponse.workTableRow.formId
        ) || null
      );
  }, [
    workFlowRowSelectResponse.workTableRow.formId,
    productGraceDtlData?.productGraces,
  ]);

  return (
    <div className="w-full h-full py-2">
      <ProductGraceForm
        canEditForm1={workFlowRowSelectResponse.workTableForms.canEditForm1}
        addProductList={addProductList}
        productGraceDtlHistory={productGraceDtlHistory || []}
        isLoadingDtlHistory={isLoadingDtlHistory}
        productGraceSave={productGraceSave}
        isLoadingProductGraceSave={isLoadingProductGraceSave}
        selectedProductGrace={selectedProductGrace} //for check if selectedProductGrace.flwId===0 new else edit && sending selectedProductGrace.id in edit
        productGraceDtls={productGraceDtl}
        isNew={false} //for check if isNew new else edit
        setIsNew={() => false}
        setIsEdit={() => true}
        fromWorkFlow={true} //for going to editting in product grace form as default
      />
    </div>
  );
};

export default ProductGraceForWorkFlow;
