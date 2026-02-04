import { useEffect, useState } from "react";
import PageTitle from "../../components/layout/PageTitle";
import UserHeader from "../../components/user/userMainForm/UserHeader";
import UserInfo from "../../components/user/userMainForm/UserInfo";
import { DefinitionInvironment } from "../../types/definitionInvironment";
import useUserList from "../../hooks/useUser";
import {
  DisableEnableRequest,
  SystemUserPerms,
  UsrChartsPerms,
} from "../../types/user";
import { useUserStore } from "../../store/userStore";
import { useGeneralContext } from "../../context/GeneralContext";
import UserPermissions from "../../components/user/userMainForm/UserPermissions";
import { v4 as uuidv4 } from "uuid";

type Props = {
  definitionInvironment: DefinitionInvironment;
};

export default function User({ definitionInvironment }: Props) {
  const [isNew, setIsNew] = useState(-1);
  const [users, setUsers] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [systemUserPerms, setSystemUserPerms] = useState<any[]>([]);
  const [usrChartsPerms, setUsrChartsPerms] = useState<any[]>([]);
  const [salesPriceUserPerms, setSalesPriceUserPerms] = useState<any[]>([]);
  ////////////////////////////////////////////////////////
  const {
    userListResponse,
    isLoadingUserList,
    errorUserList,
    userPermsResponse,
    isLoadingUserPerms,
    errorUserPerms,
    refetchUserList,
    refetchUserPerms,
    disableEnable,
    isLoadingDisableEnable,
    disableEnableResponse,
    addRemovePermission,
    isLoadingAddRemovePermission,
    addRemovePermissionResponse,
    addRemoveChartPermission,
    isLoadingAddRemoveChartPermission,
    addRemoveChartPermissionResponse,
    addRemoveSystemPermission,
    isLoadingAddRemoveSystemPermission,
    addRemoveSystemPermissionResponse,
    addRemoveSalesPricePermission,
    isLoadingAddRemoveSalesPricePermission,
    addRemoveSalesPricePermissionResponse,
  } = useUserList();
  const { setField: setPermissionField } = useUserStore();
  const { systemId } = useGeneralContext();
  const { usrId } = useGeneralContext();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDisableEnableModalOpen, setIsDisableEnableModalOpen] =
    useState(false);
  const [isSelectUserModalOpen, setIsSelectUserModalOpen] = useState(false);
  const [isCloseSelectUserModal, setIsCloseSelectUserModal] = useState(false);
  ////////////////////////////////////////////////////////
  // api/User/userPerms?SystemId=4&DestUsrId=0
  useEffect(() => {
    if (!isSelectUserModalOpen && !isCloseSelectUserModal) { // if not show select user form
      console.log("set permission field");
      setPermissionField("systemId", systemId);
      setPermissionField("destUsrId", selectedUser?.id || usrId);
    }
  }, [systemId, usrId, selectedUser, isSelectUserModalOpen, isCloseSelectUserModal]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    const tempData1: any[] = userListResponse.data.result.users.map(
      (user: any) => {
        return {
          ...user,
          parentId: user.parent,
        };
      }
    );
    setUsers(tempData1);
  }, [isLoadingUserList, errorUserList, userListResponse]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (userListResponse.data.result.users.length === 0) {
      setPermissions([]);
      setSystemUserPerms([]);
      setUsrChartsPerms([]);
      setSalesPriceUserPerms([]);
      return;
    }
    const tempData: any[] = userPermsResponse.data.result.permissions.map(
      (permission: any) => {
        return {
          ...permission,
          id: permission.progpartId,
          parentId: permission.parent,
        };
      }
    );
    setPermissions(tempData);
    const tempData2: any[] = userPermsResponse.data.result.systemUserPerms.map(
      (systemUserPerm: SystemUserPerms) => {
        return {
          ...systemUserPerm,
          parentId: systemUserPerm.parent,
        };
      }
    );
    setSystemUserPerms(tempData2);
    const tempData3: any[] = userPermsResponse.data.result.usrChartsPerms.map(
      (usrChartsPerm: UsrChartsPerms) => {
        return {
          ...usrChartsPerm,
          parentId: usrChartsPerm.parent,
        };
      }
    );
    setUsrChartsPerms(tempData3);
    setSalesPriceUserPerms(userPermsResponse.data.result.salesPriceUserPerms);
  }, [isLoadingUserPerms, errorUserPerms, userPermsResponse, userListResponse]);
  ////////////////////////////////////////////////////////
  const handleUserActiveChange = async (
    userId: number,
    setCurrentUserId: React.Dispatch<React.SetStateAction<number>>
  ) => {
    //let active = true;
    const backupUsers = [...users];
    setUsers((prev: any) => {
      return prev.map((item: any) => {
        if (item.id === userId) {
          return { ...item, active: !item.active };
        }
        return item;
      });
    });
    // for api/user/disableEnable
    setCurrentUserId(userId);
    const active = !users.find((item: any) => item.id === userId)?.active;
    const request: DisableEnableRequest = {
      userId,
      active,
      sourceCall: "web",
      idempotencyKey: uuidv4(),
    };
    console.log(request, "request");
    try {
      const response = await disableEnable(request);
      // Check error using the response directly, not the state
      if (response.meta.errorCode > 0) {
        console.log("error occured");
        console.log(response, "disableEnableResponse");
        //means error occured - restore previous state
        setUsers(backupUsers);
      }
    } catch (error) {
      // Handle network/request errors
      console.log("error occured", error);
      setUsers(backupUsers);
    }
    setIsDisableEnableModalOpen(true);
  };
  ////////////////////////////////////////////////////////

  return (
    <div className="w-full h-full md:h-[calc(100vh-50px)] flex flex-col bg-gray-200 pt-2">
      {/* Top blue header */}
      <header className="flex flex-col md:flex-row items-center justify-between border-b-2 border-gray-300">
        <PageTitle definitionInvironment={definitionInvironment} />
        <UserHeader
          isNewUser={isNew}
          setIsNewUser={setIsNew}
          users={users}
          refetchUserList={refetchUserList}
          refetchUserPerms={refetchUserPerms}
          isLoadingUserList={isLoadingUserList}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          handleUserActiveChange={handleUserActiveChange}
          isLoadingDisableEnable={isLoadingDisableEnable}
          disableEnableResponse={disableEnableResponse}
          isDisableEnableModalOpen={isDisableEnableModalOpen}
          setIsDisableEnableModalOpen={setIsDisableEnableModalOpen}
          isSelectUserModalOpen={isSelectUserModalOpen} // true for show select user form, false for show user info form
          setIsSelectUserModalOpen={setIsSelectUserModalOpen}
          setIsCloseSelectUserModal={setIsCloseSelectUserModal}//to control not sending systemId and destUsrId when close select user modal
        />
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="px-2 w-full h-full flex flex-col md:flex-row items-start md:items-center justify-start md:gap-2 text-xs md:text-sm">
        <div className=" w-full md:w-1/2 h-full">
          <UserInfo
            users={users}
            isLoading={isLoadingUserList}
            setSelectedUser={setSelectedUser}
            onUserActiveChange={handleUserActiveChange}
            isLoadingDisableEnable={isLoadingDisableEnable}
            disableEnableResponse={disableEnableResponse}
            isDisableEnableModalOpen={isDisableEnableModalOpen}
            setIsDisableEnableModalOpen={setIsDisableEnableModalOpen}
            isShowSelectUserForm={false}
            //setIsShowSelectUserForm={setIsSelectUserModalOpen}
            //setIsCloseSelectUserModal={setIsCloseSelectUserModal}//to control not sending systemId and destUsrId when close select user modal
          />
        </div>
        <div className="w-full md:w-1/2 h-full flex flex-col">
          <UserPermissions
            permissions={permissions}
            systemUserPerms={systemUserPerms}
            usrChartsPerms={usrChartsPerms}
            salesPriceUserPerms={salesPriceUserPerms}
            isLoading={isLoadingUserPerms}
            isLoadingAddRemovePermission={isLoadingAddRemovePermission}
            addRemovePermission={addRemovePermission}
            selectedUser={selectedUser}
            addRemovePermissionResponse={addRemovePermissionResponse}
            isLoadingAddRemoveChartPermission={
              isLoadingAddRemoveChartPermission
            }
            addRemoveChartPermission={addRemoveChartPermission}
            addRemoveChartPermissionResponse={addRemoveChartPermissionResponse}
            isLoadingAddRemoveSystemPermission={
              isLoadingAddRemoveSystemPermission
            }
            addRemoveSystemPermission={addRemoveSystemPermission}
            addRemoveSystemPermissionResponse={
              addRemoveSystemPermissionResponse
            }
            isLoadingAddRemoveSalesPricePermission={
              isLoadingAddRemoveSalesPricePermission
            }
            addRemoveSalesPricePermission={addRemoveSalesPricePermission}
            addRemoveSalesPricePermissionResponse={
              addRemoveSalesPricePermissionResponse
            }
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
