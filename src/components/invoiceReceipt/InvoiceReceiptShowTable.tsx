//کارشناس خرید => دریافت پیش فاکتور
import Skeleton from "../layout/Skeleton";
import {
  IndentDtl,
  IndentDtlTable,
  IndentMrsResponse,
} from "../../types/invoiceReceipt";
import TrashIcon from "../../assets/images/GrayThem/delete_gray_16.png";
import HistoryIcon from "../../assets/images/GrayThem/history_gray_16.png";
import RestoreIcon from "../../assets/images/GrayThem/restore_gray_16.png";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  convertPersianDate,
  convertToFarsiDigits,
  convertToLatinDigits,
  currencyStringToNumber,
  formatNumberWithCommas,
  normalizeInputForSearch,
} from "../../utilities/general";
import { useProductStore } from "../../store/productStore";
import { useGeneralContext } from "../../context/GeneralContext";
import TTable, { EditableInput } from "../controls/TTable";
import {
  DefaultOptionType,
  TableColumns,
} from "../../types/general";
import {
  Detail,
  IndentSaveRequest,
  IndentShowProductListResponse,
  ProductSearchRequest,
} from "../../types/product";
import { red } from "@mui/material/colors";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import { Fields } from "./InvoiceReceiptShow";
import InvoiceReceiptHistory from "./invoiceReceiptHistory";
import InvoiceReceiptShowTableHeader from "./InvoiceReceiptShowTableHeader";
import InvoiceReceiptShowTableSummery from "./InvoiceReceiptShowTableSummery";
import { debounce } from "lodash";
import { useProducts } from "../../hooks/useProducts";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import ModalMessage from "../layout/ModalMessage";

type Props = {
  isNew?: boolean;
  canEditForm: boolean;
  addList: IndentDtl[];
  indentMrsResponse: IndentMrsResponse;
  isLoading: boolean;
  handleSubmit: (
    e?: React.MouseEvent<HTMLButtonElement>,
    productId?: number
  ) => Promise<IndentShowProductListResponse | undefined>;
  handleAddRow: (
    index: number,
    setData: Dispatch<SetStateAction<IndentDtlTable[]>>
  ) => void;
  showDeleted: boolean;
  mrsId: number;
  fields: Fields;
  newRow: IndentDtlTable;
  //products: DefaultOptionType[];
  saveList: (request: IndentSaveRequest) => Promise<any>;
  isLoadingSaveList: boolean;
  isDtHistoryLoading: boolean;
  getIndentMrsResponse: () => void;
  //setProductSearchinTable: React.Dispatch<React.SetStateAction<string>>;
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  isFromWorkFlow: boolean;
};
export const headCells = [
  {
    Header: "ردیف",
    accessor: "index",
    width: "2%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "برند",
    accessor: "bName",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "کالا",
    accessor: "product",
    width: "25%",
    type: "autoComplete",
    placeholder: "کالا را انتخاب کنید...",
    Cell: EditableInput,
  },
  {
    Header: "موجودی",
    accessor: "companyStock",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "فروش",
    accessor: "sumCompanyCnt",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "موجودی",
    accessor: "storeStock",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "فروش",
    accessor: "sumStoreCnt",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "خرید",
    accessor: "lbDate",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "تعداد",
    accessor: "cnt",
    width: "5%",
    type: "inputText",
    Cell: EditableInput,
  },
  {
    Header: "آفر",
    accessor: "offer",
    width: "5%",
    type: "inputText",
    Cell: EditableInput,
  },
  {
    Header: "مبلغ",
    accessor: "cost",
    width: "5%",
    type: "inputText",
    isCurrency: true,
    Cell: EditableInput,
  },
  {
    Header: "تخفیف",
    accessor: "dcrmnt",
    width: "5%",
    type: "inputText",
    isCurrency: true,
    Cell: EditableInput,
  },
  {
    Header: "مالیات",
    accessor: "taxValue",
    width: "5%",
    Cell: ({ value }: any) =>
      convertToFarsiDigits(formatNumberWithCommas(value)),
  },
  {
    Header: "جمع",
    accessor: "total",
    width: "5%",
    Cell: ({ value }: any) =>
      convertToFarsiDigits(formatNumberWithCommas(value)),
  },
  {
    Header: "شرح",
    accessor: "dtlDsc",
    width: "10%",
    type: "textArea",
    Cell: EditableInput,
  },
  {
    Header: " ",
    accessor: "icons",
    width: "3%",

    Cell: () => {
      return (
        <div className="flex w-full">
          {
            <img
              src={TrashIcon}
              onClick={() => console.log("hello")}
              className="cursor-pointer"
              alt="TrashIcon"
            />
          }
          <img
            src={HistoryIcon}
            onClick={() => console.log("hello")}
            className="cursor-pointer"
            alt="HistoryIcon"
          />
        </div>
      );
    },
  },
];

const InvoiceReceiptShowTable = ({
  isNew,
  //setProductSearchinTable,
  canEditForm,
  addList,
  indentMrsResponse,
  isLoading,
  handleSubmit,
  handleAddRow,
  showDeleted,
  mrsId,
  fields,
  newRow,
  //products,
  saveList,
  isLoadingSaveList,
  isDtHistoryLoading,
  getIndentMrsResponse,
  setIsNew,
  setIsEdit,
  isFromWorkFlow,
}: Props) => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [dtlDscSearch, setDtlDscSearch] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const { yearId, systemId } = useGeneralContext();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in invoiceReceiptShowTable table

  const {
    setField: setProductField,
    indentDtlHistoryResponse,
    indentSaveResponse,
  } = useProductStore();

  const [search, setSearch] = useState<string>("");
  const { products, isProductSearchLoading } = useProducts();
  const [isModalSaveOpen, setIsModalSaveOpen] = useState(false);
  //send params to /api/Product/search?accSystem=4&accYear=15&page=1&searchTerm=%D8%B3%D9%81
  useEffect(() => {
    if (canEditForm) {
      setProductField("productSearchAccSystem", systemId);
      setProductField("productSearchAccYear", yearId);
      handleDebounceFilterChange("productSearchSearch", search);
      setProductField("productSearchPage", 1);
    }
    // to not allow calling salesPricesSearch when productSearch is called
    setProductField("salesPricesSearchPage", 1);
  }, [search, systemId, yearId]);
  const abortControllerRef = useRef<AbortController | null>(null);
  ///////////////////////////////////////////////////////
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setProductField(field as keyof ProductSearchRequest, value);
    }, 500),
    [setProductField]
  );
  ///////////////////////////////////////////////////////

  const columns: TableColumns = useMemo(() => {
    return headCells.map((item) => {
      return {
        ...item,
        options:
          item.accessor === "product"
            ? products.map((p) => ({
                id: p.pId,
                title: p.n,
              }))
            : undefined,
        setSearch: item.accessor === "product" ? setSearch : undefined,
        isLoading: item.accessor === "product" ? isProductSearchLoading : false,
        Cell:
          item.accessor === "icons"
            ? ({ row }: any) => {
                return (
                  <div className="flex w-full">
                    {canEditForm ? (
                      <img
                        src={row.original.isDeleted ? RestoreIcon : TrashIcon}
                        onClick={() => updateToDeleted(row)}
                        className="cursor-pointer"
                        alt="TrashIcon"
                      />
                    ) : null}
                    <img
                      src={HistoryIcon}
                      onClick={() => handleShowHistory(row)}
                      className="cursor-pointer"
                      alt="HistoryIcon"
                    />
                  </div>
                );
              }
            : item.Cell,
      };
    });
  }, [canEditForm, products]);

  const columnsHistory: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "شماره",
      accessor: "id",
      width: "5%",
    },
    {
      Header: "تاریخ",
      accessor: "dat",
      width: "10%",
    },
    {
      Header: "تعداد",
      accessor: "cnt",
      width: "5%",
    },
    {
      Header: "آفر",
      accessor: "offer",
      width: "5%",
    },
    {
      Header: "مالیات",
      accessor: "taxValue",
      width: "10%",
    },
    {
      Header: "تخفیف",
      accessor: "dcrmnt",
      width: "10%",
    },
    {
      Header: "مجموع",
      accessor: "total",
      width: "10%",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
      width: "20%",
    },
    {
      Header: "مرحله",
      accessor: "fmName",
      width: "15%",
    },
    {
      Header: "هامش",
      accessor: "fDsc",
      width: "5%",
    },
  ];

  const handleShowHistory = (row: any) => {
    //console.log("enter handleShowHistory")
    if (row.original.pId !== 0) {
      setProductField("pId", row.original.pId);
      setProductField("mrsId", mrsId);
      setProductField("mrsIdTrigger", Date.now());
      setShowHistory(true);
    }
  };
  const updateToDeleted = (row: any) => {
    console.log("updateToDeleted", row.original.id);
    setOriginalData((old) =>
      old.map((origRow) => {
        if (
          origRow.id === row.original.id &&
          origRow.pId === row.original.pId
        ) {
          return { ...origRow, isDeleted: !origRow.isDeleted };
        }
        return origRow;
      })
    );
  };

  const [originalData, setOriginalData] = useState<IndentDtlTable[]>([]);
  const [deletedData, setDeletedData] = useState<IndentDtlTable[]>([]);
  const [data, setData] = useState<IndentDtlTable[]>([]);

  /////////////////////////////////////////////////////////////
  // Use ref to store timeout ID to prevent closure issues and repeated executions
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Clear any existing timeout before setting a new one
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }

    // Only set timeout if modal is open
    if (isModalSaveOpen) {
      modalTimeoutRef.current = setTimeout(() => {
        setIsModalSaveOpen(false);
        modalTimeoutRef.current = null;
      }, 3000);
    }

    // Cleanup function
    return () => {
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
        modalTimeoutRef.current = null;
      }
    };
  }, [isModalSaveOpen]);
  ///////////////////////////////////////////////////////
  useEffect(() => {
    if (isNew) {
      setOriginalData([]);
      setData([]);
    }
  }, []);
  // Initialize data when indentMrsResponse changes
  useEffect(() => {
    if (isNew) return;
    if (indentMrsResponse.data.result.indentDtls) {
      let i = 1;
      let initialData = indentMrsResponse.data.result.indentDtls.map((dtl) => ({
        ...dtl,
        index: i++,
        isDeleted: false,
      }));
      initialData.push({ ...newRow, index: initialData.length + 1 });
      setOriginalData(initialData);
      setData(initialData);
    }
  }, [indentMrsResponse.data.result.indentDtls]);
  ////////////////////////////////////////////////////////
  // Memoize filtered data to prevent expensive recalculations
  // This prevents performance violations when originalData changes frequently
  const filteredData = useMemo(() => {
    if (originalData.length === 0) return [];

    const normalizedProductSearch = normalizeInputForSearch(productSearch);
    const normalizedBrandSearch = normalizeInputForSearch(brandSearch);
    const normalizedDtlDscSearch = normalizeInputForSearch(dtlDscSearch);

    return originalData
      .filter(
        (dtl) =>
          normalizeInputForSearch(dtl.bName).includes(normalizedBrandSearch) &&
          normalizeInputForSearch(dtl.product).includes(normalizedProductSearch) &&
          normalizeInputForSearch(dtl.dtlDsc).includes(normalizedDtlDscSearch)
      )
      .map((row, idx) => ({ ...row, index: idx + 1 }));
  }, [brandSearch, productSearch, dtlDscSearch, originalData]);

  // Update data when filteredData changes
  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);
  //////////////////////////////////////////////////////
  // Use refs to track changes efficiently without expensive JSON.stringify
  const lastProcessedAddListLengthRef = useRef<number>(0);
  const lastProcessedAddListIdsRef = useRef<Set<number>>(new Set());
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Cancel any pending requestAnimationFrame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Quick check: only process if length changed or if we detect new IDs
    const currentIds = new Set(addList.map((item) => item.id));
    const hasNewItems =
      addList.length !== lastProcessedAddListLengthRef.current ||
      addList.some((item) => !lastProcessedAddListIdsRef.current.has(item.id));

    if (hasNewItems) {
      lastProcessedAddListLengthRef.current = addList.length;
      lastProcessedAddListIdsRef.current = currentIds;

      // Use requestAnimationFrame to defer the expensive operation
      // This prevents blocking the main thread
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        setOriginalData((old) => {
          // Filter out empty rows from existing data
          const temp = old.filter(
            (item) => item.id !== 0 && item.product !== "" && item.pId !== 0
          );

          // Get existing IDs to avoid duplicates
          const existingIds = new Set(temp.map((item) => item.id));

          // Add new items from addList that aren't duplicates
          const newItems = addList
            .filter((item) => !existingIds.has(item.id))
            .map((item, idx) => ({
              ...item,
              index: temp.length + idx + 1,
              isDeleted: false,
            }));

          return [...temp, ...newItems];
        });
      });
    }

    // Cleanup function to cancel pending animation frame
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [addList]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (!showDeleted) {
      // Show only records where isDeleted is false
      setDeletedData(originalData.filter((row) => row.isDeleted === true)); //save deleted rows in deletedData
      setOriginalData((old) => old.filter((row) => row.isDeleted === false)); //save undeleted rows in Data
    } else {
      // Show all records
      setOriginalData((old) =>
        [...old, ...deletedData].sort((a, b) => a.index - b.index)
      ); //  full dataset
      setDeletedData([]);
    }
  }, [!showDeleted]);
  ///////////////////////////////////////////////////////
  const updateMyRow = async (rowIndex: number, value: DefaultOptionType) => {
    const productId = value?.id ?? 0;
    if (productId === 0) return;
    const response = await handleSubmit(undefined, productId);
    setOriginalData((old) =>
      old.map((row, index) => {
        if (index === rowIndex && response) {
          return {
            ...old[rowIndex],
            index: rowIndex + 1,
            id: response.data.result[0].id,
            custId: 0,
            ordr: 0,
            customer: "",
            pId: response.data.result[0].pId,
            bName: response.data.result[0].bName,
            productCode: "",
            product: response.data.result[0].product,
            sumCompanyCnt: response.data.result[0].sumCompanyCnt ?? 0,
            sumStoreCnt: response.data.result[0].sumStoreCnt ?? 0,
            lbDate: response.data.result[0].lbDate ?? "",
            companyStock: response.data.result[0].companyStock ?? 0,
            storeStock: response.data.result[0].storeStock ?? 0,
            productExp: "",
            cnt: response.data.result[0].cnt ?? 0,
            offer: response.data.result[0].offer ?? 0,
            cost: response.data.result[0].cost ?? 0,
            dcrmntPrcnt: 0,
            dcrmnt: 0,
            taxValue: response.data.result[0].taxValue ?? 0,
            total: response.data.result[0].total ?? 0,
            dtlDsc: response.data.result[0].dtlDsc,
            del: false,
            recieptId: 0,
            recieptDsc: "",
            isDeleted: false,
          };
        }
        return row;
      })
    );
    if (rowIndex === originalData.length - 1)
      handleAddRow(rowIndex + 2, setOriginalData);
  };
  /////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    /*console.log(
      rowIndex,
      columnId,
      value,
      "come to updateMyData in InvoiceReceiptShowTable"
    );*/
    // Direct mutation - fastest approach
    // Just find and update the row directly, no state updates needed
    // The mutation persists in the object, React will see it when state is read
    let val="";
    if (columnId==="cost" || columnId==="dcrmnt")
      val=currencyStringToNumber(convertToLatinDigits(value)).toString()
    else 
      val=value
    const currentRow = data[rowIndex];
    if (!currentRow) return;

    // Update data array (what's displayed in the table)
    console.log(val, "value");
    (data as any)[rowIndex][columnId] = val;

    // Also update originalData to keep them in sync
    const rowInOriginal = originalData.find(
      (row) => row.index === currentRow.index
    );
    if (rowInOriginal) {
      (rowInOriginal as any)[columnId] = val;
    }

    // Force re-render by creating a new array reference for calculated fields
    // This ensures React detects the change and re-renders the table
    if (columnId === "total" || columnId === "taxValue") {
      setData([...data]);
    }
  };
  /////////////////////////////////////////////////////
  const calculateTotal = useCallback(
    (rowIndex: number, params: string[]): number => {
      let value0 = String((data as any)[rowIndex]?.[params[0]] ?? "0"); //cost
      let value1 = String((data as any)[rowIndex]?.[params[1]] ?? "0"); //cnt
      let value2 = String((data as any)[rowIndex]?.[params[2]] ?? "0"); //dcrmnt
      let value3 = String((data as any)[rowIndex]?.[params[3]] ?? "0"); //tax

      value0 = value0 === "" ? "0" : value0;
      value1 = value1 === "" ? "0" : value1;
      value2 = value2 === "" ? "0" : value2;
      value3 = value3 === "" ? "0" : value3;

      const result = Math.round(
        currencyStringToNumber(convertToLatinDigits(value0)) *
          currencyStringToNumber(convertToLatinDigits(value1)) +
          (currencyStringToNumber(convertToLatinDigits(value0)) *
            currencyStringToNumber(convertToLatinDigits(value1)) *
            currencyStringToNumber(convertToLatinDigits(value3))) /
            100 -
          currencyStringToNumber(convertToLatinDigits(value2))
      );

      return result;
    },
    [data]
  );
  /////////////////////////////////////////////////////
  const calculateTaxValue = useCallback(
    (rowIndex: number, params: string[]): number => {
      let value0 = String((data as any)[rowIndex]?.[params[0]] ?? "0"); //cost
      let value1 = String((data as any)[rowIndex]?.[params[1]] ?? "0"); //cnt
      let value2 = String((data as any)[rowIndex]?.[params[2]] ?? "0"); //tax

      value0 = value0 === "" ? "0" : value0;
      value1 = value1 === "" ? "0" : value1;
      value2 = value2 === "" ? "0" : value2;

      const result = Math.round(
        (currencyStringToNumber(convertToLatinDigits(value0)) *
          currencyStringToNumber(convertToLatinDigits(value1)) *
          currencyStringToNumber(convertToLatinDigits(value2))) /
          100
      );
      return result;
    },
    [data]
  );

  /////////////////////////////////////////////////////
  const changeRowValues = useCallback(
    (value: string, rowIndex: number, columnId: string) => {
      console.log(
        value,
        rowIndex,
        columnId,
        "come to changeRowValues in InvoiceReceiptShowTable"
      );
    },
    []
  );
  /////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any): string | null => {
    if (row.original.isDeleted) {
      return red[100];
    }
    return null;
  };
  ////////////////////////////////////////////////////////
  const handleSubmitSave = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ): Promise<any | undefined> => {
    if (e) e.preventDefault();
    let request: IndentSaveRequest;
    const dtls: Detail[] = originalData
      .map((item) => {
        const dtl: Detail = {
          id: item.id,
          cId: item.custId,
          pId: item.pId,
          cnt: convertToLatinDigits(item.cnt.toString()),
          offer: convertToLatinDigits(item.offer.toString()),
          cost: convertToLatinDigits(item.cost.toString()),
          dcrmntPrcnt: item.dcrmntPrcnt.toString(),
          dcrmnt: convertToLatinDigits(item.dcrmnt.toString()),
          taxValue: item.taxValue.toString(),
          dtlDsc: item.dtlDsc,
          deleted: item.isDeleted,
        };
        if (item.cnt !== 0) {
          return dtl;
        } else {
          return undefined;
        }
      })
      .filter((item) => item !== undefined);

    request = {
      id: 0,
      ordrId: indentMrsResponse.data.result.indents[0]?.ordrId ?? "0",
      mrsId,
      customerId: Number(fields.customer?.id) ?? 0,
      del: showDeleted,
      acc_System: systemId,
      acc_Year: yearId,
      payDuration: fields.payDuration,
      dat: convertToLatinDigits(fields.dat), //indentMrsResponse.data.result.indents[0]?.dat ?? "",
      tim: convertToLatinDigits(fields.tim), //indentMrsResponse.data.result.indents[0]?.tim ?? "",
      dsc: fields.dsc,
      salesPriceId: Number(fields.price?.id ?? 0),
      saleFDate:
        fields.fdate === null || !fields.fdate
          ? ""
          : convertPersianDate(fields.fdate.toLocaleDateString("fa-IR")),
      saleTDate:
        fields.tdate === null || !fields.tdate
          ? ""
          : convertPersianDate(fields.tdate.toLocaleDateString("fa-IR")),
      dtls,
    };
    console.log(request, "request");
    try {
      const response = await saveList(request);
      setIsModalSaveOpen(true);
      getIndentMrsResponse();
      if (response.meta.errorCode <= 0) {
        setIsNew(false);
        setIsEdit(false);
      }
      return response;
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
  ////////////////////////////////////////////////////////
  // on selecting each row, set the id and productId and yearId in productGraceStore for api/productGrace?id=
  const [selectedDtlId, setSelectedDtlId] = useState<number>(0); // for selected id in productOfferFormList table
  //const [res, setRes] = useState<ShowProductListResponse | undefined>(
  //  undefined
  //);
  useEffect(() => {
    if (!canEditForm) return;
    const fetchData = async () => {
      if (data.length > 0) {
        const found = data.find((item) => item.id === selectedDtlId);
        const productId = found?.pId ?? 0;
        if (productId === 0) return;
        const res = await handleSubmit(undefined, productId);
        //set tax field in data and originalData in selectedDtl row
        const tax = res?.data.result?.[0]?.tax ?? 0;
        const originalItem = originalData.find(
          (item) => item.id === selectedDtlId
        );
        if (originalItem) originalItem.tax = tax;
        const dataItem = data.find((item) => item.id === selectedDtlId);
        if (dataItem) dataItem.tax = tax;
        console.log(tax, "tax");
      }
    };
    fetchData();
  }, [selectedDtlId, yearId]);

  const { height } = useCalculateTableHeight();
  return (
    <>
      <div className="p-2 mt-2 w-full bg-white rounded-md">
        <div
          className={!isFromWorkFlow ? "overflow-y-auto" : ""}
          style={{ height: !isFromWorkFlow ? height - 450 : "auto" }}
        >
          <InvoiceReceiptShowTableHeader
            brandSearch={brandSearch}
            setBrandSearch={setBrandSearch}
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            dtlDscSearch={dtlDscSearch}
            setDtlDscSearch={setDtlDscSearch}
          />
          {isLoading ? (
            <div className="text-center">{<Skeleton />}</div>
          ) : (
            <div className="w-full">
              <TTable
                setSelectedId={setSelectedDtlId}
                canEditForm={canEditForm}
                columns={columns}
                data={data}
                originalData={originalData}
                calculatedFieldfns={[
                  {
                    calcField: "taxValue",
                    calculateFn: calculateTaxValue,
                    params: ["cost", "cnt", "tax"],
                  },
                  {
                    calcField: "total",
                    calculateFn: calculateTotal,
                    params: ["cost", "cnt", "dcrmnt", "tax"],
                  },
                ]}
                selectedRowIndex={selectedRowIndex}
                setSelectedRowIndex={setSelectedRowIndex}
                updateMyData={updateMyData}
                fontSize="0.75rem"
                changeRowSelectColor={true}
                wordWrap={true}
                updateMyRow={updateMyRow}
                CellColorChange={handleCellColorChange}
                changeRowValues={changeRowValues}
                showToolTip={true}
              />
            </div>
          )}
        </div>
        <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end ">
          <InvoiceReceiptShowTableSummery data={data} />
          {canEditForm && (
            <Button
              text={isLoadingSaveList ? "در حال ثبت اطلاعات..." : "ثبت"}
              backgroundColor="bg-green-500"
              color="text-white"
              backgroundColorHover="bg-green-600"
              colorHover="text-white"
              variant="shadow-lg w-64"
              onClick={handleSubmitSave}
            />
          )}
        </ConfirmCard>
      </div>
      <InvoiceReceiptHistory
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isDtHistoryLoading={isDtHistoryLoading}
        indentDtlHistoryResponse={indentDtlHistoryResponse}
        columnsHistory={columnsHistory}
      />
      <ModalMessage
        isOpen={isModalSaveOpen}
        backgroundColor={
          indentSaveResponse?.meta?.errorCode === -1
            ? "bg-green-200"
            : "bg-red-200"
        }
        color="text-white"
        onClose={() => setIsModalSaveOpen(false)}
        message={indentSaveResponse?.meta?.message || ""}
        visibleButton={false}
      />
    </>
  );
};

export default InvoiceReceiptShowTable;
