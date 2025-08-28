import { useEffect, useState } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import AutoComplete from "../controls/AutoComplete";
import { useCustomers } from "../../hooks/useCustomers";
import { useCustomerStore } from "../../store/customerStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { WarehouseShowIdResponse } from "../../types/warehouse";

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
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setCusomerField("systemId", systemId);
    setCusomerField("yearId", yearId);
    setCusomerField("search", search);
  }, [search, systemId]);

  useEffect(() => {
    setCustomer({
      id: warehouseShowIdResponse.data.result.response.warehouseTemporaryReceiptMst.cId.toString(),
      title:
        warehouseShowIdResponse.data.result.response
          .warehouseTemporaryReceiptMst.srName,
    });
  }, [warehouseShowIdResponse]);

  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="w-3/4 flex justify-center items-center">
          <label className="p-1 w-24 text-left">تامین کننده:</label>
          <div className="bg-slate-50 flex w-full">
            <AutoComplete
              options={customers.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={customer}
              handleChange={(_event, newValue) => {
                return setCustomer(newValue as Customer);
              }}
              setSearch={setSearch}
              showLabel={false}
              inputPadding="0 !important"
              showClearIcon={false}
            />
          </div>
        </div>
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
