import { useEffect, useState } from "react";
import { useUserStore } from "../../../store/userStore";
import { TableTreeView, TableTreeColumn } from "../../controls/TableTreeView";

type Props = {
  data: any[];
  isExpanded: boolean;
  isLoading: boolean;
  setSelectedUser: (user: any) => void;
  isSelectUserModalOpen: boolean;
};

interface UserData {
  id: string | number;
  parentId?: string | number | null;
  username?: string;
  nam?: string;
  chartFullName?: string;
  isActive?: boolean;
  isOnline?: boolean;
  idString?: string;
  [key: string]: any;
}

const UserInfoTree = ({
  data,
  isExpanded,
  isLoading,
  setSelectedUser,
  isSelectUserModalOpen,
}: Props) => {
  const { setField: setPermissionField } = useUserStore();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const columns: TableTreeColumn<UserData>[] = [
    {
      header: "نام کاربری",
      accessor: "userName",
      width: "20%",
    },
    {
      header: "عنوان",
      accessor: "nam",
      width: "20%",
    },
    {
      header: "واحد سازمانی",
      accessor: "chartFullName",
      width: "40%",
    },
    {
      header: "فعال",
      accessor: "isActiveInput",
      width: "5%",
    },
    {
      header: "آنلاین",
      accessor: "isOnlineImg",
      width: "5%",
    },
    {
      header: "شناسه",
      accessor: "idString",
      width: "10%",
    },
  ];

  const handleRowClick = (user: UserData) => {
    console.log("Row clicked:", user);
    setPermissionField("destUsrId", user.id);
    // Add your row click logic here
  };
  //initialize selectedUser when selectedRowIndex changes
  useEffect(() => {
    if (data[selectedRowIndex]) {
      console.log(data[selectedRowIndex], "selectedUser in UserInfoTree");
      setSelectedUser(data[selectedRowIndex]);
    }
  }, [selectedRowIndex]);
  return (
    <div
      className={`w-full text-sm flex flex-col gap-2 md:overflow-y-auto h-full`}
    >
      <TableTreeView
        isLoading={isLoading}
        heightOffset={15}
        expandAll={isExpanded}
        data={data}
        columns={columns}
        defaultExpandedLevel={0}
        onRowClick={isSelectUserModalOpen ? undefined : handleRowClick}
        showHeader={true}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
      />
    </div>
  );
};

export default UserInfoTree;
