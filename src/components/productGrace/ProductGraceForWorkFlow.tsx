import { useEffect, useState } from "react";
import { useProductGrace } from "../../hooks/useProductGrace";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import ProductGraceForm from "./ProductGraceForm";
import { ProductGrace } from "../../types/productGrace";
import { useProductGraceStore } from "../../store/productGraceStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { DefinitionDateTime } from "../../types/definitionInvironment";
import { useProductStore } from "../../store/productStore";
import { useBrandStore } from "../../store/brandStore";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  definitionDateTime: DefinitionDateTime;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductGraceForWorkFlow = ({
  workFlowRowSelectResponse,
  definitionDateTime,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const {
    refetchProductGraceDtl,
    productGraceDtl,
    productGraceDtlData,
    addProductList,
    productGraceDtlHistory,
    isLoadingDtlHistory,
    productGraceSave,
    isLoadingProductGraceSave,
  } = useProductGrace();

  const { setField, id } = useProductGraceStore();
  const {setField:setProductField}= useProductStore()
  const {setField:setBrandField}= useBrandStore()
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedProductGrace, setSelectedProductGrace] =
    useState<ProductGrace | null>(null);

  const { yearId, systemId } = useGeneralContext();

  if (id !== workFlowRowSelectResponse.workTableRow.formId) {
    setField("yearIdDtl", yearId);
    setField("systemIdDtl", systemId);
    setField("yearId", -1);
    setField("systemId", -1);
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }

  /*useEffect(() => {
    setField("yearId", yearId);
    setField("systemId", systemId);
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }, [workFlowRowSelectResponse.workTableRow.formId, yearId, systemId]);*/

  ////////////////////////////////////////////////////////////////////////
  //refetch refetchProductGraceDtl if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchProductGraceDtl();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);

  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (workFlowRowSelectResponse.workTableRow.formId !== 0) {
      setSelectedProductGrace(
        productGraceDtlData?.productGraces?.find(
          (item) => item.id === workFlowRowSelectResponse.workTableRow.formId
        ) || null
      );
      setSelectedId(workFlowRowSelectResponse.workTableRow.formId);
      setProductField("salesPricesSearchPage", -1); // for not fetching salesPrice in useProduct()
      setBrandField("accSystem",-1)
    }
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
        selectedId={selectedId}
        definitionDateTime={definitionDateTime}
      />
    </div>
  );
};

export default ProductGraceForWorkFlow;
