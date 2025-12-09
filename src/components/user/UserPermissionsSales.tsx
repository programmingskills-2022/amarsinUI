import { useMemo, useState } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import { SalesPriceUserPerms } from "../../types/user";
import { TableColumns } from "../../types/general";
import TTable from "../controls/TTable";
import { Paper } from "@mui/material";
import Skeleton from "../layout/Skeleton";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";

type Props = {
  salesPriceUserPerms: SalesPriceUserPerms[];
  isLoading: boolean;
  onSalesPriceUserPermChange?: (salesPriceUserPermId: string | number) => void;
};
const UserPermissionsSales = ({
  salesPriceUserPerms,
  isLoading,
  onSalesPriceUserPermChange,
}: Props) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const columns: TableColumns = [
    {
      Header: ".",
      accessor: "title",
      width: "92%",
    },
    {
      Header: ".",
      accessor: "checkedInput",
      width: "8%",
    },
  ];
  const data = useMemo(() => {
    return salesPriceUserPerms.map(
      (salesPriceUserPerm: SalesPriceUserPerms) => {
        return {
          ...salesPriceUserPerm,
          title: convertToFarsiDigits(salesPriceUserPerm.title),
          checkedInput: (
            <input
              type="checkbox"
              className="flex items-center justify-center"
              checked={salesPriceUserPerm.slct}
              onChange={() => {
                onSalesPriceUserPermChange?.(salesPriceUserPerm.salesPriceId);
              }}
            />
          ),
        };
      }
    );
  }, [salesPriceUserPerms, onSalesPriceUserPermChange]);
  const { height, width } = useCalculateTableHeight();
  return (
    <div className="w-full flex flex-col gap-2 text-sm text-gray-600 md:h-[calc(100%-30px)] md:overflow-y-auto"
    style={width > 640 ? { height: height } : { height: "fit" }}>
      <Paper
        className="w-full overflow-y-auto px-2"
        
      >
        {isLoading ? (
          <div className="text-center">{<Skeleton />}</div>
        ) : (
          <div className="w-full mt-2">
            <TTable
              columns={columns}
              data={data}
              selectedRowIndex={selectedRowIndex}
              setSelectedRowIndex={setSelectedRowIndex}
              changeRowSelectColor={true}
              showHeader={false}
            />
          </div>
        )}
      </Paper>
    </div>
  );
};

export default UserPermissionsSales;
