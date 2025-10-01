import { useEffect, useState } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import AutoComplete from "../controls/AutoComplete";
import { useCustomers } from "../../hooks/useCustomers";
import { DefaultOptionType } from "../../types/general";
import { WarehouseTemporaryReceiptPurchaseShowResponse } from "../../types/warehouse";
import { useWarehouse } from "../../hooks/useWarehouse";

type Props = {
  warehouseTemporaryReceiptPurchaseShowResponse: WarehouseTemporaryReceiptPurchaseShowResponse;
  canEditForm1Mst2: boolean;
};

const ReceiptPurchaseShowHeader = ({
  warehouseTemporaryReceiptPurchaseShowResponse,
  canEditForm1Mst2,
}: Props) => {
  const [customer, setCustomer] = useState<DefaultOptionType | null>(null);
  const [datTim, setDatTim] = useState<string>("");
  const [exp, setExp] = useState<string>("");
  const { customers } = useCustomers();
  const [search, setSearch] = useState<string>("");

  const { warehouseSearchResponse } = useWarehouse();
  const [warehouseSearch, setWarehouseSearch] = useState<string>("");
  const [warehouse, setWarehouse] = useState<DefaultOptionType | null>(null);

  useEffect(() => {
    setCustomer({
      id:
        warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
          .warehouseTemporaryReceiptMst?.cId ?? "",
      title:
        warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
          .warehouseTemporaryReceiptMst?.srName ?? "",
    });
    setDatTim(
      warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
        .warehouseTemporaryReceiptMst?.dat +
        " - " +
        warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
          .warehouseTemporaryReceiptMst?.tim
    );
    setExp(
      warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
        .warehouseTemporaryReceiptMst?.exp ?? ""
    );
    setWarehouse({
      id:
        warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.wId ??
        "",
      title:
        convertToFarsiDigits(
          warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.wName
        ) ?? "",
    });
  }, [
    warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.warehouseTemporaryReceiptMst,
    warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.wName,
    warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.wId
  ]);


  useEffect(() => {
    console.log(warehouseSearch,search);
  }, []);
  
  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <div className="w-full md:w-3/4 flex justify-center items-center">
          <label className="p-1 w-20 text-left">خریدار:</label>
          <div className="flex w-full rounded-md">
            <AutoComplete
              options={customers.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={customer}
              handleChange={(_event, newValue) => {
                return setCustomer(newValue as DefaultOptionType | null);
              }}
              disabled={!canEditForm1Mst2}
              setSearch={setSearch}
              showLabel={false}
              backgroundColor={!canEditForm1Mst2 ? "inherit" : "white"}
              showClearIcon={false}
              inputPadding="0 !important"
            />
          </div>
        </div>
        <div className="w-full md:w-1/4 flex">
          <label className="p-1 w-20 md:w-12 text-left">تاریخ:</label>
          <input
            type="text"
            value={convertToFarsiDigits(datTim)}
            disabled={!canEditForm1Mst2}
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <div className="md:w-3/4 flex">
          <label className="p-1 w-20 text-left">توضیحات:</label>
          <input
            type="text"
            value={convertToFarsiDigits(exp)}
            disabled={!canEditForm1Mst2}
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="md:w-1/4 flex justify-center items-center">
          <label className="p-1 w-20 md:w-12 text-left">انبار:</label>
          <AutoComplete
            disabled={!canEditForm1Mst2}
            options={warehouseSearchResponse.data.result.searchResults.map(
              (b) => ({
                id: b.id,
                title: b.text,
              })
            )}
            value={warehouse}
            handleChange={(_event, newValue) => {
              setWarehouse(newValue as DefaultOptionType);
            }}
            setSearch={setWarehouseSearch}
            showLabel={false}
            backgroundColor={!canEditForm1Mst2 ? "inherit" : "white"}
            showClearIcon={false}
            inputPadding="0 !important"
            //placeholder="انبار را انتخاب کنید..."
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptPurchaseShowHeader;
