import React from "react";
import { TableColumns } from "../../types/general";
import Question16 from "../../assets/images/GrayThem/question16.png";
type Props = {
  columns: TableColumns;
  sendSortId: number;
  sendSortFId: number;
  sendSortTId: number;
  sendSortPId: number;
  sendSortIRC: number;
  sendSortPName: number;
  sendSortEventId: number;
  sendSortErr: number;
  sendSortMsg: number;
  sendSortTitle: number;
  sendSortCode: number;
  sendSortDat: number;
  sendSortSrName: number;
  sendSortLotNumber: number;
  sendSortCnt: number;
  sendSortSuccessed: number;
  sendSortIsCancel: number;
  sendSortFlowMapName: number;
  sendSortCompleteDate: number;
  setSendSortId: (sendSortId: number) => void;
  setSendSortFId: (sendSortFId: number) => void;
  setSendSortTId: (sendSortTId: number) => void;
  setSendSortPId: (sendSortPId: number) => void;
  setSendSortIRC: (sendSortIRC: number) => void;
  setSendSortPName: (sendSortPName: number) => void;
  setSendSortEventId: (sendSortEventId: number) => void;
  setSendSortErr: (sendSortErr: number) => void;
  setSendSortMsg: (sendSortMsg: number) => void;
  setSendSortTitle: (sendSortTitle: number) => void;
  setSendSortCode: (sendSortCode: number) => void;
  setSendSortDat: (sendSortDat: number) => void;
  setSendSortSrName: (sendSortSrName: number) => void;
  setSendSortLotNumber: (sendSortLotNumber: number) => void;
  setSendSortCnt: (sendSortCnt: number) => void;
  setSendSortSuccessed: (sendSortSuccessed: number) => void;
  setSendSortIsCancel: (sendSortIsCancel: number) => void;
  setSendSortFlowMapName: (sendSortFlowMapName: number) => void;
  setSendSortCompleteDate: (sendSortCompleteDate: number) => void;
  handleStatusSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FlowProductsSendAllTableHeader = React.memo(
  ({
    columns,
    sendSortId,
    sendSortFId,
    sendSortTId,
    sendSortPId,
    sendSortIRC,
    sendSortPName,
    sendSortEventId,
    sendSortErr,
    sendSortMsg,
    sendSortTitle,
    sendSortCode,
    sendSortDat,
    sendSortSrName,
    sendSortLotNumber,
    sendSortCnt,
    sendSortSuccessed,
    sendSortIsCancel,
    sendSortFlowMapName,
    sendSortCompleteDate,
    setSendSortId,
    setSendSortFId,
    setSendSortTId,
    setSendSortPId,
    setSendSortIRC,
    setSendSortPName,
    setSendSortEventId,
    setSendSortErr,
    setSendSortMsg,
    setSendSortTitle,
    setSendSortCode,
    setSendSortDat,
    setSendSortSrName,
    setSendSortLotNumber,
    setSendSortCnt,
    setSendSortSuccessed,
    setSendSortIsCancel,
    setSendSortFlowMapName,
    setSendSortCompleteDate,
    handleStatusSelectAllClick,
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
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortId,
                    setSendSortId
                  );
                } else if (column.accessor === "fId") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortFId,
                    setSendSortFId
                  );
                } else if (column.accessor === "tId") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortTId,
                    setSendSortTId
                  );
                } else if (column.accessor === "pId") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortPId,
                    setSendSortPId
                  );
                } else if (column.accessor === "irc") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortIRC,
                    setSendSortIRC
                  );
                } else if (column.accessor === "pName") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortPName,
                    setSendSortPName
                  );
                } else if (column.accessor === "eventId") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortEventId,
                    setSendSortEventId
                  );
                } else if (column.accessor === "err") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortErr,
                    setSendSortErr
                  );
                } else if (column.accessor === "msg") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortMsg,
                    setSendSortMsg
                  );
                } else if (column.accessor === "title") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortTitle,
                    setSendSortTitle
                  );
                } else if (column.accessor === "code") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortCode,
                    setSendSortCode
                  );
                } else if (column.accessor === "dat") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortDat,
                    setSendSortDat
                  );
                } else if (column.accessor === "srName") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortSrName,
                    setSendSortSrName
                  );
                } else if (column.accessor === "lotNumber") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortLotNumber,
                    setSendSortLotNumber
                  );
                } else if (column.accessor === "cnt") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortCnt,
                    setSendSortCnt
                  );
                } else if (column.accessor === "successed") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortSuccessed,
                    setSendSortSuccessed
                  );
                } else if (column.accessor === "isCancel") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortFlowMapName,
                      setSendSortCompleteDate,
                    ],
                    sendSortIsCancel,
                    setSendSortIsCancel
                  );
                } else if (column.accessor === "flowMapName") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortCompleteDate,
                    ],
                    sendSortFlowMapName,
                    setSendSortFlowMapName
                  );
                } else if (column.accessor === "completeDate") {
                  setSort(
                    [
                      setSendSortId,
                      setSendSortFId,
                      setSendSortTId,
                      setSendSortPId,
                      setSendSortIRC,
                      setSendSortPName,
                      setSendSortEventId,
                      setSendSortErr,
                      setSendSortMsg,
                      setSendSortTitle,
                      setSendSortCode,
                      setSendSortDat,
                      setSendSortSrName,
                      setSendSortLotNumber,
                      setSendSortCnt,
                      setSendSortSuccessed,
                      setSendSortIsCancel,
                      setSendSortFlowMapName,
                    ],
                    sendSortCompleteDate,
                    setSendSortCompleteDate
                  );
                }
              }}
            >
              {column.accessor !== "statusImages" ? (
                column.Header
              ) : (
                <div className="flex justify-evenly items-center w-full">
                  <input type="checkbox" onChange={(e) => handleStatusSelectAllClick(e)}/>
                  <img src={Question16} alt="Question16" className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
      </div>
    );
  }
);

FlowProductsSendAllTableHeader.displayName = "CupboardsReportShowTableHeader";

export default FlowProductsSendAllTableHeader;
