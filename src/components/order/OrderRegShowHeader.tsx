import { useEffect, useState } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import { useCustomerStore } from "../../store/customerStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { OrderRegShowResponse } from "../../types/order";
//import AutoComplete from "../controls/AutoComplete";
import { useCustomers } from "../../hooks/useCustomers";
import { DefaultOptionType, SearchItem } from "../../types/general";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import { WarehouseSearchResponse } from "../../types/warehouse";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";
import { useWarehouseStore } from "../../store/warehouseStore";
import { useProductStore } from "../../store/productStore";

type Props = {
  orderRegShowResponse: OrderRegShowResponse;
  canEditForm1Mst1: boolean;
  cash1: boolean;
  setCash1: React.Dispatch<React.SetStateAction<boolean>>;
  byPhone: boolean;
  setByPhone: React.Dispatch<React.SetStateAction<boolean>>;
  urgency: boolean;
  setUrgency: React.Dispatch<React.SetStateAction<boolean>>;
  customer: DefaultOptionType | null;
  setCustomer: (customer: DefaultOptionType | null) => void;
  salesPrice: DefaultOptionType | null;
  warehouse: DefaultOptionType | null;
  salesPricesSearchResponse: SearchItem[];
  warehouseSearchResponse: WarehouseSearchResponse;
  //setSalesPriceSearch: React.Dispatch<React.SetStateAction<string>>;
  changeSalesPrice: (newValue: DefaultOptionType) => void;
  changeWarehouse: (newValue: DefaultOptionType) => void;
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
  salesPrice,
  warehouse,
  salesPricesSearchResponse,
  warehouseSearchResponse,
  //setSalesPriceSearch,
  changeSalesPrice,
  changeWarehouse,
}: Props) => {
  const { systemId, yearId } = useGeneralContext();
  const { setField: setWarehouseField } = useWarehouseStore();
  const { setField: setPriceField } = useProductStore();
  const { customers } = useCustomers();
  const { setField: setCustomerField } = useCustomerStore();
  //const [search, setSearch] = useState<string>("");
  const [isCustomerEntered, setIsCustomerEntered] = useState<boolean>(false);
  const [isWarehouseEntered, setIsWarehouseEntered] = useState<boolean>(false);
  const [isPriceEntered, setIsPriceEntered] = useState<boolean>(false);
  /*useEffect(() => {
    setCustomerField("systemIdCustomerSearch", systemId);
    setCustomerField("yearIdCustomerSearch", yearId);
    setCustomerField("search", "ا");
    setCustomerField("page", 1);
    setCustomerField("lastId", 0);
    setCustomerField("centerType", 0);
  }, [systemId, yearId]);*/

  useEffect(() => {
    const orderMst = orderRegShowResponse.data.result.orderMst;
    if (orderMst) {
      setCash1(orderMst.cash ?? false);
      setByPhone(orderMst.byPhone ?? false);
      setUrgency(orderMst.urgency ?? false);
      setCustomer({
        id: orderMst.cId ?? "",
        title: orderMst.srName ?? "",
      });
    }
  }, [
    orderRegShowResponse.data.result.orderMst?.cash,
    orderRegShowResponse.data.result.orderMst?.byPhone,
    orderRegShowResponse.data.result.orderMst?.urgency,
    orderRegShowResponse.data.result.orderMst?.cId,
    orderRegShowResponse.data.result.orderMst?.srName,
    setCash1,
    setByPhone,
    setUrgency,
    setCustomer,
  ]);

  const { width } = useCalculateTableHeight();

  return (
    <div className="mt-2 text-sm w-full flex flex-col gap-2 border border-gray-400 rounded-md p-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        <div className="w-full md:w-3/4 flex justify-center items-center">
          <AutoCompleteSearch
            label="خریدار"
            labelWidth="w-16"
            setField={setCustomerField}
            fieldValues={[
              { field: "systemIdCustomerSearch", value: systemId },
              { field: "yearIdCustomerSearch", value: yearId },
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
                  id: newValue.id,
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
            disabled={!canEditForm1Mst1}
          />
          {orderRegShowResponse.data.result.orderMst?.blackList ? (
            <p className="text-red-500 w-20 p-1">لیست سیاه</p>
          ) : null}
        </div>
        <div className="w-full md:w-1/4 flex">
          <label className="p-1 w-20 md:w-12 text-left">ثبت:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              orderRegShowResponse.data.result.orderMst?.dat +
                " - " +
                orderRegShowResponse.data.result.orderMst?.tim
            )}
            disabled={!canEditForm1Mst1}
            readOnly
            className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex w-full">
        <label className="p-1 w-20 text-left">توضیحات:</label>
        <input
          type="text"
          value={convertToFarsiDigits(
            orderRegShowResponse.data.result.orderMst?.exp ?? ""
          )}
          disabled={!canEditForm1Mst1}
          readOnly
          className="text-sm text-gray-400 w-full p-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex w-1/2">
          <label className="p-1 w-20 text-left">تیتک:</label>
          <input
            type="text"
            value={convertToFarsiDigits(
              orderRegShowResponse.data.result.orderMst?.dsc ?? ""
            )}
            disabled={!canEditForm1Mst1}
            readOnly
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
            readOnly
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
              orderRegShowResponse.data.result.orderMst?.customerDcrmntPrcnt ??
                ""
            )}
            readOnly
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
      {width <= 640 ? (
        <>
          <AutoCompleteSearch
            label=""
            labelWidth="w-16"
            setField={setPriceField}
            fieldValues={[
              { field: "salesPricesSearchPage", value: 1 },
              { field: "salesPricesSearchLastId", value: 0 },
            ]}
            fieldSearch="salesPricesSearchSearch"
            options={salesPricesSearchResponse.map((b) => ({
              id: b.id,
              text: convertToFarsiDigits(b.text),
            }))}
            selectedOption={salesPrice as DefaultOptionType}
            isEntered={isPriceEntered}
            setIsEntered={setIsPriceEntered}
            handleChange={(_event, newValue) => {
              changeSalesPrice(newValue as DefaultOptionType);
            }}
            textAlign="center"
            placeholder="قیمت را انتخاب کنید..."
          />
          {/*<div className="flex items-center justify-between w-full">
            <label className="p-1 w-20 text-left">قیمت:</label>
            <AutoComplete
              disabled={false}
              options={salesPricesSearchResponse.map((b) => ({
                id: b.id,
                title: b.text,
              }))}
              value={salesPrice}
              handleChange={(_event, newValue) => {
                changeSalesPrice(newValue as DefaultOptionType);
              }}
              setSearch={setSalesPriceSearch}
              showLabel={false}
              outlinedInputPadding="10px"
              backgroundColor={"white"}
              showClearIcon={false}
              inputPadding="0 !important"
              textAlign="center"
              desktopfontsize="12px"
              placeholder="قیمت را انتخاب کنید..."
            />
          </div> */}
          <AutoCompleteSearch
            label="انبار"
            labelWidth="w-16"
            setField={setWarehouseField}
            fieldValues={[
              { field: "page", value: 1 },
              { field: "pageSize", value: 30 },
              { field: "lastId", value: 0 },
              { field: "CustomerTypeId", value: -1 },
              { field: "PartKey", value: 0 },
            ]}
            fieldSearch="search"
            options={warehouseSearchResponse.data.result.searchResults.map(
              (b) => ({
                id: b.id,
                text: convertToFarsiDigits(b.text),
              })
            )}
            selectedOption={warehouse as DefaultOptionType}
            isEntered={isWarehouseEntered}
            setIsEntered={setIsWarehouseEntered}
            handleChange={(_event, newValue) => {
              changeWarehouse(newValue as DefaultOptionType);
            }}
            textAlign="center"
          />
        </>
      ) : null}
    </div>
  );
};

export default OrderRegShowHeader;
