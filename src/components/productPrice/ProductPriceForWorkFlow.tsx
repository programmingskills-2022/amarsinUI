import { useEffect, useState } from "react";
import { useProductPrice } from "../../hooks/useProductPrice";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { ProductPrice } from "../../types/productPrice";
import { useProductPriceStore } from "../../store/productPriceStore";
import ProductPriceForm from "./ProductPriceForm";
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

const ProductPriceForWorkFlow = ({ workFlowRowSelectResponse,definitionDateTime, refetchSwitch, setRefetchSwitch }: Props) => {
  const {
    productPriceDtl,
    productPriceDtlData,
    addProductList,
    productPriceDtlHistory,
    isLoadingDtlHistory,
    productPriceSave,
    isLoadingProductPriceSave,
    refetchProductPriceDtl,
  } = useProductPrice();

  const { setField,id } = useProductPriceStore();
  const {setField:setProductField}= useProductStore()
  const {setField:setBrandField}= useBrandStore()
  
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedProductPrice, setSelectedProductPrice] =
  useState<ProductPrice | null>(null);
  
  const {yearId, systemId  }=useGeneralContext() 
  if (id!==workFlowRowSelectResponse.workTableRow.formId){
    console.log("enter...")
    setField("yearId", -1);
    setField("systemId", -1);
    setField("yearIdDtl", yearId);
    setField("systemIdDtl", systemId);
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
    setProductField("salesPricesSearchPage", -1); // for not fetching salesPrice in useProduct()
  }
  /*useEffect(() => {
    setField("yearId", yearId);
    setField("systemId",systemId );
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }, [workFlowRowSelectResponse.workTableRow.formId, yearId,systemId]);*/

  ////////////////////////////////////////////////////////////////////////
  //refetch refetchProductPriceDtl if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchProductPriceDtl();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log("enter..",productPriceDtlData);
    console.log(
      productPriceDtlData?.productPrices?.find(
        (item) => item.id === workFlowRowSelectResponse.workTableRow.formId
      ) || null
    );
    if (workFlowRowSelectResponse.workTableRow.formId !== 0) {      
      setSelectedProductPrice(
        productPriceDtlData?.productPrices?.find(
          (item) => item.id === workFlowRowSelectResponse.workTableRow.formId
        ) || null
      );
      setSelectedId(workFlowRowSelectResponse.workTableRow.formId);
      setProductField("salesPricesSearchPage", -1); // for not fetching salesPrice in useProduct()
      setBrandField("accSystem",-1)
    }
  }, [
    workFlowRowSelectResponse.workTableRow.formId,
    productPriceDtlData?.productPrices,
  ]);

  return (
    <div className="w-full h-full py-2">
      <ProductPriceForm
        canEditForm1={workFlowRowSelectResponse.workTableForms.canEditForm1}
        addProductList={addProductList}
        productPriceDtlHistory={productPriceDtlHistory || []}
        isLoadingDtlHistory={isLoadingDtlHistory}
        productPriceSave={productPriceSave}
        isLoadingProductPriceSave={isLoadingProductPriceSave}
        selectedProductPrice={selectedProductPrice} //for check if selectedProductPrice.flwId===0 new else edit && sending selectedProductPrice.id in edit
        productPriceDtls={productPriceDtl}
        isNew={false} //for check if isNew new else edit
        isEdit={true}
        setIsNew={() => false}
        setIsEdit={() => true}
        fromWorkFlow={true} //for going to editting in product grace form as default
        selectedId={selectedId}
        definitionDateTime={definitionDateTime}
      />
    </div>
  );
};

export default ProductPriceForWorkFlow;
