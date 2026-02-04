import { useState, useEffect } from "react";
import { useGeneralContext } from "../../context/GeneralContext";
import { TableColumns } from "../../types/general";
import GetInventoryBalanceShowHeader from "./GetInventoryBalanceShowHeader";
import { GetInventoryBalanceResponse } from "../../types/ttac";
import GetInventoryBalanceShowTable from "./GetInventoryBalanceShowTable";
import { useTTacStore } from "../../store/ttacStore";

type Props = {
  getInventoryBalanceResponse: GetInventoryBalanceResponse;
  isLoading: boolean;
  data: any;
  columns: TableColumns;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  selectedRowIndex: number;
  setSelectedRowIndex: (selectedRowIndex: number) => void;
};

const GetInventoryBalanceShow = ({
  getInventoryBalanceResponse,
  isLoading,
  data,
  columns,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  selectedRowIndex,
  setSelectedRowIndex,
}: Props) => {
  const { setField: setTtacField } = useTTacStore();
  const { systemId, yearId } = useGeneralContext();
  const [hasErr, setHasErr] = useState<boolean>(true);

  //////////////////////////////////////////////////////////////
  useEffect(() => {
    setTtacField("hasErr", hasErr);
    setTtacField("systemId", systemId);
    setTtacField("yearId", yearId);
    setTtacField("pageNumber", pageNumber);
  }, [hasErr, systemId, yearId, pageNumber]);

  useEffect(() => {
    setPageNumber(1);
  }, [yearId, systemId, hasErr]);

  return (
    <div className="w-full">
      <GetInventoryBalanceShowHeader hasErr={hasErr} setHasErr={setHasErr} />
      <GetInventoryBalanceShowTable
        isLoading={isLoading}
        columns={columns}
        data={data}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalCount={getInventoryBalanceResponse.data.total_count ?? 0}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
      />
    </div>
  );
};

export default GetInventoryBalanceShow;
