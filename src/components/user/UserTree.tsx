import { useUserStore } from "../../store/userStore";
import { TableTreeView, TableTreeColumn } from "../controls/TableTreeView";

type Props = {
  data: any[];
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

const UserTree = ({ data }: Props) => {
  const {setField : setPermissionField}= useUserStore()
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
      accessor: "isActiveImg",
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
    setPermissionField("destUsrId", user.id)
    // Add your row click logic here
  };

  return (
    <div className="w-full text-sm flex flex-col gap-2">
      <TableTreeView
        expandAll={true}
        data={data}
        columns={columns}
        defaultExpandedLevel={0}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default UserTree;
