import { TableTreeView, TableTreeColumn } from "../controls/TableTreeView";

type Props = {
  data: any[];
};

interface UserData {
  id: string | number;
  parentId?: string | number | null;
  username?: string;
  title?: string;
  orgUnit?: string;
  status?: string;
  online?: string;
  [key: string]: any;
}

const UserTree = ({ data }: Props) => {
  const columns: TableTreeColumn<UserData>[] = [
    {
      header: "نام کاربری",
      accessor: "username",
      width: "20%",
    },
    {
      header: "عنوان",
      accessor: "title",
      width: "20%",
    },
    {
      header: "واحد سازمانی",
      accessor: "orgUnit",
      width: "40%",
    },
    {
      header: "فعال",
      accessor: "status",
      width: "5%",
    },
    {
      header: "آنلاین",
      accessor: "online",
      width: "5%",
    },
    {
      header: "شناسه",
      accessor: "id",
      width: "10%",
    },
  ];

  const handleRowClick = (user: UserData) => {
    console.log("Row clicked:", user);
    // Add your row click logic here
  };

  return (
    <div className="w-full text-sm flex flex-col gap-2">
      <TableTreeView
        data={data}
        columns={columns}
        defaultExpandedLevel={0}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default UserTree;
