import { Paper } from "@mui/material";
import { TableColumns } from "../../types/general";
import { InvoicePaymentResponse } from "../../types/invoice";
import Skeleton from "../layout/Skeleton";
import TTable from "../controls/TTable";
import { useEffect, useState } from "react";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import Attach from "../../assets/images/GrayThem/Attach24.png";

type Props = {
  invoicePaymentResponse: InvoicePaymentResponse;
  isLoading: boolean;
};

const InvoicePaymentShowTable = ({
  invoicePaymentResponse,
  isLoading,
}: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0)
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "3%",
    },
    {
      Header: "نوع",
      accessor: "kindT",
      width: "5%",
    },
    {
      Header: "تاریخ",
      accessor: "dat",
      width: "8%",
    },
    {
      Header: "کاربر",
      accessor: "usrName",
      width: "10%",
    },
    {
      Header: "شماره",
      accessor: "no",
      width: "8%",
    },
    {
      Header: "جزئیات",
      accessor: "exp",
      width: "20%",
    },
    {
      Header: "توضیحات",
      accessor: "dsc",
      width: "28%",
    },
    {
      Header: "مبلغ",
      accessor: "amnt",
      width: "10%",
    },
    {
      Header: "مانده",
      accessor: "rem",
      width: "10%",
    },
    {
      Header: "...",
      accessor: "attachments",
      width: "2%",
    },
  ];

  useEffect(() => {
    const tempData = invoicePaymentResponse.data.result.payments.map((p, i) => {
      return {
        ...p,
        index: convertToFarsiDigits(i + 1),
        kindT: convertToFarsiDigits(p.kindT),
        dat: convertToFarsiDigits(p.dat),
        usrName: convertToFarsiDigits(p.usrName),
        no: convertToFarsiDigits(p.no),
        exp: convertToFarsiDigits(p.exp),
        dsc: convertToFarsiDigits(p.dsc),
        amnt: convertToFarsiDigits(formatNumberWithCommas(p.amnt)),
        rem: convertToFarsiDigits(formatNumberWithCommas(p.rem)),
        attachments: (
          <div className="cursor-pointer">
            <img src={Attach} alt="ضمائم" className="w-4 h-4" />
          </div>
        ),
      };
    });
    setData(tempData);
  }, [invoicePaymentResponse]);

  return (
    <>
      <Paper className="p-2 mt-2 w-full">
        {isLoading ? (
          <div className="text-center">{<Skeleton />}</div>
        ) : invoicePaymentResponse.meta.errorCode > 0 ? (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            {invoicePaymentResponse.meta.message}
          </p>
        ) : (
          <div className="w-full mt-2">
            <TTable
              columns={columns}
              data={data}
              selectedRowIndex={selectedRowIndex}
              setSelectedRowIndex={setSelectedRowIndex}
              //updateMyData={updateMyData}
              fontSize="0.75rem"
            />
          </div>
        )}
      </Paper>
    </>
  );
};

export default InvoicePaymentShowTable;
