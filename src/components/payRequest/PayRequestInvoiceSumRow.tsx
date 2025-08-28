import { useEffect, useState } from "react";
import { TableColumns } from "../../types/general";
import { PayRequestInvoiceIncludeChecks } from "../../types/payRequest";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";

type Props = {
  data: PayRequestInvoiceIncludeChecks[];
  columns: TableColumns;
};

const PayRequestInvoiceSumRow = ({ data, columns }: Props) => {
  const [sumTotal, setSumTotal] = useState(0);
  const [sumDcrmnt, setSumDcrmnt] = useState(0);
  const [sumPay, setSumPay] = useState(0);
  const [sumRem, setSumRem] = useState(0);
  const [sumSettle, setSumSettle] = useState(0);
  useEffect(() => {
    setSumTotal(data.reduce((acc, item) => acc + item.total, 0));
    setSumDcrmnt(data.reduce((acc, item) => acc + item.dcrmnt, 0));
    setSumPay(data.reduce((acc, item) => acc + item.pay, 0));
    setSumRem(data.reduce((acc, item) => acc + item.rem, 0));
    setSumSettle(data.reduce((acc, item) => acc + item.settle, 0));
  }, [data]);
  return (
    <div className="flex items-center justify-center w-full bg-gray-200 border-b-2 border-gray-300 text-gray-500 text-sm font-bold border-l-2 border-r-2">
      {columns.map((column) => (
        <>
          {column.Header === "جمع فاکتور" && (
            <div
              className="border-x-2 border-gray-300 p-1"
              style={{ width: column.width }}
            >
              {convertToFarsiDigits(formatNumberWithCommas(sumTotal))}
            </div>
          )}
          {column.Header === "تخفیف نقدی" && (
            <div
              className="border-l-2 border-gray-300 p-1"
              style={{ width: column.width }}
            >
              {convertToFarsiDigits(formatNumberWithCommas(sumDcrmnt))}
            </div>
          )}
          {column.Header === "پرداختی" && (
            <div
              className="border-l-2 border-gray-300 p-1"
              style={{ width: column.width }}
            >
              {convertToFarsiDigits(formatNumberWithCommas(sumPay))}
            </div>
          )}
          {column.Header === "مانده" && (
            <div
              className="border-l-2 border-gray-300 p-1"
              style={{ width: column.width }}
            >
              {convertToFarsiDigits(formatNumberWithCommas(sumRem))}
            </div>
          )}
          {column.Header === "تسویه" && (
            <div
              className="border-l-2 border-gray-300 p-1"
              style={{ width: column.width }}
            >
              {convertToFarsiDigits(formatNumberWithCommas(sumSettle))}
            </div>
          )}
          {column.Header !== "جمع فاکتور" &&
            column.Header !== "تخفیف نقدی" &&
            column.Header !== "پرداختی" &&
            column.Header !== "مانده" &&
            column.Header !== "تسویه" && (
              <div
                className="border-l-2 first:border-x-2 py-1"
                style={{ width: column.width }}
              >
                {column.Header==="نوع" && "جمع کل:"}
              </div>
            )}
        </>
      ))}
    </div>
  );
};

export default PayRequestInvoiceSumRow;
