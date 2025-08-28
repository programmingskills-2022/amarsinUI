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
import { WorkflowRowSelectResponse } from "../../types/workflow";

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
  canEditForm: boolean;
  customerId: number;
  originalData: PayRequestDtlTable[];
  setOriginalData: (
    data:
      | PayRequestDtlTable[]
      | ((old: PayRequestDtlTable[]) => PayRequestDtlTable[])
  ) => void;
  chequeBookDtlByIdResponse: ChequeBookDtlByIdResponse;
  setShowInvoices: React.Dispatch<React.SetStateAction<boolean>>;
  setPay: React.Dispatch<React.SetStateAction<number>>;
  setAmountTab2: React.Dispatch<React.SetStateAction<number>>;
  setPayRequestDtlId: React.Dispatch<React.SetStateAction<number>>;
  setChequeBookId: React.Dispatch<React.SetStateAction<number>>;
  chequeBookId: number;
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
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
  canEditForm,
  chequeBookDtlByIdResponse,
  setShowInvoices,
  setPay,
  setAmountTab2,
  setPayRequestDtlId,
  setChequeBookId,
  chequeBookId,
  workFlowRowSelectResponse
}: Props) => {
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
      setSearch: setChequeBookSearch,
      search: chequeBookSearch,
      placeholder: "دسته چک را انتخاب کنید...",
      Cell: canEditForm
        ? EditableInput
        : ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "شماره چک",
      accessor: "chequeBookDtl",
      width: "9%",
      type: "autoComplete",
      options: options2,
      setSearch: setChequeBookDtlSearch,
      search: chequeBookDtlSearch,
      placeholder: "شماره چک را انتخاب کنید...",
      Cell: canEditForm
        ? EditableInput
        : ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "در وجه",
      accessor: "prsn",
      width: "22%",
      Cell: canEditForm
        ? EditableInput
        : ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "صیادی",
      accessor: "chqBkNo",
      width: "8%",
      Cell: canEditForm
        ? EditableInput
        : ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "سررسید",
      accessor: "dat",
      width: "5%",
      Cell: canEditForm
        ? EditableInput
        : ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "مبلغ",
      accessor: "amount",
      width: "8%",
      Cell: canEditForm ? EditableInput : ({ value }: any) => value,
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
      width: "15%",
      Cell: canEditForm
        ? EditableInput
        : ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: " ",
      accessor: "lastColumn",
      width: "3%",
      Cell: ({ row }: any) => (
        <div className="flex w-full">
          {canEditForm && (
            <>
              <img
                src={row.original.del ? RestoreIcon : TrashIcon}
                onClick={() => updateToDeleted(row)}
                className="cursor-pointer"
                alt="TrashIcon"
              />
              <input
                type="checkbox"
                checked={row.original.checked}
                onChange={() => showInvoices(row)}
                className="cursor-pointer"
              />
            </>
          )}
        </div>
      ),
    },
  ];
  const [isChecked, setIsChecked] = useState(true); //for showing deleted rows
  const { id, setField: setPayRequestInvoicesField } = usePayRequestStore();
  const { systemId, yearId } = useGeneralContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: number;
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
  ////////////////////////////////////////////////////////////////
  //initializing chequeBookSearch requests
  useEffect(() => {
    setField("acc_systemChequeBookSearch", systemId);
    setField("searchChequeBookSearch", chequeBookSearch);
    setField("pageChequeBookSearch", 1);
    setField("lastIdChequeBookSearch", 0);
    //console.log(chequeBookSearch, "chequeBookSearch in useEffect");
  }, [chequeBookSearch]);
  useEffect(() => {
    console.log(chequeBookId, "chequeBookId in useEffect");
    setField("searchChequeBookDtlSearch", chequeBookDtlSearch);
    setField("pageChequeBookDtlSearch", 1);
    setField("lastIdChequeBookDtlSearch", 0);
    if (chequeBookId !== 0) {
      setField("chequeBookIdChequeBookDtlSearch", chequeBookId);
    }
  }, [chequeBookDtlSearch, chequeBookId]);
  ////////////////////////////////////////////////////////////////
  //initializing payRequestInvoicesField
  useEffect(() => {
    setPayRequestInvoicesField("payRequestId", id);
    setPayRequestInvoicesField("systemIdPayRequestInvoice", systemId);
    setPayRequestInvoicesField("yearIdPayRequestInvoice", yearId);
    setPayRequestInvoicesField("customerId", customerId);
  }, [customerId, systemId, yearId, id]);
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
    setData((old: PayRequestDtlTable[]) =>
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
  };

  ////////////////////////////////////////////////////
  const changeRowValues = (
    value: string,
    rowIndex: number,
    columnId: string
  ) => {
    updateMyData(rowIndex, columnId, value);
  };
  ////////////////////////////////////////////////////////////////
  const updateToDeleted = (row: any) => {
    setOriginalData((old: PayRequestDtlTable[]) =>
      old.map((origRow) => {
        if (origRow.id === row.original.id) {
          return { ...origRow, del: !origRow.del };
        }
        return origRow;
      })
    );
  };

  ////////////////////////////////////////////////////////////////
  const showInvoices = (row: any) => {
    console.log(row.original.id, "row.original.id in showInvoices");
    setPayRequestDtlId(row.original.id);
    setOriginalData((old: PayRequestDtlTable[]) => {
      return old.map((origRow) => {
        // console.log(origRow);
        if (origRow.id === row.original.id) {
          return { ...origRow, amount: row.original.amount, checked: true };
        }
        return origRow;
      });
    });
    if (
      currencyStringToNumber(convertToLatinDigits(row.original.amount)) !== 0
    ) {
      setShowInvoices(true);
      setPay(currencyStringToNumber(convertToLatinDigits(row.original.amount)));
    } else {
      setIsModalOpen(true);
    }
  };
  ///////////////////////////////////////////////////////////////
  const updateMyRow = async (
    rowIndex: number,
    value: DefaultOptionType,
    columnId?: string
  ) => {
    console.log(value, columnId, "value in updateMyRow");
    setData((old) =>
      old.map((row, index) => {
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
      })
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
  useEffect(() => {
    setAmountTab2(
      data.reduce(
        (acc, curr) =>
          acc + currencyStringToNumber(convertToLatinDigits(curr.amount)),
        0
      )
    );
  }, [data]);

  useEffect(() => {
    setData((old) =>
      old.map((row, index) => {
        if (
          row.chequeBookDtlId ===
          chequeBookDtlByIdResponse.data.result.checkBookDtl.id
        ) {
          return {
            ...old[index],
            chqBkNo: chequeBookDtlByIdResponse.data.result.checkBookDtl.chqBkNo,
          };
        }
        return row;
      })
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
    setData: (value: React.SetStateAction<PayRequestDtlTable[]>) => void
  ) => {
    setData((prev) => [...prev, { ...newRow, index: index }]);
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
          disabled={true}
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
      <TTable
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        fontSize="0.75rem"
        updateMyRow={updateMyRow}
        changeRowSelectColor={true}
        wordWrap={true}
        changeRowValues={changeRowValues}
        showToolTip={true}
        canEditForm={true}
        CellColorChange={handleCellColorChange}
      />
      {workFlowRowSelectResponse.workTableForms.canEditForm1Dtl1 && (
        <div className="flex items-center justify-start border border-gray-300 rounded-lg p-2 shadow-lg bg-gray-100 w-10 text-sm text-gray-600">
          <img
            src={PlusIcon}
            alt="PlusIcon"
            className="cursor-pointer"
            onClick={() => handleAddRow(data.length + 1, setOriginalData)}
          />
        </div>
      )}
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
