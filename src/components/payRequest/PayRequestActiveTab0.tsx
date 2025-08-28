import { useEffect, useState } from "react";
import Input from "../controls/Input";
import { TableColumns } from "../../types/general";
import { usePayRequestStore } from "../../store/payRequestStore";
import { useGeneralContext } from "../../context/GeneralContext";
import TTable from "../controls/TTable";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import { PayRequestInvoicesTable } from "../../types/payRequest";
import Skeleton from "../layout/Skeleton";

type Props = {
  customerId: number;
  setRemSum: (remSum: number) => void;
  data: PayRequestInvoicesTable[];
  setData: (data: PayRequestInvoicesTable[]) => void;
  isLoading: boolean;
};

const PayRequestActiveTab0 = ({
  data,
  setData,
  customerId,
  setRemSum,
  isLoading,
}: Props) => {

  const [isChecked, setIsChecked] = useState(false);
  const { id, setField: setPayRequestInvoicesField } = usePayRequestStore();
  const { systemId, yearId } = useGeneralContext();

  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "3%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "نوع",
      accessor: "kind",
      width: "5%",
    },
    {
      Header: "شماره فاکتور",
      accessor: "factorNo",
      width: "10%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "تاریخ",
      accessor: "dat",
      width: "5%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "تاریخ تسویه",
      accessor: "payDat",
      width: "5%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "مبلغ",
      accessor: "fact",
      width: "10%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value)),
    },
    {
      Header: "اضافات",
      accessor: "pls",
      width: "10%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value)),
    },
    {
      Header: "کسورات",
      accessor: "mns",
      width: "10%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value)),
    },
    {
      Header: "ارزش افزوده",
      accessor: "valueTax",
      width: "10%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value)),
    },
    {
      Header: "جمع",
      accessor: "total",
      width: "10%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value)),
    },
    {
      Header: "پرداختی",
      accessor: "pay",
      width: "10%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value)),
    },
    {
      Header: "مانده",
      accessor: "rem",
      width: "10%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value)),
    },
    {
      Header: " ",
      accessor: "checked",
      width: "2%",
      Cell: ({ value, row }: any) => (
        <div className="flex justify-evenly items-center w-full">
          <input
            className="cursor-pointer"
            type="checkbox"
            checked={value}
            readOnly
            onClick={() => handleCheckClick(value, row.original)}
          />
        </div>
      ),
    },
  ];

  const handleCheckClick = (value: boolean, row: PayRequestInvoicesTable) => {
    // Handle checkbox click logic here
    console.log("Checkbox clicked:", value, row);
    const newData = [...data];
    const index = newData.findIndex((item) => item.id === row.id);
    if (index !== -1) {
      newData[index].checked = !newData[index].checked;
    }
    setData(newData);
    calculateTotal();
  };
  const calculateTotal = () => {
    const remSum = data.reduce(
      (acc, item) => acc + (item.checked ? item.rem : 0),
      0
    );
    setRemSum(remSum);
  };


  useEffect(() => {
    setPayRequestInvoicesField("payRequestId", id);
    setPayRequestInvoicesField("systemIdPayRequestInvoice", systemId);
    setPayRequestInvoicesField("yearIdPayRequestInvoice", yearId);
    setPayRequestInvoicesField("customerId", customerId);
  }, [customerId, systemId, yearId, id]);

  return (
    <div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-2 shadow-lg bg-gray-100">
      <div className="flex items-center justify-center gap-2">
        <hr className="border-gray-300 w-full" />
        <Input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <TTable columns={columns} data={data} changeRowSelectColor={true} />
      )}
    </div>
  );
};

export default PayRequestActiveTab0;
