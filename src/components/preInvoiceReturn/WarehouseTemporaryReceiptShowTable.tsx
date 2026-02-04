import  { useEffect, useState } from "react";
import { colors } from "../../utilities/color";
import {
  PreInvoiceReturnDtlTable,
  ResultWarehouseTemporaryReceiptShow,
  WarehouseTemporaryReceiptSaveRequest,
} from "../../types/preInvoiceReturn";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import { FaCheck, FaSave } from "react-icons/fa";
import TTable, { EditableInput } from "../controls/TTable";
import Skeleton from "../layout/Skeleton";
import { DefaultOptionType, TableColumns } from "../../types/general";
import { usePreInvoiceReturnStore } from "../../store/preInvoiceReturnStore";
import Spinner from "../controls/Spinner";
import { WarehouseTemporaryReceiptIndentDtl } from "../../types/warehouse";

type Props = {
  warehouseTemporaryReceiptShowResponse: ResultWarehouseTemporaryReceiptShow;
  isLoadingWarehouseTemporaryReceiptShow: boolean;
  preInvoiceDtlSearchOptions: DefaultOptionType[];
  canEditForm1: boolean;
  search: string;
  setSearch: (search: string) => void;
  warehouseTemporaryReceiptSave: (
    request: WarehouseTemporaryReceiptSaveRequest
  ) => void;
  isLoadingWarehouseTemporaryReceiptSave: boolean;
  setStatusClicked: (statusClicked: boolean) => void;
  setSelectedProduct: (dtl: WarehouseTemporaryReceiptIndentDtl) => void;
};

const WarehouseTemporaryReceiptShowTable = ({
  warehouseTemporaryReceiptShowResponse,
  isLoadingWarehouseTemporaryReceiptShow,
  preInvoiceDtlSearchOptions,
  canEditForm1,
  search,
  setSearch,
  warehouseTemporaryReceiptSave,
  isLoadingWarehouseTemporaryReceiptSave,
  setStatusClicked,
  setSelectedProduct,
}: Props) => {
  const columns: TableColumns = [
    {
      Header: "اطلاعات درخواست",
      width: "65%",
      columns: [
        {
          Header: "ردیف",
          accessor: "index",
          width: "3%",
          Cell: ({ value }: any) => convertToFarsiDigits(value),
        },
        {
          Header: "کالا",
          accessor: "product",
          width: "15%",
          Cell: ({ value }: any) => convertToFarsiDigits(value),
        },
        {
          Header: "قفسه",
          accessor: "cupCode",
          width: "6%",
          Cell: ({ value }: any) => convertToFarsiDigits(value),
        },
        {
          Header: "uid",
          accessor: "uid",
          width: "10%",
          Cell: ({ value }: any) => convertToFarsiDigits(value),
        },
        {
          Header: "انقضاء",
          accessor: "expireDate",
          width: "5%",
        },
        {
          Header: "تعداد",
          accessor: "cnt",
          width: "3%",
          Cell: ({ value }: any) => convertToFarsiDigits(value),
        },
        {
          Header: "سالم",
          accessor: "appearanceImage",
          width: "3%",
        },
        {
          Header: "فاکتور",
          accessor: "factorNo",
          width: "10%",
          Cell: ({ value }: any) => convertToFarsiDigits(value),
        },
        {
          Header: "شرح",
          accessor: "dtlDsc",
          width: "10%",
          Cell: ({ value }: any) => convertToFarsiDigits(value),
        },
      ],
    },
    {
      Header: "ثبت",
      width: canEditForm1 ? "33%" : "35%",
      backgroundColor: colors.indigo50,
      columns: [
        {
          Header: "رسید موقت",
          accessor: "wtrdText",
          width: canEditForm1 ? "23%" : "25%" ,
          backgroundColor: colors.indigo50,
          type: "autoComplete",
          options: preInvoiceDtlSearchOptions,
          align: "center",
          setSearch,
          search,
          placeholder: "رسید موقت را انتخاب کنید...",
          Cell: canEditForm1
            ? EditableInput
            : ({ value }: any) => convertToFarsiDigits(value),
        },
        {
          Header: "تعداد",
          accessor: "regedCnt",
          width: "3%",
          backgroundColor: colors.indigo50,
          Cell: ({ value }: any) => convertToFarsiDigits(Number(value)),
        },
        {
          Header: "آفر",
          accessor: "regedOffer",
          width: "3%",
          backgroundColor: colors.indigo50,
          Cell: ({ value }: any) => convertToFarsiDigits(Number(value)),
        },
        {
          Header: "وضعیت",
          accessor: "status",
          width: "4%",
          backgroundColor: colors.indigo50,
          Cell: ({ value }: any) => (value),
        },
      ],
    },
    {
      Header: "...",
      width: "2%",
      backgroundColor: colors.indigo50, //indigo[50]
      visible:canEditForm1,
      columns: [
        {
          Header: "...",
          accessor: "saveBtn",
          width: "2%",
          backgroundColor: colors.indigo50,
          visible:canEditForm1,
          Cell: ({ value }: any) => value,
        },
      ],
    },
  ];

  const [data, setData] = useState<PreInvoiceReturnDtlTable[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in warehouseTemporaryReceiptShowTable table
  const { setField } = usePreInvoiceReturnStore();
  ///////////////////////////////////////////////////////
  const updateToSave = (row: any) => {
    const request: WarehouseTemporaryReceiptSaveRequest = {
      WarehouseTemporaryReceiptSaveRequestId: row.id,
      warehouseTemporaryReceiptDtlId: row.wtrdId ?? 0,
    };
    console.log(request, "request in updateToSave");
    warehouseTemporaryReceiptSave(request);
    checkIconClick(
      Number(convertToLatinDigits(row.index.toString()))-1,
      { id: row.wtrdId, title: row.wtrdText },
      "wtrdText"
    );
  };
//////////////////////////////////////////////////////////
  const handleStatusClick = (dtl: WarehouseTemporaryReceiptIndentDtl) => {
    console.log(dtl,"dtl")
    setSelectedProduct(dtl);
    setStatusClicked(true);
  };
  ///////////////////////////////////////////////////////
  useEffect(() => {
    setData(
      warehouseTemporaryReceiptShowResponse.preInvoiceReturnDtls.map(
        (item, idx) => { 
          console.log(item, "item in WarehouseTemporaryReceiptShowTable useEffect");
          const dtl: WarehouseTemporaryReceiptIndentDtl = {
            id: 0,
            iocId: 0,
            produce: "",
            expire: "",
            uId: "",
            status: 0,
            cId: item.wtrcdId,
            code: "",
            gtin: "",
            irc: "",
            pCode: "",
            pName: "",
            cnt: 0,
            stock: 0,
            pOffer: 0,
            indents: [],
            rCnt: 0,
            rOffer: 0,
          };
          return{
          ...item,
          index: convertToFarsiDigits(idx + 1).toString(),
          expireDate:
            convertToFarsiDigits(item.expireYear) +
            "/" +
            convertToFarsiDigits(item.expireMonth) +
            "/" +
            convertToFarsiDigits(item.expireDay),
          appearanceImage: item.appearance ? <FaCheck color="green" /> : null,
          status: (
            <div className="flex justify-evenly items-center w-full">
              {convertToFarsiDigits(item.statusCode)}
              <input
                type="checkbox"
                checked={false}
                readOnly
                onClick={() => handleStatusClick(dtl)}
              />
            </div>
          ),          
          saveBtn: (
            <button
              className="flex w-full items-center justify-center"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                updateToSave(item);
              }}
            >
              {isLoadingWarehouseTemporaryReceiptSave ? (
                <Spinner size={4} />
              ) : (
                <FaSave color="purple" size={16} />
              )}
            </button>
          ),
        }}
      )
    );
  }, [warehouseTemporaryReceiptShowResponse]);

  useEffect(() => {
    warehouseTemporaryReceiptShowResponse.preInvoiceReturnDtls[
      selectedRowIndex
    ] &&
      setField(
        "preInvoiceDtlId",
        warehouseTemporaryReceiptShowResponse.preInvoiceReturnDtls?.[
          selectedRowIndex
        ]?.id
      );
  }, [
    warehouseTemporaryReceiptShowResponse.preInvoiceReturnDtls?.[
      selectedRowIndex
    ]?.id,
    selectedRowIndex,
  ]);

  //////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    const currentRow = data[rowIndex];
    if (!currentRow) return;

    (currentRow as any)[columnId] = value;
/*    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );*/
  };
  ////////////////////////////////////////////////////
  const changeRowValues = (
    value: string,
    rowIndex: number,
    columnId: string
  ) => {
    updateMyData(rowIndex, columnId, value);
  };
  ///////////////////////////////////////////////////////////////
  const updateMyRow = async (
    rowIndex: number,
    value: DefaultOptionType,
    columnId?: string
  ) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex && value && value.id !== 0) {
          let wtrdId = 0;
          if(columnId === "wtrdText") {
            if (value!==null) {
              wtrdId = value.id;
              updateToSave({...old[rowIndex], wtrdId: wtrdId});
            }
          }
          return {
            ...old[rowIndex],
            [columnId as string]:
              columnId === "wtrdText" ? value.title : old[rowIndex].wtrdText,
            wtrdId:
              columnId === "wtrdText"
                ? value !== null
                  ? value.id
                  : 0
                : old[rowIndex].wtrdId,
            saveBtn: columnId==="wtrdText"?(
              <button
                className="flex w-full items-center justify-center"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  updateToSave({...old[rowIndex], wtrdId: wtrdId});
                }}
              >
                {<FaCheck color="green" size={16} />}
              </button>
            ):(
              <button
                className="flex w-full items-center justify-center"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  updateToSave({...old[rowIndex], wtrdId: wtrdId});
                }}
              >
                {<FaSave color="purple" size={16} />}
              </button>
            ),
          };
        }
        return row;
      })
    );
  };
  ///////////////////////////////////////////////////////////////
  const checkIconClick = async (
    rowIndex: number,
    value: DefaultOptionType,
    columnId?: string
  ) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex && value && value.id !== 0) {
          return {
            ...old[rowIndex],
            saveBtn: columnId==="wtrdText"?(
              <button
                className="flex w-full items-center justify-center"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  updateToSave(old[rowIndex]);
                }}
              >
                {<FaSave color="purple" size={16} />}
              </button>
            ):(
              <button
                className="flex w-full items-center justify-center"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  updateToSave(old[rowIndex]);
                }}
              >
                {<FaSave color="purple" size={16} />}
              </button>
            ),
          };
        }
        return row;
      })
    );
  };

  return (
    <>
      {isLoadingWarehouseTemporaryReceiptShow ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : (
        <>
          <TTable
            columns={columns}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            data={data}
            //fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={true}
            canEditForm={canEditForm1}
            changeRowValues={changeRowValues}
            updateMyData={updateMyData}
            updateMyRow={updateMyRow}
            //CellColorChange={handleCellColorChange}
          />
        </>
      )}
    </>
  );
};

export default WarehouseTemporaryReceiptShowTable;
