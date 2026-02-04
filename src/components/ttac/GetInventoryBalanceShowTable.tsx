import { useCallback, useEffect, useRef, useState } from "react";
import TTable from "../controls/TTable";
import { TableColumns } from "../../types/general";
import { TablePaginationActions } from "../controls/TablePaginationActions";
import CupboardsReportShowTableHeader from "./GetInventoryBalanceShowTableHeader";
import { debounce } from "lodash";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import { colors } from "../../utilities/color";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import { useTTacStore } from "../../store/ttacStore";
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
};

const GetInventoryBalanceShowTable = ({
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
}: Props) => {
  //const { width, height } = useCalculateTableHeight();
  const { setField } = useTTacStore();
  //const [selectedId, setSelectedId] = useState<number>(1363444);
  const abortControllerRef = useRef<AbortController | null>(null);
  //add filter options
  const [srchIRC, setSrchIRC] = useState<string>("");
  const [srchLotNumber, setSrchLotNumber] = useState<string>("");
  //for sorting
  const [sortId, setSortId] = useState<number>(0);
  const [sortIRC, setSortIRC] = useState<number>(0);
  const [sortLotNumber, setSortLotNumber] = useState<number>(0);
  const [sortWStock, setSortWStock] = useState<number>(0);
  const [sortCnt, setSortCnt] = useState<number>(0);
  const [sortNotSent, setSortNotSent] = useState<number>(0);
  const [sortTCnt, setSortTCnt] = useState<number>(0);

  // Refs for maintaining focus on input elements
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  //for pagination
  const [hasPagination, setHasPagination] = useState<boolean>(true);
  const [showPagination, setShowPagination] = useState<boolean>(true);

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

  useEffect(() => {
    //setSelectedId(0);
    setHasPagination(true)
    setField("srchIRC", srchIRC);
    setField("srchLotNumber", srchLotNumber);
  }, []);

  useEffect(() => {
    if (!showPagination) {
      setField("pageNumber", 0);
    } else {
      setField("pageNumber", 1);
    }
  }, [showPagination]);

  useEffect(() => {
    setField("sortId", sortId);
    setField("sortIRC", sortIRC);
    setField("sortLotNumber", sortLotNumber);
    setField("sortWStock", sortWStock);
    setField("sortCnt", sortCnt);
    setField("sortNotSent", sortNotSent);
    setField("sortTCnt", sortTCnt);
  }, [
    sortId,
    sortIRC,
    sortLotNumber,
    sortWStock,
    sortCnt,
    sortNotSent,
    sortTCnt,
  ]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log("pageNumber", pageNumber);
    setField("pageNumber", pageNumber);
  }, [pageNumber]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    setPageNumber(1);
  }, [
    srchIRC,
    srchLotNumber,
    sortId,
    sortIRC,
    sortLotNumber,
    sortWStock,
    sortCnt,
    sortNotSent,
    sortTCnt,
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
        className={`border p-1 text-sm rounded-sm`}
      />
    );
  };
  /////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any): string | null => {
    const wStock = Number(convertToLatinDigits(row.original.wStock));
    const notSent = Number(convertToLatinDigits(row.original.notSent));
    const tCnt = Number(convertToLatinDigits(row.original.tCnt));

    if (convertToLatinDigits(row.original.tCnt) === "1-") {
      return colors.gray100;
    } else if (wStock + notSent === tCnt && notSent !== 0) {
      return colors.red100;
    } else if (wStock + notSent !== tCnt) {
      return colors.red200;
    }
    return "";
  };
  const { width, height } = useCalculateTableHeight();

  return (
    <div className="px-2 h-full">
      {isLoading ? (
        <Skeleton width={width} height={height}/>
      ) : (
        <div
          className="mt-2 overflow-y-auto"
          style={width > 640 ? { height: height } : { height: "fit" }}
        >
          <div className="w-full flex justify-center md:justify-end items-center ">
            <input
              name="id"
              value={""}
              disabled
              style={{ width: columns[0].width }}
              className={`border p-1 text-sm bg-gray-200 rounded-sm border-gray-300`}
            />
            {CupboardsInput(
              "srchIRC",
              columns[1].width ?? "",
              srchIRC,
              setSrchIRC
            )}
            {CupboardsInput(
              "srchLotNumber",
              columns[2].width ?? "",
              srchLotNumber,
              setSrchLotNumber
            )}
            {/* put empty inputs for the rest of the columns */}
            {Array.from({ length: 5 }, (_, i) => i + 3).map((colIndex) => (
              <input
                key={colIndex}
                name=""
                value={""}
                disabled
                style={{ width: columns[colIndex].width }}
                className={`border p-1 text-sm bg-gray-200 rounded-sm  border-gray-300`}
              />
            ))}
            {/* end of empty inputs */}
          </div>
          <CupboardsReportShowTableHeader
            columns={columns}
            sortId={sortId}
            sortIRC={sortIRC}
            sortLotNumber={sortLotNumber}
            sortWStock={sortWStock}
            sortCnt={sortCnt}
            sortNotSent={sortNotSent}
            sortTCnt={sortTCnt}
            setSortId={setSortId}
            setSortIRC={setSortIRC}
            setSortLotNumber={setSortLotNumber}
            setSortWStock={setSortWStock}
            setSortCnt={setSortCnt}
            setSortNotSent={setSortNotSent}
            setSortTCnt={setSortTCnt}
          />
          <TTable
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            columns={columns}
            data={data}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            //setSelectedId={handleSelectedIdChange}
            wordWrap={false}
            showToolTip={true}
            showHeader={false}
            CellColorChange={handleCellColorChange}
          />
          <div className="w-full bg-white rounded-md">
            <TablePaginationActions
              setSelectedRowIndex={setSelectedRowIndex}
              page={pageNumber - 1}
              setPage={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={totalCount ?? 0}
              hasPagination={hasPagination}
              showPagination={showPagination}
              setShowPagination={setShowPagination}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GetInventoryBalanceShowTable;
