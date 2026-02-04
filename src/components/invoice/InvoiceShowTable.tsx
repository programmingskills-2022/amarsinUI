import { Paper } from "@mui/material";
import Skeleton from "../layout/Skeleton";
import React, { useEffect } from "react";
import TTable from "../controls/TTable";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import InvoiceShowTableHeader from "./InvoiceShowTableHeader";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import { InvoiceShowIdResponse } from "../../types/invoice";

type Props = {
  caption: string;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceShowIdResponse: InvoiceShowIdResponse;
  refetchInvoiceShowId: () => void;
  isLoading: boolean;
};

const InvoiceShowTable = ({
  caption,
  refetchSwitch,
  setRefetchSwitch,
  invoiceShowIdResponse,
  refetchInvoiceShowId,
  isLoading,
}: Props) => {
  const columns = React.useMemo(
    () => [
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

    []
  );

  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      refetchInvoiceShowId();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);

  const data = invoiceShowIdResponse.data.result.invoiceDtls.map((dtl, i) => ({
    ...dtl,
    index: i + 1,
  }));

  const { width } = useCalculateTableHeight();
  return (
    <>
      <Paper className="p-2 mt-2 w-full">
        {isLoading ? (
          <div className="text-center">{<Skeleton />}</div>
        ) : invoiceShowIdResponse.meta.errorCode > 0 ? (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            {invoiceShowIdResponse.meta.message}
          </p>
        ) : (
          <div className="w-full mt-2">
            {width > 768 && <InvoiceShowTableHeader caption={caption} />}
            <TTable
              columns={columns}
              data={data}
              //updateMyData={updateMyData}
              fontSize="0.75rem"
              maxVisibleColumns={6}
            />
          </div>
        )}
      </Paper>
    </>
  );
};

export default InvoiceShowTable;
