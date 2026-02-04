import { Paper } from "@mui/material";
import { TableColumns } from "../../../types/general";
import Skeleton from "../../layout/Skeleton";
import TTable from "../../controls/TTable";
import { InventoryProductFlowResponse } from "../../../types/inventory";
import { useMemo } from "react";
import { convertToFarsiDigits } from "../../../utilities/general";

type Props = {
  inventoryProductFlowResponse: InventoryProductFlowResponse;
  isLoading: boolean;
};

const InventoryProductFlowShow = ({
  inventoryProductFlowResponse,
  isLoading,
}: Props) => {
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "عنوان",
      accessor: "strFrm",
      width: "10%",
    },
    {
      Header: "فاکتور",
      accessor: "code",
      width: "10%",
    },
    {
      Header: "تاریخ",
      accessor: "dat",
      width: "10%",
    },
    {
      Header: "طرف حساب",
      accessor: "srName",
      width: "35%",
    },
    {
      Header: "تعداد",
      accessor: "cnt",
      width: "5%",
    },
    {
      Header: "قیمت بازرگانی",
      accessor: "tCost",
      width: "10%",
    },
    {
      Header: "بچ",
      accessor: "cupCode",
      width: "5%",
    },
    {
      Header: "قیمت انبار",
      accessor: "cost",
      width: "10%",
    },
  ];
  const data = useMemo(() => {
    return inventoryProductFlowResponse.data.result.map((item, index) => ({
      ...item,
      index: convertToFarsiDigits(index + 1),
      strFrm: convertToFarsiDigits(item.strFrm),
      code: convertToFarsiDigits(item.code),
      dat: convertToFarsiDigits(item.dat),
      cnt: convertToFarsiDigits(item.cnt),
      tCost: convertToFarsiDigits(item.tCost),
      cost: convertToFarsiDigits(item.cost),
      cupCode: convertToFarsiDigits(item.cupCode),
      srName: convertToFarsiDigits(item.srName),
    }));
  }, [inventoryProductFlowResponse.data.result]);
  return (
    <Paper className="p-2 mt-2 w-full">
      {isLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : inventoryProductFlowResponse.meta.errorCode > 0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {inventoryProductFlowResponse.meta.message}
        </p>
      ) : (
        <div className="mt-2 overflow-y-auto" style={{ height: "500px" }}>
          <TTable
            columns={columns}
            data={data}
            //updateMyData={updateMyData}
            fontSize="0.75rem"
            maxVisibleColumns={6}
          />
        </div>
      )}
    </Paper>
  );
};

export default InventoryProductFlowShow;
