import React, { useEffect, useState } from "react";
import { colors } from "../../utilities/color";
import TTable from "../controls/TTable";
import {
  InvoiceReturnRequestDtl,
  InvoiceReturnRequestInvoiceListResponse,
  InvoiceReturnRequestRegisterDtlRequest,
} from "../../types/invoiceReturnRequest";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import { useInvoiceReturnRequestStore } from "../../store/invoiceReturnRequestStore";
import Skeleton from "../layout/Skeleton";
import { TableColumns } from "../../types/general";

type Props = {
  invoiceReturnRequestDtls: InvoiceReturnRequestDtl[];
  invoiceReturnRequestInvoiceListResponse: InvoiceReturnRequestInvoiceListResponse;
  isLoadingInvoiceReturnRequestInvoiceList: boolean;
  invoiceReturnRequestRegisterDtl: (
    request: InvoiceReturnRequestRegisterDtlRequest[]
  ) => Promise<any>;
  handleEditClickClose: (editClicked: boolean) => void;
};

const InvoiceReturnRequestInvoiceList = ({
  invoiceReturnRequestDtls,
  invoiceReturnRequestInvoiceListResponse,
  isLoadingInvoiceReturnRequestInvoiceList,
  invoiceReturnRequestRegisterDtl,
  handleEditClickClose,
}: Props) => {
  const { setField, invoiceListId } = useInvoiceReturnRequestStore();
  const [data, setData] = useState<any[]>([]);
  const [cnt, setCnt] = useState<number>(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in invoiceReturnRequestInvoiceList table
  const [error, setError] = useState<string>("");

  //get cnt from invoiceReturnRequestShowResponse
  useEffect(() => {
    const cntTemp = invoiceReturnRequestDtls.find((item) => item.id === invoiceListId)?.cnt;
    if (cntTemp) {
      setCnt(cntTemp);
    }
  }, [invoiceReturnRequestDtls]);
  // Validate data whenever it changes and update error message
  useEffect(() => {
    // Check if any cup's regedCnt exceeds its remaining count (rCnt)
    const hasValidationError1 = data.some((item) => {
      const cupsArray = item.cupsArray || [];
      const regedCntArray = item.regedCntArray || [];
      
      return cupsArray.some((cup: any, index: number) => {
        const regedCnt = Number(convertToLatinDigits(regedCntArray[index] || "0"));
        const itemrCnt = Number(convertToLatinDigits(cup.rCnt));
        //console.log(regedCnt, itemrCnt,"regedCnt, itemrCnt for hasValidationError1")
        return regedCnt > itemrCnt;
      });
    });
    const hasValidationError2 = data.some((item) => {
      const regedCntArray = item.regedCntArray || [];
      const regedCntSum = regedCntArray.reduce((acc: number, regedCnt: string) => {
        return acc + Number(convertToLatinDigits(regedCnt));
      }, 0);
      //console.log(regedCntSum, cnt,"regedCntSum, cnt for hasValidationError2")
      return regedCntSum > cnt;
    });
    if (hasValidationError1) {
      setError("تعداد ثبت شده، از مانده قفسه بیشتر است!");
    } else if (hasValidationError2) {
      setError("تعداد ثبت شده، از مانده تعداد قلم فاکتور بیشتر است!!");
    } else {
      setError("");
    }
  }, [data]);
  // Define update functions before columns to use in Cell renderers
  const updateMyDataForColumns = (rowIndex: number, columnId: string, value: string | string[]) => {
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

  const changeRowValuesForColumns = (
    value: string,
    rowIndex: number,
    columnId: string
  ) => {
    updateMyDataForColumns(rowIndex, columnId, value);
  };

  const columns:TableColumns = React.useMemo(
    () => [
      {
        Header: "اطلاعات فاکتور",
        width: "35%",
        columns: [
          {
            Header: "ردیف",
            accessor: "index",
            width: "3%",
          },
          {
            Header: "شماره فاکتور",
            accessor: "factorNo",
            width: "16%",
          },
          {
            Header: "تعداد",
            accessor: "cnt",
            width: "8%",
          },
          {
            Header: "آفر",
            accessor: "offer",
            width: "8%",
          },
        ],
      },
      {
        Header: "مانده",
        width: "10%",
        backgroundColor: colors.red50,
        columns: [
          {
            Header: "تعداد",
            accessor: "rCnt",
            width: "5%",
            backgroundColor: colors.red50,
          },
          {
            Header: "آفر",
            accessor: "rOffer",
            width: "5%",
            backgroundColor: colors.red50,
          },
        ],
      },
      {
        Header: "ثبت",
        width: "55%",
        backgroundColor: colors.indigo50, //indigo[50]
        columns: [
          {
            Header: "قفسه",
            accessor: "cupCode",
            width: "15%",
            Cell: ({ row }: any) => {
              const cupsArray = row.original.cupsArray || [];
              return (
                <div className="flex flex-col w-full">
                  {cupsArray.map((cup: any, index: number) => (
                    <div
                      key={index}
                      className={`text-center py-1 ${index < cupsArray.length - 1 ? "border-b border-gray-300" : ""}`}
                    >
                      {convertToFarsiDigits(cup.cupCode)}
                    </div>
                  ))}
                </div>
              );
            },
          },
          {
            Header: "مبلغ",
            accessor: "cost",
            width: "10%",
            Cell: ({ row }: any) => {
              const cupsArray = row.original.cupsArray || [];
              return (
                <div className="flex flex-col w-full">
                  {cupsArray.map((cup: any, index: number) => (
                    <div
                      key={index}
                      className={`text-center py-1 ${index < cupsArray.length - 1 ? "border-b border-gray-300" : ""}`}
                    >
                      {convertToFarsiDigits(cup.cost)}
                    </div>
                  ))}
                </div>
              );
            },
          },
          {
            Header: "مانده",
            accessor: "remainCnt",
            width: "10%",
            Cell: ({ row }: any) => {
              const cupsArray = row.original.cupsArray || [];
              return (
                <div className="flex flex-col w-full">
                  {cupsArray.map((cup: any, index: number) => (
                    <div
                      key={index}
                      className={`text-center py-1 ${index < cupsArray.length - 1 ? "border-b border-gray-300" : ""}`}
                    >
                      {convertToFarsiDigits(cup.rCnt)}
                    </div>
                  ))}
                </div>
              );
            },
          },
          {
            Header: "تعداد",
            accessor: "regedCnt",
            width: "10%",
            backgroundColor: colors.indigo50,
            Cell: ({ row }: any) => {
              const regedCntArray = row.original.regedCntArray || [];
              
              return (
                <div className="flex flex-col w-full">
                  {regedCntArray.map((value: string, cupIndex: number) => (
                    <div
                      key={cupIndex}
                      className={`py-1 ${cupIndex < regedCntArray.length - 1 ? "border-b border-gray-300" : ""}`}
                    >
                      <input
                        type="text"
                        className="text-inherit p-0 m-0 border-0 w-full focus:outline-none text-center"
                        style={{
                          backgroundColor: colors.indigo50,
                          fontSize: "0.75rem",
                          minHeight: "20px",
                        }}
                        value={convertToFarsiDigits(value)}
                        onFocus={(e) => e.target.style.backgroundColor = "white"}
                        onBlur={(e) => e.target.style.backgroundColor = colors.indigo50}
                        onChange={(e) => {
                          const newValue = convertToLatinDigits(e.target.value);
                          const newArray = [...regedCntArray];
                          newArray[cupIndex] = newValue;
                          updateMyDataForColumns(row.index, "regedCntArray", newArray);
                          updateMyDataForColumns(
                            row.index,
                            "regedCnt",
                            newArray.map((v) => convertToFarsiDigits(v)).join("\n")
                          );
                          changeRowValuesForColumns(newArray.join("\n"), row.index, "regedCnt");
                        }}
                      />
                    </div>
                  ))}
                </div>
              );
            },
          },
          {
            Header: "آفر",
            accessor: "regedOffer",
            width: "10%",
            backgroundColor: colors.indigo50,
            Cell: ({ row }: any) => {
              const regedOfferArray = row.original.regedOfferArray || [];
              
              return (
                <div className="flex flex-col w-full">
                  {regedOfferArray.map((value: string, cupIndex: number) => (
                    <div
                      key={cupIndex}
                      className={`py-1 ${cupIndex < regedOfferArray.length - 1 ? "border-b border-gray-300" : ""}`}
                    >
                      <input
                        type="text"
                        className="text-inherit p-0 m-0 border-0 w-full focus:outline-none text-center"
                        style={{
                          backgroundColor: colors.indigo50,
                          fontSize: "0.75rem",
                          minHeight: "20px",
                        }}
                        value={convertToFarsiDigits(value)}
                        onFocus={(e) => e.target.style.backgroundColor = "white"}
                        onBlur={(e) => e.target.style.backgroundColor = colors.indigo50}
                        onChange={(e) => {
                          const newValue = convertToLatinDigits(e.target.value);
                          const newArray = [...regedOfferArray];
                          newArray[cupIndex] = newValue;
                          updateMyDataForColumns(row.index, "regedOfferArray", newArray);
                          updateMyDataForColumns(
                            row.index,
                            "regedOffer",
                            newArray.map((v) => convertToFarsiDigits(v)).join("\n")
                          );
                          changeRowValuesForColumns(newArray.join("\n"), row.index, "regedOffer");
                        }}
                      />
                    </div>
                  ))}
                </div>
              );
            },
          },
        ],
      },
    ],
    []
  );
  useEffect(() => {
    const { invoiceReturnRequestInvoiceDtls, invoiceReturnRequestInvoiceDtlCups } = 
      invoiceReturnRequestInvoiceListResponse.data.result;

    const tempData = invoiceReturnRequestInvoiceDtls.map((item, index) => {
      const cups = invoiceReturnRequestInvoiceDtlCups.filter(
        (cup) => cup.invoiceDtlId === item.invoiceDtlId
      );

      return {
        ...item,
        index: convertToFarsiDigits(index + 1),
        factorNo: convertToFarsiDigits(item.factorNo),
        cnt: convertToFarsiDigits(item.cnt),
        offer: convertToFarsiDigits(item.offer),
        rCnt: convertToFarsiDigits(item.rCnt),
        rOffer: convertToFarsiDigits(item.rOffer),
        // Cup arrays for Cell renderers and processing
        remainCntArray: cups.map((cup) => cup.rCnt),// to check the sum of remainCnt in handleSubmit
        cupsArray: cups,// to display the cups in the table
        iocIdArray: cups.map((cup) => cup.iocId),// to store the iocId of the cups
        regedCntArray: cups.map(() => "0"),// to store the regedCnt of the cups
        regedOfferArray: cups.map(() => "0"),// to store the regedOffer of the cups
      };
    });

    setData(tempData);
  }, [invoiceReturnRequestInvoiceListResponse]);
  ///////////////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string | string[]) => {
    //console.log(rowIndex, columnId, value,"rowIndex, columnId, value")
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
  ///////////////////////////////////////////////////////////////
  const changeRowValues = (
    value: string,
    rowIndex: number,
    columnId: string
  ) => {
    updateMyData(rowIndex, columnId, value);
  };
  ///////////////////////////////////////////////////////////////
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Step 1: Validate all data first
    const regedCntSum = data.reduce((acc: number, item: any) => {
      const regedCntArray = item.regedCntArray || [];
      return acc + regedCntArray.reduce((acc: number, regedCnt: string) => {
        return acc + Number(convertToLatinDigits(regedCnt));
      }, 0);
    }, 0);
    console.log(regedCntSum, cnt,"regedCntSum, cnt")
    if (regedCntSum > cnt) {
      setError("مقادیر ثبت شده، از تعداد درخواست بیشتر است!");
      return;
    }
    /*const hasError = data.some((item) => {
      const regedCntArray = item.regedCntArray || [];
      const remainCntArray = item.remainCntArray || [];
      
      const regedCntSum = regedCntArray.reduce((acc: number, regedCnt: string) => {
        return acc + Number(convertToLatinDigits(regedCnt));
      }, 0);
      const remainCntSum = remainCntArray.reduce((acc: number, remainCnt: string) => {
        return acc + Number(convertToLatinDigits(remainCnt));
      }, 0);
      const itemCntNum = Number(convertToLatinDigits(item.cnt));
      
      console.log(regedCntSum,remainCntSum,itemCntNum,"regedCntSum,remainCntSum,itemCntNum")
      if (regedCntSum  > cnt) {
        console.log("hasError in handleSubmit", regedCntSum, remainCntSum, itemCntNum);
        return true; // Found error, stop checking
      }
      return false;
    });

    console.log(hasError,"hasError in handleSubmit")
    // Step 2: If validation fails, show error and don't send request
    if (hasError) {
      setError("مقادیر ثبت شده، از تعداد درخواست بیشتر است!");
      return;
    }
    */
    // Step 2: Build request only if validation passed
    const request: InvoiceReturnRequestRegisterDtlRequest[] = [];
    data.forEach((item) => {
      const regedCntArray = item.regedCntArray || [];
      const regedOfferArray = item.regedOfferArray || [];
      const iocIdArray = item.iocIdArray || [];
     
      regedCntArray.forEach((regedCnt: string, cupIndex: number) => {
        if (iocIdArray[cupIndex] !== undefined) {
          request.push({
            invoiceDtlId: item.invoiceDtlId,
            iocId: iocIdArray[cupIndex],
            cnt: Number(convertToLatinDigits(regedCnt)),
            offer: Number(convertToLatinDigits(regedOfferArray[cupIndex] || "0")),
          });
        }
      });
    });

    try {
      console.log(request,"request")
      setField("invoiceReturnRequestDtlId", invoiceListId);
      const response = await invoiceReturnRequestRegisterDtl(request);
      console.log(response, "response in handleSubmit");
      if (response.meta.errorCode > 0) {
        setError(convertToFarsiDigits(response.meta.message ?? ""));
        return;
      }
      handleEditClickClose(false);
    } catch (error) {
      console.log(error, "error in handleSubmit");
      handleEditClickClose(false);
    }
  };
  ///////////////////////////////////////////////////////////////
  const handleCellColorChange = (row: any) => {
    const cupsArray = row.original.cupsArray || [];// برای دسترسی به مانده تعداد قلم فاکتور
    const regedCntArray = row.original.regedCntArray || [];// برای دسترسی به تعداد ثبت شده قلم فاکتور
    
    // Check if any cup's regedCnt exceeds its remaining count (rCnt)
    let hasError = cupsArray.some((cup: any, index: number) => {
      const regedCnt = Number(convertToLatinDigits(regedCntArray[index] || "0"));
      const itemrCnt = Number(convertToLatinDigits(cup.rCnt));
      return regedCnt > itemrCnt;
    });

    //check if regedCnt sum is greater than cnt
    const regedCntSum = regedCntArray.reduce((acc: number, regedCnt: string) => {
      return acc + Number(convertToLatinDigits(regedCnt));
    }, 0);
    if (regedCntSum > cnt) {
      hasError = true;
    }
    
    if (hasError) {
      return colors.red100;
    }
    return "";
  };
  ///////////////////////////////////////////////////////////////
  return (
    <>
      {isLoadingInvoiceReturnRequestInvoiceList ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : invoiceReturnRequestInvoiceListResponse.meta.errorCode > 0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {invoiceReturnRequestInvoiceListResponse.meta.message}
        </p>
      ) : (
        <div className="w-full mt-2">
          <TTable
            columns={columns}
            data={data}
            updateMyData={updateMyData}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={true}
            changeRowValues={changeRowValues}
            showToolTip={true}
            canEditForm={true}
            CellColorChange={handleCellColorChange}
          />
        </div>
      )}

      {data.length > 0 && (
        <ConfirmCard variant="rounded-md justify-end">
          <div className="flex gap-2 items-center">
            <p className="text-red-500 text-sm">{error}</p>
            <Button text="تایید" onClick={handleSubmit} />
          </div>
        </ConfirmCard>
      )}
    </>
  );
};

export default InvoiceReturnRequestInvoiceList;
