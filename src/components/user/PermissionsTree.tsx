
import { TableTreeView, TableTreeColumn } from "../controls/TableTreeView";

type Props = {
  data: any[];
  isLoading: boolean;
};

interface PermissionData {
  id: string | number;
  parentId?: string | number | null;
  nam?: string;
  [key: string]: any;
}

const PermissionsTree = ({ data, isLoading }: Props) => {
  const columns: TableTreeColumn<PermissionData>[] = [
    {
      header: ".",
      accessor: "nam",
      width: "92%",
    },
    {
      header: ".",
      accessor: "checkedInput",
      width: "8%",
    },
  ];
  const handleRowClick = (permission: PermissionData) => {
    console.log("Row clicked:", permission.id);
    // Add your row click logic here
  };

  return (
    <div className="w-full text-sm flex flex-col gap-2 overflow-y-auto h-full">
      <TableTreeView
        isLoading={isLoading}
        showHeader={false}
        expandAll={true}
        data={data}
        columns={columns}
        defaultExpandedLevel={0}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default PermissionsTree;
