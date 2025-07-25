import { Paper } from "@mui/material";
import { useInvoice } from "../../hooks/useInvoice";
import Skeleton from "../layout/Skeleton";
import React from "react";
import TTable from "../controls/TTable";
import { convertToFarsiDigits, formatNumberWithCommas } from "../../utilities/general";

const InvoiceShowTable = () => {
  const { isLoading, invoiceShowIdResponse } = useInvoice();

  const columns = React.useMemo(
    () => [
      {
        Header: "اقلام",
        width: "100%",
        columns: [
          {
            Header: "ردیف",
            accessor: "index",
            width: "5%",
            Cell: ({ value }: any) => {
              return convertToFarsiDigits(value);
            },
          },
          {
            Header: "کالا",
            accessor: "product",
            width: "45%",
            Cell: ({ value }: any) => {
              return convertToFarsiDigits(value);
            },
          },
          {
            Header: "تعداد",
            accessor: "cnt",
            width: "10%",
            Cell: ({ value }: any) => {
              return convertToFarsiDigits(value);
            },
          },
          {
            Header: "آفر",
            accessor: "offer",
            width: "10%",
            Cell: ({ value }: any) => {
              return convertToFarsiDigits(value);
            },
          },
          {
            Header: "قیمت",
            accessor: "cost",
            width: "10%",
            Cell: ({ value }: any) => {
              return convertToFarsiDigits(formatNumberWithCommas(value));
            },
          },
          {
            Header: "ارزش افزوده",
            accessor: "valueTax",
            width: "10%",
            Cell: ({ value }: any) => {
              return convertToFarsiDigits(formatNumberWithCommas(value));
            },
          },
          {
            Header: "جمع",
            accessor: "total",
            width: "10%",
            Cell: ({ value }: any) => {
              return convertToFarsiDigits(formatNumberWithCommas(value));
            },
          },
        ],
      },
    ],
    []
  );

  /*const headCells: HeadCell<InvoiceDetail>[] = [
    {
      id: "index",
      label: "ردیف",
      disableSorting: true,
      cellWidth: "5%",
      isNumber: true,
    },
    {
      id: "product",
      label: "کالا",
      cellWidth: "30%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "cnt",
      label: "تعداد",
      cellWidth: "10%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "offer",
      label: "آفر",
      cellWidth: "10%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "cost",
      label: "قیمت",
      cellWidth: "10%",
      isNumber: true,
      disableSorting: true,
      isCurrency: true,
    },
    {
      id: "valueTax",
      label: "ارزش افزوده",
      cellWidth: "10%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "total",
      label: "جمع",
      cellWidth: "25%",
      isNumber: true,
      disableSorting: true,
      isCurrency: true,
    },
  ];*/

  //const headerGroups: HeaderGroup[] = [{ label: "اقلام", colSpan: 7 }];

  /*const handleRowClick = (
    item: InvoiceDetail,
    setSelectedRowId: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    setSelectedRowId(Number(item["id"]));
  };*/

  const data = invoiceShowIdResponse.data.result.invoiceDtls.map((dtl, i) => ({
    ...dtl,
    index: i + 1,
  }));

  return (
    <>
      <Paper className="p-2 mt-2 w-full">
        {isLoading ? (
          <div className="text-center">{<Skeleton />}</div>
        ) : invoiceShowIdResponse.meta.errorCode !== -1 ? (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            {invoiceShowIdResponse.meta.message}
          </p>
        ) : (
          <div className="w-full mt-2">
            <TTable
              columns={columns}
              data={data}
              //updateMyData={updateMyData}
              fontSize="0.75rem"
            />
          </div>
        )}
      </Paper>
    </>
  );
};

export default InvoiceShowTable;
