import { useMemo } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import UserPermissionsInfoTree from "./UserPermissionsInfoTree";

type Props = {
  permissions: any[];
  isLoading: boolean;
  isExpanded: boolean;
  searchPermissions: string;
  onPermissionChange?: (permissionId: string | number) => void;
};
const UserPermissionsInfo = ({
  permissions,
  isLoading,
  isExpanded,
  searchPermissions,
  onPermissionChange,
}: Props) => {
  const data = useMemo(() => {
    const searchLower = searchPermissions.toLowerCase();
    return permissions
      .filter((item) =>
        item.nam?.toLowerCase().includes(searchLower)
      )
      .map((item) => {
        return {
          ...item,
          idString: convertToFarsiDigits(item.id),
          nam: convertToFarsiDigits(item.nam),
          checkedInput: (
            <input
              type="checkbox"
              className="flex items-center justify-center"
              checked={item.checked}
              onChange={() => {
                onPermissionChange?.(item.id);
              }}
            />
          ),
        };
      });
  }, [permissions, searchPermissions, onPermissionChange]);
  return (
    <div className="w-full flex flex-col gap-2 text-sm text-gray-600 h-full">
      <UserPermissionsInfoTree
        data={data}
        isLoading={isLoading}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default UserPermissionsInfo;
