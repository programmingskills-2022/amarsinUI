import {   useMemo } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import { SystemUserPerms } from "../../types/user";
import UserPermissionsSystemTree from "./UserPermissionsSystemTree";

type Props = {
  systemUserPerms: SystemUserPerms[];
  isLoading: boolean;
  onSystemUserPermChange?: (systemUserPermId: string | number) => void;
};
const UserPermissionsSystem = ({
  systemUserPerms,
  isLoading,
  onSystemUserPermChange,
}: Props) => {

  const data = useMemo(() => {
    return systemUserPerms.map((systemUserPerm: SystemUserPerms) => {
      return {
        ...systemUserPerm,
        title: convertToFarsiDigits(systemUserPerm.title),
        checkedInput: (
          <input
            type="checkbox"
            className="flex items-center justify-center"
            checked={systemUserPerm.slct}
            onChange={() => {
              onSystemUserPermChange?.(systemUserPerm.id);
            }}
          />
        ),
      };
    });
  }, [systemUserPerms, onSystemUserPermChange]);
  
  return (
    <div className="w-full flex flex-col gap-2 text-sm text-gray-600 md:h-[calc(100%-30px)] md:overflow-y-auto">
      <UserPermissionsSystemTree data={data} isLoading={isLoading} />
    </div>
  );
};

export default UserPermissionsSystem;
