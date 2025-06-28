import { green, indigo } from "@mui/material/colors";
import { HeadCell, HeaderGroup } from "../../hooks/useTable";
import { useWarehouse } from "../../hooks/useWarehouse";
import {
  IndentRequest,
  SelectIndentsRequest,
  WarehouseTemporaryReceiptIndent,
} from "../../types/warehouse";
import { Table } from "../controls/Table";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import Button from "../controls/Button";
import ConfirmCard from "../layout/ConfirmCard";
import { useGeneralContext } from "../../context/GeneralContext";
import { convertToFarsiDigits, convertToLatinDigits } from "../../utilities/general";

type Props = {
  iocId: number;
  handleWarehouseIndentListClose: () => void;
};
const WarehouseIndentTable = ({
  iocId,
  handleWarehouseIndentListClose,
}: Props) => {
  const { setIsModalOpen } = useGeneralContext();
  const { isLoadingWarehouseIndentList, warehouseIndentList, editIndents } =
    useWarehouse();

  const [rCnt, setRCnt] = useState(["0"]);
  const [rOffer, setROffer] = useState(["0"]);

  const headerGroups: HeaderGroup[] = [
    { label: "اطلاعات درخواست", colSpan: 9 },
    { label: "ثبت", colSpan: 2 , backgroundColor: indigo[50]},
  ];
  const headCells: HeadCell<WarehouseTemporaryReceiptIndent>[] = [
    {
      id: "index",
      label: "ردیف",
      disableSorting: true,
      cellWidth: "5%",
      isNumber: true,
    },
    {
      id: "id",
      label: "شماره",
      cellWidth: "5%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "payDuration",
      label: "سررسید",
      cellWidth: "5%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "cnt",
      label: "تعداد",
      cellWidth: "5%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "offer",
      label: "آفر",
      cellWidth: "5%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "amnt",
      label: "تعداد کل",
      cellWidth: "10%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "rem",
      label: "مانده",
      cellWidth: "10%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "dcrmnt",
      label: "تخفیف",
      cellWidth: "10%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "dsc",
      label: "شرح",
      cellWidth: "25%",
      isNumber: true,
      disableSorting: true,
    },
    {
      id: "rCnt",
      label: "تعداد",
      cellWidth: "10%",
      disableSorting: true,
      backgroundColor: green[50],
      type: "input",
      val: rCnt,
      setVal: (e, idx) => setValRCnt(e, idx),
    },
    {
      id: "rOffer",
      label: "آفر",
      cellWidth: "10%",
      isNumber: true,
      disableSorting: true,
      backgroundColor: green[50],
      type: "input",
      val: rOffer,
      setVal: (e, idx) => setValROffer(e, idx),
    },
  ];

  const regex = /^[0-9\u06F0-\u06F9]*$/;

  const setValRCnt = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    //Regular expression to allow only numbers
    const value = convertToFarsiDigits(e.target.value);
    if (regex.test(value)) {
      setRCnt((prev) => {
        const newArr = [...prev];
        newArr[idx] = value;
        return newArr;
      });
    }
  };
  const setValROffer = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    //Regular expression to allow only numbers
    const value = convertToFarsiDigits(e.target.value);
    if (regex.test(value)) {
      setROffer((prev) => {
        const newArr = [...prev];
        newArr[idx] = value;
        return newArr;
      });
    }
  };

  const data =
    warehouseIndentList.data.result.warehouseTemporaryReceiptIndentLists;
  //fill registered values of rCnt and rOffer fields
  useEffect(() => {
    setRCnt((prev) => {
      const newArr = [...prev];
      data.map((item, idx) => {
        newArr[idx] = convertToFarsiDigits(item.rCnt);
        return newArr;
      });
      return newArr;
    });
    setROffer((prev) => {
      const newArr = [...prev];
      data.map((item, idx) => {
        newArr[idx] = convertToFarsiDigits(item.rOffer);
        return newArr;
      });
      return newArr;
    });
  }, [data]);

  /*const sum1 =
    rCnt.reduce((acc, cnt) => acc + parseInt(cnt), 0) +
    rOffer.reduce((acc, offer) => acc + parseInt(offer), 0);
  const sum2 = data.reduce((acc, item) => acc + item.amnt, 0);*/

  //if (sum1 !== sum2) setIsModalOpen(true);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    /*if (sum1 !== sum2) {
      setIsModalOpen(true);
      return;
    }*/

    let request: SelectIndentsRequest;
    let indents: IndentRequest[] = [];

    data.map((item, idx) => {
      return indents.push({
        id: item.dId,
        cnt: Number(convertToLatinDigits(rCnt[idx])),
        offer: Number(convertToLatinDigits(rOffer[idx])),
      });
    });
    request = { iocId, indents };
    console.log(indents, "indents");

    try {
      const response = await editIndents(request);
      handleWarehouseIndentListClose();

      // Now we can check the response directly
      if (response.meta.errorCode !== -1) {
        console.log(response.meta.errorCode, "response.meta.errorCode");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error editing indents:", error);
      setIsModalOpen(true);
    }
  };

  const handleRowClick = (
    item: WarehouseTemporaryReceiptIndent,
    setSelectedRowId: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    setSelectedRowId(Number(item["id"]));
  };

  return (
    <>
      {isLoadingWarehouseIndentList ? (
        <div className="text-center">{<Skeleton />}</div>
      ) : warehouseIndentList.meta.errorCode !== -1 ? (
        <p className="p-6 text-red-400 text-sm md:text-base font-bold">
          {warehouseIndentList.meta.message}
        </p>
      ) : (
        <div
          className="w-full mt-2"
          //style={{ height: parentHeight }}
        >
          <Table
            data={data}
            headCells={headCells}
            headerGroups={headerGroups}
            wordWrap={true}
            pagination={false}
            rowClickHandler={handleRowClick}
          />

          {data.length > 0 && (
            <ConfirmCard>
              <Button text="تایید" onClick={handleSubmit} />
            </ConfirmCard>
          )}
        </div>
      )}
    </>
  );
};

export default WarehouseIndentTable;
