import { useEffect, useState } from "react";
import { Column } from "../../types/general";
import TTable from "../controls/TTable";
import { convertToFarsiDigits } from "../../utilities/general";
import Card from "../controls/Card";

type Props = {
  item: any;
  columns: Column[][];
  index: number;
  changeRowValues: (value: string, rowIndex: number, columnId: string) => void;
  canEditForm: boolean;
};

const OrderCupboardListMobileItem = ({
  item,
  columns,
  index,
  changeRowValues,
  canEditForm,
}: Props) => {
  const data = [item];
  const [cnt, setCnt] = useState(""); //تعداد
  const [oCnt, setOCnt] = useState(""); // آفر

  useEffect(() => {
    setCnt(convertToFarsiDigits(item.cnt));
    setOCnt(convertToFarsiDigits(item.oCnt));
  }, [item]);

  return (
    <Card
      padding="sm"
      borderColor="border-gray-300"
      className="flex flex-col w-full"
    >
      <TTable columns={columns[0] ?? []} data={data} />
      <div
        className="flex items-center justify-between w-full gap-2 px-2"
        style={{
          backgroundColor:
            columns[1] && columns[1][0]
              ? columns[1][0].backgroundColor
              : "transparent",
        }}
      >
        <div className="flex items-center justify-center text-sm w-1/2 gap-2 pt-1">
          <label>{columns[1] && columns[1][0] && columns[1][0].Header}:</label>
          <input
            disabled={!canEditForm}
            className="text-inherit border border-gray-300 rounded-md p-1 w-full"
            style={{ backgroundColor: "transparent" }}
            value={cnt}
            onChange={(e) => {
              setCnt(convertToFarsiDigits(e.target.value));
              changeRowValues(e.target.value, index, "cnt");
            }}
            onBlur={() => {
              changeRowValues(cnt, index, "cnt");
            }}
          />
        </div>
        <div
          className="flex items-center justify-center text-sm w-1/2 gap-2 pt-1"
          style={{
            backgroundColor:
              columns[1] && columns[1][0]
                ? columns[1][0].backgroundColor
                : "transparent",
          }}
        >
          <label>{columns[1] && columns[1][1] && columns[1][1].Header}:</label>
          <input
            disabled={!canEditForm}
            className="text-inherit border border-gray-300 rounded-md p-1 w-full"
            style={{ backgroundColor: "transparent" }}
            value={oCnt}
            onChange={(e) => {
              setOCnt(convertToFarsiDigits(e.target.value));
              changeRowValues(e.target.value, index, "oCnt");
            }}
            onBlur={() => {
              changeRowValues(oCnt, index, "oCnt");
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default OrderCupboardListMobileItem;
