import { useState } from "react";
import { TableTreeView, TableTreeColumn } from "../../controls/TableTreeView";
import useCalculateTableHeight from "../../../hooks/useCalculateTableHeight";

type Props = {
  data: any[];
  isLoading: boolean;
};

interface systemUserPermData {
  id: string | number;
  parentId?: string | number | null;
  title?: string;
  [key: string]: any;
}

const UserPermissionsSystemTree = ({ data, isLoading }: Props) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const { width } = useCalculateTableHeight();
  const columns: TableTreeColumn<systemUserPermData>[] = [
    {
      header: ".",
      accessor: "title",
      width: width > 640 ? "92%" : "80%",
    },
    {
      header: ".",
      accessor: "checkedInput",
      width: width > 640 ? "8%" : "10%",
    },
  ];
  const handleRowClick = (systemUserPerm: any) => {
    console.log("Row clicked:", systemUserPerm);
    // Add your row click logic here
  };
  return (
    <div className="w-full text-sm flex flex-col gap-2 md:overflow-y-auto h-full">
      <TableTreeView
        isLoading={isLoading}
        showHeader={false}
        expandAll={true}
        data={data}
        columns={columns}
        defaultExpandedLevel={0}
        onRowClick={handleRowClick}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
      />
    </div>
  );
};

export default UserPermissionsSystemTree;
