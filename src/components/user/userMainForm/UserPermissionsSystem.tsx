import { useMemo, useState } from "react";
import { convertToFarsiDigits } from "../../../utilities/general";
import {
  SystemUserPerms,
} from "../../../types/user";
import UserPermissionsSystemTree from "./UserPermissionsSystemTree";
import { FaSpinner } from "react-icons/fa";

type Props = {
  systemUserPerms: SystemUserPerms[];
  isLoading: boolean;
  onSystemUserPermChange?: (
    systemUserPermId: string | number,
    setCurrentSystemUserPermId: React.Dispatch<React.SetStateAction<number>>,
    data: SystemUserPerms[],
    setData: React.Dispatch<
      React.SetStateAction<SystemUserPerms[]>
    >,
    addRemoveSystemPermission: (request: any) => Promise<any>,
    type: "system"
  ) => void;
  setSystemUserPermsData: React.Dispatch<
    React.SetStateAction<SystemUserPerms[]>
  >;
  addRemoveSystemPermission: (request: any) => Promise<any>;
  isLoadingAddRemoveSystemPermission: boolean;
};
const UserPermissionsSystem = ({
  systemUserPerms,
  isLoading,
  onSystemUserPermChange,
  setSystemUserPermsData,
  addRemoveSystemPermission,
  isLoadingAddRemoveSystemPermission,
}: Props) => {
  const [currentSystemUserPermId, setCurrentSystemUserPermId] =
    useState<number>(0);
  const data = useMemo(() => {
    return systemUserPerms.map((systemUserPerm: SystemUserPerms) => {
      return {
        ...systemUserPerm,
        title: convertToFarsiDigits(systemUserPerm.title),
        checkedInput:
          isLoadingAddRemoveSystemPermission &&
          systemUserPerm.id === currentSystemUserPermId ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <input
              type="checkbox"
              className="flex items-center justify-center"
              checked={systemUserPerm.slct}
              onChange={() => {
                if (onSystemUserPermChange) {
                  onSystemUserPermChange(
                    systemUserPerm.id,
                    setCurrentSystemUserPermId,
                    systemUserPerms,
                    setSystemUserPermsData,
                    addRemoveSystemPermission,
                    "system"
                  );
                }
              }}
            />
          ),
      };
    });
  }, [
    systemUserPerms,
    isLoadingAddRemoveSystemPermission,
    currentSystemUserPermId,
    onSystemUserPermChange,
    setSystemUserPermsData,
    addRemoveSystemPermission,
  ]);

  return (
    <div className="w-full flex flex-col gap-2 text-sm text-gray-600 md:h-[calc(100%-30px)] md:overflow-y-auto">
      <UserPermissionsSystemTree data={data} isLoading={isLoading} />
    </div>
  );
};

export default UserPermissionsSystem;
