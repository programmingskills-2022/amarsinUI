import { TableColumns } from "../../types/general";
import {
  convertToFarsiDigits,
  formatNumberWithCommas,
} from "../../utilities/general";
import TTable from "../controls/TTable";
import Input from "../controls/Input";
import {
  PayRequestDtlAddInvoiceRequest,
  PayRequestDtlAddRemoveInvoiceResponse,
  PayRequestDtlRemoveInvoiceRequest,
  PayRequestInvoiceIncludeChecks,
  PayRequestInvoicesTable,
} from "../../types/payRequest";
import PayRequestInvoiceSumRow from "./PayRequestInvoiceSumRow";
import { useEffect, useState } from "react";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import ModalMessage from "../layout/ModalMessage";

type Props = {
  canEditForm1Dtl2: boolean;
  setInvoicesWithChecks: (data: PayRequestInvoiceIncludeChecks[]) => void;
  payRequestDtlId: number; //which payRequestDtlId is checked
  data: PayRequestInvoiceIncludeChecks[];
  pay: number;
  newPay: number;
  payRequestDtlIndex: number;
  isNew: boolean;
  tempData: PayRequestInvoiceIncludeChecks[];
  setTempData: (data: PayRequestInvoiceIncludeChecks[]) => void;
  payRequestDtlRemoveInvoice: UseMutateAsyncFunction<
    any,
    Error,
    PayRequestDtlRemoveInvoiceRequest,
    unknown
  >;
  payRequestDtlRemoveInvoiceResponse: PayRequestDtlAddRemoveInvoiceResponse;
  payRequestDtlAddInvoice: UseMutateAsyncFunction<
    any,
    Error,
    PayRequestDtlAddInvoiceRequest,
    unknown
  >;
  payRequestDtlAddInvoiceResponse: PayRequestDtlAddRemoveInvoiceResponse;
  fromWorkFlow: boolean;
};

const PayRequestInvoices = ({
  canEditForm1Dtl2,
  setInvoicesWithChecks,
  payRequestDtlId,
  data,
  pay,
  newPay,
  payRequestDtlIndex,
  isNew,
  tempData,
  setTempData,
  payRequestDtlRemoveInvoice,
  payRequestDtlRemoveInvoiceResponse,
  payRequestDtlAddInvoice,
  payRequestDtlAddInvoiceResponse,
  fromWorkFlow,
}: Props) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [isRemoveInvoiceOpen, setIsRemoveInvoiceOpen] = useState(false);
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
      Header: "تسویه (سایر)",
      accessor: "payed",
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
            disabled={!canEditForm1Dtl2}
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
   if (Number(row.rem)<0 && !value) return
    let request:
      | PayRequestDtlRemoveInvoiceRequest
      | PayRequestDtlAddInvoiceRequest;
    let settlementValue = 0;
    if (value) {
      request = {
        payRequestDtlId: payRequestDtlId,
        invoiceId: row.id,
      };
      console.log(request, "request in remove handleCheckClick ");
      if (fromWorkFlow) {
        payRequestDtlRemoveInvoice(request);
        setIsRemoveInvoiceOpen(true);
      }
    }
    const newData = [...tempData]; //[...data];
    let payValueTemp = payValue;
    newData.map((item) => {
      console.log(item, "item in handleCheckClick");
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
            (p) => p.paymentRow === payRequestDtlIndex,
          );
        } else {
          index = item.invcs.findIndex(
            (p) => p.payRequestDtlId === payRequestDtlId,
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
            (p) => p.paymentRow === payRequestDtlIndex,
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
            (p) => p.payRequestDtlId === payRequestDtlId,
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
    console.log(payValueTemp, "payValueTemp in handleCheckClick");
    settlementValue = newData.find((p) => p.id === row.id)?.settle ?? 0;
    console.log(settlementValue, "settlementValue in handleCheckClick");
    if (!value && settlementValue > 0 && fromWorkFlow) {
      request = {
        payRequestDtlId: payRequestDtlId,
        invoiceId: row.id,
        settlement: settlementValue,
      };
      console.log(request, "request in add handleCheckClick ");
      payRequestDtlAddInvoice(request);
      setIsAddInvoiceOpen(true);
    }
  };

  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isAddInvoiceOpen) {
      timeoutId = setTimeout(() => {
        setIsAddInvoiceOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAddInvoiceOpen]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isRemoveInvoiceOpen) {
      timeoutId = setTimeout(() => {
        setIsRemoveInvoiceOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isRemoveInvoiceOpen]);
  ////////////////////////////////////////////////////////
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

      <ModalMessage
        isOpen={isAddInvoiceOpen}
        onClose={() => setIsAddInvoiceOpen(false)}
        backgroundColor={
          payRequestDtlAddInvoiceResponse?.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          payRequestDtlAddInvoiceResponse?.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={payRequestDtlAddInvoiceResponse.meta.message ?? ""}
        visibleButton={false}
      />

      <ModalMessage
        isOpen={isRemoveInvoiceOpen}
        onClose={() => setIsRemoveInvoiceOpen(false)}
        backgroundColor={
          payRequestDtlRemoveInvoiceResponse?.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          payRequestDtlRemoveInvoiceResponse?.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={payRequestDtlRemoveInvoiceResponse.meta.message ?? ""}
        visibleButton={false}
      />
    </div>
  );
};

export default PayRequestInvoices;
