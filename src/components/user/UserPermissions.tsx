import { Switch } from "@mui/material";
import Input from "../controls/Input";
import Card from "../controls/Card";
import { useUserStore } from "../../store/userStore";
import { useGeneralContext } from "../../context/GeneralContext";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { RiExpandHeightFill } from "react-icons/ri";
import { CgCompressV } from "react-icons/cg";
import UserPermissionsInfo from "./UserPermissionsInfo";
type Props = {
  permissions: any[];
  isLoading: boolean;
};
const UserPermissions = ({ permissions, isLoading }: Props) => {
  const { setField: setPermissionField } = useUserStore();
  const { systemId } = useGeneralContext();
  const [searchPermissions, setSearchPermissions] = useState("");
  const [debouncedSearchPermissions, setDebouncedSearchPermissions] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isShowPermissions, setIsShowPermissions] = useState(false);
  const [permissionsData, setPermissionsData] = useState<any[]>([]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    setPermissionField("systemId", systemId);
    setPermissionField("destUsrId", 0);
  }, [systemId]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    const tempData = permissions.filter((item) =>
      isShowPermissions ? item.checked === isShowPermissions : true
    );
    setPermissionsData(tempData);
  }, [permissions, isShowPermissions]);
  ////////////////////////////////////////////////////////
  const handlePermissionChange = useCallback((permissionId: string | number) => {
    setPermissionsData((prev) => {
      return prev.map((item) => {
        if (item.id === permissionId) {
          return { ...item, checked: !item.checked };
        }
        return item;
      });
    });
    // Also update the original permissions array for future sync
    // Note: You may want to sync this back to the parent component if needed
  }, []);
  ////////////////////////////////////////////////////////
  const handleDebouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchPermissions(value);
    }, 300),
    []
  );
  
  useEffect(() => {
    return () => {
      handleDebouncedSearch.cancel();
    };
  }, [handleDebouncedSearch]);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchPermissions(value);
    handleDebouncedSearch(value);
  }, [handleDebouncedSearch]);
  ////////////////////////////////////////////////////////
  return (
    <div className="w-1/2 flex flex-col gap-3 py-3 text-sm text-gray-600 h-full justify-between items-center">
      <div className="w-full flex justify-end items-center gap-2">
        <Input
          label="جستجو:"
          placeholder="جستجو..."
          widthDiv="w-1/2"
          widthInput="w-full"
          value={searchPermissions}
          onChange={handleSearchChange}
        />
        <div className="w-1/2 flex flex-row justify-between items-center text-xs">
          <div className="flex flex-row justify-center items-center">
            <p>
              {!isShowPermissions
                ? "نمایش دسترسی های کاربر"
                : " نمایش همه دسترسی های سیستم"}
            </p>
            <Switch
              checked={isShowPermissions}
              onChange={(e) => setIsShowPermissions(e.target.checked)}
              color="primary"
              size="small"
            />
          </div>
          <div className="w-1/4 flex flex-row justify-center items-center gap-2">
            <RiExpandHeightFill
              className="text-xl cursor-pointer hover:text-blue-500"
              onClick={() => setIsExpanded(true)}
            />
            <CgCompressV
              className="text-xl cursor-pointer hover:text-blue-500"
              onClick={() => setIsExpanded(false)}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-between gap-2 h-full">
        <Card border="none" padding="none" className="w-1/2 h-full">
          <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
            منوهای نرم افزار
          </div>
          <UserPermissionsInfo
            permissions={permissionsData}
            isLoading={isLoading}
            isExpanded={isExpanded}
            searchPermissions={debouncedSearchPermissions}
            onPermissionChange={handlePermissionChange}
          />
        </Card>
        <div className="w-1/2 flex flex-col gap-2 h-full">
          <Card border="none" padding="none" className="w-full h-1/4">
            <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
              سیستم
            </div>
            <p>---------</p>
          </Card>
          <Card border="none" padding="none" className="w-full h-1/2">
            <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
              چارت سازمانی
            </div>
            <p>gshagsh</p>
          </Card>
          <Card border="none" padding="none" className="w-full h-1/4">
            <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
              قیمت فروش
            </div>
            <p>gshagsh</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserPermissions;
