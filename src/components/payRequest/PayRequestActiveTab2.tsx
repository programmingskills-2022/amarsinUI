import { useEffect, useState } from "react";
import Input from "../controls/Input";
import { DefaultOptionType, TableColumns } from "../../types/general";
import { usePayRequestStore } from "../../store/payRequestStore";
import { useGeneralContext } from "../../context/GeneralContext";
import TTable, { EditableInput } from "../controls/TTable";
import TrashIcon from "../../assets/images/GrayThem/delete_gray_16.png";
import RestoreIcon from "../../assets/images/GrayThem/restore_gray_16.png";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
  currencyStringToNumber,
} from "../../utilities/general";
import {
  ChequeBookDtlByIdResponse,
  PayRequestDtlTable,
  PayRequestSaveResponse,
} from "../../types/payRequest";
import { colors } from "../../utilities/color";
import ModalForm from "../layout/ModalForm";
import ShowMessages from "../controls/ShowMessages";
import ModalMessage from "../layout/ModalMessage";
import PlusIcon from "../../assets/images/GrayThem/plus24.png";

type Props = {
  data: PayRequestDtlTable[];
  setData: React.Dispatch<React.SetStateAction<PayRequestDtlTable[]>>;
  payRequestSaveResponse: PayRequestSaveResponse;
  setField: (field: string | number | symbol, value: any) => void;
  options1: DefaultOptionType[];
  options2: DefaultOptionType[];
  chequeBookSearch: string;
  chequeBookDtlSearch: string;
  setChequeBookSearch: React.Dispatch<React.SetStateAction<string>>;
  setChequeBookDtlSearch: React.Dispatch<React.SetStateAction<string>>;
  customerId: number;
  originalData: PayRequestDtlTable[];
  setOriginalData: (
    data:
      | PayRequestDtlTable[]
      | ((old: PayRequestDtlTable[]) => PayRequestDtlTable[]),
  ) => void;
  chequeBookDtlByIdResponse: ChequeBookDtlByIdResponse;
  setShowInvoices: React.Dispatch<React.SetStateAction<boolean>>;
  setPay: React.Dispatch<React.SetStateAction<number>>;
  setAmountTab2: React.Dispatch<React.SetStateAction<number>>;
  setPayRequestDtlId: React.Dispatch<React.SetStateAction<number>>;
  setChequeBookId: React.Dispatch<React.SetStateAction<number>>;
  chequeBookId: number;
  //workFlowRowSelectResponse: WorkflowRowSelectResponse;
  //setIsPayChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setPayRequestDtlIndex: React.Dispatch<React.SetStateAction<number>>;
  isNew: boolean;
  fromWorkFlow: boolean;
  canEditForm1: boolean;
  canEditForm1Dtl1: boolean;
  canEditForm1Dtl2: boolean;
};

const PayRequestActiveTab2 = ({
  data,
  setData,
  payRequestSaveResponse,
  setField,
  options1,
  options2,
  chequeBookSearch,
  chequeBookDtlSearch,
  setChequeBookSearch,
  setChequeBookDtlSearch,
  originalData,
  setOriginalData,
  customerId,
  chequeBookDtlByIdResponse,
  setShowInvoices,
  setPay,
  setAmountTab2,
  setPayRequestDtlId,
  setChequeBookId,
  chequeBookId,
  //workFlowRowSelectResponse,
  //setIsPayChanged,
  setPayRequestDtlIndex,
  isNew,
  fromWorkFlow,
  canEditForm1,
  canEditForm1Dtl1,
  canEditForm1Dtl2,
}: Props) => {
  /*const CanEditForm1Dtl1 =
    workFlowRowSelectResponse.workTableForms.canEditForm1Dtl1;
  const CanEditForm1Dtl2 =
    workFlowRowSelectResponse.workTableForms.canEditForm1Dtl2;*/
  const [isChecked, setIsChecked] = useState(true); //for showing deleted rows
  const { id, setField: setPayRequestInvoicesField } = usePayRequestStore();
  const { yearId, systemId } = useGeneralContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in payRequestActiveTab2 table
  const [isZeroPayRequestDtlId, setIsZeroPayRequestDtlId] = useState(false);
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "3%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "دسته چک",
      accessor: "chequeBook",
      width: "27%",
      type: "autoComplete",
      options: options1,
      setField: setField,
      fieldValues: [
        { field: "acc_systemChequeBookSearch", value: systemId },
        { field: "lastIdChequeBookSearch", value: 0 },
        { field: "pageChequeBookSearch", value: 1 },
      ],

      fieldSearch: "searchChequeBookSearch",
      setSearch: setChequeBookSearch,
      search: chequeBookSearch,
      placeholder: "دسته چک را انتخاب کنید...",
      Cell: canEditForm1Dtl1
        ? EditableInput
        : ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "شماره چک",
      accessor: "chequeBookDtl",
      width: "9%",
      type: "autoComplete",
      options: options2,
      setField: setField,
      fieldValues: [
        { field: "chequeBookIdChequeBookDtlSearch", value: chequeBookId },
        { field: "lastIdChequeBookDtlSearch", value: 0 },
        { field: "pageChequeBookDtlSearch", value: 1 },
      ],

      fieldSearch: "searchChequeBookDtlSearch",
      setSearch: setChequeBookDtlSearch,
      search: chequeBookDtlSearch,
      placeholder: "شماره چک را انتخاب کنید...",
      Cell: canEditForm1Dtl1
        ? EditableInput
        : ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "در وجه",
      accessor: "prsn",
      width: "22%",
      Cell: EditableInput,
    },
    {
      Header: "صیادی",
      accessor: "chqBkNo",
      width: "8%",
      Cell: canEditForm1Dtl1
        ? EditableInput
        : ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "سررسید",
      accessor: "dat",
      width: "5%",
      type: "date",
      Cell: EditableInput,
    },
    {
      Header: "مبلغ",
      accessor: "amount",
      width: "8%",
      Cell: EditableInput,
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
      width: "15%",
      Cell: EditableInput,
    },
    {
      Header: " ",
      accessor: "lastColumn",
      width: "3%",
      Cell: ({ row }: any) => (
        <div className="flex w-full items-center justify-center">
          {canEditForm1Dtl2 && (
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                updateToDeleted(row);
              }}
            >
              <img
                src={row.original.del ? RestoreIcon : TrashIcon}
                style={{ width: "16px", height: "16px" }}
                alt="TrashIcon"
              />
            </button>
          )}
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              showInvoices(row);
            }}
            className="flex items-center justify-center"
          >
            <input
              type="checkbox"
              checked={row.original.checked}
              className="cursor-pointer place-content-center"
              onChange={() => console.log("checked", row.original.checked)}
            />
          </button>
        </div>
      ),
    },
  ];
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpen) {
      timeoutId = setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpen]);
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isZeroPayRequestDtlId) {
      timeoutId = setTimeout(() => {
        setIsZeroPayRequestDtlId(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isZeroPayRequestDtlId]);
  ////////////////////////////////////////////////////////////////
  /*useEffect(() => {
    //initializing chequeBookSearch requests api/Payment/chequeBookSearch
    //if can edit form1, initialize chequeBookSearch requests
    if (CanEditForm1Dtl1) {
      setField("acc_systemChequeBookSearch", systemId);
      setField("searchChequeBookSearch", chequeBookSearch);
      setField("pageChequeBookSearch", 1);
      setField("lastIdChequeBookSearch", 0);
    }
  }, [chequeBookSearch, systemId]);*/
  /*useEffect(() => {
    setField("searchChequeBookDtlSearch", chequeBookDtlSearch);
    setField("pageChequeBookDtlSearch", 1);
    setField("lastIdChequeBookDtlSearch", 0);
    if (chequeBookId !== 0) {
      setField("chequeBookIdChequeBookDtlSearch", chequeBookId);
    }
  }, [chequeBookDtlSearch, chequeBookId]);*/
  ////////////////////////////////////////////////////////////////
  //initializing payRequestInvoicesField
  //replace below
  //api/PayRequest/DtlInvoices?PayRequestDtlId=3290
  useEffect(() => {
    if (!fromWorkFlow) {
      setPayRequestInvoicesField("payRequestId", id);
      setPayRequestInvoicesField("systemIdPayRequestInvoice", systemId);
      setPayRequestInvoicesField("yearIdPayRequestInvoice", yearId);
      setPayRequestInvoicesField("customerId", customerId);
    }
  }, [id, systemId, yearId, customerId, fromWorkFlow]);
  ////////////////////////////////////////////////////////////////
  //initializing data
  useEffect(() => {
    if (isChecked) {
      setData(originalData);
    } else {
      setData(originalData.filter((item) => item.del === false));
    }
  }, [isChecked, originalData]);
  ////////////////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    console.log(rowIndex, columnId, value, "updateMyData");
    /*const currentRow = originalData[rowIndex];
    if (!currentRow) return;

    (currentRow as any)[columnId] = value;*/
    setOriginalData((old: PayRequestDtlTable[]) =>
      //setData((old: PayRequestDtlTable[]) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      }),
    );
  };

  ////////////////////////////////////////////////////
  const changeRowValues = (
    value: string,
    rowIndex: number,
    columnId: string,
  ) => {
    updateMyData(rowIndex, columnId, value);
  };
  ////////////////////////////////////////////////////////////////
  const updateToDeleted = (row: any) => {
    setOriginalData((old: PayRequestDtlTable[]) =>
      old.map((origRow) => {
        if (origRow.index === row.original.index) {
          return { ...origRow, del: !origRow.del };
        }
        return origRow;
      }),
    );
  };

  ////////////////////////////////////////////////////////////////
  const showInvoices = (row: any) => {
    if (row.original.id === 0 && fromWorkFlow) {
      setIsZeroPayRequestDtlId(true);
      return;
    }
    //set payRequestDtlId to api/PayRequest/DtlInvoices?PayRequestDtlId=3290
    if (fromWorkFlow) {
      setPayRequestInvoicesField("payRequestDtlId", Number(row.original.id));
      setPayRequestInvoicesField("payRequestDtlIdTrigger", Date.now());
    }
    setPayRequestDtlId(row.original.id);
    setPayRequestDtlIndex(row.original.index);
    setOriginalData((old: PayRequestDtlTable[]) => {
      return old.map((origRow) => {
        console.log(origRow, row.original, "origRow in showInvoices");
        if (isNew && origRow.index === row.original.index) {
          return {
            ...origRow,
            amount: row.original.amount,
            checked: row.original.checked ?? false,
          };
        } else if (!isNew && origRow.id === row.original.id) {
          return {
            ...origRow,
            amount: row.original.amount,
            checked: row.original.checked ?? false,
          };
        }
        return origRow;
      });
    });
    if (
      currencyStringToNumber(convertToLatinDigits(row.original.amount)) !== 0
    ) {
      setShowInvoices(true);
      console.log(
        currencyStringToNumber(convertToLatinDigits(row.original.amount)),
        "amount in showInvoices",
      );
      setPay(currencyStringToNumber(convertToLatinDigits(row.original.amount)));
      //setIsPayChanged(true);
    } else {
      setIsModalOpen(true);
    }
  };
  ///////////////////////////////////////////////////////////////
  const updateMyRow = async (
    rowIndex: number,
    value: DefaultOptionType,
    columnId?: string,
  ) => {
    console.log(value, columnId, "value in updateMyRow");
    //setData((old) =>
    setOriginalData((old) =>
      old.map((row, index) => {
        //console.log(row, "row in updateMyRow");
        if (index === rowIndex && value && value.id !== 0) {
          return {
            ...old[rowIndex],
            [columnId as string]:
              columnId === "chequeBook"
                ? value.title
                : old[rowIndex].chequeBook,
            chequeBookId:
              columnId === "chequeBook" ? value.id : old[rowIndex].chequeBookId,
            chequeBookDtl:
              columnId === "chequeBook" ? "" : old[rowIndex].chequeBookDtl,
            chqBkNo: columnId === "chequeBook" ? "" : old[rowIndex].chqBkNo,
            chequeBookDtlId:
              columnId === "chequeBookDtl"
                ? value.id
                : old[rowIndex].chequeBookDtlId,
          };
        }
        return row;
      }),
    );
    if (columnId === "chequeBook" && value) {
      //console.log(value.id, "value.id in updateMyRow");
      //setField("chequeBookIdChequeBookDtlSearch", value.id);
      setChequeBookId(value.id);
    }
    if (columnId === "chequeBookDtl" && value) {
      setField("chequeBookDtlId", value.id);
    }
  };
  ////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setAmountTab2(
      data.reduce(
        (acc, curr) =>
          acc + currencyStringToNumber(convertToLatinDigits(curr.amount)),
        0,
      ),
    );
  }, [data]);

  useEffect(() => {
    //setData((old) =>
    setOriginalData((old) =>
      old.map((row, index) => {
        if (
          row.chequeBookDtlId.toString() ===
          chequeBookDtlByIdResponse.data.result.checkBookDtl.id.toString()
        ) {
          return {
            ...old[index],
            chqBkNo: chequeBookDtlByIdResponse.data.result.checkBookDtl.chqBkNo,
          };
        }
        return row;
      }),
    );
  }, [chequeBookDtlByIdResponse.data.result.checkBookDtl.id]);
  /////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any): string | null => {
    if (row.original.del) {
      return colors.red100;
    }
    return null;
  };
  ////////////////////////////////////////////////////////
  const newRow: PayRequestDtlTable = {
    id: 0,
    chequeBookId: 0,
    chequeBook: "",
    chequeBookDtlId: 0,
    chequeBookDtl: "",
    prsn: "",
    chqNo: "",
    chqBkNo: "",
    dat: "",
    amount: "0",
    dtlDsc: "",
    del: false,
    checked: false,
    index: 0,
  };

  const handleAddRow = (
    index: number,
    //setData: (value: React.SetStateAction<PayRequestDtlTable[]>) => void
  ) => {
    console.log(data, "data in handleAddRow");
    console.log(originalData, "originalData in handleAddRow");
    setOriginalData((prev) => [...prev, { ...newRow, index: index }]);
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg p-2 shadow-lg bg-gray-100 w-full text-sm text-gray-600">
      <div className="flex items-center justify-between mb-2">
        <a
          className="text-blue-500 hover:text-blue-700 hover:cursor-pointer w-40"
          href="https://tracking.post.ir/"
          target="_blank"
        >
          رهگیری مرسوله پستی
        </a>
        <Input
          type="text"
          widthDiv="w-full"
          widthLabel="w-40"
          widthInput="w-full-minus-40"
          disabled={!canEditForm1Dtl2} //{!workFlowRowSelectResponse.workTableForms.canEditForm1Dtl2}
          variant="outlined"
        />
        <a
          className="text-blue-500 hover:text-blue-700 hover:cursor-pointer w-40"
          href="https://cbi.ir/EstelamPichak/22036.aspx"
          target="_blank"
        >
          استعلام چک
        </a>
      </div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <p className="px-2">پیشنهاد</p>
        <hr className="border-gray-300 w-full" />
        <Input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <p className="px-2 w-40">نمایش حذف شده ها</p>
      </div>
      {/*show tab2 table*/}
      <TTable
        columns={columns}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
        data={data}
        updateMyData={updateMyData}
        fontSize="0.75rem"
        updateMyRow={updateMyRow}
        changeRowSelectColor={true}
        wordWrap={true}
        changeRowValues={changeRowValues}
        showToolTip={true}
        canEditForm={canEditForm1} //{workFlowRowSelectResponse.workTableForms.canEditForm1}
        CellColorChange={handleCellColorChange}
      />
      {
        //workFlowRowSelectResponse.workTableForms.canEditForm1Dtl2 && (
        canEditForm1Dtl2 && (
          <div className="flex items-center justify-start border border-gray-300 rounded-lg p-2 shadow-lg bg-gray-100 w-10 text-sm text-gray-600">
            <img
              src={PlusIcon}
              alt="PlusIcon"
              className="cursor-pointer"
              onClick={() => handleAddRow(data.length + 1)} //setOriginalData)}
            />
          </div>
        )
      }
      <ModalMessage
        isOpen={isModalOpen}
        backgroundColor={
          payRequestSaveResponse?.meta?.errorCode === -1
            ? "bg-green-200"
            : "bg-red-200"
        }
        color="text-white"
        onClose={() => setIsModalOpen(false)}
        message={payRequestSaveResponse?.meta?.message || ""}
        visibleButton={false}
      />
      <ModalMessage
        isOpen={isZeroPayRequestDtlId}
        backgroundColor={"bg-red-200"}
        color="text-white"
        onClose={() => setIsZeroPayRequestDtlId(false)}
        message={
          "برای نمایش فاکتورهای تسویه نشده ابتدا درخواست پرداخت را ذخیره نمایید."
        }
        visibleButton={false}
      />
      <ModalMessage
        isOpen={isModalOpen}
        backgroundColor={"bg-red-200"}
        color="text-white"
        onClose={() => setIsModalOpen(false)}
        message={"مقداری برای پرداخت مشخص نشده!"}
        visibleButton={false}
      />
      {/*open ShowMessages if ثبت is clicked with errors*/}
      {payRequestSaveResponse.data.result.dtlErrMsgs.length > 0 && (
        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="پیام ها"
          width="1/2"
        >
          <ShowMessages
            dtlErrMsgs={payRequestSaveResponse.data.result.dtlErrMsgs}
            color={colors.red100}
            heightWindow={300}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default PayRequestActiveTab2;
