import { useMemo, useState } from "react";
import { convertToFarsiDigits } from "../../../utilities/general";
import UserPermissionsInfoTree from "./UserPermissionsInfoTree";
import { FaSpinner } from "react-icons/fa";

type Props = {
  permissions: any[];
  isLoading: boolean;
  isExpanded: boolean;
  searchPermissions: string;
  isLoadingAddRemovePermission: boolean;
  onPermissionChange?: (
    id: string | number,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
    data: any[],
    setData: React.Dispatch<React.SetStateAction<any[]>>,
    addRemovefunction: (request: any) => Promise<any>,
    type: "permission" | "chart" | "system" | "salesPrice"
  ) => void;
  setPermissionsData: React.Dispatch<React.SetStateAction<any[]>>;
  addRemovePermission: (request: any) => Promise<any>;
};
const UserPermissionsInfo = ({
  permissions,
  isLoading,
  isExpanded,
  searchPermissions,
  isLoadingAddRemovePermission,
  onPermissionChange,
  setPermissionsData,
  addRemovePermission,
}: Props) => {
  const [currentPermissionId, setCurrentPermissionId] = useState<number>(0);
  const data = useMemo(() => {
    const searchLower = searchPermissions.toLowerCase();
    return permissions
      .filter((item) => item.nam?.toLowerCase().includes(searchLower))
      .map((item) => {
        return {
          ...item,
          idString: convertToFarsiDigits(item.id),
          nam: convertToFarsiDigits(item.nam),
          checkedInput:
            isLoadingAddRemovePermission && item.id === currentPermissionId ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <input
                type="checkbox"
                className="flex items-center justify-center"
                checked={item.checked}
                onChange={() => {
                  if (onPermissionChange) {
                    onPermissionChange(
                      item.id,
                      setCurrentPermissionId,
                      permissions,
                      setPermissionsData,
                      addRemovePermission,
                      "permission"
                    );
                  }
                }}
              />
            ),
        };
      });
  }, [
    permissions,
    searchPermissions,
    onPermissionChange,
    isLoadingAddRemovePermission,
    currentPermissionId,
  ]);
  return (
    <div className="w-full flex flex-col gap-2 text-sm text-gray-600 md:h-[calc(100%-30px)] md:overflow-y-auto">
      <UserPermissionsInfoTree
        data={data}
        isLoading={isLoading}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default UserPermissionsInfo;
