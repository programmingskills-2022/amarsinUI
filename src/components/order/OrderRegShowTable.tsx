import { convertToLatinDigits } from "../../utilities/general";
import Skeleton from "../layout/Skeleton";
import TTable from "../controls/TTable";
import {
  DefaultOptionType,
  SearchItem,
  TableColumns,
} from "../../types/general";
import OrderRegShowTableHeader from "./OrderRegShowTableHeader";
import { colors } from "../../utilities/color";
import { useState } from "react";
import { WarehouseSearchResponse } from "../../types/warehouse";

type Props = {
  processedData: any[];
  isLoadingOrderRegShow: boolean;
  warehouse: DefaultOptionType | null;
  salesPrice: DefaultOptionType | null;
  columns: TableColumns;
  setSalesPriceSearch: React.Dispatch<React.SetStateAction<string>>;
  setWarehouseSearch: React.Dispatch<React.SetStateAction<string>>;
  changeSalesPrice: (newValue: DefaultOptionType) => void;
  changeWarehouse: (newValue: DefaultOptionType) => void;
  salesPricesSearchResponse: SearchItem[];
  warehouseSearchResponse: WarehouseSearchResponse;
};

const OrderRegShowTable = ({
  processedData,
  isLoadingOrderRegShow,
  warehouse,
  salesPrice,
  columns,
  setSalesPriceSearch,
  setWarehouseSearch,
  changeSalesPrice,
  changeWarehouse,
  salesPricesSearchResponse,
  warehouseSearchResponse,
}: Props) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in orderRegShowTable table
  //////////////////////////////////////////////////////////////
  const handleCellColorChange = (row: any, columnId: string): string | null => {
    const colsInfo = row.cells;
    const isEqualOffer = Number(convertToLatinDigits(colsInfo?.[5]?.value ?? 0)) === Number(convertToLatinDigits(colsInfo?.[8]?.value ?? 0));
    const cntOfferSumReg =
      Number(convertToLatinDigits(colsInfo?.[4]?.value ?? 0)) +
      Number(convertToLatinDigits(colsInfo?.[5]?.value ?? 0));
    const cntOfferSumOrder =
      Number(convertToLatinDigits(colsInfo?.[16]?.value ?? 0)) +
      Number(convertToLatinDigits(colsInfo?.[17]?.value ?? 0));
    if ((columnId === "oCnt" || columnId === "offer") && !isEqualOffer) {
      return colors.red200;
    } else if (
      cntOfferSumReg !== cntOfferSumOrder &&
      (columnId === "cupCode" ||
        columnId === "cupEDate" ||
        columnId === "cupCnt" ||
        columnId === "cupOCnt")
    ) {
      return colors.red200;
    } else if (
      columnId === "cupCode" ||
      columnId === "cupEDate" ||
      columnId === "cupCnt" ||
      columnId === "cupOCnt" ||
      columnId === "editIcon2"
    ) {
      return colors.indigo50;
    }
    return null;
  };

  return (
    <>
      <OrderRegShowTableHeader
        columns={columns}
        salesPrice={salesPrice}
        warehouse={warehouse}
        setSalesPriceSearch={setSalesPriceSearch}
        setWarehouseSearch={setWarehouseSearch}
        changeSalesPrice={changeSalesPrice}
        changeWarehouse={changeWarehouse}
        salesPricesSearchResponse={salesPricesSearchResponse}
        warehouseSearchResponse={warehouseSearchResponse}
      />
      {isLoadingOrderRegShow ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <>
          <TTable
            columns={columns}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            data={processedData}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={true}
            showHeader={false}
            CellColorChange={handleCellColorChange}
          />
        </>
      )}
    </>
  );
};

export default OrderRegShowTable;
