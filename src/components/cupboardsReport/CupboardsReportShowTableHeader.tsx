import React from "react";
import { TableColumns } from "../../types/general";

type Props = {
  columns: TableColumns;
  sortCode: number;
  sortFullCode: number;
  sortFullName: number;
  sortTtac: number;
  sortADProdDate: number;
  sortADExpDate: number;
  sortProductGTIN: number;
  sortProductIRC: number;
  sortUID: number;
  setSortCode: (sortId: number) => void;
  setSortFullCode: (sortDate: number) => void;
  setSortFullName: (sortTime: number) => void;
  setSortTtac: (sortDsc: number) => void;
  setSortADProdDate: (sortDsc: number) => void;
  setSortADExpDate: (sortDsc: number) => void;
  setSortProductGTIN: (sortDsc: number) => void;
  setSortProductIRC: (sortDsc: number) => void;
  setSortUID: (sortDsc: number) => void;
};

const CupboardsReportShowTableHeader = React.memo(({
  columns,
  sortCode,
  sortFullCode,
  sortFullName,
  sortTtac,
  sortADProdDate,
  sortADExpDate,
  sortProductGTIN,
  sortProductIRC,
  sortUID,
  setSortCode,
  setSortFullCode,
  setSortFullName,
  setSortTtac,
  setSortADProdDate,
  setSortADExpDate,
  setSortProductGTIN,
  setSortProductIRC,
  setSortUID,
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
      {columns.filter((column: any) => column.visible!==false).map((column: any) => (
        <div
          className="flex bg-gray-200 border border-gray-300 text-center items-center justify-center border-r last:border-l cursor-pointer"
          key={column.id}
          style={{ width: column.width }}
          onClick={() => {
            if (column.accessor === "code") {
              setSort(
                [
                  setSortFullCode,
                  setSortFullName,
                  setSortTtac,
                  setSortADProdDate,
                  setSortADExpDate,
                  setSortProductGTIN,
                  setSortProductIRC,
                  setSortUID,
                ],
                sortCode,
                setSortCode
              );
            } else if (column.accessor === "fullCode") {
              setSort(
                [
                  setSortCode,
                  setSortFullName,
                  setSortTtac,
                  setSortADProdDate,
                  setSortADExpDate,
                  setSortProductGTIN,
                  setSortProductIRC,
                  setSortUID,
                ],
                sortFullCode,
                setSortFullCode
              );
            } else if (column.accessor === "fullName") {
              setSort(
                [
                  setSortCode,
                  setSortFullCode,
                  setSortTtac,
                  setSortADProdDate,
                  setSortADExpDate,
                  setSortProductGTIN,
                  setSortProductIRC,
                  setSortUID,
                ],
                sortFullName,
                setSortFullName
              );
            } else if (column.accessor === "ttac") {
              setSort(
                [
                  setSortCode,
                  setSortFullCode,
                  setSortTtac,
                  setSortADProdDate,
                  setSortADExpDate,
                  setSortProductGTIN,
                  setSortProductIRC,
                  setSortUID,
                ],
                sortTtac,
                setSortTtac
              );
            } else if (column.accessor === "prodDate") {
              setSort(
                [
                  setSortCode,
                  setSortFullCode,
                  setSortFullName,
                  setSortTtac,
                  setSortADExpDate,
                  setSortProductGTIN,
                  setSortProductIRC,
                  setSortUID,
                ],
                sortADProdDate,
                setSortADProdDate
              );
            } else if (column.accessor === "expDate") {
              setSort(
                [
                  setSortCode,
                  setSortFullCode,
                  setSortFullName,
                  setSortTtac,
                  setSortADProdDate,
                  setSortADExpDate,
                  setSortProductGTIN,
                  setSortProductIRC,
                  setSortUID,
                ],
                sortADExpDate,
                setSortADExpDate
              );
            } else if (column.accessor === "gtin") {
              setSort(
                [
                  setSortCode,
                  setSortFullCode,
                  setSortFullName,
                  setSortTtac,
                  setSortADProdDate,
                  setSortADExpDate,
                  setSortProductGTIN,
                  setSortProductIRC,
                  setSortUID,
                ],
                sortProductGTIN,
                setSortProductGTIN
              );
            } else if (column.accessor === "irc") {
              setSort(
                [
                  setSortCode,
                  setSortFullCode,
                  setSortFullName,
                  setSortTtac,
                  setSortADProdDate,
                  setSortADExpDate,
                  setSortProductGTIN,
                  setSortProductIRC,
                  setSortUID,
                ],
                sortProductIRC,
                setSortProductIRC
              );
            } else if (column.accessor === "uid") {
              setSort(
                [
                  setSortCode,
                  setSortFullCode,
                  setSortFullName,
                  setSortTtac,
                  setSortADProdDate,
                  setSortADExpDate,
                  setSortProductGTIN,
                  setSortProductIRC,
                  setSortUID,
                ],
                sortUID,
                setSortUID
              );
            } 
          }}
        >
          {column.Header}
        </div>
      ))}
    </div>
  );
});

CupboardsReportShowTableHeader.displayName = 'CupboardsReportShowTableHeader';

export default CupboardsReportShowTableHeader;
