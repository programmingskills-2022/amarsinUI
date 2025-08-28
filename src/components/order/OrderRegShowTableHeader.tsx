import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import {
  ColumnGroup,
  TableColumns,
  Column,
  DefaultOptionType,
} from "../../types/general";
import AutoComplete from "../controls/AutoComplete";
import { OrderRegShowResponse } from "../../types/order";
import { useOrderStore } from "../../store/orderStore";
import { useWarehouse } from "../../hooks/useWarehouse";
import { convertToFarsiDigits, convertToLatinDigits } from "../../utilities/general";

type Props = {
  orderRegShowResponse: OrderRegShowResponse;
  columns: TableColumns;
  salesPrice: DefaultOptionType | null;
  warehouse: DefaultOptionType | null;
  setSalesPrice: React.Dispatch<React.SetStateAction<DefaultOptionType | null>>;
  setWarehouse: React.Dispatch<React.SetStateAction<DefaultOptionType | null>>;
};

const OrderRegShowTableHeader = ({
  orderRegShowResponse,
  columns,
  salesPrice,
  warehouse,
  setSalesPrice,
  setWarehouse,
}: Props) => {
  const { salesPricesSearchResponse } = useProducts();
  const { warehouseSearchResponse } = useWarehouse();
  const [salesPriceSearch, setSalesPriceSearch] = useState<string>("");
  const [warehouseSearch, setWarehouseSearch] = useState<string>("");
  const {setField:setSalesPriceField,setField:setWarehouseField}=useOrderStore()


  useEffect(() => {
    setSalesPriceField("salesPricesSearch", salesPriceSearch);
    setSalesPriceField("salesPricesSearchPage", 1);
    setSalesPriceField("lastId", 0);
  }, [salesPriceSearch]);

  useEffect(() => {
    //console.log(convertToLatinDigits(warehouseSearch),"warehouseSearch");
    setWarehouseField("search", convertToLatinDigits(warehouseSearch) ? null :"ا");
    setWarehouseField("page", 1);
    setWarehouseField("pageSize", 30);
    setWarehouseField("lastId", 0);
    setWarehouseField("CustomerTypeId", -1);
    setWarehouseField("PartKey", 0);
  }, [warehouseSearch]);

  useEffect(() => {
    setSalesPrice({
      id: orderRegShowResponse.data.result.defaultPriceId,
      title: convertToFarsiDigits(orderRegShowResponse.data.result.priceTitle),
    });
    setWarehouse({
      id: orderRegShowResponse.data.result.defaultWarehouseId,
      title: convertToFarsiDigits(orderRegShowResponse.data.result.warehouseName),
    });
  }, [orderRegShowResponse]);

  const calculateMergedWidth = (columnGroup: ColumnGroup) => {
    const mergedColumns = ["cupCode", "cupCnt", "cupOCnt", "cupEDate", "editIcon2"];
    let totalWidth = 0;
    columnGroup.columns.forEach((column) => {
      if (mergedColumns.includes(column.accessor)) {
        const columnWidth = Number(column.width?.slice(0, -1)) || 0;
        totalWidth += columnWidth;
      }
    });
    return (totalWidth * 100) / Number(columnGroup.width?.slice(0, -1)) + "%";
  };
//change order sales price
  const changeSalesPrice = (newValue: DefaultOptionType) => {
    //console.log(newValue);
    setSalesPriceField("orderIdForSalesPrice", orderRegShowResponse.data.result.orderMst.id);
    setSalesPriceField("salesPriceId", newValue.id);
    setSalesPrice(newValue);
    setSalesPriceSearch(newValue.title);
  };
//change warehouse
  const changeWarehouse = (newValue: DefaultOptionType) => {
    //console.log(newValue);
    setWarehouse(newValue);
    setWarehouseSearch(newValue?.title ?? "ا");
  };

  return (
    <>
      {/* Group Header */}
      <div className="flex text-xs font-bold text-gray-500 w-full">
        {columns.map((item: ColumnGroup | Column) => {
          // Check if item is a ColumnGroup
          const columnGroup = item as ColumnGroup;
          return (
            <div
              className="bg-gray-200 p-1 border-r border-y last:border-x border-gray-300 text-center"
              style={{
                width: columnGroup.width,
                backgroundColor: columnGroup.backgroundColor,
              }}
            >
              {columnGroup.Header}
            </div>
          );
        })}
      </div>
      <div className="w-full border-gray-300">
        {/* Column Header */}
        <div className="flex text-xs font-bold text-gray-500 w-full">
          {columns.map((item: ColumnGroup | Column) => {
            const columnGroup = item as ColumnGroup;
            const mergedWidth = calculateMergedWidth(columnGroup);
            return (
              <div
                key={columnGroup.Header}
                className="flex"
                style={{ width: columnGroup.width }}
              >
                {columnGroup.columns.map((column) => {
                  const isMergedColumn = [
                    "cupCode",
                    "cupCnt",
                    "cupOCnt",
                    "cupEDate",
                    "editIcon2",
                  ].includes(column.accessor);
                  //warehouse option place is here
                  if (column.accessor === "cupCode") {
                    return (
                      <div
                        className="bg-gray-200  border-gray-300 text-center flex flex-col items-center justify-center border-r last:border-l border-b"
                        style={{
                          width: mergedWidth,
                          backgroundColor: column.backgroundColor,
                        }}
                      >
                        <AutoComplete
                          disabled={false}
                          options={warehouseSearchResponse.data.result.searchResults.map((b) => ({
                            id: b.id,
                            title: b.text,
                          }))}
                          value={warehouse}
                          handleChange={(_event, newValue) => {
                            changeWarehouse(newValue as DefaultOptionType);
                          }}
                          setSearch={setWarehouseSearch}
                          showLabel={false}
                          outlinedInputPadding="10px"
                          backgroundColor={"white"}
                          showClearIcon={false}
                          inputPadding="0 !important"
                          textAlign="center"
                          desktopfontsize="12px"
                          placeholder="انبار را انتخاب کنید..."
                        />
                      </div>
                    );
                  }
                  //sale price option place is here
                  else if (column.accessor === "salePrice")
                    return (
                      <div
                        className="bg-gray-200  border-gray-300 text-center flex flex-col items-center justify-center border-r last:border-l border-b"
                        style={{
                          width:
                            (
                              (Number(column.width?.slice(0, -1)) * 100) /
                              Number(columnGroup.width?.slice(0, -1))
                            ).toString() + "%",
                          backgroundColor: column.backgroundColor,
                        }}
                      >
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
                      </div>
                    );
                  else if (!isMergedColumn && column.accessor !== "cupCnt")
                    return (
                      <div
                        className="bg-gray-200  border-gray-300 text-center flex flex-col items-center justify-center border-r last:border-l"
                        style={{
                          width:
                            (
                              (Number(column.width?.slice(0, -1)) * 100) /
                              Number(columnGroup.width?.slice(0, -1))
                            ).toString() + "%",
                          backgroundColor: column.backgroundColor,
                        }}
                      >
                        <p className="py-1"></p>
                      </div>
                    );
                })}
              </div>
            );
          })}
        </div>
        {/* Column Header */}
        <div className="flex text-xs font-bold text-gray-500 w-full">
          {columns.map((item: ColumnGroup | Column) => {
            const columnGroup = item as ColumnGroup;
            return (
              <div
                key={columnGroup.Header}
                className="flex"
                style={{ width: columnGroup.width }}
              >
                {columnGroup.columns.map((column) => (
                  <div
                    className="bg-gray-200  border-gray-300 text-center flex flex-col items-center justify-center border-r last:border-l"
                    style={{
                      width:
                        (
                          (Number(column.width?.slice(0, -1)) * 100) /
                          Number(columnGroup.width?.slice(0, -1))
                        ).toString() + "%",
                      backgroundColor: column.backgroundColor,
                    }}
                  >
                    <p className="py-1">{column.Header}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OrderRegShowTableHeader;
