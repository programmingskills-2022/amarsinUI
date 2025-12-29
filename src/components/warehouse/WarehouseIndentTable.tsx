import {
  IndentRequest,
  SelectIndentsRequest,
  WarehouseIndentListResponse,
  WarehouseTemporaryReceiptIndentTbl,
} from "../../types/warehouse";
import React, { useEffect, useState } from "react";
import Button from "../controls/Button";
import ConfirmCard from "../layout/ConfirmCard";
import { useGeneralContext } from "../../context/GeneralContext";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import TTable, { EditableInput } from "../controls/TTable";
import { colors } from "../../utilities/color";
import Skeleton from "../layout/Skeleton";

type Props = {
  iocId: number;
  handleWarehouseIndentListClose: () => void;
  isLoadingWarehouseIndentList: boolean;
  warehouseIndentList: WarehouseIndentListResponse;
  editIndents: (request: SelectIndentsRequest) => Promise<any>;
};
const WarehouseIndentTable = ({
  iocId,
  handleWarehouseIndentListClose,
  isLoadingWarehouseIndentList,
  warehouseIndentList,
  editIndents,
}: Props) => {
  const { setIsModalOpen } = useGeneralContext();

  const columns = React.useMemo(
    () => [
      {
        Header: "اطلاعات درخواست",
        width: "80%",
        columns: [
          {
            Header: "ردیف",
            accessor: "index",
            width: "5%",
          },
          {
            Header: "شماره",
            accessor: "id",
            width: "5%",
          },
          {
            Header: "سررسید",
            accessor: "payDuration",
            width: "5%",
          },
          {
            Header: "تعداد",
            accessor: "cnt",
            width: "5%",
          },
          {
            Header: "آفر",
            accessor: "offer",
            width: "5%",
          },
          {
            Header: "تعداد کل",
            accessor: "amnt",
            width: "10%",
          },
          {
            Header: "مانده",
            accessor: "rem",
            width: "10%",
          },
          {
            Header: "تخفیف",
            accessor: "dcrmnt",
            width: "10%",
          },
          {
            Header: "شرح",
            accessor: "dsc",
            width: "25%",
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
            accessor: "rCnt",
            cellWidth: "10%",
            backgroundColor: colors.green50, //green[50]
            Cell: EditableInput,
          },
          {
            Header: "آفر",
            accessor: "rOffer",
            cellWidth: "10%",
            backgroundColor: colors.green50, //green[50]
            Cell: EditableInput,
          },
        ],
      },
    ],
    []
  );

  const [data, setData] = useState<WarehouseTemporaryReceiptIndentTbl[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in warehouseIndentTable table

  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    // Direct mutation - fastest approach
    // Just find and update the row directly, no state updates needed
    // The mutation persists in the object, React will see it when state is read
    const currentRow = data[rowIndex];
    if (!currentRow) return;

    (currentRow as any)[columnId] = value;
    // We also turn on the flag to not reset the page
    /*setSkipPageReset(true);
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
    );*/
  };

  useEffect(() => {
    if (warehouseIndentList.data.result.warehouseTemporaryReceiptIndentLists) {
      setData(
        warehouseIndentList.data.result.warehouseTemporaryReceiptIndentLists.map(
          (item, idx) => ({
            index: convertToFarsiDigits(idx + 1),
            id: convertToFarsiDigits(item.id),
            payDuration: convertToFarsiDigits(item.payDuration),
            dId: convertToFarsiDigits(item.dId),
            cnt: convertToFarsiDigits(item.cnt),
            offer: convertToFarsiDigits(item.offer),
            rem: convertToFarsiDigits(item.rem),
            dcrmnt: convertToFarsiDigits(item.dcrmnt),
            dsc: item.dsc,
            rCnt: convertToFarsiDigits(item.rCnt),
            rOffer: convertToFarsiDigits(item.rOffer),
            amnt: convertToFarsiDigits(item.amnt),
          })
        )
      );
    }
  }, [
    warehouseIndentList.data.result.warehouseTemporaryReceiptIndentLists
      ?.length,
  ]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let request: SelectIndentsRequest;
    let indents: IndentRequest[] = [];

    data.map((item) => {
      return indents.push({
        id: Number(convertToLatinDigits(item.dId)),
        cnt: Number(convertToLatinDigits(item.rCnt)),
        offer: Number(convertToLatinDigits(item.rOffer)),
      });
    });
    request = { iocId, indents };
    console.log(indents, "indents");

    try {
      const response = await editIndents(request);

      // Now we can check the response directly
      if (response.meta.errorCode > 0) {
        setIsModalOpen(true);
      } else handleWarehouseIndentListClose();
    } catch (error) {
      setIsModalOpen(true);
    }
  };
  /////////////////////////////////////////////////////////
  const changeRowValues = (
    value: string,
    rowIndex: number,
    columnId: string
  ) => {
    console.log(
      value,
      rowIndex,
      columnId,
      "come to changeRowValues in WarehouseIndentTable"
    );
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

  return (
    <>
      {isLoadingWarehouseIndentList ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : warehouseIndentList.meta.errorCode > 0 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {warehouseIndentList.meta.message}
        </p>
      ) : (
        <div
          className="w-full mt-2"
          //style={{ height: parentHeight }}
        >
          <TTable
            columns={columns}
            data={data}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            updateMyData={updateMyData}
            //skipPageReset={skipPageReset}
            changeRowSelectColor={true}
            canEditForm={true}
            changeRowValues={changeRowValues}
            fontSize="14px"
          />

          {data.length > 0 && (
            <ConfirmCard variant="rounded-md justify-end">
              <Button text="تایید" onClick={handleSubmit} />
            </ConfirmCard>
          )}
        </div>
      )}
    </>
  );
};

export default WarehouseIndentTable;
