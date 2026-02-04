import React from "react";
import { TableColumns } from "../../types/general";

type Props = {
  columns: TableColumns;
  sortId: number;
  sortIRC: number;
  sortLotNumber: number;
  sortWStock: number;
  sortCnt: number;
  sortNotSent: number;
  sortTCnt: number;
  setSortId: (sortId: number) => void;
  setSortIRC: (sortIRC: number) => void;
  setSortLotNumber: (sortLotNumber: number) => void;
  setSortWStock: (sortWStock: number) => void;
  setSortCnt: (sortCnt: number) => void;
  setSortNotSent: (sortNotSent: number) => void;
  setSortTCnt: (sortTCnt: number) => void;
};

const GetInventoryBalanceShowTableHeader = React.memo(
  ({
    columns,
    sortId,
    sortIRC,
    sortLotNumber,
    sortWStock,
    sortCnt,
    sortNotSent,
    sortTCnt,
    setSortId,
    setSortIRC,
    setSortLotNumber,
    setSortWStock,
    setSortCnt,
    setSortNotSent,
    setSortTCnt,
  }: Props) => {
    const setSort = (
      setHeaderList: ((sort: number) => void)[],
      sortColumn: number,
      setSortColumn: (sort: number) => void
    ) => {
      setHeaderList.forEach((setHeader) => {
        setHeader(0);
      });
      if (sortColumn === 1) setSortColumn(-1);
      else setSortColumn(1);
    };
    return (
      <div className="flex text-xs font-bold text-gray-500 w-full h-6">
        {columns
          .filter((column: any) => column.visible !== false)
          .map((column: any) => (
            <div
              className="flex bg-gray-200 border border-gray-300 text-center items-center justify-center border-r last:border-l cursor-pointer"
              key={column.id}
              style={{ width: column.width }}
              onClick={() => {
                if (column.accessor === "id") {
                  setSort(
                    [
                      setSortIRC,
                      setSortLotNumber,
                      setSortWStock,
                      setSortCnt,
                      setSortNotSent,
                      setSortTCnt,
                    ],
                    sortId,
                    setSortId
                  );
                } else if (column.accessor === "irc") {
                  setSort(
                    [
                      setSortId,
                      setSortLotNumber,
                      setSortWStock,
                      setSortCnt,
                      setSortNotSent,
                      setSortTCnt,
                    ],
                    sortIRC,
                    setSortIRC
                  );
                } else if (column.accessor === "lotNumber") {
                  setSort(
                    [
                      setSortId,
                      setSortIRC,
                      setSortWStock,
                      setSortCnt,
                      setSortNotSent,
                      setSortTCnt,
                    ],
                    sortLotNumber,
                    setSortLotNumber
                  );
                } else if (column.accessor === "wStock") {
                  setSort(
                    [
                      setSortId,
                      setSortIRC,
                      setSortLotNumber,
                      setSortCnt,
                      setSortNotSent,
                      setSortTCnt,
                    ],
                    sortWStock,
                    setSortWStock
                  );
                } else if (column.accessor === "cnt") {
                  setSort(
                    [
                      setSortId,
                      setSortIRC,
                      setSortLotNumber,
                      setSortNotSent,
                      setSortTCnt,
                      setSortWStock,
                    ],
                    sortCnt,
                    setSortCnt
                  );
                } else if (column.accessor === "notSent") {
                  setSort(
                    [
                      setSortId,
                      setSortIRC,
                      setSortLotNumber,
                      setSortWStock,
                      setSortTCnt,
                      setSortWStock,
                    ],
                    sortNotSent,
                    setSortNotSent
                  );
                } else if (column.accessor === "tCnt") {
                  setSort(
                    [
                      setSortId,
                      setSortIRC,
                      setSortLotNumber,
                      setSortWStock,
                      setSortCnt,
                      setSortNotSent,
                    ],
                    sortTCnt,
                    setSortTCnt
                  );
                }
              }}
            >
              {column.Header}
            </div>
          ))}
      </div>
    );
  }
);

GetInventoryBalanceShowTableHeader.displayName =
  "CupboardsReportShowTableHeader";

export default GetInventoryBalanceShowTableHeader;
