import { useCallback, useEffect, useRef, useState } from "react";
import Skeleton from "../layout/Skeleton";
import TTable from "../controls/TTable";
import { TableColumns } from "../../types/general";
import { TablePaginationActions } from "../controls/TablePaginationActions";
import CupboardsReportShowTableHeader from "./CupboardsReportShowTableHeader";
import { debounce } from "lodash";
import { useCupboardsReportStore } from "../../store/cupboardsReportStore";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import ModalForm from "../layout/ModalForm";
import { WarehouseTemporaryReceiptIndentDtl } from "../../types/warehouse";
import { colors } from "../../utilities/color";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import ProductCatalogue from "../warehouse/ProductCatalogue";

type Props = {
  isLoading: boolean;
  columns: TableColumns;
  data: any[];
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalCount: number;
  selectedProduct: WarehouseTemporaryReceiptIndentDtl | null;
  setSelectedProduct: (dtl: WarehouseTemporaryReceiptIndentDtl | null) => void;
  statusClicked: boolean;
  setStatusClicked: (statusClicked: boolean) => void;
  checkSeekingInfo: boolean;
  setCheckSeekingInfo: (checkSeekingInfo: boolean) => void;
  selectedRowIndex: number;
  setSelectedRowIndex: (selectedRowIndex: number) => void;
  uid: string | undefined;
  setUid: (uid: string | undefined) => void;
};

const CupboardsReportShowTable = ({
  isLoading,
  columns,
  data,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  totalCount,
  selectedProduct,
  setSelectedProduct,
  statusClicked,
  setStatusClicked,
  checkSeekingInfo,
  setCheckSeekingInfo,
  selectedRowIndex,
  setSelectedRowIndex,
  uid,
  setUid,
}: Props) => {
  //const { width, height } = useCalculateTableHeight();
  const { setField } = useCupboardsReportStore();
  //const [selectedId, setSelectedId] = useState<number>(1363444);
  const abortControllerRef = useRef<AbortController | null>(null);
  //add filter options
  const [srchCode, setSrchCode] = useState<string>("");
  const [srchFullCode, setSrchFullCode] = useState<string>("");
  const [srchFullName, setSrchFullName] = useState<string>("");
  const [srchTtac, setSrchTtac] = useState<string>("");
  const [srchADProdDate, setSrchADProdDate] = useState<string>("");
  const [srchADExpDate, setSrchADExpDate] = useState<string>("");
  const [srchProductGTIN, setSrchProductGTIN] = useState<string>("");
  const [srchProductIRC, setSrchProductIRC] = useState<string>("");
  const [srchUID, setSrchUID] = useState<string>("");
  const [sortCode, setSortCode] = useState<number>(0);
  const [sortFullCode, setSortFullCode] = useState<number>(0);
  const [sortFullName, setSortFullName] = useState<number>(0);
  const [sortTtac, setSortTtac] = useState<number>(0);
  const [sortADProdDate, setSortADProdDate] = useState<number>(0);
  const [sortADExpDate, setSortADExpDate] = useState<number>(0);
  const [sortProductGTIN, setSortProductGTIN] = useState<number>(0);
  const [sortProductIRC, setSortProductIRC] = useState<number>(0);
  const [sortUID, setSortUID] = useState<number>(0);

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

  useEffect(() => {
    //setSelectedId(0);
    setField("srchFullCode", srchFullCode);
    setField("srchFullName", srchFullName);
    setField("srchADProdDate", srchADProdDate);
    setField("srchADExpDate", srchADExpDate);
    setField("srchProductGTIN", srchProductGTIN);
    setField("srchTtac", srchTtac);
    setField("srchCode", srchCode);
    setField("srchProductIRC", srchProductIRC);
    setField("srchUID", srchUID);
  }, []);

  useEffect(() => {
    setField("sortCode", sortCode);
    setField("sortFullCode", sortFullCode);
    setField("sortFullName", sortFullName);
    setField("sortTtac", sortTtac);
    setField("sortADProdDate", sortADProdDate);
    setField("sortADExpDate", sortADExpDate);
    setField("sortProductGTIN", sortProductGTIN);
    setField("sortProductIRC", sortProductIRC);
    setField("sortUID", sortUID);
  }, [
    sortCode,
    sortFullCode,
    sortFullName,
    sortTtac,
    sortADProdDate,
    sortADExpDate,
    sortProductGTIN,
    sortProductIRC,
    sortUID,
  ]);
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log("pageNumber", pageNumber);
    setField("pageNumber", pageNumber);
  }, [pageNumber]);
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
  ////////////////////////////////////////////////////////
  const handleProductCatalogueClose = () => {
    setStatusClicked(false);
    setSelectedProduct(null);
    setCheckSeekingInfo(false);
    setUid(undefined);
  };

  /////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any): string | null => {
    if (convertToLatinDigits(row.original.status) !== "0") {
      return colors.red100;
    }
    return null;
  };
  const { width, height } = useCalculateTableHeight();

  return (
    <div className="px-2 h-full">
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
              className={`border p-1 text-sm bg-gray-200 rounded-sm border-gray-300`}
            />
            {CupboardsInput(
              "srchFullCode",
              columns[1].width ?? "",
              srchFullCode,
              setSrchFullCode
            )}
            {CupboardsInput(
              "srchFullName",
              columns[2].width ?? "",
              srchFullName,
              setSrchFullName
            )}
            {CupboardsInput(
              "srchADProdDate",
              columns[3].width ?? "",
              srchADProdDate,
              setSrchADProdDate
            )}
            {CupboardsInput(
              "srchADExpDate",
              columns[4].width ?? "",
              srchADExpDate,
              setSrchADExpDate
            )}
            {CupboardsInput(
              "srchProductGTIN",
              columns[5].width ?? "",
              srchProductGTIN,
              setSrchProductGTIN
            )}
            {CupboardsInput(
              "srchTtac",
              columns[6].width ?? "",
              srchTtac,
              setSrchTtac
            )}
            {CupboardsInput(
              "srchCode",
              columns[7].width ?? "",
              srchCode,
              setSrchCode
            )}
            {CupboardsInput(
              "srchProductIRC",
              columns[8].width ?? "",
              srchProductIRC,
              setSrchProductIRC
            )}
            {CupboardsInput(
              "srchUID",
              columns[9].width ?? "",
              srchUID,
              setSrchUID
            )}
            {/* put empty inputs for the rest of the columns */}
            {Array.from({ length: 6 }, (_, i) => i + 10).map((colIndex) => (
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
            sortCode={sortCode}
            sortFullCode={sortFullCode}
            sortFullName={sortFullName}
            sortTtac={sortTtac}
            sortADProdDate={sortADProdDate}
            sortADExpDate={sortADExpDate}
            sortProductGTIN={sortProductGTIN}
            sortProductIRC={sortProductIRC}
            sortUID={sortUID}
            setSortCode={setSortCode}
            setSortFullCode={setSortFullCode}
            setSortFullName={setSortFullName}
            setSortTtac={setSortTtac}
            setSortADProdDate={setSortADProdDate}
            setSortADExpDate={setSortADExpDate}
            setSortProductGTIN={setSortProductGTIN}
            setSortProductIRC={setSortProductIRC}
            setSortUID={setSortUID}
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
              showPagination={true}
            />
          </div>
        </div>
      )}
      {/*open product catalog if status is clicked*/}
      <ModalForm
        isOpen={statusClicked}
        onClose={handleProductCatalogueClose}
        title="کاتالوگ محصول"
        width="1/2"
        isCloseable={true}
      >
        {checkSeekingInfo
          ? selectedProduct && (
              <ProductCatalogue
                dtl={selectedProduct}
                visible={false} //dont show system info column
                uid={uid}
                setUid={setUid}
              />
            )
          : selectedProduct && (
              <ProductCatalogue dtl={selectedProduct} visible={true} />
            )}
      </ModalForm>
    </div>
  );
};

export default CupboardsReportShowTable;
