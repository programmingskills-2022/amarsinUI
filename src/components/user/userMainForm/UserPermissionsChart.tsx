import { useMemo, useState } from "react";
import { convertToFarsiDigits } from "../../../utilities/general";
import { UsrChartsPerms } from "../../../types/user";
import UserPermissionsChartTree from "./UserPermissionsChartTree";
import { FaSpinner } from "react-icons/fa";

type Props = {
  usrChartsPerms: UsrChartsPerms[];
  isLoading: boolean;
  onUsrChartsPermChange?: (
    usrChartsPermId: string | number,
    setCurrentUsrChartsPermId: React.Dispatch<React.SetStateAction<number>>,
    data: UsrChartsPerms[],
    setData: React.Dispatch<React.SetStateAction<UsrChartsPerms[]>>,
    addRemoveChartPermission: (request: any) => Promise<any>,
    type: "chart"
  ) => void;
  setUsrChartsPermsData: React.Dispatch<React.SetStateAction<UsrChartsPerms[]>>;
  addRemoveChartPermission: (request: any) => Promise<any>;
  isLoadingAddRemoveChartPermission: boolean;
};
const UserPermissionsChart = ({
  usrChartsPerms,
  isLoading,
  onUsrChartsPermChange,
  setUsrChartsPermsData,
  addRemoveChartPermission,
  isLoadingAddRemoveChartPermission,
}: Props) => {
  const [currentUsrChartsPermId, setCurrentUsrChartsPermId] =
    useState<number>(0);
  const data = useMemo(() => {
    return usrChartsPerms.map((usrChartsPerm: UsrChartsPerms) => {
      return {
        ...usrChartsPerm,
        name: convertToFarsiDigits(usrChartsPerm.name),
        checkedInput:
          isLoadingAddRemoveChartPermission &&
          usrChartsPerm.id === currentUsrChartsPermId ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <input
              type="checkbox"
              className="flex items-center justify-center"
              checked={usrChartsPerm.slct}
              onChange={() => {
                if (onUsrChartsPermChange) {
                  onUsrChartsPermChange(
                    usrChartsPerm.id,
                    setCurrentUsrChartsPermId,
                    usrChartsPerms,
                    setUsrChartsPermsData,
                    addRemoveChartPermission,
                    "chart"
                  );
                }
              }}
            />
          ),
      };
    });
  }, [
    usrChartsPerms,
    isLoadingAddRemoveChartPermission,
    currentUsrChartsPermId,
    onUsrChartsPermChange,
    setUsrChartsPermsData,
    addRemoveChartPermission,
  ]);

  return (
    <div className="w-full flex flex-col gap-2 text-sm text-gray-600 h-full md:h-[calc(100%-30px)] md:overflow-y-auto">
      <UserPermissionsChartTree data={data} isLoading={isLoading} />
    </div>
  );
};

export default UserPermissionsChart;
