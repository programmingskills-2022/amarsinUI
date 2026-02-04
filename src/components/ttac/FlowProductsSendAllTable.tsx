import { useCallback, useEffect, useRef, useState } from "react";
import TTable from "../controls/TTable";
import { TableColumns } from "../../types/general";
import { TablePaginationActions } from "../controls/TablePaginationActions";
import { debounce } from "lodash";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import { colors } from "../../utilities/color";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import { useTTacStore } from "../../store/ttacStore";
import FlowProductsSendAllTableHeader from "./FlowProductsSendAllTableHeader";
import Skeleton from "../layout/Skeleton";

type Props = {
  isLoading: boolean;
  columns: TableColumns;
  data: any[];
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalCount: number;
  selectedRowIndex: number;
  setSelectedRowIndex: (selectedRowIndex: number) => void;
  handleStatusSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FlowProductsSendAllTable = ({
  isLoading,
  columns,
  data,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  totalCount,
  selectedRowIndex,
  setSelectedRowIndex,
  handleStatusSelectAllClick,
}: Props) => {
  //const { width, height } = useCalculateTableHeight();
  const { setField } = useTTacStore();
  //const [selectedId, setSelectedId] = useState<number>(1363444);
  const abortControllerRef = useRef<AbortController | null>(null);
  //add filter options
  const [sendSrchCode, setSendSrchCode] = useState("");
  const [sendSrchCompleteDate, setSendSrchCompleteDate] = useState("");
  const [sendSrchDat, setSendSrchDat] = useState("");
  const [sendSrchEventId, setSendSrchEventId] = useState("");
  const [sendSrchFlowMapName, setSendSrchFlowMapName] = useState("");
  const [sendSrchIRC, setSendSrchIRC] = useState("");
  const [sendSrchIsCancel, setSendSrchIsCancel] = useState("");
  const [sendSrchLotNumber, setSendSrchLotNumber] = useState("");
  const [sendSrchMsg, setSendSrchMsg] = useState("");
  const [sendSrchPName, setSendSrchPName] = useState("");
  const [sendSrchSrName, setSendSrchSrName] = useState("");
  const [sendSrchSuccessed, setSendSrchSuccessed] = useState("");
  const [sendSrchTitle, setSendSrchTitle] = useState("");

  //for sorting
  const [sendSortId, setSendSortId] = useState<number>(0);
  const [sendSortFId, setSendSortFId] = useState<number>(0);
  const [sendSortTId, setSendSortTId] = useState<number>(0);
  const [sendSortPId, setSendSortPId] = useState<number>(0);
  const [sendSortIRC, setSendSortIRC] = useState<number>(0);
  const [sendSortPName, setSendSortPName] = useState<number>(0);
  const [sendSortEventId, setSendSortEventId] = useState<number>(0);
  const [sendSortErr, setSendSortErr] = useState<number>(0);
  const [sendSortMsg, setSendSortMsg] = useState<number>(0);
  const [sendSortTitle, setSendSortTitle] = useState<number>(0);
  const [sendSortCode, setSendSortCode] = useState<number>(0);
  const [sendSortDat, setSendSortDat] = useState<number>(0);
  const [sendSortSrName, setSendSortSrName] = useState<number>(0);
  const [sendSortLotNumber, setSendSortLotNumber] = useState<number>(0);
  const [sendSortCnt, setSendSortCnt] = useState<number>(0);
  const [sendSortSuccessed, setSendSortSuccessed] = useState<number>(0);
  const [sendSortIsCancel, setSendSortIsCancel] = useState<number>(0);
  const [sendSortFlowMapName, setSendSortFlowMapName] = useState<number>(0);
  const [sendSortCompleteDate, setSendSortCompleteDate] = useState<number>(0);

  // Refs for maintaining focus on input elements
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Function to preserve focus
  const preserveFocus = useCallback((inputName: string) => {
    setFocusedInput(inputName);
    setTimeout(() => {
      if (inputRefs.current[inputName]) {
        inputRefs.current[inputName]?.focus();
      }
    }, 0);
  }, []);

  // Restore focus after re-renders
  useEffect(() => {
    if (focusedInput && inputRefs.current[focusedInput]) {
      inputRefs.current[focusedInput]?.focus();
    }
  }, [focusedInput, data]);
  ////////////////////////////////////////////////////////////
  // for filtering
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      console.log(field, value, "field, value");
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setField(field, value);
    }, 500),
    [setField]
  );

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  //filter options
  useEffect(() => {
    //setSelectedId(0);
    setField("sendSrchCode", sendSrchCode);
    setField("sendSrchCompleteDate", sendSrchCompleteDate);
    setField("sendSrchDat", sendSrchDat);
    setField("sendSrchEventId", sendSrchEventId);
    setField("sendSrchFlowMapName", sendSrchFlowMapName);
    setField("sendSrchIRC", sendSrchIRC);
    setField("sendSrchIsCancel", sendSrchIsCancel);
    setField("sendSrchLotNumber", sendSrchLotNumber);
    setField("sendSrchMsg", sendSrchMsg);
    setField("sendSrchPName", sendSrchPName);
    setField("sendSrchSrName", sendSrchSrName);
    setField("sendSrchSuccessed", sendSrchSuccessed);
    setField("sendSrchTitle", sendSrchTitle);
  }, []);
  //sorting options
  useEffect(() => {
    setField("sendSortId", sendSortId);
    setField("sendSortFId", sendSortFId);
    setField("sendSortTId", sendSortTId);
    setField("sendSortPId", sendSortPId);
    setField("sendSortIRC", sendSortIRC);
    setField("sendSortPName", sendSortPName);
    setField("sendSortEventId", sendSortEventId);
    setField("sendSortErr", sendSortErr);
    setField("sendSortMsg", sendSortMsg);
    setField("sendSortTitle", sendSortTitle);
    setField("sendSortCode", sendSortCode);
    setField("sendSortDat", sendSortDat);
    setField("sendSortSrName", sendSortSrName);
    setField("sendSortLotNumber", sendSortLotNumber);
    setField("sendSortCnt", sendSortCnt);
    setField("sendSortSuccessed", sendSortSuccessed);
    setField("sendSortIsCancel", sendSortIsCancel);
    setField("sendSortFlowMapName", sendSortFlowMapName);
    setField("sendSortCompleteDate", sendSortCompleteDate);
  }, [
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
  ]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log("pageNumber", pageNumber);
    setField("sendPageNumber", pageNumber);
  }, [pageNumber]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    setPageNumber(1);
  }, [
    sendSrchCode,
    sendSrchCompleteDate,
    sendSrchDat,
    sendSrchEventId,
    sendSrchFlowMapName,
    sendSrchIRC,
    sendSrchIsCancel,
    sendSrchLotNumber,
    sendSrchMsg,
    sendSrchPName,
    sendSrchSrName,
    sendSrchSuccessed,
    sendSrchTitle,
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
  ]);
  ////////////////////////////////////////////////////////////
  const CupboardsInput = (
    inputName: string,
    inputWidth: string,
    inputValue: string,
    setInputValue: (value: string) => void
  ) => {
    return (
      <input
        ref={(el) => (inputRefs.current[inputName] = el)}
        name={inputName}
        value={convertToFarsiDigits(inputValue ?? "")}
        onChange={(e) => {
          preserveFocus(inputName);
          handleDebounceFilterChange(
            inputName,
            convertToLatinDigits(e.target.value)
          );
          setInputValue(e.target.value);
        }}
        onFocus={() => setFocusedInput(inputName)}
        style={{ width: inputWidth }}
        className={`border p-1 rounded-sm`}
      />
    );
  };
  /////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any): string | null => {
    if (Number(row.original.err) > 0) {
      return colors.red200;
    }
    return null;
  };
  //////////////////////////////////////////////////////////////
  const { width, height } = useCalculateTableHeight();
  ////////////////////////////////////////////////////////////
  return (
    <div className="h-full text-xs">
      {isLoading ? (
        <Skeleton />
      ) : (
        <div
          className="mt-2 overflow-y-auto"
          style={width > 640 ? { height: height } : { height: "fit" }}
        >
          <div className="w-full flex justify-center md:justify-end items-center ">
            <input
              name="index"
              value={""}
              disabled
              style={{ width: columns[0].width }}
              className={`border p-1 bg-gray-200 rounded-sm border-gray-300`}
            />
            {CupboardsInput(
              "sendSrchEventId",
              columns[1].width ?? "",
              sendSrchEventId,
              setSendSrchEventId
            )}
            {CupboardsInput(
              "sendSrchMsg",
              columns[2].width ?? "",
              sendSrchMsg,
              setSendSrchMsg
            )}
            {CupboardsInput(
              "sendSrchSuccessed",
              columns[3].width ?? "",
              sendSrchSuccessed,
              setSendSrchSuccessed
            )}
            {CupboardsInput(
              "sendSrchIsCancel",
              columns[4].width ?? "",
              sendSrchIsCancel,
              setSendSrchIsCancel
            )}
            {CupboardsInput(
              "sendSrchTitle",
              columns[5].width ?? "",
              sendSrchTitle,
              setSendSrchTitle
            )}
            {CupboardsInput(
              "sendSrchCode",
              columns[6].width ?? "",
              sendSrchCode,
              setSendSrchCode
            )}
            {CupboardsInput(
              "sendSrchDat",
              columns[7].width ?? "",
              sendSrchDat,
              setSendSrchDat
            )}
            {CupboardsInput(
              "sendSrchSrName",
              columns[8].width ?? "",
              sendSrchSrName,
              setSendSrchSrName
            )}
            {CupboardsInput(
              "sendSrchLotNumber",
              columns[9].width ?? "",
              sendSrchLotNumber,
              setSendSrchLotNumber
            )}
            {CupboardsInput(
              "sendSrchIRC",
              columns[10].width ?? "",
              sendSrchIRC,
              setSendSrchIRC
            )}
            {CupboardsInput(
              "sendSrchPName",
              columns[11].width ?? "",
              sendSrchPName,
              setSendSrchPName
            )}
            {CupboardsInput(
              "sendSrchCompleteDate",
              columns[12].width ?? "",
              sendSrchCompleteDate,
              setSendSrchCompleteDate
            )}
            {CupboardsInput(
              "sendSrchFlowMapName",
              columns[13].width ?? "",
              sendSrchFlowMapName,
              setSendSrchFlowMapName
            )}
            {/* put empty inputs for the rest of the columns */}
            {Array.from({ length: 2 }, (_, i) => i + 14).map((colIndex) => (
              <input
                key={colIndex}
                name=""
                value={""}
                disabled
                style={{ width: columns[colIndex].width }}
                className={`border p-1 bg-gray-200 rounded-sm  border-gray-300`}
              />
            ))}
          </div>
          <FlowProductsSendAllTableHeader
            columns={columns}
            sendSortId={sendSortId}
            sendSortFId={sendSortFId}
            sendSortTId={sendSortTId}
            sendSortPId={sendSortPId}
            sendSortIRC={sendSortIRC}
            sendSortPName={sendSortPName}
            sendSortEventId={sendSortEventId}
            sendSortErr={sendSortErr}
            sendSortMsg={sendSortMsg}
            sendSortTitle={sendSortTitle}
            sendSortCode={sendSortCode}
            sendSortDat={sendSortDat}
            sendSortSrName={sendSortSrName}
            sendSortLotNumber={sendSortLotNumber}
            sendSortCnt={sendSortCnt}
            sendSortSuccessed={sendSortSuccessed}
            sendSortIsCancel={sendSortIsCancel}
            sendSortFlowMapName={sendSortFlowMapName}
            sendSortCompleteDate={sendSortCompleteDate}
            setSendSortId={setSendSortId}
            setSendSortFId={setSendSortFId}
            setSendSortTId={setSendSortTId}
            setSendSortPId={setSendSortPId}
            setSendSortIRC={setSendSortIRC}
            setSendSortPName={setSendSortPName}
            setSendSortEventId={setSendSortEventId}
            setSendSortErr={setSendSortErr}
            setSendSortMsg={setSendSortMsg}
            setSendSortTitle={setSendSortTitle}
            setSendSortCode={setSendSortCode}
            setSendSortDat={setSendSortDat}
            setSendSortSrName={setSendSortSrName}
            setSendSortLotNumber={setSendSortLotNumber}
            setSendSortCnt={setSendSortCnt}
            setSendSortSuccessed={setSendSortSuccessed}
            setSendSortIsCancel={setSendSortIsCancel}
            setSendSortFlowMapName={setSendSortFlowMapName}
            setSendSortCompleteDate={setSendSortCompleteDate}
            handleStatusSelectAllClick={handleStatusSelectAllClick}
          />
          <TTable
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            columns={columns}
            data={data}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            //setSelectedId={handleSelectedIdChange}
            wordWrap={true}
            showToolTip={true}
            showHeader={false}
            CellColorChange={handleCellColorChange}
          />
          <div className="w-full bg-white rounded-md text-sm">
            <TablePaginationActions
              setSelectedRowIndex={setSelectedRowIndex}
              page={pageNumber - 1}
              setPage={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={totalCount ?? 0}
              showPagination={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowProductsSendAllTable;
