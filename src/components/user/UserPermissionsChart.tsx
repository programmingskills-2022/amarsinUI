import {  useMemo } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import { UsrChartsPerms } from "../../types/user";
import UserPermissionsChartTree from "./UserPermissionsChartTree";

type Props = {
  usrChartsPerms: UsrChartsPerms[];
  isLoading: boolean;
  onUsrChartsPermChange?: (usrChartsPermId: string | number) => void;
};
const UserPermissionsChart = ({
  usrChartsPerms,
  isLoading,
  onUsrChartsPermChange,
}: Props) => {

  const data = useMemo(() => {
    return usrChartsPerms.map((usrChartsPerm: UsrChartsPerms) => {
      return {
        ...usrChartsPerm,
        name: convertToFarsiDigits(usrChartsPerm.name),
        checkedInput: (
          <input
            type="checkbox"
            className="flex items-center justify-center"
            checked={usrChartsPerm.slct}
            onChange={() => {
              onUsrChartsPermChange?.(usrChartsPerm.id);
            }}
          />
        ),
      };
    });
  }, [usrChartsPerms, onUsrChartsPermChange]);
  
  return (
    <div className="w-full flex flex-col gap-2 text-sm text-gray-600 h-full md:h-[calc(100%-30px)] md:overflow-y-auto">
      <UserPermissionsChartTree data={data} isLoading={isLoading} />
    </div>
  );
};

export default UserPermissionsChart;
