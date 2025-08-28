//کارشناس بازرگانی=>تایید اطلاعات چک دریافتی
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  InvoiceOutStandingResponse,
  InvoiceOutstandingWithIndex,
  PaymentInvoice,
  PaymentInvoicesSaveRequest,
  PaymentInvoicesSaveResponse,
} from "../../types/paymentInvoice";
import TTable, { EditableInput } from "../controls/TTable";

import {
  convertToFarsiDigits,
  convertToLatinDigits,
  currencyStringToNumber,
  formatNumberWithCommas,
} from "../../utilities/general";
import PaymentInvoiceShowFooter from "./PaymentInvoiceShowFooter";
import { TableColumns } from "../../types/general";
import { colors } from "../../utilities/color";
import Button from "../controls/Button";
import ModalMessage from "../layout/ModalMessage";
import ConfirmCard from "../layout/ConfirmCard";
import Skeleton from "../layout/Skeleton";

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
            Cell: ({ value }: any) =>
              convertToFarsiDigits(formatNumberWithCommas(value)),
          },
          {
            Header: "تسویه",
            accessor: "amnt",
            width: "7%",
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
    console.log(
      `Total allocated: ${totalAllocated}, Total remaining: ${
        latestInvoiceDataRef.current?.rem ?? 0
      }`
    );
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
            currencyStringToNumber(
              convertToLatinDigits(row.amnt.toString())
            )
          );
        }, 0);

        console.log(currentTotalAllocated, "currentTotalAllocated");
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
          check: false,
          index: i++,
        })
      );
      setData(initialData);
    }
  }, [invoiceOutStandingResponse]);
  /////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };
  /////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any, columnId: string): string | null => {
    if (row.original.check && (columnId === "rem" || columnId === "amnt")) {
      return colors.green50;
    }
    return null;
  };
  ////////////////////////////////////////////////////////
  const changeRowValues = useCallback(
    (value: string, rowIndex: number, columnId: string) => {
      console.log(value, "value");
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
    let timeoutId: number;
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
  if (isLoadingPaymentInvoicesSave) {
    return <div className="text-center">{<Skeleton />}</div>;
  }
  return (
    <>
      {isLoading ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : invoiceOutStandingResponse.meta.errorCode !== -1 ? (
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
            wordWrap={true}
            CellColorChange={handleCellColorChange}
            changeRowValues={changeRowValues}
            showToolTip={true}
          />
        </div>
      )}
      <PaymentInvoiceShowFooter data={data} isEqualSum={isEqualSum} />
      <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end ">
        {canEditForm && (
          <Button
            text={
              isLoadingPaymentInvoicesSave
                ? "در حال ثبت اطلاعات..."
                : "ثبت اطلاعات"
            }
            backgroundColor="bg-green-500"
            color="text-white"
            backgroundColorHover="bg-green-600"
            colorHover="text-white"
            variant="shadow-lg w-48"
            onClick={handleSubmitSave}
          />
        )}
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
