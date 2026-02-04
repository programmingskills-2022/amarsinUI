import { useEffect, useRef, useState } from "react";
import { Column, ColumnGroup, TableColumns } from "../../types/general";
import OrderCupboardListMobileItem from "./OrderCupboardListMobileItem";

type Props = {
  data: any[];
  columns: TableColumns;
  changeRowValues: (value: string, rowIndex: number, columnId: string) => void;
  canEditForm:boolean;
};

const OrderCupboardListMobileTable = ({ data, columns, changeRowValues,canEditForm }: Props) => {
  const [columnsArray, setColumnsArray] = useState<Column[][]>([]);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    (columns as ColumnGroup[]).forEach((column) => {
      let temp = [];
      temp =
        column &&
        column.columns.map((column) => {
          return {
            ...column,
            width: column.width // conver column widths to new columns widths
              ? (Number(column.width.slice(0, -1)) * 100) /
                  Number(columns[0]?.width?.slice(0, -1)) +
                "%"
              : "100%",
          };
        });
      setColumnsArray((prev: any) => [...prev, temp]);
    });
  }, [columns]);

  return (
    <>
      {data &&
        data.map((item, index) => (
          <OrderCupboardListMobileItem
            key={index}
            index={index}
            item={item}
            columns={columnsArray}
            changeRowValues={changeRowValues}
            canEditForm={canEditForm}
          />
        ))}
    </>
  );
};

export default OrderCupboardListMobileTable;
