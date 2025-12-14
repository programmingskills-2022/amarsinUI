import { useEffect, useState } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
//import AutoComplete from "../controls/AutoComplete";
import { useCustomers } from "../../hooks/useCustomers";
import { useCustomerStore } from "../../store/customerStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { WarehouseShowIdResponse } from "../../types/warehouse";
import AutoCompleteSearch from "../workflow/workflowMap/AutoCompleteSearch";
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

  /*useEffect(() => {
    setCusomerField("systemIdCustomerSearch", systemId);
    setCusomerField("yearIdCustomerSearch", yearId);
    setCusomerField("page", 1);
    setCusomerField("lastId", 0);
    setCusomerField("centerType", 0);
    setCusomerField("search", search);
  }, [search, systemId, yearId]);*/

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
        {/*<div className="w-3/4 flex justify-center items-center">
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
        </div>*/}
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
          setSelectedOption={(newValue: DefaultOptionType | null) => {
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
