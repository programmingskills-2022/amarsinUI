import { useEffect, useState } from "react";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import ProductOfferForm from "./ProductOfferForm";
import { useProductOffer } from "../../hooks/useProductOffer";
import { useProductOfferStore } from "../../store/productOfferStore";
import { ProductOffer } from "../../types/productOffer";
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

const ProductOfferForWorkFlow = ({
  workFlowRowSelectResponse,
  definitionDateTime,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const {
    productOfferDtl,
    productOfferDtlData,
    addProductList,
    productOfferDtlHistory,
    isLoadingProductOfferDtlHistory,
    productOfferSave,
    isLoadingProductOfferSave,
    refetchProductOfferDtl,
    isLoadingAddList,
  } = useProductOffer();

  const { setField, id } = useProductOfferStore();
  const {setField:setProductField}= useProductStore()
  const {setField:setBrandField}= useBrandStore()
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedProductOffer, setSelectedProductOffer] =
    useState<ProductOffer | null>(null);

  const { yearId, systemId } = useGeneralContext();
  if (id !== workFlowRowSelectResponse.workTableRow.formId) {
    setField("acc_YearDtl", yearId);
    setField("acc_SystemDtl", systemId);
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }
  /*useEffect(() => {
    setField("acc_Year", yearId);
    setField("acc_System", systemId);
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }, [workFlowRowSelectResponse.workTableRow.formId, yearId, systemId]);*/
  ////////////////////////////////////////////////////////////////////////
  //refetch refetchProductGraceDtl if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchProductOfferDtl();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (workFlowRowSelectResponse.workTableRow.formId !== 0) {
      setSelectedProductOffer(
        productOfferDtlData?.productOffers?.find(
          (item) => item.id === workFlowRowSelectResponse.workTableRow.formId
        ) || null
      );
      setSelectedId(workFlowRowSelectResponse.workTableRow.formId);
      setProductField("salesPricesSearchPage", -1); // for not fetching salesPrice in useProduct()
      setBrandField("accSystem",-1)
    }
  }, [
    workFlowRowSelectResponse.workTableRow.formId,
    productOfferDtlData?.productOffers,
  ]);

  return (
    <div className="w-full h-full py-2">
      <ProductOfferForm
        isLoadingAddList={isLoadingAddList}
        canEditForm1={workFlowRowSelectResponse.workTableForms.canEditForm1}
        addProductList={addProductList}
        productOfferDtlHistory={productOfferDtlHistory || []}
        isLoadingProductOfferDtlHistory={isLoadingProductOfferDtlHistory}
        productOfferSave={productOfferSave}
        isLoadingProductOfferSave={isLoadingProductOfferSave}
        selectedProductOffer={selectedProductOffer} //for check if selectedProductOffer.flwId===0 new else edit && sending selectedProductOffer.id in edit
        productOfferDtls={productOfferDtl}
        isNew={false} //for check if isNew new else edit
        setIsNew={() => false}
        setIsEdit={() => true}
        fromWorkFlow={true} //for going to editting in product offer form as default
        selectedId={selectedId}
        definitionDateTime={definitionDateTime}
      />
    </div>
  );
};

export default ProductOfferForWorkFlow;
