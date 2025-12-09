
import { useState } from "react";
import { TableTreeView, TableTreeColumn } from "../controls/TableTreeView";

type Props = {
  data: any[];
  isLoading: boolean;
};

interface usrChartsPermData {
  id: string | number;
  parentId?: string | number | null;
  name?: string;
  [key: string]: any;
}

const UserPermissionsChartTree = ({ data, isLoading }: Props) => {
    const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const columns: TableTreeColumn<usrChartsPermData>[] = [
    {
      header: ".",
      accessor: "name",
      width: "92%",
    },
    {
      header: ".",
      accessor: "checkedInput",
      width: "8%",
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

export default UserPermissionsChartTree;
