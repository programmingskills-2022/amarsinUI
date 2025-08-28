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
  useState,
} from "react";
import {
  convertPersianDate,
  convertToFarsiDigits,
  convertToLatinDigits,
  currencyStringToNumber,
  formatNumberWithCommas,
} from "../../utilities/general";
import { useProductStore } from "../../store/productStore";
import { useGeneralContext } from "../../context/GeneralContext";
import TTable, { EditableInput } from "../controls/TTable";
import { DefaultOptionType, TableColumns } from "../../types/general";
import {
  Detail,
  IndentSaveRequest,
  IndentSaveResponse,
  IndentShowProductListResponse,
} from "../../types/product";
import { red } from "@mui/material/colors";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import { Fields } from "./InvoiceReceiptShow";
import InvoiceReceiptHistory from "./invoiceReceiptHistory";
import InvoiceReceiptShowTableHeader from "./InvoiceReceiptShowTableHeader";
import InvoiceReceiptShowTableSummery from "./InvoiceReceiptShowTableSummery";

type Props = {
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
  products: DefaultOptionType[];
  saveList: (request: IndentSaveRequest) => Promise<IndentSaveResponse>;
  isLoadingSaveList: boolean;
  isDtHistoryLoading: boolean;
  getIndentMrsResponse: () => void;
  setProductSearchinTable: React.Dispatch<React.SetStateAction<string>>
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
    accessor: "storeStock",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "موجودی",
    accessor: "sumCompanyCnt",
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
    type: "inputText",
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
  setProductSearchinTable, 
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
  products,
  saveList,
  isLoadingSaveList,
  isDtHistoryLoading,
  getIndentMrsResponse,
}: Props) => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [dtlDscSearch, setDtlDscSearch] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const {yearId,systemId} = useGeneralContext();

  const { setField: setProductField, indentDtlHistoryResponse } =
    useProductStore();

  const columns: TableColumns = useMemo(() => {
    return headCells.map((item) => {
      return {
        ...item,
        options: item.accessor === "product" ? products : undefined,
        setSearch: item.accessor === "product" ? setProductSearchinTable : undefined,
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
  }, [canEditForm,products,setProductSearchinTable]);

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
    if (row.original.pId !== 0) {
      setProductField("pId", row.original.pId);
      setProductField("mrsId", mrsId);
      setShowHistory(true);
    }
  };
  const updateToDeleted = (row: any) => {
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

  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [originalData, setOriginalData] = useState<IndentDtlTable[]>([]);
  const [deletedData, setDeletedData] = useState<IndentDtlTable[]>([]);
  const [data, setData] = useState<IndentDtlTable[]>([]);

  useEffect(() => {
    console.log(skipPageReset);
  }, []);

  ///////////////////////////////////////////////////////
  // Initialize data when indentMrsResponse changes
  useEffect(() => {
    if (indentMrsResponse.indentDtls) {
      let i = 1;
      let initialData = indentMrsResponse.indentDtls.map((dtl) => ({
        ...dtl,
        index: i++,
        isDeleted: false,
      }));
      initialData.push({ ...newRow, index: initialData.length + 1 });
      setOriginalData(initialData);
      setData(initialData);
    }
  }, [indentMrsResponse]);
  ////////////////////////////////////////////////////////
  // Filter data based on search terms
  useEffect(() => {
    if (originalData.length > 0) {
      const filtered = originalData
        .filter(
          (dtl) =>
            dtl.bName.includes(brandSearch) &&
            dtl.product.includes(productSearch) &&
            dtl.dtlDsc.includes(dtlDscSearch)
        )
        .map((row, idx) => ({ ...row, index: idx + 1 }));

      setData(filtered);
    }
    //console.log(originalData)
  }, [brandSearch, productSearch, dtlDscSearch, originalData]);
  //////////////////////////////////////////////////////
  useEffect(() => {
    setOriginalData((old) => [
      ...old,
      ...addList.map((item, idx) => ({
        ...item,
        index: old.length + idx + 1,
        isDeleted: false,
      })),
    ]);
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
            id: response.indentProducts[0].id,
            custId: 0,
            ordr: 0,
            customer: "",
            pId: response.indentProducts[0].pId,
            bName: response.indentProducts[0].bName,
            productCode: "",
            product: response.indentProducts[0].product,
            sumCompanyCnt: response.indentProducts[0].sumCompanyCnt ?? 0,
            sumStoreCnt: response.indentProducts[0].sumStoreCnt ?? 0,
            lbDate: response.indentProducts[0].lbDate ?? "",
            companyStock: response.indentProducts[0].companyStock ?? 0,
            storeStock: response.indentProducts[0].storeStock ?? 0,
            productExp: "",
            cnt: response.indentProducts[0].cnt ?? 0,
            offer: response.indentProducts[0].offer ?? 0,
            cost: response.indentProducts[0].cost ?? 0,
            dcrmntPrcnt: 0,
            dcrmnt: 0,
            taxValue: response.indentProducts[0].taxValue ?? 0,
            total: response.indentProducts[0].total ?? 0,
            dtlDsc: response.indentProducts[0].dtlDsc,
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
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
    // Also update the same row in originalData
    const rowInOriginal = data[rowIndex];
    if (rowInOriginal) {
      setOriginalData((origOld) =>
        origOld.map((row) => {
          if (row.id === rowInOriginal.id && row.pId === rowInOriginal.pId) {
            return {
              ...row,
              [columnId]: value,
            };
          }
          return row;
        })
      );
    }
  };
  /////////////////////////////////////////////////////
  const calculateTotal = useMemo(() => {
    return (cost: string, cnt: string, taxValue: string, dcrmnt: string) => {
      return (
        currencyStringToNumber(convertToLatinDigits(cost)) *
          Number(convertToLatinDigits(cnt)) +
        currencyStringToNumber(convertToLatinDigits(taxValue)) -
        currencyStringToNumber(convertToLatinDigits(dcrmnt))
      );
    };
  }, []);

  /////////////////////////////////////////////////////
  const changeRowValues = useCallback(
    (value: string, rowIndex: number, columnId: string) => {
      if (
        columnId === "cost" ||
        columnId === "cnt" ||
        columnId === "taxValue" ||
        columnId === "dcrmnt"
      ) {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              const total = calculateTotal(
                columnId === "cost" ? value : row.cost.toString(),
                columnId === "cnt" ? value : row.cnt.toString(),
                columnId === "taxValue" ? value : row.taxValue.toString(),
                columnId === "dcrmnt" ? value : row.dcrmnt.toString()
              );
              return {
                ...old[rowIndex],
                [columnId]: value,
                total,
              };
            }
            return row;
          })
        );
        const rowInOriginal = data[rowIndex];
        setOriginalData((old) =>
          old.map((row) => {
            if (row.id === rowInOriginal.id && row.pId === rowInOriginal.pId) {
              const total = calculateTotal(
                columnId === "cost" ? value : row.cost.toString(),
                columnId === "cnt" ? value : row.cnt.toString(),
                columnId === "taxValue" ? value : row.taxValue.toString(),
                columnId === "dcrmnt" ? value : row.dcrmnt.toString()
              );
              return {
                ...row,
                [columnId]: value,
                total,
              };
            }
            return row;
          })
        );
      }
    },
    [calculateTotal, data]
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
  ): Promise<IndentSaveResponse | undefined> => {
    if (e) e.preventDefault();
    let request: IndentSaveRequest;
    const dtls: Detail[] = originalData.map((item) => {
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
      return dtl;
    });

    request = {
      id: 0,
      ordrId: indentMrsResponse.indents[0]?.ordrId ?? "",
      mrsId,
      customerId: Number(fields.customer?.id) ?? 0,
      del: showDeleted,
      acc_System: systemId,
      acc_Year: yearId,
      payDuration: fields.payDuration,
      dat: indentMrsResponse.indents[0]?.dat ?? "",
      tim: indentMrsResponse.indents[0]?.tim ?? "",
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
    console.log(request);
    try {
      const response = await saveList(request);
      getIndentMrsResponse();
      return response;
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
  return (
    <>
      <div className="p-2 mt-2 w-full bg-white rounded-md">
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
        ) : indentMrsResponse.err !== 0 ? (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            {indentMrsResponse.msg}
          </p>
        ) : (
          <div className="w-full">
            <TTable
              canEditForm={canEditForm}
              columns={columns}
              data={data}
              updateMyData={updateMyData}
              //skipPageReset={skipPageReset}
              fontSize="0.75rem"
              changeRowSelectColor={true}
              wordWrap={true}
              /*options={products.map((p) => ({
                id: p.pId,
                title: convertToFarsiDigits(p.n),
              }))}*/
              //setSearchText={setSearch}
              updateMyRow={updateMyRow}
              CellColorChange={handleCellColorChange}
              changeRowValues={changeRowValues}
              showToolTip={true}
            />
          </div>
        )}
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
    </>
  );
};

export default InvoiceReceiptShowTable;
