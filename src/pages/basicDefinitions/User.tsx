import { useEffect, useState } from "react";
import PageTitle from "../../components/layout/PageTitle";
import UserAccessibilities from "../../components/user/UserAccessibilities";
import UserHeader from "../../components/user/UserHeader";
import UserInfo from "../../components/user/UserInfo";
import { DefinitionInvironment } from "../../types/definitionInvironment";
import useUserList from "../../hooks/useUser";
import { useUserStore } from "../../store/userStore";

type Props = {
  definitionInvironment: DefinitionInvironment;
};

export default function User({ definitionInvironment }: Props) {
  const [isNew, setIsNew] = useState(-1);
  const [users, setUsers] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const {
    userListResponse,
    isLoadingUserList,
    errorUserList,
    userPermsResponse,
    isLoadingUserPerms,
    errorUserPerms,
  } = useUserList();
  const { setField: setUserField } = useUserStore();
  ////////////////////////////////////////////////////////
  useEffect(() => {
    console.log("useEffect");
    setUserField("Active", -1);
    setUserField("IsOnline", -1);
  }, []);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    const tempData: any[] = userListResponse.data.result.users.map(
      (user: any) => {
        return {
          ...user,
          parentId: user.parent,
        };
      }
    );
    setUsers(tempData);
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
  }, [isLoadingUserPerms, errorUserPerms, userPermsResponse]);
  ////////////////////////////////////////////////////////
  return (
    <div className="h-[calc(100vh-50px)] flex flex-col bg-gray-200 pt-2">
      {/* Top blue header */}
      <header className="flex items-center justify-between border-b-2 border-gray-300">
        <PageTitle definitionInvironment={definitionInvironment} />
        <UserHeader isNewUser={isNew} setIsNewUser={setIsNew} users={users} />
      </header>
      {/* Sub-header */}

      {/* Main content */}
      <main className="w-full h-full flex items-start justify-between">
        <UserInfo users={users} />
        <UserAccessibilities permissions={permissions} isLoading={isLoadingUserPerms} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-xs text-gray-500 px-4 py-1 flex justify-between"></footer>
    </div>
  );
}
