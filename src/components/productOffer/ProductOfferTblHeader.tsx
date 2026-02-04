import React from "react";
import { TableColumns } from "../../types/general";

type Props = {
  columns: TableColumns;
  sortId: number;
  sortDate: number;
  sortTime: number;
  sortDsc: number;
  sortAccepted?: number;
  sortUsrName: number;
  sortStep: number;
  sortSrName?: number | undefined;
  sortAmount?: number | undefined;
  setSortId: (sortId: number) => void;
  setSortDate: (sortDate: number) => void;
  setSortTime: (sortTime: number) => void;
  setSortDsc: (sortDsc: number) => void;
  setSortAccepted?: (sortAccepted: number) => void;
  setSortUsrName: (sortUsrName: number) => void;
  setSortStep: (sortStep: number) => void;
  setSortSrName?: (sortSrName: number) => void;
  setSortAmount?: (sortAmount: number) => void;
};

const ProductOfferTblHeader = React.memo(({
  columns,
  sortId, // in purchaseRequestIndent id is mrsId
  sortDate,
  sortTime,
  sortDsc,
  sortAccepted,
  sortUsrName,
  sortStep,
  sortSrName,
  sortAmount,
  setSortId,
  setSortDate,
  setSortTime,
  setSortDsc,
  setSortAccepted,
  setSortUsrName,
  setSortStep,
  setSortSrName,
  setSortAmount,
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
      {columns.filter((column: any) => column.visible!==false).map((column: any, index: number) => (
        <div
          className="flex bg-gray-200 border border-gray-300 text-center items-center justify-center border-r last:border-l cursor-pointer"
          key={column.id || column.accessor || index}
          style={{ width: column.width }}
          onClick={() => {
            if ((column.accessor === "id" ) || (column.accessor === "ordrId" )) {
              setSort(
                [
                  setSortDate,
                  setSortTime,
                  setSortDsc,
                  //setSortAccepted,
                  setSortUsrName,
                  setSortStep,
                ],
                sortId,
                setSortId
              );
            } else if (column.accessor === "dat") {
              setSort(
                [
                  setSortId,
                  setSortTime,
                  setSortDsc,
                  //setSortAccepted,
                  setSortUsrName,
                  setSortStep,
                ],
                sortDate,
                setSortDate
              );
            } else if (column.accessor === "tim") {
              setSort(
                [
                  setSortId,
                  setSortDate,
                  setSortDsc,
                  //setSortAccepted,
                  setSortUsrName,
                  setSortStep,
                ],
                sortTime,
                setSortTime
              );
            } else if (column.accessor === "dsc") {
              setSort(
                [
                  setSortId,
                  setSortDate,
                  setSortTime,
                  //setSortAccepted,
                  setSortUsrName,
                  setSortStep,
                ],
                sortDsc,
                setSortDsc
              );
            } else if (column.accessor === "accepted" && sortAccepted !== undefined && setSortAccepted !== undefined) {
              setSort(
                [
                  setSortId,
                  setSortDate,
                  setSortTime,
                  setSortDsc,
                  setSortUsrName,
                  setSortStep,
                ],
                sortAccepted,
                setSortAccepted
              );
            } else if (column.accessor === "usrName") {
              setSort(
                [
                  setSortId,
                  setSortDate,
                  setSortTime,
                  setSortDsc,
                  //setSortAccepted,
                  setSortStep,
                ],
                sortUsrName,
                setSortUsrName
              );
            } else if (column.accessor === "flowMapName") {
              setSort(
                [
                  setSortId,
                  setSortDate,
                  setSortTime,
                  setSortDsc,
                  //setSortAccepted,
                  setSortUsrName,
                ],
                sortStep,
                setSortStep
              );
            } else if ((column.accessor === "amount" || column.accessor === "payDuration") && sortAmount !== undefined && setSortAmount !== undefined) {
              setSort(
                [
                  setSortId,
                  setSortDate,
                  setSortTime,
                  setSortDsc,
                  //setSortAccepted,
                  setSortUsrName,
                ],
                sortAmount,
                setSortAmount
              );
            } else if (column.accessor === "srName" && sortSrName !== undefined && setSortSrName !== undefined) {
              setSort(
                [
                  setSortId,
                  setSortDate,
                  setSortTime,
                  setSortDsc,
                  //setSortAccepted,
                  setSortUsrName,
                ],
                sortSrName,
                setSortSrName
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

ProductOfferTblHeader.displayName = 'ProductOfferTblHeader';

export default ProductOfferTblHeader;
