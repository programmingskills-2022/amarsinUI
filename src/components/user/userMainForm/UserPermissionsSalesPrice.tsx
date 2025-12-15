import { useMemo, useState } from "react";
import { convertToFarsiDigits } from "../../../utilities/general";
import { SalesPriceUserPerms } from "../../../types/user";
import { TableColumns } from "../../../types/general";
import TTable from "../../controls/TTable";
import { Paper } from "@mui/material";
import Skeleton from "../../layout/Skeleton";
import useCalculateTableHeight from "../../../hooks/useCalculateTableHeight";
import { FaSpinner } from "react-icons/fa";

type Props = {
  salesPriceUserPerms: SalesPriceUserPerms[];
  isLoading: boolean;
  onSalesPriceUserPermChange?: (
    salesPriceUserPermId: string | number,
    setCurrentSalesPriceUserPermId: React.Dispatch<
      React.SetStateAction<number>
    >,
    data: SalesPriceUserPerms[],
    setData: React.Dispatch<React.SetStateAction<SalesPriceUserPerms[]>>,
    addRemoveSalesPricePermission: (request: any) => Promise<any>,
    type: "salesPrice"
  ) => void;
  setSalesPriceUserPermsData: React.Dispatch<
    React.SetStateAction<SalesPriceUserPerms[]>
  >;
  addRemoveSalesPricePermission: (request: any) => Promise<any>;
  isLoadingAddRemoveSalesPricePermission: boolean;
};
const UserPermissionsSalesPrice = ({
  salesPriceUserPerms,
  isLoading,
  onSalesPriceUserPermChange,
  setSalesPriceUserPermsData,
  addRemoveSalesPricePermission,
  isLoadingAddRemoveSalesPricePermission,
}: Props) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const { height, width } = useCalculateTableHeight();
  const columns: TableColumns = [
    {
      Header: ".",
      accessor: "title",
      width: width > 640 ? "92%" : "90%",
    },
    {
      Header: ".",
      accessor: "checkedInput",
      width: width > 640 ? "8%" : "10%",
    },
  ];
  const [currentSalesPriceUserPermId, setCurrentSalesPriceUserPermId] =
    useState<number>(0);
  const data = useMemo(() => {
    return salesPriceUserPerms.map(
      (salesPriceUserPerm: SalesPriceUserPerms) => {
        return {
          ...salesPriceUserPerm,
          title: convertToFarsiDigits(salesPriceUserPerm.title),
          checkedInput:
            isLoadingAddRemoveSalesPricePermission &&
            salesPriceUserPerm.salesPriceId === currentSalesPriceUserPermId ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <input
                type="checkbox"
                className="flex items-center justify-center"
                checked={salesPriceUserPerm.slct}
                onChange={() => {
                  onSalesPriceUserPermChange?.(
                    salesPriceUserPerm.salesPriceId,
                    setCurrentSalesPriceUserPermId,
                    salesPriceUserPerms,
                    setSalesPriceUserPermsData,
                    addRemoveSalesPricePermission,
                    "salesPrice"
                  );
                }}
              />
            ),
        };
      }
    );
  }, [
    salesPriceUserPerms,
    isLoadingAddRemoveSalesPricePermission,
    currentSalesPriceUserPermId,
    onSalesPriceUserPermChange,
    setSalesPriceUserPermsData,
    addRemoveSalesPricePermission,
  ]);
  return (
    <div
      className="w-full flex flex-col gap-2 text-sm text-gray-600 md:h-[calc(100%-30px)] md:overflow-y-auto"
      style={width > 640 ? { height: height } : { height: "fit" }}
    >
      <Paper className="w-full overflow-y-auto px-2">
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

export default UserPermissionsSalesPrice;
