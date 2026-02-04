import { useEffect, useState } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
//import AutoComplete from "../controls/AutoComplete";
import { useCustomers } from "../../hooks/useCustomers";
import { useCustomerStore } from "../../store/customerStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { WarehouseShowIdResponse } from "../../types/warehouse";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";
import { DefaultOptionType } from "../../types/general";

type Customer = {
  id: string;
  title: string;
};
type Props = {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  warehouseShowIdResponse: WarehouseShowIdResponse;
};

const WarehouseShowHeader = ({
  customer,
  setCustomer,
  warehouseShowIdResponse,
}: Props) => {
  //const { setField, formId } = useWarehouseStore();
  const { setField: setCusomerField } = useCustomerStore();
  const { customers } = useCustomers();
  const { systemId, yearId } = useGeneralContext();
  //const [search, setSearch] = useState<string>("");
  const [isCustomerEntered, setIsCustomerEntered] = useState<boolean>(false);

  useEffect(() => {
    const warehouseMst = warehouseShowIdResponse.data.result.response.warehouseTemporaryReceiptMst;
    if (warehouseMst?.cId !== undefined && warehouseMst?.srName !== undefined) {
      setCustomer({
        id: warehouseMst.cId.toString(),
        title: warehouseMst.srName,
      });
    }
  }, [
    warehouseShowIdResponse.data.result.response.warehouseTemporaryReceiptMst?.cId,
    warehouseShowIdResponse.data.result.response.warehouseTemporaryReceiptMst?.srName,
    setCustomer,
  ]);

  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex items-center justify-between gap-2 w-full">
        <AutoCompleteSearch
          label="تامین کننده"
          labelWidth="w-20"
          setField={setCusomerField}
          fieldValues={[
            { field: "systemIdCustomerSearch", value: systemId },
            { field: "yearIdCustomerSearch", value: yearId },
            { field: "page", value: 1 },
            { field: "lastId", value: 0 },
            { field: "centerType", value: 0 },
          ]}
          fieldSearch="search"
          selectedOption={
            {
              id: customer?.id ?? 0,
              title: customer?.title ?? "",
            } as DefaultOptionType
          }
          setSelectedOption={(newValue: any) => {
            if (newValue) {
              setCustomer({
                id: String(newValue.id),
                title: newValue.title,
              });
            } else {
              setCustomer(null);
            }
          }}
          options={customers.map((b) => ({
            id: b.id,
            text: b.text,
          }))}
          isEntered={isCustomerEntered}
          setIsEntered={setIsCustomerEntered}
        />
        <div className="w-1/4 flex">
          <label className="p-1 w-12 text-left">تاریخ:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              warehouseShowIdResponse.data.result.response
                .warehouseTemporaryReceiptMst.dat
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex w-3/4">
          <label className="p-1 w-24 text-left">توضیحات:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              warehouseShowIdResponse.data.result.response
                .warehouseTemporaryReceiptMst.exp
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex w-1/4">
          <label className="p-1 w-12 text-left">انبار:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              warehouseShowIdResponse.data.result.response.wName
            )}
            disabled
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default WarehouseShowHeader;
