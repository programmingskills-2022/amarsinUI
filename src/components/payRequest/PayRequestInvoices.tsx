import { TableColumns } from "../../types/general";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import TTable from "../controls/TTable";
import Input from "../controls/Input";
import {
  PayRequestInvoiceIncludeChecks,
  PayRequestInvoicesTable,
} from "../../types/payRequest";
import PayRequestInvoiceSumRow from "./PayRequestInvoiceSumRow";
import { useEffect, useState } from "react";

type Props = {
  setInvoicesWithChecks: (data: PayRequestInvoiceIncludeChecks[]) => void;
  payRequestDtlId: number; //which payRequestDtlId is checked
  data: PayRequestInvoiceIncludeChecks[];
  pay: number;
  newPay: number;
  payRequestDtlIndex: number;
  isNew: boolean;
  tempData: PayRequestInvoiceIncludeChecks[];
  setTempData: (data: PayRequestInvoiceIncludeChecks[]) => void;
};

const PayRequestInvoices = ({
  setInvoicesWithChecks,
  payRequestDtlId,
  data,
  pay,
  newPay,
  payRequestDtlIndex,
  isNew,
  tempData,
  setTempData,
}:
Props) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index
  /*const [tempData, setTempData] = useState<PayRequestInvoiceIncludeChecks[]>(
    []
  );*/
  const [payValue, setPayValue] = useState(0);
  // in payRequestInvoices table
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
        <button
          className="flex justify-evenly items-center w-full"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleCheckClick(value, row.original);
          }}
        >
          <input
            className="cursor-pointer"
            type="checkbox"
            checked={value}
            readOnly
          />
        </button>
      ),
    },
  ];

  ///////////////////////////////////////////////////////////////
  //keep data in tempData
  useEffect(() => {
    setTempData(data);
  }, [data]);

  useEffect(() => {
    let paySum = 0;
    tempData.map((item) => {
      item.invcs.map((invc) => {
        if (isNew) {
          if (invc.paymentRow === payRequestDtlIndex) {
            paySum = paySum + invc.settle;
          }
        } else {
          if (invc.payRequestDtlId === payRequestDtlId) {
            paySum = paySum + invc.settle;
          }
        }
      });
    });
    if (paySum === pay) {
      setPayValue(0); // give initial value to newPay
    } else {
      setPayValue(newPay);
    }
  }, [newPay]);

  const handleCheckClick = (value: boolean, row: PayRequestInvoicesTable) => {
    // Handle checkbox click logic here
    console.log("Checkbox clicked:", value, row);
    const newData = [...tempData]; //[...data];
    let payValueTemp = payValue;
    newData.map((item) => {
      if (item.id === row.id) {
        item.checked = !item.checked;
        if (item.checked) {
          if (payValueTemp > item.rem) {
            payValueTemp = payValueTemp - item.rem;
            item.settle = item.rem;
          } else {
            item.settle = payValueTemp;
            payValueTemp = 0;
          }
        } else {
          payValueTemp = payValueTemp + item.settle;
          item.settle = 0;
        }
      }
      //remove invc from item.invcs if item.checked is false
      if (!item.checked) {
        let index = 0;
        if (isNew) {
          index = item.invcs.findIndex(
            (p) => p.paymentRow === payRequestDtlIndex
          );
        } else {
          index = item.invcs.findIndex(
            (p) => p.payRequestDtlId === payRequestDtlId
          );
        }

        if (index !== -1) {
          item.invcs.splice(index, 1);
        }
      } else {
        //add invc to item.invcs if item.checked is true
        if (isNew) {
          //if new payRequestDtl
          const invc = item.invcs.find(
            (p) => p.paymentRow === payRequestDtlIndex
          );
          if (invc) {
            invc.settle = item.settle;
          } else {
            item.settle > 0 &&
              item.invcs.push({
                payRequestDtlId: payRequestDtlId,
                settle: item.settle,
                paymentRow: payRequestDtlIndex,
                id: item.id,
                dcrmntPrcnt: 0,
                dcrmnt: 0,
              });
          }
        }
        //is not new
        else {
          const invc = item.invcs.find(
            (p) => p.payRequestDtlId === payRequestDtlId
          );
          if (invc) {
            invc.settle = item.settle;
          } else {
            item.settle > 0 &&
              item.invcs.push({
                payRequestDtlId: payRequestDtlId,
                settle: item.settle,
                paymentRow: item.invcs.length + 1,
                id: item.id,
                dcrmntPrcnt: 0,
                dcrmnt: 0,
              });
          }
        }
      }
    });
    setTempData(newData); //setData(newData);
    setInvoicesWithChecks(newData);
    setPayValue(payValueTemp);
  };

  return (
    <div>
      <TTable
        columns={columns}
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}
        data={tempData} //data
        fontSize="14px"
        changeRowSelectColor={true}
      />
      <PayRequestInvoiceSumRow data={tempData} columns={columns} />
      {/*data*/}
      <div className="flex items-center justify-end gap-2 mt-2">
        <Input
          label="مبلغ پرداختی:"
          value={convertToFarsiDigits(formatNumberWithCommas(pay))}
          variant="outlined"
          disabled={true}
        />
        {/*<Button text="تایید" onClick={handleConfirm} />*/}
      </div>
    </div>
  );
};

export default PayRequestInvoices;
