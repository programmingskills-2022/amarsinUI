import { useEffect, useState } from "react";
import { usePreInvoiceReturn } from "../../hooks/usePreInvoiceReturn";
import { usePreInvoiceReturnStore } from "../../store/preInvoiceReturnStore";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import WarehouseTemporaryReceiptShowHeader from "./WarehouseTemporaryReceiptShowHeader";
import WarehouseTemporaryReceiptShowTable from "./WarehouseTemporaryReceiptShowTable";
import { DefaultOptionType } from "../../types/general";
import { WarehouseTemporaryReceiptIndentDtl } from "../../types/warehouse";
import ModalForm from "../layout/ModalForm";
import ProductCatalogue from "../warehouse/ProductCatalogue";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
};

const WarehouseTemporaryReceiptShow = ({
  workFlowRowSelectResponse,
}: Props) => {
  const {
    warehouseTemporaryReceiptShowResponse,
    isLoading,
    preInvoiceDtlSearchResponse,
    isLoadingWarehouseTemporaryReceiptSave,
    warehouseTemporaryReceiptSave,
  } = usePreInvoiceReturn();
  const { setField } = usePreInvoiceReturnStore();
  const [preInvoiceDtlSearchOptions, setPreInvoiceDtlSearchOptions] = useState<
    DefaultOptionType[]
  >([]);
  const [search, setSearch] = useState<string>("");
  const [statusClicked, setStatusClicked] = useState(false);
  const [selectedProduct, setSelectedProduct] =
  useState<WarehouseTemporaryReceiptIndentDtl | null>(null);
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    setField("id", workFlowRowSelectResponse.workTableRow.formId);
  }, [workFlowRowSelectResponse.workTableRow.formId]);

  useEffect(() => {
    setField("pagePreInvoiceDtlSearch", 1);
    setField("searchPreInvoiceDtlSearch", search);
    setField(
      "preInvoiceDtlId",
      warehouseTemporaryReceiptShowResponse?.preInvoiceReturnDtls?.[0]?.id
    );
  }, [ search]);
/////////////////////////////////////////////////////////////
  useEffect(() => {
    setPreInvoiceDtlSearchOptions(
      preInvoiceDtlSearchResponse.data.result.results.map((item) => ({
        id: item.id,
        title: item.text,
      }))
    );
  }, [preInvoiceDtlSearchResponse]);

//////////////////////////////////////////////////////////////
  const handleProductCatalogueClose = () => {
    setStatusClicked(false);
    setSelectedProduct(null);
  };
//////////////////////////////////////////////////////////////
  return (
    <div className="w-full flex flex-col">
      <WarehouseTemporaryReceiptShowHeader
        warehouseTemporaryReceiptShowResponse={
          warehouseTemporaryReceiptShowResponse
        }
      />
      <div className="flex items-center w-full justify-between gap-2 py-1">
        <p className="px-2 text-sm">اقلام</p>
        <hr className="w-full border-2 border-gray-300" />
      </div>
      <WarehouseTemporaryReceiptShowTable
        warehouseTemporaryReceiptShowResponse={
          warehouseTemporaryReceiptShowResponse
        }
        isLoadingWarehouseTemporaryReceiptShow={isLoading}
        preInvoiceDtlSearchOptions={preInvoiceDtlSearchOptions}
        canEditForm1={workFlowRowSelectResponse.workTableForms.canEditForm1}
        search={search}
        setSearch={setSearch}
        warehouseTemporaryReceiptSave={warehouseTemporaryReceiptSave}
        isLoadingWarehouseTemporaryReceiptSave={
          isLoadingWarehouseTemporaryReceiptSave
        }
        setStatusClicked={setStatusClicked}
        setSelectedProduct={setSelectedProduct}
      />
      {/*open product catalog if status is clicked*/}
      <ModalForm
        isOpen={statusClicked}
        onClose={handleProductCatalogueClose}
        title="کاتالوگ محصول"
        width="1/2"
      >
        {selectedProduct && <ProductCatalogue dtl={selectedProduct} visible={false} />}
      </ModalForm>      
    </div>
  );
};

export default WarehouseTemporaryReceiptShow;
