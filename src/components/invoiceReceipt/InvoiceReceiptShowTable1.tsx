import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ShowProductListResponse } from "../../types/productOffer";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import TTable from "../controls/TTable";
import { DefaultOptionType, TableColumns } from "../../types/general";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import { red } from "@mui/material/colors";
import ModalMessage from "../layout/ModalMessage";
import { useGeneralContext } from "../../context/GeneralContext";
import { IndentDtlTable } from "../../types/invoiceReceipt";
import {
  IndentDtlHistory,
  IndentShowProductListResponse,
} from "../../types/purchaseRequest";
import {
  convertToLatinDigits,
  currencyStringToNumber,
  normalizeInputForSearch,
} from "../../utilities/general";
import InvoiceReceiptShowTableHeader from "./InvoiceReceiptShowTableHeader";
import InvoiceReceiptShowTableSummery from "./InvoiceReceiptShowTableSummery";
import InvoiceReceiptHistory from "./invoiceReceiptHistory";

type Props = {
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  addList: any[];
  showDeleted: boolean;
  handleSubmit: (
    e?: React.MouseEvent<HTMLButtonElement>,
    productId?: number,
  ) => Promise<IndentShowProductListResponse | undefined>;
  isLoadingSaveList: boolean;
  handleSubmitSave: () => void;
  isDtHistoryLoading: boolean;
  handleAddRow: (
    index: number,
    setData: Dispatch<SetStateAction<any[]>>,
  ) => void;
  dtlHistoryResponse: IndentDtlHistory[];
  originalData: IndentDtlTable[];
  setOriginalData: Dispatch<SetStateAction<IndentDtlTable[]>>;
  columns: TableColumns;
  showHistory: boolean;
  setShowHistory: Dispatch<SetStateAction<boolean>>;
  isModalRegOpen: boolean;
  setIsModalRegOpen: Dispatch<SetStateAction<boolean>>;
  canEditForm1: boolean;
  selectedId: number;
  isNew: boolean;
  saveListResponse: any;
  isFromWorkFlow: boolean;
  //isLoadingAddList: boolean;
};

const InvoiceReceiptShowTable1 = ({
  setIsNew,
  setIsEdit,
  addList,
  showDeleted,
  handleSubmit,
  isLoadingSaveList,
  handleSubmitSave,
  isDtHistoryLoading,
  handleAddRow,
  dtlHistoryResponse,
  originalData,
  setOriginalData,
  columns,
  showHistory,
  setShowHistory,
  isModalRegOpen,
  setIsModalRegOpen,
  canEditForm1,
  selectedId,
  isNew,
  saveListResponse,
  isFromWorkFlow,
  //isLoadingAddList,
}: Props) => {
  //const { productOfferSaveResponse } = useProductOfferStore();
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [dtlDscSearch, setDtlDscSearch] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [deletedData, setDeletedData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in productOfferFormList table
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
  // Initialize data when addList changes
  useEffect(() => {
    if (addList.length > 0) {
      let i = 1;
      let initialData = addList.map((item) => ({
        ...item,
        index: i++,
        isDeleted: false,
      }));
      //initialData.push({ ...newRow, index: initialData.length + 1 });
      setOriginalData(initialData);
      setData(initialData);
    }
  }, [addList]);
    ///////////////////////////////////////////////////////
    useEffect(() => {
      if (isNew) {
        setOriginalData([]);
        setData([]);
      }
    }, []);
  ////////////////////////////////////////////////////////
  // Filter data based on search terms
  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (originalData.length === 0) return;

    const normalizedProductSearch = normalizeInputForSearch(productSearch);
    const normalizedBrandSearch = normalizeInputForSearch(brandSearch);
    const normalizedDtlDscSearch = normalizeInputForSearch(dtlDscSearch);

    const temp = originalData
      .filter(
        (dtl) =>
          normalizeInputForSearch(dtl.bName).includes(normalizedBrandSearch) &&
          normalizeInputForSearch(dtl.product).includes(normalizedProductSearch) &&
          normalizeInputForSearch(dtl.dtlDsc).includes(normalizedDtlDscSearch)
      )
      .map((row, idx) => ({ ...row, index: idx + 1 }));
    setData(temp)
  }, [brandSearch, productSearch, dtlDscSearch, originalData])
  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (!showDeleted) {
      // Show only records where isDeleted is false
      setDeletedData(originalData.filter((row) => row.isDeleted === true)); //save deleted rows in deletedData
      setOriginalData((old) => old.filter((row) => row.isDeleted === false)); //save undeleted rows in Data
    } else {
      // Show all records
      setOriginalData((old) =>
        [...old, ...deletedData].sort((a, b) => a.index - b.index),
      ); //  full dataset
      setDeletedData([]);
    }
  }, [!showDeleted]);
  //////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    const currentRow = data[rowIndex];
    if (!currentRow) return;

    // Update data array (what's displayed in the table)
    (data as any)[rowIndex][columnId] = value;

    // Also update originalData to keep them in sync
    const rowInOriginal = originalData.find(
      (row) => row.index === currentRow.index,
    );

    if (rowInOriginal) {
      (rowInOriginal as any)[columnId] = value;
    }

    if (
      columnId === "cost" ||
      columnId === "cnt" ||
      columnId === "tax" ||
      columnId === "dcrmnt"
    ) {
      let val = currencyStringToNumber(convertToLatinDigits(value)).toString();
      if (Number.isNaN(Number(val))) {
        val = "0";
      } else val = value;
      let value0 =
        columnId === "cost"
          ? currencyStringToNumber(convertToLatinDigits(val ?? "0"))
          : currencyStringToNumber(
              convertToLatinDigits(data[rowIndex]["cost"].toString() ?? "0"),
            ); //cost

      let value1 =
        columnId === "cnt"
          ? currencyStringToNumber(convertToLatinDigits(val ?? "0"))
          : currencyStringToNumber(
              convertToLatinDigits(data[rowIndex]["cnt"].toString() ?? "0"),
            ); //cnt

      let value2 =
        columnId === "dcrmnt"
          ? currencyStringToNumber(convertToLatinDigits(val ?? "0"))
          : currencyStringToNumber(
              convertToLatinDigits(data[rowIndex]["dcrmnt"].toString() ?? "0"),
            ); //dcrmnt

      let value3 =
        columnId === "tax"
          ? currencyStringToNumber(convertToLatinDigits(val ?? "0"))
          : currencyStringToNumber(
              convertToLatinDigits(data[rowIndex]["tax"].toString() ?? "0"),
            ); //tax

      value0 = Number.isNaN(Number(value0)) ? 0 : value0;
      value1 = Number.isNaN(Number(value1)) ? 0 : value1;
      value2 = Number.isNaN(Number(value2)) ? 0 : value2;
      value3 = Number.isNaN(Number(value3)) ? 0 : value3;

      const total = Math.round(
        value0 * value1 + (value0 * value1 * value3) / 100 - value2,
      );
      const taxValue = Math.round((value0 * value1 * value3) / 100);

      (data as any)[rowIndex]["total"] = total;
      (data as any)[rowIndex]["taxValue"] = taxValue;
      if (rowInOriginal) {
        (rowInOriginal as any)["total"] = total;
        (rowInOriginal as any)["taxValue"] = taxValue;
      }
      setData([...data]);
    }
  };

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
      }),
    );
    if (rowIndex === originalData.length - 1)
      handleAddRow(rowIndex + 2, setOriginalData);
  };
  /////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any): string | null => {
    if (row.original.isDeleted) {
      return red[100];
    }
    return null;
  };
  /////////////////////////////////////////////////////
  const { height, width } = useCalculateTableHeight();
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalRegOpen) {
      timeoutId = setTimeout(() => {
        setIsModalRegOpen(false);
        setIsNew(false);
        setIsEdit(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalRegOpen]);
  ////////////////////////////////////////////////////////
  // on selecting each row, set the id and productId and yearId in productGraceStore for api/productGrace?id=
  const { yearId } = useGeneralContext();
  //const [selectedDtlId, setSelectedDtlId] = useState<number>(0); // for selected id in productOfferFormList table
  const [res, setRes] = useState<ShowProductListResponse | undefined>(
    undefined,
  );
  /*useEffect(() => {
    console.log(
      "come to useEffect in productOfferFormList",
      isLoadingAddList,
      selectedRowIndex,
      canEditForm1,
    );
    if (isLoadingAddList || !canEditForm1 || selectedRowIndex === 0) return;
    const fetchData = async () => {
      if (data.length > 0) {
        console.log(data, selectedRowIndex, "data in useEffect");
        const found = data.find((item) => item.index === selectedRowIndex + 1);
        //console.log(found, "found in useEffect");
        const productId = found?.pId ?? 0;
        if (productId === 0) return;
        const request: ShowProductListRequest = {
          id: selectedId,
          productId,
          acc_Year: yearId,
          brands: [],
        };
        const res = await handleSubmit(undefined, request);
        setRes(res);
        //console.log(res, "res in useEffect");
      }
    };
    fetchData();
  }, [selectedRowIndex, yearId]);*/
  ////////////////////////////////////////////////////////
  // on selecting each row, set the id and productId and yearId in productGraceStore for api/productGrace?id=
  const [selectedDtlId, setSelectedDtlId] = useState<number>(0); // for selected id in productOfferFormList table
  //const [res, setRes] = useState<ShowProductListResponse | undefined>(
  //  undefined
  //);
  useEffect(() => {
    if (!canEditForm1) return;
    const fetchData = async () => {
      if (data.length > 0) {
        const found = data.find((item) => item.id === selectedDtlId);
        const productId = found?.pId ?? 0;
        if (productId === 0) return;
        const res = await handleSubmit(undefined, productId);
        //set tax field in data and originalData in selectedDtl row
        const tax = res?.data.result?.[0]?.tax ?? 0;
        const originalItem = originalData.find(
          (item) => item.id === selectedDtlId,
        );
        if (originalItem) originalItem.tax = tax;
        const dataItem = data.find((item) => item.id === selectedDtlId);
        if (dataItem) dataItem.tax = tax;
        console.log(tax, "tax");
      }
    };
    fetchData();
  }, [selectedDtlId, yearId]);
  ////////////////////////////////////////////////////////
  //initialize selectedRowIndex, selectedDtlId, res when selectedId changes
  useEffect(() => {
    if (selectedId === 0) return;
    setSelectedRowIndex(0);
    //setSelectedDtlId(0);
    setRes(undefined);
  }, [selectedId]);
  ////////////////////////////////////////////////////////
  //update originalData when res (productGraceListResponse) changes
  useEffect(() => {
    if (res && res.data.result.length > 0) {
      updateMyRowAfterShowProductList(res);
    }
  }, [res]);
  ////////////////////////////////////////////////////////
  const updateMyRowAfterShowProductList = (res: ShowProductListResponse) => {
    console.log(
      selectedRowIndex,
      "selectedRowIndex in updateMyRowAfterShowProductList",
    );
    setOriginalData((old) =>
      old.map((row, index) => {
        if (index === selectedRowIndex && res.data.result.length > 0) {
          return {
            ...row,
            s1O:
              res.data.result[0].s1DO + res.data.result[0].s1NO > 0
                ? res.data.result[0].s1DO.toString() +
                  "+" +
                  res.data.result[0].s1NO.toString()
                : "",
            s2O:
              res.data.result[0].s2DO + res.data.result[0].s2NO > 0
                ? res.data.result[0].s2DO.toString() +
                  "+" +
                  res.data.result[0].s2NO.toString()
                : "",
            s3O:
              res.data.result[0].s3DO + res.data.result[0].s3NO > 0
                ? res.data.result[0].s3DO.toString() +
                  "+" +
                  res.data.result[0].s3NO.toString()
                : "",
            s4O:
              res.data.result[0].s4DO + res.data.result[0].s4NO > 0
                ? res.data.result[0].s4DO.toString() +
                  "+" +
                  res.data.result[0].s4NO.toString()
                : "",
            s5O:
              res.data.result[0].s5DO + res.data.result[0].s5NO > 0
                ? res.data.result[0].s5DO.toString() +
                  "+" +
                  res.data.result[0].s5NO.toString()
                : "",
          };
        }
        return row;
      }),
    );
  };
  ////////////////////////////////////////////////////////
  return (
    <>
      <div className="mt-2 w-full bg-white rounded-md">
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

          <div className="w-full">
            <TTable
              setSelectedId={setSelectedDtlId}
              canEditForm={canEditForm1}
              columns={columns}
              data={data}
              originalData={originalData}
              /*calculatedFieldfns={[
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
                ]}*/
              selectedRowIndex={selectedRowIndex}
              setSelectedRowIndex={setSelectedRowIndex}
              updateMyData={updateMyData}
              fontSize="0.75rem"
              changeRowSelectColor={true}
              wordWrap={true}
              updateMyRow={updateMyRow}
              CellColorChange={handleCellColorChange}
              //changeRowValues={changeRowValues}
              showToolTip={true}
            />
          </div>
        </div>
        <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end ">
          <InvoiceReceiptShowTableSummery data={data} />
          {canEditForm1 && (
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
        indentDtlHistoryResponse={dtlHistoryResponse}
        columnsHistory={columnsHistory}
      />
      <ModalMessage
        isOpen={isModalRegOpen}
        onClose={() => setIsModalRegOpen(false)}
        backgroundColor={
          saveListResponse?.meta.errorCode <= 0 ? "bg-green-200" : "bg-red-200"
        }
        bgColorButton={
          saveListResponse?.meta.errorCode <= 0 ? "bg-green-500" : "bg-red-500"
        }
        color="text-white"
        message={
          saveListResponse?.meta.errorCode > 0
            ? saveListResponse?.meta.message || ""
            : "اطلاعات با موفقیت ثبت شد."
        }
        visibleButton={false}
      />
    </>
  );
};

export default InvoiceReceiptShowTable1;
