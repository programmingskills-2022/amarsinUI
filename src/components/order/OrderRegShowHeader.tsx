import { useEffect, useState } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import { useCustomerStore } from "../../store/customerStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { OrderRegShowResponse } from "../../types/order";
import AutoComplete from "../controls/AutoComplete";
import { useCustomers } from "../../hooks/useCustomers";
import { DefaultOptionType } from "../../types/general";

type Props = {
  orderRegShowResponse: OrderRegShowResponse;
  canEditForm1Mst1: boolean;
  cash1: boolean;
  setCash1: React.Dispatch<React.SetStateAction<boolean>>
  byPhone: boolean;
  setByPhone: React.Dispatch<React.SetStateAction<boolean>>;
  urgency: boolean;
  setUrgency: React.Dispatch<React.SetStateAction<boolean>>;
  customer: DefaultOptionType | null;
  setCustomer: (customer: DefaultOptionType | null) => void;
};

const OrderRegShowHeader = ({
  orderRegShowResponse,
  canEditForm1Mst1,
  cash1,
  setCash1,
  byPhone,
  setByPhone,
  urgency,
  setUrgency,
  customer,
  setCustomer,
}: Props) => {

  const { systemId, yearId } = useGeneralContext();
  const { customers } = useCustomers();
  const { setField: setCustomerField } = useCustomerStore();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setCustomerField("systemId", systemId);
    setCustomerField("yearId", yearId);
    setCustomerField("search", search);
    setCustomerField("page", 1);
    setCustomerField("lastId", 0);
    setCustomerField("centerType", 0);
  }, [search, systemId, yearId]);

  useEffect(() => {
    setSearch("")
    setCash1(orderRegShowResponse.data.result.orderMst?.cash);
    setByPhone(orderRegShowResponse.data.result.orderMst?.byPhone);
    setUrgency(orderRegShowResponse.data.result.orderMst?.urgency);
    setCustomer({
      id: orderRegShowResponse.data.result.orderMst?.cId ?? "",
      title: orderRegShowResponse.data.result.orderMst?.srName   ?? "",
    });
  }, [orderRegShowResponse.data.result.orderMst]);
  
  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="w-3/4 flex justify-center items-center">
          <label className="p-1 w-20 text-left">خریدار:</label>
          <div className="bg-slate-50 flex w-full rounded-md">
          <AutoComplete
              options={customers.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={customer}
              handleChange={(_event, newValue) => {
                return setCustomer(newValue as DefaultOptionType | null);
              }}
              setSearch={setSearch}
              showLabel={false}
              inputPadding="0 !important"
              showClearIcon={false}
              changeColorOnFocus={true}
              disabled={!canEditForm1Mst1}
            />
          </div>
          {orderRegShowResponse.data.result.orderMst?.blackList ? <p className="text-red-500 w-20 p-1">لیست سیاه</p> : null}
        </div>
        <div className="w-1/4 flex">
          <label className="p-1 w-12 text-left">ثبت:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              orderRegShowResponse.data.result.orderMst?.dat +
                " - " +
                orderRegShowResponse.data.result.orderMst?.tim
            )}
            disabled={!canEditForm1Mst1}
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex w-full">
        <label className="p-1 w-20 text-left">توضیحات:</label>
        <input
          type="text"
          value={convertToFarsiDigits(orderRegShowResponse.data.result.orderMst?.exp ?? "")}
          disabled={!canEditForm1Mst1}
          className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex w-1/2">
          <label className="p-1 w-20 text-left">تیتک:</label>
          <input
            type="text"
            value={convertToFarsiDigits(orderRegShowResponse.data.result.orderMst?.dsc ?? "")}
            disabled={!canEditForm1Mst1}
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex w-1/2">
          <label className="p-1 w-20 text-left">مودیان:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              orderRegShowResponse.data.result.orderMst?.footerDescTxt ?? ""
            )}
            disabled={!canEditForm1Mst1}
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex w-1/3 items-center gap-2">
          <input
            type="checkbox"
            checked={cash1}
            onChange={(e) => setCash1(e.target.checked)}
          />
          <label className="p-1 w-10 text-left">نقدی</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              orderRegShowResponse.data.result.orderMst?.customerDcrmntPrcnt ?? ""
            )}
            className="text-sm text-gray-400 w-16 p-1 border border-gray-300 rounded-md"
          />
          <label className="p-1 text-left">%</label>
        </div>
        <div className="flex w-1/3">
          <input
            className="place-content-end"
            type="checkbox"
            checked={byPhone}
            onChange={(e) => setByPhone(e.target.checked)}
          />
          <label className="p-1 w-12 text-left">تلفنی</label>
        </div>
        <div className="flex w-1/3">
          <input
            type="checkbox"
            checked={urgency}
            onChange={(e) => setUrgency(e.target.checked)}
          />
          <label className="p-1 w-12 text-left">اورژانسی</label>
        </div>
      </div>
    </div>
  );
};

export default OrderRegShowHeader;
