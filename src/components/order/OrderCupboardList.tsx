import React, {  useState } from "react";
import Button from "../controls/Button";
import ConfirmCard from "../layout/ConfirmCard";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import TTable, { EditableInput } from "../controls/TTable";
import { colors } from "../../utilities/color";
import Skeleton from "../layout/Skeleton";
import { OrderCupListResponse, OrderCupListTbl } from "../../types/order";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import OrderCupboardListMobileTable from "./OrderCupboardListMobileTable";

type Props = {
  handleOrderCupboardListClose: () => void;
  processedData: any;
  setProcessedData: any;
  orderCupListResponse: OrderCupListResponse;
  isLoadingOrderCupList: boolean;
  orderDtlId: number;
  checkSum: number;
  setBaseData: (baseData: any) => void;
  data: OrderCupListTbl[];
  /*setData: (
    data: OrderCupListTbl[] | ((prev: OrderCupListTbl[]) => OrderCupListTbl[])
  ) => void;*/
};
const OrderCupboardList = ({
  handleOrderCupboardListClose,
  processedData,
  orderDtlId,
  orderCupListResponse,
  isLoadingOrderCupList,
  setProcessedData,
  data,
  //setData,
  checkSum,
  setBaseData,
}: Props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "اطلاعات قفسه",
        width: "80%",
        columns: [
          {
            Header: "ردیف",
            accessor: "index",
            width: "5%",
          },
          {
            Header: "کد",
            accessor: "fCode",
            width: "15%",
          },
          {
            Header: "تاربخ",
            accessor: "fDate",
            width: "13%",
          },
          {
            Header: "بچ",
            accessor: "cCode",
            width: "20%",
          },
          {
            Header: "انقضاء",
            accessor: "eDate",
            width: "13%",
          },
          {
            Header: "موجودی",
            accessor: "cAmnt",
            width: "14%",
          },
        ],
      },
      {
        Header: "ثبت",
        width: "20%",
        backgroundColor: colors.indigo50, //indigo[50]
        columns: [
          {
            Header: "تعداد",
            accessor: "cnt",
            width: "10%",
            backgroundColor: colors.indigo50, //green[50]
            Cell: EditableInput,
          },
          {
            Header: "آفر",
            accessor: "oCnt",
            width: "10%",
            backgroundColor: colors.indigo50, //green[50]
            Cell: EditableInput,
          },
        ],
      },
    ],
    []
  );
  ////////////////////////////////////////////////////
  const [error, setError] = useState<string>("");
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in orderCupboardList table

  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    //console.log(rowIndex, columnId, value,"rowIndex, columnId, value")
    const currentRow = data[rowIndex];
    if (!currentRow) return;

    (currentRow as any)[columnId] = value;
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

  ////////////////////////////////////////////////////
  const changeRowValues = (
    value: string,
    rowIndex: number,
    columnId: string
  ) => {
    updateMyData(rowIndex, columnId, value);
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

  /////////////////////////////////////////////////////////
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    //const checkSum = cnt + oCnt;
    e.preventDefault();
    const sum = data.reduce((acc, item) => {
      return (
        acc +
        Number(convertToLatinDigits(String(item.cnt))) +
        Number(convertToLatinDigits(String(item.oCnt)))
      );
    }, 0);

    console.log(data, sum, checkSum, "sum,checkSum");
    if (sum < checkSum) {
      setError("مقادیر ثبت شده، از تعداد سفارش کمتر است!");
      return;
    } else if (sum > checkSum) {
      setError("مقادیر ثبت شده، از تعداد سفارش بیشتر است!");
      return;
    } else {
      console.log("submit");
      //console.log(tempData,"tempData")
      const updateData = processedData?.map((item: any) => {
        if (item.otId === orderDtlId) {
          const newCups: any[] = [];
          data.map((cupItem: any) => {
            newCups.push({
              id: cupItem.iocId,
              code: convertToLatinDigits(cupItem.cCode),
              eDate: convertToLatinDigits(cupItem.eDate),
              cnt: Number(convertToLatinDigits(String(cupItem.cnt))),
              oCnt: Number(convertToLatinDigits(String(cupItem.oCnt))),
            });
          });

          return {
            ...item,
            //cups: newCups,
            cupId: newCups
              .map((cup: any) => convertToFarsiDigits(cup.id))
              .join("\n"),
            cupCode: newCups
              .map((cup: any) => convertToFarsiDigits(cup.code))
              .join("\n"),
            cupEDate: newCups
              .map((cup: any) => convertToFarsiDigits(cup.eDate))
              .join("\n"),
            cupCnt: newCups
              .map((cup: any) => convertToFarsiDigits(cup.cnt))
              .join("\n"),
            cupOCnt: newCups
              .map((cup: any) => convertToFarsiDigits(cup.oCnt))
              .join("\n"),
          };
        }
        return item;
      });
      //console.log(updateData,"updateData in order cupboard list")
      console.log(updateData,"updateData")
      setBaseData(updateData);
      setProcessedData(updateData);
      handleOrderCupboardListClose();
    }
  };

  const { width } = useCalculateTableHeight();

  return (
    <>
      {isLoadingOrderCupList ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : orderCupListResponse.meta.errorCode >0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {orderCupListResponse.meta.message}
        </p>
      ) : (
        <div className="w-full mt-2">
          {width > 640 ? (
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
            />
          ) : (
            <OrderCupboardListMobileTable
              data={data}
              columns={columns}
              changeRowValues={changeRowValues}
              canEditForm={true}
            />
          )}

          {data.length > 0 && (
            <ConfirmCard variant="rounded-md justify-end">
              <div className="flex gap-2 items-center">
                <p className="text-red-500 text-sm">{error}</p>
                <Button text="تایید" onClick={handleSubmit} />
              </div>
            </ConfirmCard>
          )}
        </div>
      )}
    </>
  );
};

export default OrderCupboardList;
