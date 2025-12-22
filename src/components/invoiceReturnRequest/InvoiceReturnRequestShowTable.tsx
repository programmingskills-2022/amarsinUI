import React, { useEffect, useState } from "react";
import { convertToFarsiDigits } from "../../utilities/general";
import Skeleton from "../layout/Skeleton";
import { Paper } from "@mui/material";
import TTable from "../controls/TTable";
import { colors } from "../../utilities/color";
import HistoryIcon from "../../assets/images/GrayThem/history_gray_16.png";
import EditIcon from "../../assets/images/GrayThem/edit_gray16.png";
import { FaCheck } from "react-icons/fa";
import { useInvoiceReturnRequestStore } from "../../store/invoiceReturnRequestStore";

type Props = {
  invoiceReturnRequestShowResponse: any; //InvoiceReturnRequestShowResponse;
  isLoadingInvoiceReturnRequestShow: boolean;
  setEditClicked: (editClicked: boolean) => void;
  formKind: "isRequest" | "isPreInvoice";
};

const InvoiceReturnRequestShowTable = ({
  invoiceReturnRequestShowResponse,
  isLoadingInvoiceReturnRequestShow,
  setEditClicked,
  formKind,
}: Props) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in warehouseShowTable table
  const { setField } = useInvoiceReturnRequestStore();
  const [data, setData] = useState<any[]>([]);
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        Header: "اطلاعات درخواست",
        width: formKind === "isRequest" ? "56%" : "76%",
        columns: [
          {
            Header: "ردیف",
            accessor: "index",
            width: "3%",
          },
          {
            Header: "کالا",
            accessor: "product",
            width: formKind === "isRequest" ? "15%" : "25%",
          },
          {
            Header: "قفسه",
            accessor: "cupCode",
            width: "5%",
          },
          {
            Header: "UID",
            accessor: "uid",
            width: "10%",
          },
          {
            Header: "انقضاء",
            accessor: "expDate",
            width: "5%",
          },
          {
            Header: "تعداد",
            accessor: "cnt",
            width: "5%",
          },
          {
            Header: "سالم",
            accessor: "appearanceImage",
            width: "3%",
          },
          {
            Header: "فاکتور",
            accessor: "factor",
            width: "10%",
          },
          {
            Header: "شرح",
            accessor: "dtlDsc",
            width: "10%",
          },
        ],
      },
      {
        Header: "کنترل",
        width: "24%",
        backgroundColor: colors.orang100,
        columns: [
          {
            Header: "تشخیص",
            accessor: "determination",
            width: "22%",
            backgroundColor: colors.orang100,
          },
          {
            Header: "...",
            accessor: "historyIcon",
            width: "2%",
            backgroundColor: colors.orang100,
            Cell: ({ row }: any) => (
              <img
                src={HistoryIcon}
                onClick={() => console.log(row)}
                className="cursor-pointer"
                alt="report"
              />
            ),
          },
        ],
      },
      {
        Header: "اطلاعات ثبت",
        width: "20%",
        backgroundColor: colors.indigo50,
        columns: [
          {
            Header: "فاکتور",
            accessor: "factorNo",
            width: "8%",
            backgroundColor: colors.indigo50,
          },
          {
            Header: "تعداد",
            accessor: "regedCnt",
            width: "5%",
            backgroundColor: colors.indigo50,
          },
          {
            Header: "آفر",
            accessor: "regedOffer",
            width: "5%",
            backgroundColor: colors.indigo50,
          },
          {
            Header: "...",
            accessor: "editIcon",
            width: "2%",
            backgroundColor: colors.indigo50,
            Cell: ({ row }: any) => (
              <img
                src={EditIcon}
                onClick={() => handleEditClick(row)}
                className="cursor-pointer"
                alt="report"
              />
            ),
          },
        ],
      },
    ];

    // Process columns based on formKind
    let processedColumns = [...baseColumns];

    // If formKind is "isPreInvoice", exclude the "اطلاعات ثبت" column
    if (formKind === "isPreInvoice") {
      processedColumns = processedColumns.filter(
        (col) => col.Header !== "اطلاعات ثبت"
      );
    }

    // If formKind is "isRequest", exclude the "فاکتور" column (with accessor "factor") from "اطلاعات درخواست"
    if (formKind === "isRequest") {
      processedColumns = processedColumns.map((col: any) => {
        if (col.Header === "اطلاعات درخواست") {
          return {
            ...col,
            columns: col.columns.filter(
              (subCol: any) => subCol.accessor !== "factor"
            ),
          };
        }
        return col;
      }) as any;
    }

    return processedColumns;
  }, [formKind]);

  ////////////////////////////////////////////////////////////////////////
  //set id(invoiceDtlId) in store to use in api/InvoiceReturnRequest/invoiceEdit?Id=3712
  const handleEditClick = (row: any) => {
    setEditClicked(true);
    console.log(row.original.id, "row");
    setField("invoiceListId", row.original.id);
    setField("invoiceListIdTrigger", Date.now());
  };

  useEffect(() => {
    if (formKind === "isRequest") {
      const tempData: any[] =
        invoiceReturnRequestShowResponse.data.result.invoiceReturnRequestDtls.map(
          (item: any, index: number) => {
            const diagnosises =
              invoiceReturnRequestShowResponse.data.result.diagnosises
                .filter((diagnosis: any) => diagnosis.id === item.id)
                .map((diagnosis: any) => diagnosis.msg);
            return {
              ...item,
              index: convertToFarsiDigits(index + 1),
              product: convertToFarsiDigits(item.product),
              cupCode: convertToFarsiDigits(item.cupCode),
              uid: convertToFarsiDigits(item.uid),
              expDate: convertToFarsiDigits(
                item.expireYear + "/" + item.expireMonth + "/" + item.expireDay
              ),
              cnt: convertToFarsiDigits(item.cnt),
              appearanceImage: item.appearance ? (
                <div className="w-full flex items-center justify-center">
                  <FaCheck color="green" />
                </div>
              ) : null,
              dtlDsc: convertToFarsiDigits(item.dtlDsc),
              determination:
                diagnosises.length > 0
                  ? diagnosises.map((diagnosis: any) => (
                      <div className="flex items-center justify-left">
                        <span className="text-2xl px-2">•</span>
                        <p>{convertToFarsiDigits(diagnosis)}</p>
                      </div>
                    ))
                  : null,
              factorNo: convertToFarsiDigits(item.factorNo),
              regedCnt: convertToFarsiDigits(Number(item.regedCnt)),
              regedOffer: convertToFarsiDigits(Number(item.regedOffer)),
            };
          }
        );
      setData(tempData);
    }
  }, [invoiceReturnRequestShowResponse.data.result.invoiceReturnRequestDtls]);

  useEffect(() => {
    if (formKind === "isPreInvoice") {
      // preInvoiceReturnShowResponse is mapped to invoiceReturnRequestShowResponse
      const tempData: any[] =
        invoiceReturnRequestShowResponse.data.result.preInvoiceReturnDtls.map(
          (item: any, index: number) => {
            const diagnosises =
            invoiceReturnRequestShowResponse.data.result.diagnosises
              .filter((diagnosis: any) => diagnosis.id === item.id)
              .map((diagnosis: any) => diagnosis.msg);
            return {
              ...item,
              index: convertToFarsiDigits(index + 1),
              product: convertToFarsiDigits(item.product),
              cupCode: convertToFarsiDigits(item.cupCode),
              uid: convertToFarsiDigits(item.uid),
              expDate: convertToFarsiDigits(
                item.expireYear + "/" + item.expireMonth + "/" + item.expireDay
              ),
              cnt: convertToFarsiDigits(item.cnt),
              appearanceImage: item.appearance ? (
                <div className="w-full flex items-center justify-center">
                  <FaCheck color="green" />
                </div>
              ) : null,
              dtlDsc: convertToFarsiDigits(item.dtlDsc),
              determination:
                diagnosises.length > 0
                  ? diagnosises.map((diagnosis: any) => (
                      <div className="flex items-center justify-left">
                        <span className="text-2xl px-2">•</span>
                        <p>{convertToFarsiDigits(diagnosis)}</p>
                      </div>
                    ))
                  : null,
              factor: convertToFarsiDigits(item.factorNo),
              regedCnt: convertToFarsiDigits(Number(item.regedCnt)),
              regedOffer: convertToFarsiDigits(Number(item.regedOffer)),
            };
          }
        );
      setData(tempData);
    }
  }, [invoiceReturnRequestShowResponse.data.result.preInvoiceReturnDtls]);
  return (
    <Paper className="p-2 mt-2 w-full">
      {isLoadingInvoiceReturnRequestShow ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : invoiceReturnRequestShowResponse.meta.errorCode > 0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {invoiceReturnRequestShowResponse.meta.message}
        </p>
      ) : (
        <div className="w-full mt-2">
          <TTable
            columns={columns}
            data={data}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            changeRowSelectColor={true}
            wordWrap={true}
            showToolTip={true}
            //updateMyData={updateMyData}
            fontSize="0.75rem"
          />
        </div>
      )}
    </Paper>
  );
};

export default InvoiceReturnRequestShowTable;
