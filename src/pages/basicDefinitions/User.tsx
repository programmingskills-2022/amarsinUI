import { useEffect, useState } from "react";
import PageTitle from "../../components/layout/PageTitle";
import UserHeader from "../../components/user/UserHeader";
import UserInfo from "../../components/user/UserInfo";
import { DefinitionInvironment } from "../../types/definitionInvironment";
import useUserList from "../../hooks/useUser";
import { SystemUserPerms, UsrChartsPerms } from "../../types/user";
import { useUserStore } from "../../store/userStore";
import { useGeneralContext } from "../../context/GeneralContext";
import UserPermissions from "../../components/user/UserPermissions";

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
  } = useUserList();
  const { setField: setPermissionField } = useUserStore();
  const { systemId } = useGeneralContext();
  const { usrId } = useGeneralContext();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  ////////////////////////////////////////////////////////
  // api/User/userPerms?SystemId=4&DestUsrId=0
  useEffect(() => {
    console.log(selectedUser, "selectedUser");
    setPermissionField("systemId", systemId);
    setPermissionField("destUsrId", selectedUser?.id || usrId);
  }, [systemId, usrId, selectedUser]);
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
  }, [isLoadingUserPerms, errorUserPerms, userPermsResponse]);
  ////////////////////////////////////////////////////////
  return (
    <div className="w-full h-[calc(100vh-50px)] flex flex-col bg-gray-200 pt-2">
      {/* Top blue header */}
      <header className="flex flex-col md:flex-row items-center justify-between border-b-2 border-gray-300">
        <PageTitle definitionInvironment={definitionInvironment} />
        <UserHeader
          isNewUser={isNew}
          setIsNewUser={setIsNew}
          users={users}
          refetchUserList={refetchUserList}
          refetchUserPerms={refetchUserPerms}
        />
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="px-2 w-full h-full flex flex-col md:flex-row items-start md:items-center justify-center gap-2">
        <UserInfo
          users={users}
          isLoading={isLoadingUserList}
          setSelectedUser={setSelectedUser}
        />
        <UserPermissions
          permissions={permissions}
          systemUserPerms={systemUserPerms}
          usrChartsPerms={usrChartsPerms}
          salesPriceUserPerms={salesPriceUserPerms}
          isLoading={isLoadingUserPerms}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
