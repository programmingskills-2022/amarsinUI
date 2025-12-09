import { Switch } from "@mui/material";
import Input from "../controls/Input";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { RiExpandHeightFill } from "react-icons/ri";
import { CgCompressV } from "react-icons/cg";
import UserPermissionsInfo from "./UserPermissionsInfo";
import {
  SalesPriceUserPerms,
  UsrChartsPerms,
  SystemUserPerms,
} from "../../types/user";
import UserPermissionsSystem from "./UserPermissionsSystem";
import UserPermissionsChart from "./UserPermissionsChart";
import UserPermissionsSales from "./UserPermissionsSales";
type Props = {
  permissions: any[];
  systemUserPerms: SystemUserPerms[];
  usrChartsPerms: UsrChartsPerms[];
  salesPriceUserPerms: SalesPriceUserPerms[];
  isLoading: boolean;
};
const UserPermissions = ({
  permissions,
  systemUserPerms,
  usrChartsPerms,
  salesPriceUserPerms,
  isLoading,
}: Props) => {
  const [searchPermissions, setSearchPermissions] = useState("");
  const [debouncedSearchPermissions, setDebouncedSearchPermissions] =
    useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isShowPermissions, setIsShowPermissions] = useState(false);
  const [permissionsData, setPermissionsData] = useState<any[]>([]);
  const [systemUserPermsData, setSystemUserPermsData] = useState<any[]>([]);
  const [usrChartsPermsData, setUsrChartsPermsData] = useState<any[]>([]);
  const [salesPriceUserPermsData, setSalesPriceUserPermsData] = useState<any[]>(
    []
  );
  //initialize permissions data//////////////////////////////////////////
  useEffect(() => {
    if (!isLoading) {
      const tempData = permissions.filter((item) =>
        isShowPermissions ? item.checked === isShowPermissions : true
      );
      setPermissionsData(tempData);
    }
  }, [permissions, isShowPermissions]);
  ////////////////////////////////////////////////////////
  const handlePermissionChange = useCallback(
    (permissionId: string | number) => {
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
    },
    []
  );
  ////////////////////////////////////////////////////////
  //initialize system user permissions data///////////////
  useEffect(() => {
    setSystemUserPermsData(systemUserPerms);
  }, [systemUserPerms]);
  useEffect(() => {
    setUsrChartsPermsData(usrChartsPerms);
  }, [usrChartsPerms]);
  useEffect(() => {
    setSalesPriceUserPermsData(salesPriceUserPerms);
  }, [salesPriceUserPerms]);
  ////////////////////////////////////////////////////////
  const handleSystemUserPermChange = useCallback(
    (systemUserPermId: string | number) => {
      setSystemUserPermsData((prev) => {
        return prev.map((item) => {
          if (item.id === systemUserPermId) {
            return { ...item, slct: !item.slct };
          }
          return item;
        });
      });
    },
    []
  );
  ////////////////////////////////////////////////////////
  const handleUsrChartsPermChange = useCallback(
    (usrChartsPermId: string | number) => {
      setUsrChartsPermsData((prev) => {
        return prev.map((item) => {
          if (item.id === usrChartsPermId) {
            return { ...item, slct: !item.slct };
          }
          return item;
        });
      });
    },
    []
  );
  ////////////////////////////////////////////////////////
  const handleSalesPriceUserPermChange = useCallback(
    (salesPriceUserPermId: string | number) => {
      setSalesPriceUserPermsData((prev) => {
        return prev.map((item) => {
          if (item.id === salesPriceUserPermId) {
            return { ...item, slct: !item.slct };
          }
          return item;
        });
      });
    },
    []
  );
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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchPermissions(value);
      handleDebouncedSearch(value);
    },
    [handleDebouncedSearch]
  );
  ////////////////////////////////////////////////////////
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-3 py-3 text-sm text-gray-600 md:h-full items-start justify-start md:justify-between md:items-center">
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
      <div className="w-full flex items-center justify-between gap-2 md:h-full">
        <div className="w-1/2 h-full">
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
        </div>
        <div className="w-1/2 flex flex-col gap-2 md:h-full">
          <div className="w-full md:h-[calc(25%-30px)]">
            <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
              سیستم
            </div>
            <UserPermissionsSystem
              systemUserPerms={systemUserPermsData}
              isLoading={isLoading}
              onSystemUserPermChange={handleSystemUserPermChange}
            />
          </div>
          <div className="w-full md:h-[calc(50%-30px)]">
            <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
              چارت سازمانی
            </div>
            <UserPermissionsChart
              usrChartsPerms={usrChartsPermsData}
              isLoading={isLoading}
              onUsrChartsPermChange={handleUsrChartsPermChange}
            />
          </div>
          <div className="w-full md:h-[calc(25%-30px)]">
            <div className="w-full flex items-center justify-between bg-blue-300 rounded-t-lg p-1">
              قیمت فروش
            </div>
            <UserPermissionsSales
              salesPriceUserPerms={salesPriceUserPermsData}
              isLoading={isLoading}
              onSalesPriceUserPermChange={handleSalesPriceUserPermChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissions;
