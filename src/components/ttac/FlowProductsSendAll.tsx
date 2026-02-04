import { useEffect, useState, useRef } from "react";
import FlowProductsSendAllHeader from "./FlowProductsSendAllHeader";
import FlowProductsSendAllTable from "./FlowProductsSendAllTable";
import { TableColumns } from "../../types/general";
import {
  convertToFarsiDigits,
  convertToPersianDate,
} from "../../utilities/general";
import Flow16 from "../../assets/images/GrayThem/flow16.png";
import Question16 from "../../assets/images/GrayThem/question16.png";
import Report16 from "../../assets/images/GrayThem/report16.png";
import { useTTacStore } from "../../store/ttacStore";
import { useGeneralContext } from "../../context/GeneralContext";
import Spinner from "../controls/Spinner";
import { v4 as uuidv4 } from "uuid";
import ModalMessage from "../layout/ModalMessage";
import {
  CupboardCaptureResponse,
  FlowProductsSendAllResponse,
  ImportTTacStatusResponse,
} from "../../types/ttac";
import { QueryObserverResult } from "@tanstack/react-query";

type Props = {
  refetchFlowProductsSendAll: () => Promise<
    QueryObserverResult<FlowProductsSendAllResponse, Error>
  >;
  flowProductsSendAllResponse: FlowProductsSendAllResponse;
  isLoadingFlowProductsSendAll: boolean;
  isFetchingFlowProductsSendAll: boolean;
  cupboardCaptureResponse: CupboardCaptureResponse;
  isLoadingCupboardCapture: boolean;
  importTTacStatusResponse: ImportTTacStatusResponse;
  isLoadingImportTTacStatus: boolean;
};
const FlowProductsSendAll = ({
  refetchFlowProductsSendAll,
  flowProductsSendAllResponse,
  isLoadingFlowProductsSendAll,
  isFetchingFlowProductsSendAll,
  cupboardCaptureResponse,
  isLoadingCupboardCapture,
  importTTacStatusResponse,
  isLoadingImportTTacStatus,
}: Props) => {

  const { setField } = useTTacStore();
  const { yearId, systemId } = useGeneralContext();
  const [sendDate, setSendDate] = useState<Date | null>(new Date());
  const [sendTtacSent, setSendTtacSent] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const dataRef = useRef<any[]>([]);

  // for pagination
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(35);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [pendingCupboardCaptureRowIndex, setPendingCupboardCaptureRowIndex] =
    useState<number | null>(null);
  const [pendingImportTTacStatusRowIndex, setPendingImportTTacStatusRowIndex] =
    useState<number | null>(null);
  const [isOpenCaptureMessageModal, setIsOpenCaptureMessageModal] =
    useState<boolean>(false);
  const [
    isOpenImportTTacStatusMessageModal,
    setIsOpenImportTTacStatusMessageModal,
  ] = useState<boolean>(false);
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "2%",
    },
    {
      Header: "eventId",
      accessor: "eventId",
      width: "14%",
    },
    {
      Header: "پیام",
      accessor: "msg",
      width: "15%",
    },
    {
      Header: "تایید",
      accessor: "successed",
      width: "2%",
    },
    {
      Header: "انصراف",
      accessor: "isCancel",
      width: "2%",
    },
    {
      Header: "نوع",
      accessor: "title",
      width: "3%",
    },
    {
      Header: "کد",
      accessor: "code",
      width: "3%",
    },
    {
      Header: "تاریخ",
      accessor: "dat",
      width: "5%",
    },
    {
      Header: "طرف حساب",
      accessor: "srName",
      width: "14%",
    },
    {
      Header: "بچ",
      accessor: "lotNumber",
      width: "5%",
    },
    {
      Header: "IRC",
      accessor: "irc",
      width: "7%",
    },
    {
      Header: "کالا",
      accessor: "pName",
      width: "16%",
    },
    {
      Header: "تغییر مکان",
      accessor: "completeDate",
      width: "5%",
    },
    {
      Header: "مرحله",
      accessor: "flowMapName",
      width: "5%",
    },
    {
      Header: "تعداد",
      accessor: "cnt",
      width: "2%",
    },
    {
      Header: " ",
      accessor: "statusImages",
      width: "2%",
    },
  ];
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpenCaptureMessageModal || isOpenImportTTacStatusMessageModal) {
      timeoutId = setTimeout(() => {
        setIsOpenCaptureMessageModal(false);
        setIsOpenImportTTacStatusMessageModal(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpenCaptureMessageModal, isOpenImportTTacStatusMessageModal]);

  //////////////////////////////////////////////////////////////
  useEffect(() => {
    setPageNumber(1);
  }, [sendDate, sendTtacSent]);
  //////////////////////////////////////////////////////////////

  useEffect(() => {
    setField("sendSystemId", systemId);
    setField("sendYearId", yearId);
    setField("sendDate", convertToPersianDate(sendDate ?? new Date()));
    setField("sendTtacSent", sendTtacSent);
  }, [sendDate, sendTtacSent, systemId, yearId]);
  // for initializing data
  useEffect(() => {
    if (flowProductsSendAllResponse.data.result.length === 0) return;
    const tempData = flowProductsSendAllResponse.data.result.map((c, index) => {
      return {
        ...c,
        eventId: convertToFarsiDigits(c.eventId),
        msg: convertToFarsiDigits(c.msg),
        successed: convertToFarsiDigits(c.successed),
        isCancel: convertToFarsiDigits(c.isCancel),
        title: convertToFarsiDigits(c.title),
        code: convertToFarsiDigits(c.code),
        dat: convertToFarsiDigits(c.dat),
        srName: convertToFarsiDigits(c.srName),
        lotNumber: convertToFarsiDigits(c.lotNumber),
        irc: convertToFarsiDigits(c.irc),
        pName: convertToFarsiDigits(c.pName),
        completeDate: convertToFarsiDigits(c.completeDate),
        flowMapName: convertToFarsiDigits(c.flowMapName),
        cnt: convertToFarsiDigits(Number(c.cnt)),
        index: convertToFarsiDigits((pageNumber - 1) * pageSize + index + 1),
        status: "Nothing",
        statusImages: (
          <div className="flex justify-evenly items-center w-full">
            {c.err === 0 ? (
              <input
                type="checkbox"
                checked={false}
                onChange={() => handleStatusClick(index)}
              />
            ) : (
              <img
                src={Question16}
                alt="Question16"
                className="cursor-pointer w-4 h-4"
                onClick={() => handleQuestionClick(index)}
              />
            )}
            <img src={Flow16} alt="Flow16" className="w-4 h-4" />
          </div>
        ),
      };
    });
    setData(tempData);
    dataRef.current = tempData;
  }, [flowProductsSendAllResponse.data.result, isFetchingFlowProductsSendAll]);
  //////////////////////////////////////////////////////////////
  const handleStatusClick = (rowIndex: number) => {
    // Read from ref to ensure we have the latest data
    const cupboardCapturedId = dataRef.current[rowIndex]?.id ?? 0;
    setPendingCupboardCaptureRowIndex(rowIndex);
    setField("cupboardCaptureId", cupboardCapturedId);
    setField("cupboardCaptureCurrentDateTime", true);
    setField("cupboardCaptureIdempotencyKey", uuidv4());
    // Show loading state immediately
    setData((old) => {
      const updated = old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            statusImages: (
              <div className="flex justify-evenly items-center w-full">
                {isLoadingCupboardCapture ? (
                  <Spinner size={4} />
                ) : (
                  row.statusImages
                )}
                <img
                  src={Flow16}
                  alt="Flow16"
                  className="cursor-pointer w-4 h-4"
                />
              </div>
            ),
          };
        }
        return row;
      });
      dataRef.current = updated;
      return updated;
    });
    // Trigger API call
    //refetchCupboardCapture();
  };
  //////////////////////////////////////////////////////////////
  // Update data when cupboardCaptureResponse changes
  useEffect(() => {
    if (
      pendingCupboardCaptureRowIndex !== null &&
      cupboardCaptureResponse?.data?.result &&
      isLoadingCupboardCapture === false
    ) {
      const rowIndex = pendingCupboardCaptureRowIndex;
      setIsOpenCaptureMessageModal(true);
      setData((old) => {
        const updated = old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              status: "CupboardCapture",
              eventId:
                cupboardCaptureResponse.data.result.err === 0
                  ? cupboardCaptureResponse.data.result.eventId
                  : row.eventId,
              msg: cupboardCaptureResponse.data.result.msg,
              tId: cupboardCaptureResponse.data.result.logId,
              successed:
                cupboardCaptureResponse.data.result.err === 0 &&
                cupboardCaptureResponse.data.result.status === 1
                  ? 1
                  : row.successed,
              err: cupboardCaptureResponse.data.result.err,
              statusImages: (
                <div className="flex justify-evenly items-center w-full">
                  {cupboardCaptureResponse.data.result.err === 0 ? (
                    <img
                      src={Question16}
                      alt="Question16"
                      className="cursor-pointer w-4 h-4"
                      onClick={() => handleQuestionClick(rowIndex)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleStatusClick(rowIndex)}
                    />
                  )}
                  <img
                    src={Flow16}
                    alt="Flow16"
                    className="cursor-pointer w-4 h-4"
                  />
                </div>
              ),
            };
          }
          return row;
        });
        dataRef.current = updated;
        return updated;
      });
      setPendingCupboardCaptureRowIndex(null);
    }
  }, [cupboardCaptureResponse, pendingCupboardCaptureRowIndex]);
  ////////////////////////////////////////////////////////////
  const handleQuestionClick = (rowIndex: number) => {
    setPendingImportTTacStatusRowIndex(rowIndex);
    // Read tId from the ref to get the latest value (avoids closure issues)
    const currentRow = dataRef.current[rowIndex];
    const tId = currentRow?.tId ?? 0;
    setField("importTTacStatusSystemId", systemId);
    setField("importTTacStatusLtId", tId);
    // Increment trigger to force refetch even with same values
    setField("importTTacStatusTrigger", Date.now());
    // Show loading state immediately
    setData((old) => {
      const updated = old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            statusImages: (
              <div className="flex justify-evenly items-center w-full">
                {isLoadingImportTTacStatus ? (
                  <Spinner size={4} />
                ) : (
                  row.statusImages
                )}
                <img
                  src={Flow16}
                  alt="Flow16"
                  className="cursor-pointer w-4 h-4"
                />
              </div>
            ),
          };
        }
        return row;
      });
      dataRef.current = updated;
      return updated;
    });
    // Trigger API call
    //refetchImportTTacStatus();
  };
  ////////////////////////////////////////////////////////////
  // Update data when importTTacStatusResponse changes
  useEffect(() => {
    if (
      pendingImportTTacStatusRowIndex !== null &&
      importTTacStatusResponse?.data?.result &&
      isLoadingImportTTacStatus === false
    ) {
      const rowIndex = pendingImportTTacStatusRowIndex;
      if (importTTacStatusResponse.data.result.err !== 0) {
        setIsOpenImportTTacStatusMessageModal(true);
      }
      setData((old) => {
        const updated = old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              status: "ImportTTacStatus",
              msg: importTTacStatusResponse.data.result.msg,
              err: importTTacStatusResponse.data.result.err,
              successed:
                importTTacStatusResponse.data.result.status === 1
                  ? 1
                  : row.successed,
              statusImages: (
                <div className="flex justify-evenly items-center w-full">
                  {importTTacStatusResponse.data.result.err === 0 ? (
                    <img
                      src={Report16}
                      alt="Report16"
                      className="cursor-pointer w-4 h-4"
                      onClick={() => handleQuestionClick(rowIndex)}
                    />
                  ) : (
                    <img
                      src={Question16}
                      alt="Question16"
                      className="cursor-pointer w-4 h-4"
                      onClick={() => handleQuestionClick(rowIndex)}
                    />
                  )}
                  <img
                    src={Flow16}
                    alt="Flow16"
                    className="cursor-pointer w-4 h-4"
                  />
                </div>
              ),
            };
          }
          return row;
        });
        dataRef.current = updated;
        return updated;
      });
      setPendingImportTTacStatusRowIndex(null);
    }
  }, [importTTacStatusResponse, pendingImportTTacStatusRowIndex]);
  //////////////////////////////////////////////////////////////
  const handleStatusSelectAllClick = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === "Nothing") {
          //handleStatusClick(i);
          console.log(i, "i");
        }
      }
    }
  };
  //////////////////////////////////////////////////////////////
  return (
    <div className="w-full flex flex-col text-sm text-gray-500">
      <FlowProductsSendAllHeader
        sendDate={sendDate}
        setSendDate={setSendDate}
        sendTtacSent={sendTtacSent}
        setSendTtacSent={setSendTtacSent}
        refetchFlowProductsSendAll={refetchFlowProductsSendAll}
      />
      <FlowProductsSendAllTable
        isLoading={
          isLoadingFlowProductsSendAll || isFetchingFlowProductsSendAll //|| //isLoadingCupboardCapture || isLoadingImportTTacStatus
        }
        columns={columns}
        data={data}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalCount={flowProductsSendAllResponse.data.total_count ?? 0}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
        handleStatusSelectAllClick={handleStatusSelectAllClick}
      />
      <ModalMessage
        isOpen={isOpenCaptureMessageModal}
        onClose={() => setIsOpenCaptureMessageModal(false)}
        message={cupboardCaptureResponse?.data?.result?.msg || ""}
        color="text-white"
        backgroundColor={cupboardCaptureResponse?.data?.result?.err===0 ? "bg-green-200" : "bg-red-200"}
        visibleButton={false}
      />
      <ModalMessage
        isOpen={isOpenImportTTacStatusMessageModal}
        onClose={() => setIsOpenImportTTacStatusMessageModal(false)}
        message={importTTacStatusResponse?.data?.result?.msg || ""}
        color="text-white"
        backgroundColor={importTTacStatusResponse?.data?.result?.err===0 ? "bg-green-200" : "bg-red-200"}
        visibleButton={false}
      />
    </div>
  );
};

export default FlowProductsSendAll;
