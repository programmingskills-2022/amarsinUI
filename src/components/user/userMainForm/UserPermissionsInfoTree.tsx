
import { useState } from "react";
import { TableTreeView, TableTreeColumn } from "../../controls/TableTreeView";
import useCalculateTableHeight from "../../../hooks/useCalculateTableHeight";

type Props = {
  data: any[];
  isLoading: boolean;
  isExpanded: boolean;
};

interface PermissionData {
  id: string | number;
  parentId?: string | number | null;
  nam?: string;
  [key: string]: any;
}

const UserPermissionsInfoTree = ({ data, isLoading, isExpanded }: Props) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const { width } = useCalculateTableHeight();
  const columns: TableTreeColumn<PermissionData>[] = [
    {
      header: ".",
      accessor: "nam",
      width: width > 640 ? "92%" : "90%",
    },
    {
      header: ".",
      accessor: "checkedInput",
      width: width > 640 ? "8%" : "10%",
    },
  ];
  const handleRowClick = (permission: PermissionData) => {
    console.log("Row clicked:", permission.id);
    // Add your row click logic here
  };

  return (
    <div className="w-full text-sm flex flex-col gap-2 md:overflow-y-auto h-full" >
      <TableTreeView
        isLoading={isLoading}
        showHeader={false}
        expandAll={isExpanded}
        data={data}
        columns={columns}
        defaultExpandedLevel={0}
        onRowClick={handleRowClick}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
        heightOffset={40}
      />
    </div>
  );
};

export default UserPermissionsInfoTree;
