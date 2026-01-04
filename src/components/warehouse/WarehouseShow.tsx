//کارشناس خرید => ثبت اولیه رسید موقت
import { useEffect, useState } from "react";
import WarehouseShowHeader from "./WarehouseShowHeader";
import WarehouseShowTable from "./WarehouseShowTable";
import ModalForm from "../layout/ModalForm";
import ProductCatalogue from "./ProductCatalogue";
import { WarehouseTemporaryReceiptIndentDtl } from "../../types/warehouse";
import { useGeneralContext } from "../../context/GeneralContext";
import ModalMessage from "../layout/ModalMessage";
import { useWarehouseStore } from "../../store/warehouseStore";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useWarehouse } from "../../hooks/useWarehouse";
import WarehouseIndentTable from "./WarehouseIndentTable";
import ShowMessages from "../controls/ShowMessages";
import { colors } from "../../utilities/color";
import { useProductStore } from "../../store/productStore";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
};

const WarehouseShow = ({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
}: Props) => {
  const [isModalOpenReg, setIsModalOpenReg] = useState(false);
  const [statusClicked, setStatusClicked] = useState(false);
  const [confirmHasError, setConfirmHasError] = useState(false);
  const { selectIndentsResponse, regResponse, formIdWarehouseTemporaryReceipt, setField } =
    useWarehouseStore();
  const { setField: setProductField } = useProductStore();
  //const { setField: setTTacField } = useTTacStore();

  // Set formId BEFORE useWarehouse hook runs to prevent stale queries
  if (formIdWarehouseTemporaryReceipt !== workFlowRowSelectResponse.workTableRow.formId) {
    setField("formIdWarehouseTemporaryReceipt", workFlowRowSelectResponse.workTableRow.formId);
    setField("formIdWarehouseTemporaryReceiptTitac", -1);
    setField("receiptPurchaseId", -1);
    setProductField("idProductCatalogRequest", -1); // Disable productCatalog query
    setField("iocId", -1); // Disable indentList query
    setField("id", -1); // Disable salesPrices query
    setField("idReg", -1); // Disable purchaseReg query
    setField("page", -1); //  Disable salesPrices query
    setField("salesPriceId",0)
  }

  //console.log("jskdjskjd")
  const {
    warehouseShowIdResponse,
    isLoadingWarehouseShowId,
    refetchWarehouseShowId,
    reg,
    isLoadingWarehouseIndentList,
    warehouseIndentList,
    editIndents,
  } = useWarehouse();

  const [editClicked, setEditClicked] = useState(false);
  const [iocId, setIocId] = useState(0);
  const [selectedProduct, setSelectedProduct] =
    useState<WarehouseTemporaryReceiptIndentDtl | null>(null);

  //refetch warehouseShow if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchWarehouseShowId();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);

  /*useEffect(() => {
    console.log(
      workFlowRowSelectResponse.workTableRow.formId,
      "formId in WarehouseShow"
    )
    if (formId !== workFlowRowSelectResponse.workTableRow.formId)
      setField("formId", workFlowRowSelectResponse.workTableRow.formId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workFlowRowSelectResponse.workTableRow.formId]);*/

  const [customer, setCustomer] = useState<{
    id: string;
    title: string;
  } | null>({
    id: warehouseShowIdResponse.data.result.response.warehouseTemporaryReceiptMst.cId.toString(),
    title:
      warehouseShowIdResponse.data.result.response.warehouseTemporaryReceiptMst
        .srName,
  });

  const handleProductCatalogueClose = () => {
    setStatusClicked(false);
    setSelectedProduct(null);
  };
  const handleWarehouseIndentListClose = () => {
    setEditClicked(false);
    setIocId(0);
  };
  const handleWarehouseMessagesClose = () => {
    setConfirmHasError(false);
  };

  const { isModalOpen, setIsModalOpen } = useGeneralContext();
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpen || isModalOpenReg) {
      timeoutId = setTimeout(() => {
        setIsModalOpen(false);
        setIsModalOpenReg(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpen, isModalOpenReg]);

  return (
    <div className="w-full flex flex-col">
      <WarehouseShowHeader
        customer={customer}
        setCustomer={setCustomer}
        warehouseShowIdResponse={warehouseShowIdResponse}
      />
      <p className="mt-2 px-2 text-sm">اقلام</p>
      <WarehouseShowTable
        setEditClicked={setEditClicked}
        setStatusClicked={setStatusClicked}
        setSelectedProduct={setSelectedProduct}
        setIocId={setIocId}
        setIsModalOpenReg={setIsModalOpenReg}
        setConfirmHasError={setConfirmHasError}
        customerId={Number(customer?.id)}
        workFlowRowSelectResponse={workFlowRowSelectResponse}
        warehouseShowIdResponse={warehouseShowIdResponse}
        isLoadingWarehouseShowId={isLoadingWarehouseShowId}
        reg={reg}
      />
      {/*open product catalog if status is clicked*/}
      <ModalForm
        isOpen={statusClicked}
        onClose={handleProductCatalogueClose}
        title="کاتالوگ محصول"
        width="1/2"
        isCloseable={true}
      >
        {selectedProduct && (
          <ProductCatalogue dtl={selectedProduct} visible={true} />
        )}
      </ModalForm>
      {/*open product catalog if status is clicked*/}
      <ModalForm
        isOpen={editClicked}
        onClose={handleWarehouseIndentListClose}
        title="لیست درخواستها"
        width="2/3"
      >
        <WarehouseIndentTable
          iocId={iocId}
          handleWarehouseIndentListClose={handleWarehouseIndentListClose}
          isLoadingWarehouseIndentList={isLoadingWarehouseIndentList}
          warehouseIndentList={warehouseIndentList}
          editIndents={editIndents}
        />
      </ModalForm>

      {/*open WarehouseMessages if تایید is clicked with errors*/}
      <ModalForm
        isOpen={confirmHasError}
        onClose={handleWarehouseMessagesClose}
        title="پیام ها"
        width="2/3"
        isCloseable={true}
      >
        <ShowMessages
          dtlErrMsgs={regResponse.data.result.dtlErrMsgs}
          color={colors.yellow100}
        />
      </ModalForm>

      <ModalMessage
        isOpen={isModalOpen}
        backgroundColor="bg-red-200"
        bgColorButton="bg-red-500"
        bgColorButtonHover="bg-red-600"
        color="text-white"
        onClose={() => setIsModalOpen(false)}
        message={selectIndentsResponse.meta.message}
        visibleButton={false}
      />
      <ModalMessage
        isOpen={isModalOpenReg}
        backgroundColor="bg-green-200"
        bgColorButton="bg-green-500"
        bgColorButtonHover="bg-green-600"
        color="text-white"
        onClose={() => setIsModalOpenReg(false)}
        message={regResponse.meta.message ?? ""}
        visibleButton={false}
      />
    </div>
  );
};

export default WarehouseShow;
