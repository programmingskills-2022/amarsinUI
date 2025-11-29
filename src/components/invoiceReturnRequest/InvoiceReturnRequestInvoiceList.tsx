import React, { useEffect, useState } from "react";
import { colors } from "../../utilities/color";
import TTable, { EditableInput } from "../controls/TTable";
import {
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

type Props = {
  invoiceReturnRequestInvoiceListResponse: InvoiceReturnRequestInvoiceListResponse;
  isLoadingInvoiceReturnRequestInvoiceList: boolean;
  invoiceReturnRequestRegisterDtl: (
    request: InvoiceReturnRequestRegisterDtlRequest[]
  ) => Promise<any>;
  handleEditClickClose: (editClicked: boolean) => void;
};

const InvoiceReturnRequestInvoiceList = ({
  invoiceReturnRequestInvoiceListResponse,
  isLoadingInvoiceReturnRequestInvoiceList,
  invoiceReturnRequestRegisterDtl,
  handleEditClickClose,
}: Props) => {
  const { setField, invoiceListId } = useInvoiceReturnRequestStore();
  const [data, setData] = useState<any[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in invoiceReturnRequestInvoiceList table
  const [error, setError] = useState<string>("");
  const columns = React.useMemo(
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
        columns: [
          {
            Header: "تعداد",
            accessor: "rCnt",
            width: "5%",
          },
          {
            Header: "آفر",
            accessor: "rOffer",
            width: "5%",
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
          },
          {
            Header: "مبلغ",
            accessor: "cost",
            width: "10%",
          },
          {
            Header: "مانده",
            accessor: "remainCnt",
            width: "10%",
          },
          {
            Header: "تعداد",
            accessor: "regedCnt",
            width: "10%",
            backgroundColor: colors.indigo50, //green[50]
            Cell: EditableInput,
          },
          {
            Header: "آفر",
            accessor: "regedOffer",
            width: "10%",
            backgroundColor: colors.indigo50, //green[50]
            Cell: EditableInput,
          },
        ],
      },
    ],
    []
  );
  useEffect(() => {
    const tempData =
      invoiceReturnRequestInvoiceListResponse.data.result.invoiceReturnRequestInvoiceDtls.map(
        (item, index) => {
          const cup =
            invoiceReturnRequestInvoiceListResponse.data.result.invoiceReturnRequestInvoiceDtlCups.find(
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
            invoiceDtlId: item.invoiceDtlId,
            //cup data
            cupCode: convertToFarsiDigits(cup?.cupCode ?? ""),
            cost: convertToFarsiDigits(cup?.cost ?? 0),
            iocId: cup?.iocId ?? 0,
            remainCnt: convertToFarsiDigits(cup?.rCnt ?? 0),
            regedCnt: convertToFarsiDigits(0),
            regedOffer: convertToFarsiDigits(0),
          };
        }
      );
    setData(tempData);
  }, [invoiceReturnRequestInvoiceListResponse]);
  ///////////////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
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

    let hasError = false;
    //let sumCntFactor = 0;
    //let sumCntReg = 0;
    //let sumOfferFactor = 0;
    //let sumOfferReg = 0;
    const request: InvoiceReturnRequestRegisterDtlRequest[] = data.map(
      (item) => {
        if (
          Number(convertToLatinDigits(item.regedCnt)) >
          Number(convertToLatinDigits(item.cnt))
        ) {
          hasError = true;
        }
        //sumCntFactor += Number(convertToLatinDigits(item.cnt));
        //sumCntReg += Number(convertToLatinDigits(item.regedCnt));
        //sumOfferFactor += Number(convertToLatinDigits(item.offer));
        //sumOfferReg += Number(convertToLatinDigits(item.regedOffer));
        return {
          invoiceDtlId: item.invoiceDtlId,
          iocId: item.iocId,
          cnt: Number(convertToLatinDigits(item.regedCnt)),
          offer: Number(convertToLatinDigits(item.regedOffer)),
        };
      }
    );

    try {
      if (hasError) {
        setError("تعداد ثبت شده از مانده تعداد قلم فاکتور بیشتر است!");
        return;
      } else {
        console.log(invoiceListId, "invoiceListId");
        setField("invoiceReturnRequestDtlId", invoiceListId);
        const response = await invoiceReturnRequestRegisterDtl(request);
        console.log(response, "response in handleSubmit");
        if (response.meta.errorCode > 0) {
          setError(convertToFarsiDigits(response.meta.message ?? ""));
          return;
        }
        handleEditClickClose(false);
      }
    } catch (error) {
      console.log(error, "error in handleSubmit");
      handleEditClickClose(false);
    }
  };
  ///////////////////////////////////////////////////////////////
  const handleCellColorChange = (row: any) => {
    if (
      Number(convertToLatinDigits(row.original.regedCnt)) >
      Number(convertToLatinDigits(row.original.cnt))
    ) {
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
