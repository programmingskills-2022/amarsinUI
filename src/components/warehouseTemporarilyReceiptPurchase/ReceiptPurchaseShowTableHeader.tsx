import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import {
  ColumnGroup,
  TableColumns,
  Column,
  DefaultOptionType,
} from "../../types/general";
import { convertToFarsiDigits } from "../../utilities/general";
import { WarehouseTemporaryReceiptPurchaseShowResponse } from "../../types/warehouse";
import HistoryIcon from "../../assets/images/GrayThem/history_gray_16.png";
import { useWarehouseStore } from "../../store/warehouseStore";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";
import { useProductStore } from "../../store/productStore";

type Props = {
  warehouseTemporaryReceiptPurchaseShowResponse: WarehouseTemporaryReceiptPurchaseShowResponse;
  columns: TableColumns;
  salesPrice: DefaultOptionType | null;
  setSalesPrice: React.Dispatch<React.SetStateAction<DefaultOptionType | null>>;
  setIsNewOffer: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewPerm: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewGrace: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewPrice: React.Dispatch<React.SetStateAction<boolean>>;
  permissionOffer: boolean;
  permissionPerm: boolean;
  permissionGrace: boolean;
  permissionPrice: boolean;
};

const ReceiptPurchaseShowTableHeader = ({
  warehouseTemporaryReceiptPurchaseShowResponse,
  columns,
  salesPrice,
  setSalesPrice,
  setIsNewOffer,
  setIsNewPerm,
  setIsNewGrace,
  setIsNewPrice,
  permissionOffer,
  permissionPerm,
  permissionGrace,
  permissionPrice,
}: Props) => {
  const { salesPricesSearchResponse } = useProducts();
  const [salesPriceSearch, setSalesPriceSearch] = useState<string>("");
  const { setField: setSalesPriceField } = useProductStore(); //useWarehouseStore()
  const { setField: setSalesPriceFieldInWarehouse } = useWarehouseStore();
  const [isSalesPricesEntered, setIsSalesPricesEntered] = useState(false);
  //for api/Product/salesPricesSearch req
  /*useEffect(() => {
    setSalesPriceField("salesPricesSearch", salesPriceSearch); 
    setSalesPriceField("salesPricesSearchPage", 1);
    setSalesPriceField("lastId", 0);
  }, [salesPriceSearch]);*/

  useEffect(() => {
    setSalesPrice({
      id: warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.spId,
      title: convertToFarsiDigits(
        warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.spTitle
      ),
    });

    setSalesPriceFieldInWarehouse(
      "id",
      warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
        .warehouseTemporaryReceiptMst.id
    );
    setSalesPriceFieldInWarehouse(
      "salesPriceId",
      warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.spId
    );
  }, [
    warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.spId,
    warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
      .warehouseTemporaryReceiptMst.id,
    warehouseTemporaryReceiptPurchaseShowResponse.data.result.result.spTitle,
  ]);

  //change purchase sales price
  const changeSalesPrice = (newValue: DefaultOptionType) => {
    console.log(salesPriceSearch);
    setSalesPriceFieldInWarehouse(
      "id",
      warehouseTemporaryReceiptPurchaseShowResponse.data.result.result
        .warehouseTemporaryReceiptMst.id
    );
    setSalesPriceFieldInWarehouse("salesPriceId", newValue?.id ?? 1);
    setSalesPrice(newValue);
    setSalesPriceSearch(newValue?.title ?? "");
  };

  const handleHistoryClick = (accessor: string) => {
    if (accessor === "pOffer") {
      setIsNewOffer(true);
    } else if (accessor === "permImage") {
      setIsNewPerm(true);
    } else if (accessor === "graceDays") {
      setIsNewGrace(true);
    }
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
            return (
              <div
                key={columnGroup.Header}
                className="flex"
                style={{ width: columnGroup.width }}
              >
                {columnGroup.columns.map((column) => {
                  if (column.accessor === "salePrice")
                    return (
                      <div
                        key={column.accessor || column.Header}
                        className="bg-gray-200  border-gray-300 text-center flex items-center justify-center border-r"
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
                          setField={setSalesPriceField}
                          fieldValues={[
                            { field: "lastId", value: 0 },
                            { field: "salesPricesSearchPage", value: 1 },
                          ]}
                          fieldSearch="salesPricesSearch"
                          selectedOption={salesPrice as DefaultOptionType}
                          handleChange={(_event, newValue) => {
                            changeSalesPrice(newValue as DefaultOptionType);
                          }}
                          options={salesPricesSearchResponse.map((b) => ({
                            id: b.id,
                            text: b.text,
                          }))}
                          isEntered={isSalesPricesEntered}
                          setIsEntered={setIsSalesPricesEntered}
                        />
                        {permissionPrice && (
                          <img
                            src={HistoryIcon}
                            onClick={() => setIsNewPrice(true)}
                            className="cursor-pointer"
                            alt="HistoryIcon"
                          />
                        )}
                      </div>
                    );
                  else if (
                    column.accessor === "pOffer" ||
                    column.accessor === "permImage" ||
                    column.accessor === "graceDays"
                  )
                    return (
                      <div
                        key={column.accessor || column.Header}
                        className="bg-gray-200  border-gray-300 text-center flex items-center justify-center gap-1 border-r last:border-l"
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
                        {((column.accessor === "pOffer" && permissionOffer) ||
                          (column.accessor === "permImage" && permissionPerm) ||
                          (column.accessor === "graceDays" &&
                            permissionGrace)) && (
                          <img
                            src={HistoryIcon}
                            onClick={() => handleHistoryClick(column.accessor)}
                            className="cursor-pointer"
                            alt="HistoryIcon"
                          />
                        )}
                      </div>
                    );
                  return (
                    <div
                      key={column.accessor || column.Header}
                      className="bg-gray-200 border-gray-300 text-center flex flex-col items-center justify-center border-r last:border-l"
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
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ReceiptPurchaseShowTableHeader;
