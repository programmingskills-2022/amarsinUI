//کارشناس بازرگانی=>تایید اطلاعات چک دریافتی
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  InvoiceOutStandingResponse,
  InvoiceOutstandingWithIndex,
  PaymentInvoice,
  PaymentInvoicesSaveRequest,
  PaymentInvoicesSaveResponse,
  SettlementAveragesResponse,
} from "../../types/paymentInvoice";
import TTable, { EditableInput } from "../controls/TTable";

import {
  addPersianDays,
  convertToFarsiDigits,
  convertToLatinDigits,
  convertToPersianDate,
  currencyStringToNumber,
  formatNumberWithCommas,
} from "../../utilities/general";
import PaymentInvoiceShowFooter from "./PaymentInvoiceShowFooter";
import { TableColumns } from "../../types/general";
import { colors } from "../../utilities/color";
import ModalMessage from "../layout/ModalMessage";
import ConfirmCard from "../layout/ConfirmCard";
import Skeleton from "../layout/Skeleton";
import PaymentInvoiceShowTableFooter from "./PaymentInvoiceShowTableFooter";

type Props = {
  isEqualSum: boolean;
  setIsEqualSum: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceOutStandingResponse: InvoiceOutStandingResponse;
  isLoading: boolean;
  canEditForm: boolean;
  usrId: number;
  paymentId: number;
  paymentInvoicesSave: (
    request: PaymentInvoicesSaveRequest
  ) => Promise<PaymentInvoicesSaveResponse>;
  isLoadingPaymentInvoicesSave: boolean;
  paymentInvoicesSaveResponse: PaymentInvoicesSaveResponse | undefined;
  settlementAveragesResponse: SettlementAveragesResponse;
};

const PaymentInvoiceShowTable = ({
  isEqualSum,
  setIsEqualSum,
  invoiceOutStandingResponse,
  isLoading,
  canEditForm,
  usrId,
  paymentId,
  paymentInvoicesSave,
  isLoadingPaymentInvoicesSave,
  paymentInvoicesSaveResponse,
  settlementAveragesResponse,
}: Props) => {
  // Use ref to always get the latest value
  const latestInvoiceDataRef = useRef(invoiceOutStandingResponse.data);
  latestInvoiceDataRef.current = invoiceOutStandingResponse.data;
  const columns: TableColumns = React.useMemo(
    () => [
      {
        Header: " ",
        width: "64%",
        columns: [
          {
            Header: "ردیف",
            accessor: "index",
            width: "3%",
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "نوع",
            accessor: "sanadKindT",
            width: "5%",
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "ش. فاکتور",
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
            width: "8%",
            Cell: ({ value }: any) => convertToFarsiDigits(value),
          },
          {
            Header: "مبلغ",
            accessor: "fact",
            width: "7%",
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
          {
            Header: "اضافات",
            accessor: "pls",
            width: "5%",
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
          {
            Header: "کسورات",
            accessor: "mns",
            width: "5%",
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
          {
            Header: "ارزش افزوده",
            accessor: "valueTax",
            width: "8%",
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
          {
            Header: "جمع",
            accessor: "total",
            width: "8%",
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
        ],
      },

      {
        Header: "تخفیف نقدی",
        width: "10%",
        columns: [
          {
            Header: "درصد",
            accessor: "pdPrcnt",
            width: "3%",
            type: "inputText",
            Cell: EditableInput,
          },
          {
            Header: "مبلغ",
            accessor: "pd",
            width: "7%",
            type: "inputText",
            isCurrency: true,
            Cell: EditableInput,
          },
        ],
      },
      {
        Header: "سایر",
        width: "10%",
        columns: [
          {
            Header: "تخفیف",
            accessor: "dcrmnt",
            width: "5%",
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
          {
            Header: "پرداختی",
            accessor: "otherPay",
            width: "5%",
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
        ],
      },
      {
        Header: " ",
        width: "14%",
        columns: [
          {
            Header: "مانده",
            accessor: "rem",
            width: "7%",
            isBold: true,
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
          {
            Header: "تسویه",
            accessor: "amnt",
            width: "7%",
            isBold: true,
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
          {
            Header: " ",
            accessor: "check",
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
        ],
      },
    ],
    []
  );

  const [data, setData] = useState<InvoiceOutstandingWithIndex[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in paymentInvoiceShowTable table
  // Utility function to calculate total allocated amount
  const calculateTotalAllocated = useCallback(
    (dataArray: InvoiceOutstandingWithIndex[]) => {
      return dataArray.reduce(
        (sum, row) => sum + (row.check ? row.amnt : 0),
        0
      );
    },
    []
  );

  // Debug effect to log total allocated amount
  useEffect(() => {
    const totalAllocated = calculateTotalAllocated(data);
    if (totalAllocated === (latestInvoiceDataRef.current?.rem ?? 0)) {
      setIsEqualSum(true);
    } else {
      setIsEqualSum(false);
    }
    /*console.log(
      `Total allocated: ${totalAllocated}, Total remaining: ${
        latestInvoiceDataRef.current?.rem ?? 0
      }`
    );*/
  }, [data, calculateTotalAllocated, latestInvoiceDataRef.current?.rem ?? 0]);

  ////////////////////////////////////////////////////
  const handleCheckClick = useCallback(
    (value: boolean, rowValues: any) => {
      console.log(value, "value");
      setData((old) => {
        // Calculate current total allocated amount
        const currentTotalAllocated = old.reduce((sum, row) => {
          return (
            sum +
            currencyStringToNumber(convertToLatinDigits(row.amnt.toString()))
          );
        }, 0);

        //console.log(currentTotalAllocated, "currentTotalAllocated");
        // Calculate remaining amount to allocate
        const totalRemaining = latestInvoiceDataRef.current?.rem ?? 0;
        const availableToAllocate = totalRemaining - currentTotalAllocated;

        return old.map((row) => {
          if (row.index === rowValues.index) {
            let newAmnt = 0;

            if (!row.check) {
              // Unchecking: allocate amount to this row
              if (availableToAllocate >= row.rem) {
                newAmnt = row.rem;
              } else if (availableToAllocate > 0) {
                newAmnt = availableToAllocate;
              }
            }
            // If checking (unchecking the checkbox), amnt becomes 0

            return {
              ...row,
              amnt: newAmnt,
              check: !row.check,
            };
          }
          return row;
        });
      });
    },
    [invoiceOutStandingResponse.data]
  );
  ////////////////////////////////////////////////////
  useEffect(() => {
    if (invoiceOutStandingResponse.data.invoiceOutstandings) {
      let i = 1;
      let initialData = invoiceOutStandingResponse.data.invoiceOutstandings.map(
        (dtl) => ({
          ...dtl,
          check: dtl.settlement > 0 ? true : false, //dtl.checked,
          amnt: dtl.settlement,
          index: i++,
        })
      );
      setData(initialData);
    }
  }, [invoiceOutStandingResponse]);
  /////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    const currentRow = data[rowIndex];
    if (!currentRow) return;
    let val="";
    if (columnId==="pd")
      val=currencyStringToNumber(convertToLatinDigits(value)).toString()
    else 
      val=value;
    (currentRow as any)[columnId] = val;
    /*setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );*/
  };
  /////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any, columnId: string): string | null => {
    const colsInfo = row.cells;
    const isEqualRemAmnt =
      Number(convertToLatinDigits(colsInfo?.[14]?.value ?? 0)) ===
      Number(convertToLatinDigits(colsInfo?.[15]?.value ?? 0));
    if (
      row.original.check &&
      (columnId === "rem" || columnId === "amnt") &&
      isEqualRemAmnt
    ) {
      return colors.green150;
    } else if (
      row.original.check &&
      Number(convertToLatinDigits(colsInfo?.[15]?.value ?? 0)) > 0 &&
      (columnId === "rem" || columnId === "amnt")
    ) {
      return colors.green50;
    }
    return null;
  };
  ////////////////////////////////////////////////////////
  const changeRowValues = useCallback(
    (value: string, rowIndex: number, columnId: string) => {
      console.log(value, "value");
      if (value === "") {
        value = "0";
      }
      if (columnId === "pdPrcnt") {
        setData((old) => {
          // Calculate current total allocated amount excluding the current row
          const currentTotalAllocated = old.reduce((sum, row, index) => {
            if (index !== rowIndex) {
              return sum + (row.check ? row.amnt : 0);
            }
            return sum;
          }, 0);

          // Calculate remaining amount to allocate
          const totalRemaining = invoiceOutStandingResponse.data?.rem ?? 0;
          const availableToAllocate = totalRemaining - currentTotalAllocated;

          return old.map((row, index) => {
            if (index === rowIndex) {
              const pdValue = Math.round(
                (currencyStringToNumber(
                  convertToLatinDigits(value ? value : "0")
                ) *
                  row.total) /
                  100
              );
              const remValue = row.total - pdValue;

              // Calculate new amnt based on available amount
              let newAmnt = 0;
              if (row.check) {
                if (availableToAllocate >= remValue) {
                  newAmnt = remValue;
                } else if (availableToAllocate > 0) {
                  newAmnt = availableToAllocate;
                }
              }

              return {
                ...old[rowIndex],
                [columnId]: currencyStringToNumber(
                  convertToLatinDigits(value ? value : "0")
                ),
                pd: pdValue,
                rem: remValue,
                amnt: newAmnt,
              };
            }
            return row;
          });
        });
      } else if (columnId === "pd") {
        setData((old) => {
          // Calculate current total allocated amount excluding the current row
          const currentTotalAllocated = old.reduce((sum, row, index) => {
            if (index !== rowIndex) {
              return sum + (row.check ? row.amnt : 0);
            }
            return sum;
          }, 0);

          // Calculate remaining amount to allocate
          const totalRemaining = invoiceOutStandingResponse.data?.rem ?? 0;
          const availableToAllocate = totalRemaining - currentTotalAllocated;

          return old.map((row, index) => {
            if (index === rowIndex) {
              const remValue =
                row.total - currencyStringToNumber(convertToLatinDigits(value));

              // Calculate new amnt based on available amount
              let newAmnt = 0;
              if (row.check) {
                if (availableToAllocate >= remValue) {
                  newAmnt = remValue;
                } else if (availableToAllocate > 0) {
                  newAmnt = availableToAllocate;
                }
              }

              return {
                ...old[rowIndex],
                [columnId]: currencyStringToNumber(convertToLatinDigits(value)),
                rem: remValue,
                amnt: newAmnt,
              };
            }
            return row;
          });
        });
      }
    },
    [invoiceOutStandingResponse.data?.rem]
  );

  ////////////////////////////////////////////////////////
  const handleSubmitSave = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ): Promise<any> => {
    if (e) e.preventDefault();
    let request: PaymentInvoicesSaveRequest;
    const dtls: PaymentInvoice[] = [];
    data.map((item) => {
      if (item.check) {
        const dtl: PaymentInvoice = {
          id: item.id,
          psId: item.psId,
          value: convertToLatinDigits(item.amnt.toString()),
          prcnt: currencyStringToNumber(
            convertToLatinDigits(item.pdPrcnt.toString())
          ),
          dscnt: currencyStringToNumber(
            convertToLatinDigits(item.pd.toString())
          ),
        };
        dtls.push(dtl);
      }
    });

    request = {
      usrId: usrId,
      paymentId: paymentId,
      paymentInvoices: dtls,
    };
    console.log(request);
    try {
      const response = await paymentInvoicesSave(request);
      console.log(response,"response")
      setIsModalOpen(true);
      return response;
      //console.log("response");
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
  /////////////////////////////////////////////////////
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalOpen) {
      timeoutId = setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpen]);
  /////////////////////////////////////////////////////
  const calculateMonthlyAvg = useCallback(() => {
    const checkedData = data.filter((row) => row.check);
    if (checkedData.length === 0) {
      return 0;
    }
    //find maxdate and mindate
    const maxDate = Math.max(
      ...checkedData.map((row) => new Date(row.dat).getTime())
    );
    const minDate = Math.min(
      ...checkedData.map((row) => new Date(row.dat).getTime())
    );
    const diffDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
    const diffMonths = diffDays <= 30 ? 1 : diffDays / 30;
    const sumTotal = checkedData.reduce((sum, row) => {
      return (
        sum + currencyStringToNumber(convertToLatinDigits(row.total.toString()))
      );
    }, 0);
    //setMonthlyAvg(diffMonths > 0 ? Math.round(sumTotal / diffMonths) : 0);
    //setMonthlyAvg(diffMonths > 0 ? Math.round(sumTotal / diffMonths) : 0);
    return diffMonths > 0 ? Math.round(sumTotal / diffMonths) : 0;
  }, [data]);

  /////////////////////////////////////////////////////
  const getAllowedDaysForAverage = () => {
    const monthlyAvg = calculateMonthlyAvg();
    //console.log(monthlyAvg, "monthlyAvg");
    const allowedDays = settlementAveragesResponse.data.result.find(
      (item) => item.minSum < monthlyAvg && item.maxSum > monthlyAvg
    );
    return allowedDays?.days ?? 0;
  };
  /////////////////////////////////////////////////////
  const calculateTotalGraceDays = useCallback(() => {
    const checkedData = data.filter((row) => row.check);
    if (checkedData.length === 0) {
      return 0;
    }
    let total = 0;
    let invoiceTotalSum = 0;
    checkedData.forEach((row) => {
      invoiceTotalSum += currencyStringToNumber(
        convertToLatinDigits(row.total.toString())
      );
      total +=
        row.rgd *
        currencyStringToNumber(convertToLatinDigits(row.total.toString()));
    });
    return invoiceTotalSum > 0 ? Math.round(total / invoiceTotalSum) : 0;
  }, [data]);
  /////////////////////////////////////////////////////
  const calculateMaxDueDate = useCallback(() => {
    if (data.filter((row) => row.check).length === 0) {
      return "";
    }
    const allowedDays = getAllowedDaysForAverage();
    let totalGraceDays = calculateTotalGraceDays();
    //finding last invoice
    //console.log(allowedDays, totalGraceDays, "allowedDays and totalGraceDays");
    let today = convertToPersianDate(new Date());
    let maxDueDate = addPersianDays(today, allowedDays + totalGraceDays);
    return maxDueDate;
  }, [data]);
  /////////////////////////////////////////////////////
  if (isLoadingPaymentInvoicesSave) {
    return <div className="text-center">{<Skeleton />}</div>;
  }
  return (
    <>
      {isLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : invoiceOutStandingResponse.meta.errorCode > 0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {invoiceOutStandingResponse.meta.message}
        </p>
      ) : (
        <div className="w-full mt-2">
          <TTable
            canEditForm={canEditForm}
            columns={columns}
            data={data}
            updateMyData={updateMyData}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            wordWrap={true}
            CellColorChange={handleCellColorChange}
            changeRowValues={changeRowValues}
            showToolTip={true}
          />
        </div>
      )}
      <PaymentInvoiceShowFooter data={data} isEqualSum={isEqualSum} />
      <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md">
        <PaymentInvoiceShowTableFooter
          isLoadingPaymentInvoicesSave={isLoadingPaymentInvoicesSave}
          handleSubmitSave={handleSubmitSave}
          monthlyAvg={calculateMonthlyAvg()}
          maxDueDate={calculateMaxDueDate()}
          canEditForm={canEditForm}
        />
      </ConfirmCard>
      <ModalMessage
        isOpen={isModalOpen}
        backgroundColor="bg-green-200"
        bgColorButton="bg-green-500"
        bgColorButtonHover="bg-green-600"
        color="text-white"
        onClose={() => setIsModalOpen(false)}
        message={paymentInvoicesSaveResponse?.meta?.message ?? ""}
        visibleButton={false}
      />
    </>
  );
};

export default PaymentInvoiceShowTable;
