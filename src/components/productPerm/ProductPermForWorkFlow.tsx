import { useEffect, useState } from "react";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import ProductPermForm from "./ProductPermForm";
import { useProductPerm } from "../../hooks/useProductPerm";
import { useProductPermStore } from "../../store/productPermStore";
import { ProductPerm } from "../../types/productPerm";
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

const ProductPermForWorkFlow = ({ workFlowRowSelectResponse, definitionDateTime, refetchSwitch, setRefetchSwitch }: Props) => {
  const {
    productPermDtl,
    productPermDtlData,
    addProductList,
    productPermDtlHistory,
    isLoadingDtlHistory,
    productPermSave,
    isLoadingProductPermSave,
    refetchProductPermDtl,
  } = useProductPerm();

  const { setField,id } = useProductPermStore();
  const {setField:setProductField}= useProductStore()
  const {setField:setBrandField}= useBrandStore()
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedProductPerm, setSelectedProductPerm] =
    useState<ProductPerm | null>(null);

  const { yearId, systemId } = useGeneralContext();
  if (id!==workFlowRowSelectResponse.workTableRow.formId){
    setField("yearId", -1);
    setField("systemId", -1);
    setField("systemIdDtl", systemId);
    setField("yearIdDtl", yearId);
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }
  /*useEffect(() => {
    setField("yearId", yearId);
    setField("systemId", systemId);
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }, [workFlowRowSelectResponse.workTableRow.formId, yearId, systemId]);*/

  ////////////////////////////////////////////////////////////////////////
  //refetch refetchProductPermDtl if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchProductPermDtl();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (workFlowRowSelectResponse.workTableRow.formId !== 0) {
      setSelectedProductPerm(
        productPermDtlData?.productPerms?.find(
          (item) => item.id === workFlowRowSelectResponse.workTableRow.formId
        ) || null
      );
      setSelectedId(workFlowRowSelectResponse.workTableRow.formId);
      setProductField("salesPricesSearchPage", -1); // for not fetching salesPrice in useProduct()
      setBrandField("accSystem",-1)
    }
  }, [
    workFlowRowSelectResponse.workTableRow.formId,
    productPermDtlData?.productPerms,
  ]);

  return (
    <div className="w-full h-full py-2">
      <ProductPermForm
        canEditForm1={workFlowRowSelectResponse.workTableForms.canEditForm1}
        addProductList={addProductList}
        productPermDtlHistory={productPermDtlHistory || []}
        isLoadingDtlHistory={isLoadingDtlHistory}
        productPermSave={productPermSave}
        isLoadingProductPermSave={isLoadingProductPermSave}
        selectedProductPerm={selectedProductPerm} //for check if selectedProductPerm.flwId===0 new else edit && sending selectedProductPerm.id in edit
        productPermDtls={productPermDtl}
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

export default ProductPermForWorkFlow;
