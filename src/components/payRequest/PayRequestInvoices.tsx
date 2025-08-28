import { TableColumns } from "../../types/general";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import TTable from "../controls/TTable";
import Button from "../controls/Button";
import Input from "../controls/Input";
import {
  PayRequestInvoiceIncludeChecks,
  PayRequestInvoicesTable,
} from "../../types/payRequest";
import PayRequestInvoiceSumRow from "./PayRequestInvoiceSumRow";

type Props = {
  setInvoicesWithChecks: (data: PayRequestInvoiceIncludeChecks[]) => void;
  payRequestDtlId: number;
  data: PayRequestInvoiceIncludeChecks[];
  setData: (data: PayRequestInvoiceIncludeChecks[]) => void;
  pay: number;
  setShowInvoices: (show: boolean) => void;
  newPay: number;
  setNewPay: React.Dispatch<React.SetStateAction<number>>;
  //isConfirmRef: React.MutableRefObject<boolean>
};

const PayRequestInvoices = ({
  setInvoicesWithChecks,
  payRequestDtlId,
  data,
  setData,
  pay,
  setShowInvoices,
  newPay,
  setNewPay,
}: //isConfirmRef,
Props) => {
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
      width: "10%",
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
      width: "10%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "تاریخ تسویه",
      accessor: "payDat",
      width: "10%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "جمع فاکتور",
      accessor: "total",
      width: "10%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value)),
    },
    {
      Header: "تخفیف نقدی",
      accessor: "dcrmnt",
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
      Header: "تسویه",
      accessor: "settle",
      width: "15%",
      Cell: ({ value }: any) =>
        convertToFarsiDigits(formatNumberWithCommas(value ? value : 0)),
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
    console.log(newPay, "newPay in handleCheckClick");
    newData.map((item) => {
      if (item.id === row.id) {
        item.checked = !item.checked;
        if (item.checked) {
          if (newPay > item.rem) {
            setNewPay(newPay - item.rem);
            console.log(item.rem, "item.rem in handleCheckClick");
            item.settle = item.rem;
          } else {
            setNewPay(0);
            item.settle = newPay;
          }
          //item.payRequestDtlId = payRequestDtlId;
        } else {
          //item.payRequestDtlId = 0;
          setNewPay(newPay + item.settle);
          item.settle = 0;
        }
      }
      //remove invc from item.invcs if item.checked is false
      if (!item.checked) {
        const index = item.invcs.findIndex(
          (p) => p.payRequestDtlId === payRequestDtlId
        );
        if (index !== -1) {
          item.invcs.splice(index, 1);
        }
      } else {
        //add invc to item.invcs if item.checked is true
        const invc = item.invcs.find(
          (p) => p.payRequestDtlId === payRequestDtlId
        );
        if (invc) {
          invc.settle = item.settle;
        } else {
          item.settle>0 && item.invcs.push({
            payRequestDtlId: payRequestDtlId,
            settle: item.settle,
            paymentRow: item.invcs.length + 1,
            id: item.id,
            dcrmntPrcnt: 0,
            dcrmnt: 0,
          });
        }
      }
    });
    console.log(newData, "newData in handleCheckClick");
    //console.log(newData, "newData in handleCheckClick");
    //setOriginalInvoices(newData);
    setData(newData);
    setInvoicesWithChecks(newData);
  };

  const handleConfirm = () => {
    //isConfirmRef.current = true;
    setShowInvoices(false);
  };

  return (
    <div>
      <TTable
        columns={columns}
        data={data}
        fontSize="14px"
        changeRowSelectColor={true}
        //changeRowValues={changeRowValues}
      />
      <PayRequestInvoiceSumRow data={data} columns={columns} />
      <div className="flex items-center justify-end gap-2 mt-2">
        <Input
          label="مبلغ پرداختی:"
          value={convertToFarsiDigits(formatNumberWithCommas(pay))}
          variant="outlined"
          disabled={true}
        />
        <Button text="تایید" onClick={handleConfirm} />
      </div>
    </div>
  );
};

export default PayRequestInvoices;
