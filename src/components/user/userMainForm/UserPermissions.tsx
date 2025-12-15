import { Switch } from "@mui/material";
import Input from "../../controls/Input";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { RiExpandHeightFill } from "react-icons/ri";
import { CgCompressV } from "react-icons/cg";
import UserPermissionsInfo from "./UserPermissionsInfo";
import {
  SalesPriceUserPerms,
  UsrChartsPerms,
  SystemUserPerms,
  AddRemovePermissionRequest,
  AddRemovePermissionResponse,
  AddRemoveSystemPermissionResponse,
  AddRemoveSalesPricePermissionResponse,
  AddRemoveChartPermissionResponse,
  AddRemoveChartPermissionRequest,
  AddRemoveSystemPermissionRequest,
  AddRemoveSalesPricePermissionRequest,
} from "../../../types/user";
import UserPermissionsSystem from "./UserPermissionsSystem";
import UserPermissionsChart from "./UserPermissionsChart";
import UserPermissionsSalesPrice from "./UserPermissionsSalesPrice";
import useCalculateTableHeight from "../../../hooks/useCalculateTableHeight";
import { v4 as uuidv4 } from "uuid";
import { useGeneralContext } from "../../../context/GeneralContext";
import UserPermissionsMsg from "./UserPermissionsMsg";
type Props = {
  permissions: any[];
  systemUserPerms: SystemUserPerms[];
  usrChartsPerms: UsrChartsPerms[];
  salesPriceUserPerms: SalesPriceUserPerms[];
  isLoading: boolean;
  isLoadingAddRemovePermission: boolean;
  addRemovePermission: (
    request: AddRemovePermissionRequest
  ) => Promise<AddRemovePermissionResponse>;
  selectedUser: any;
  addRemovePermissionResponse: AddRemovePermissionResponse;
  isLoadingAddRemoveChartPermission: boolean;
  addRemoveChartPermission: (
    request: AddRemoveChartPermissionRequest
  ) => Promise<AddRemoveChartPermissionResponse>;
  addRemoveChartPermissionResponse: AddRemoveChartPermissionResponse;
  isLoadingAddRemoveSystemPermission: boolean;
  addRemoveSystemPermission: (
    request: AddRemoveSystemPermissionRequest
  ) => Promise<AddRemoveSystemPermissionResponse>;
  addRemoveSystemPermissionResponse: AddRemoveSystemPermissionResponse;
  isLoadingAddRemoveSalesPricePermission: boolean;
  addRemoveSalesPricePermission: (
    request: AddRemoveSalesPricePermissionRequest
  ) => Promise<AddRemoveSalesPricePermissionResponse>;
  addRemoveSalesPricePermissionResponse: AddRemoveSalesPricePermissionResponse;
};
const UserPermissions = ({
  permissions,
  systemUserPerms,
  usrChartsPerms,
  salesPriceUserPerms,
  isLoading,
  isLoadingAddRemovePermission,
  addRemovePermission,
  selectedUser,
  addRemovePermissionResponse,
  isLoadingAddRemoveChartPermission,
  addRemoveChartPermission,
  addRemoveChartPermissionResponse,
  isLoadingAddRemoveSystemPermission,
  addRemoveSystemPermission,
  addRemoveSystemPermissionResponse,
  isLoadingAddRemoveSalesPricePermission,
  addRemoveSalesPricePermission,
  addRemoveSalesPricePermissionResponse,
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
  const [isAddRemovePermissionModalOpen, setIsAddRemovePermissionModalOpen] =
    useState(false);
  const [
    isAddRemoveChartPermissionModalOpen,
    setIsAddRemoveChartPermissionModalOpen,
  ] = useState(false);
  const [
    isAddRemoveSystemPermissionModalOpen,
    setIsAddRemoveSystemPermissionModalOpen,
  ] = useState(false);
  const [
    isAddRemoveSalesPricePermissionModalOpen,
    setIsAddRemoveSalesPricePermissionModalOpen,
  ] = useState(false);
  const { systemId } = useGeneralContext();
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    // Only set timeout when modal is open AND not loading (modal is actually visible)
    if (
      (isAddRemovePermissionModalOpen && !isLoadingAddRemovePermission) ||
      (isAddRemoveChartPermissionModalOpen &&
        !isLoadingAddRemoveChartPermission) ||
      (isAddRemoveSystemPermissionModalOpen &&
        !isLoadingAddRemoveSystemPermission) ||
      (isAddRemoveSalesPricePermissionModalOpen &&
        !isLoadingAddRemoveSalesPricePermission)
    ) {
      timeoutId = setTimeout(() => {
        setIsAddRemovePermissionModalOpen(false);
        setIsAddRemoveChartPermissionModalOpen(false);
        setIsAddRemoveSystemPermissionModalOpen(false);
        setIsAddRemoveSalesPricePermissionModalOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    isAddRemovePermissionModalOpen,
    isAddRemoveChartPermissionModalOpen,
    isAddRemoveSystemPermissionModalOpen,
    isAddRemoveSalesPricePermissionModalOpen,
    isLoadingAddRemovePermission,
    isLoadingAddRemoveChartPermission,
    isLoadingAddRemoveSystemPermission,
    isLoadingAddRemoveSalesPricePermission,
  ]);
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
  // for api/user/addRemovePermission
  const handlePermissionChange = useCallback(
    async (
      id: string | number,
      setCurrentId: React.Dispatch<React.SetStateAction<number>>,
      data: any[],
      setData: React.Dispatch<React.SetStateAction<any[]>>,
      addRemovefunction: (request: any) => Promise<any>,
      type: "permission" | "chart" | "system" | "salesPrice"
    ) => {
      let checked: boolean = false;
      if (!selectedUser || !selectedUser.id) {
        console.log("No user selected, cannot change permission");
        return;
      }
      const backupPermissions = [...data];
      setData((prev: any) => {
        return prev.map((item: any) => {
          let itemId: number = 0;
          if (type === "salesPrice") {
            itemId = Number(item.salesPriceId);
          } else {
            itemId = Number(item.id);
          }
          if (itemId === Number(id)) {
            switch (type) {
              case "permission":
                checked = !item.checked;
                return { ...item, checked: checked };
              case "chart":
              case "system":
              case "salesPrice":
                console.log(item, "item");
                checked = !item.slct;
                return { ...item, slct: checked };
            }
          }
          return item;
        });
      });
      setCurrentId(Number(id));
      //let checked = !permissionsData.find((item: any) => item.id === permissionId)?.checked;
      const request: any = {
        systemId: systemId,
        usrId: selectedUser.id,
        sourceCall: "web",
        sourceCallLogId: 0,
        idempotencyKey: uuidv4(),
      };
      if (type === "permission") {
        request.progPartId = checked ? Number(id) : Number(-id); //positive for add, negative for remove
      } else if (type === "chart") {
        request.chartId = checked ? Number(id) : Number(-id);
      } else if (type === "system") {
        request.targetSystemId = checked ? Number(id) : Number(-id);
      } else if (type === "salesPrice") {
        request.salesPriceId = checked ? Number(id) : Number(-id);
      }
      console.log(request, "request for addRemovePermission");
      try {
        const response = await addRemovefunction(request);
        // Check error using the response directly, not the state
        if (response.meta.errorCode > 0) {
          console.log(response, "addRemovePermissionResponse");
          //means error occured - restore previous state
          console.log(backupPermissions, "backupPermissions");
          setData(backupPermissions);
        }
      } catch (error) {
        // Handle network/request errors
        console.log("error occured for addRemovePermission", error);
        setData(backupPermissions);
      }
      switch (type) {
        case "permission":
          setIsAddRemovePermissionModalOpen(true);
          break;
        case "chart":
          setIsAddRemoveChartPermissionModalOpen(true);
          break;
        case "system":
          setIsAddRemoveSystemPermissionModalOpen(true);
          break;
        case "salesPrice":
          setIsAddRemoveSalesPricePermissionModalOpen(true);
          break;
      }
    },
    [selectedUser, systemId]
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
  const handleDebouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchPermissions(value);
    }, 300),
    []
  );
  ////////////////////////////////////////////////////////
  useEffect(() => {
    return () => {
      handleDebouncedSearch.cancel();
    };
  }, [handleDebouncedSearch]);
  ////////////////////////////////////////////////////////
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchPermissions(value);
      handleDebouncedSearch(value);
    },
    [handleDebouncedSearch]
  );
  ////////////////////////////////////////////////////////
  const { width } = useCalculateTableHeight();
  ////////////////////////////////////////////////////////
  return (
    <div className="w-full flex flex-col gap-3 py-3 text-gray-600 md:h-full justify-start md:justify-between md:items-center">
      <div className="w-full flex flex-col md:flex-row justify-end items-center gap-2">
        <Input
          label="جستجو:"
          placeholder="جستجو..."
          widthDiv={width > 640 ? "w-1/2" : "w-full"}
          widthInput="w-full"
          value={searchPermissions}
          onChange={handleSearchChange}
          variant="outlined"
        />
        <div className="w-full md:w-1/2 flex flex-row justify-between items-center text-xs">
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
      <div className="w-full flex items-start justify-between gap-2 md:h-full">
        <div className="w-1/2 md:h-full flex flex-col">
          <div className="w-full flex items-center justify-center bg-blue-300 rounded-t-lg p-1">
            منوهای نرم افزار
          </div>
          <UserPermissionsInfo
            permissions={permissionsData}
            isLoading={isLoading}
            isExpanded={isExpanded}
            searchPermissions={debouncedSearchPermissions}
            isLoadingAddRemovePermission={isLoadingAddRemovePermission}
            onPermissionChange={handlePermissionChange}
            setPermissionsData={setPermissionsData}
            addRemovePermission={addRemovePermission}
          />
        </div>
        <div className="w-1/2 flex flex-col gap-2 md:h-full">
          <div className="w-full md:h-[calc(25%-30px)]">
            <div className="w-full flex items-center justify-center bg-blue-300 rounded-t-lg p-1">
              سیستم
            </div>
            <UserPermissionsSystem
              systemUserPerms={systemUserPermsData}
              isLoading={isLoading}
              onSystemUserPermChange={handlePermissionChange}
              setSystemUserPermsData={setSystemUserPermsData}
              addRemoveSystemPermission={addRemoveSystemPermission}
              isLoadingAddRemoveSystemPermission={
                isLoadingAddRemoveSystemPermission
              }
            />
          </div>
          <div className="w-full md:h-[calc(50%-30px)]">
            <div className="w-full flex items-center justify-center bg-blue-300 rounded-t-lg p-1">
              چارت سازمانی
            </div>
            <UserPermissionsChart
              usrChartsPerms={usrChartsPermsData}
              isLoading={isLoading}
              onUsrChartsPermChange={handlePermissionChange}
              setUsrChartsPermsData={setUsrChartsPermsData}
              addRemoveChartPermission={addRemoveChartPermission}
              isLoadingAddRemoveChartPermission={
                isLoadingAddRemoveChartPermission
              }
            />
          </div>
          <div className="w-full md:h-[calc(25%-30px)]">
            <div className="w-full flex items-center justify-center bg-blue-300 rounded-t-lg p-1">
              قیمت فروش
            </div>
            <UserPermissionsSalesPrice
              salesPriceUserPerms={salesPriceUserPermsData}
              isLoading={isLoading}
              onSalesPriceUserPermChange={handlePermissionChange}
              setSalesPriceUserPermsData={setSalesPriceUserPermsData}
              addRemoveSalesPricePermission={addRemoveSalesPricePermission}
              isLoadingAddRemoveSalesPricePermission={
                isLoadingAddRemoveSalesPricePermission
              }
            />
          </div>
        </div>
      </div>
      {!isLoadingAddRemovePermission && (
        <UserPermissionsMsg
          isOpen={isAddRemovePermissionModalOpen}
          response={addRemovePermissionResponse}
          setIsOpen={setIsAddRemovePermissionModalOpen}
        />
      )}
      {!isLoadingAddRemoveChartPermission && (
        <UserPermissionsMsg
          isOpen={isAddRemoveChartPermissionModalOpen}
          response={addRemoveChartPermissionResponse}
          setIsOpen={setIsAddRemoveChartPermissionModalOpen}
        />
      )}
      {!isLoadingAddRemoveSystemPermission && (
        <UserPermissionsMsg
          isOpen={isAddRemoveSystemPermissionModalOpen}
          response={addRemoveSystemPermissionResponse}
          setIsOpen={setIsAddRemoveSystemPermissionModalOpen}
        />
      )}
      {!isLoadingAddRemoveSalesPricePermission && (
        <UserPermissionsMsg
          isOpen={isAddRemoveSalesPricePermissionModalOpen}
          response={addRemoveSalesPricePermissionResponse}
          setIsOpen={setIsAddRemoveSalesPricePermissionModalOpen}
        />
      )}
    </div>
  );
};

export default UserPermissions;
