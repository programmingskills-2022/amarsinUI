import { TableColumns } from "../../types/general";
import TTable from "../controls/TTable";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { RpCustomerBillsResultWithIndex } from "../../types/sales";
import Skeleton from "../layout/Skeleton";

type Props = {
  data: RpCustomerBillsResultWithIndex[];
  isLoading: boolean;
};

const PayRequestActiveTab1 = ({
  data,
  isLoading,
}: Props) => {
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "3%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "تاریخ",
      accessor: "dat",
      width: "10%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),      
    },
    {
      Header: "سند",
      accessor: "sanad",
      width: "10%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "شرح",
      accessor: "exp",
      width: "37%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "بدهکار",
      accessor: "bed",
      width: "10%",
      Cell: ({ value }: any) => convertToFarsiDigits(formatNumberWithCommas(Number(value))),
    },
    {
      Header: "بستانکار",
      accessor: "bes",
      width: "13%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(Number(value))),
    },
    {
      Header: "مانده",
      accessor: "rem",
      width: "13%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(Number(value))),
    },
    {
      Header: "?",
      accessor: "bedBes",
      width: "4%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value)),
    },
  ];

  return (
    <div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-2 shadow-lg bg-gray-100">
      <div className="flex items-center justify-center gap-2">
        <hr className="border-gray-300 w-full" />
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <TTable columns={columns} data={data} changeRowSelectColor={true} />
      )}
    </div>
  );
};

export default PayRequestActiveTab1;
