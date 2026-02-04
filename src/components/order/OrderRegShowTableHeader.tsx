import {
  ColumnGroup,
  TableColumns,
  Column,
  DefaultOptionType,
  SearchItem,
} from "../../types/general";
//import AutoComplete from "../controls/AutoComplete";
import { WarehouseSearchResponse } from "../../types/warehouse";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";
import { convertToFarsiDigits } from "../../utilities/general";
import { useWarehouseStore } from "../../store/warehouseStore";
import { useState } from "react";
import { useProductStore } from "../../store/productStore";

type Props = {
  columns: TableColumns;
  salesPrice: DefaultOptionType | null;
  warehouse: DefaultOptionType | null;
  //setSalesPriceSearch: React.Dispatch<React.SetStateAction<string>>;
  changeSalesPrice: (newValue: DefaultOptionType) => void;
  changeWarehouse: (newValue: DefaultOptionType) => void;
  salesPricesSearchResponse: SearchItem[];
  warehouseSearchResponse: WarehouseSearchResponse;
};

const OrderRegShowTableHeader = ({
  columns,
  salesPrice,
  warehouse,
  //setSalesPriceSearch,
  changeSalesPrice,
  changeWarehouse,
  salesPricesSearchResponse,
  warehouseSearchResponse,
}: Props) => {
  const { setField: setWarehouseField } = useWarehouseStore();
  const {setField : setPriceField}= useProductStore()
  const [isWarehouseEntered, setIsWarehouseEntered] = useState<boolean>(false);
  const [isPriceEntered, setIsPriceEntered] = useState<boolean>(false); 
  const calculateMergedWidth = (columnGroup: ColumnGroup) => {
    const mergedColumns = [
      "cupCode",
      "cupCnt",
      "cupOCnt",
      "cupEDate",
      "editIcon2",
    ];
    let totalWidth = 0;
    columnGroup.columns.forEach((column) => {
      if (mergedColumns.includes(column.accessor)) {
        const columnWidth = Number(column.width?.slice(0, -1)) || 0;
        totalWidth += columnWidth;
      }
    });
    return (totalWidth * 100) / Number(columnGroup.width?.slice(0, -1)) + "%";
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
              key={columnGroup.Header}
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
                        key={column.accessor}
                        className="bg-gray-200  border-gray-300 text-center flex flex-col items-center justify-center border-r last:border-l border-b"
                        style={{
                          width: mergedWidth,
                          backgroundColor: column.backgroundColor,
                        }}
                      >
                        <AutoCompleteSearch
                          label=""
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
                      </div>
                    );
                  }
                  //sale price option place is here
                  else if (column.accessor === "salePrice")
                    return (
                      <div
                        key={column.accessor}
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
                        <AutoCompleteSearch
                          label=""
                          labelWidth="w-16"
                          setField={setPriceField}
                          fieldValues={[
                            { field: "salesPricesSearchPage", value: 1 },
                            { field: "salesPricesSearchLastId", value: 0 },
                          ]}
                          fieldSearch="salesPricesSearchSearch"
                          options={salesPricesSearchResponse.map(
                            (b) => ({
                              id: b.id,
                              text: convertToFarsiDigits(b.text),
                            })
                          )}
                          selectedOption={salesPrice as DefaultOptionType}
                          isEntered={isPriceEntered}
                          setIsEntered={setIsPriceEntered}
                          handleChange={(_event, newValue) => {
                            changeSalesPrice(newValue as DefaultOptionType);
                          }}
                          textAlign="center"
                          placeholder="قیمت را انتخاب کنید..."
                        />
                        {/*<AutoComplete
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
                        />*/}

                      </div>
                    );
                  else if (!isMergedColumn && column.accessor !== "cupCnt")
                    return (
                      <div
                        key={column.accessor}
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
                  return null;
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
                    key={column.accessor}
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
