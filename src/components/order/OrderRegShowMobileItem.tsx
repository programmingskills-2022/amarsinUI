import { colors } from "../../utilities/color";
import Card from "../controls/Card";
import { TableColumns, ColumnGroup, DefaultOptionType } from "../../types/general";
import { convertToFarsiDigits } from "../../utilities/general";
import TTable from "../controls/TTable";

type Props = {
  item: any;
  index: number;
  columns: TableColumns;
  salesPrice: DefaultOptionType | null;
};

const OrderRegShowMobileItem = ({ item, index, columns, salesPrice }: Props) => {
  const regInfoColumns: TableColumns = [
    {
      Header: "بچ",
      accessor: "cupCode",
      width: "25%",
      backgroundColor: colors.indigo50,
      except: true,
    },
    {
      Header: "انقضا",
      accessor: "cupEDate",
      width: "25%",
      backgroundColor: colors.indigo50,
      except: true,
    },
    {
      Header: "تعداد",
      accessor: "cupCnt",
      width: "25%",
      backgroundColor: colors.indigo50,
      except: true,
    },
    {
      Header: "آفر",
      accessor: "cupOCnt",
      width: "25%",
      backgroundColor: colors.indigo50,
      except: true,
    },
  ];
  const regInfoData: any[] = [
    {
      cupCode: item.cupCode,
      cupEDate: item.cupEDate,
      cupCnt: item.cupCnt,
      cupOCnt: item.cupOCnt,
    },
  ];
  const row1 = (
    <div className="flex items-center justify-between">
      <div>
        {
          (columns[0] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "cost"
          )?.Header
        }
        : {item.cost}
      </div>
      <div>
        {
          (columns[0] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "cnt"
          )?.Header
        }
        : {item.cnt}
      </div>
      <div>
        {
          (columns[0] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "oCnt"
          )?.Header
        }
        : {item.oCnt}
      </div>
      {item.editIcon1}
    </div>
  );
  const row2 = (
    <div className="flex items-center justify-between w-full">
      <div
        className="p-1 rounded-lg w-1/3 flex items-center justify-center"
        style={{
          backgroundColor: (columns[1] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "needPerm"
          )?.backgroundColor,
        }}
      >
        {
          (columns[1] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "needPerm"
          )?.Header
        }
        : {item.needPerm}
      </div>
      <div
        className="p-1 rounded-lg w-1/3 flex items-center justify-center"
        style={{
          backgroundColor: (columns[1] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "stock"
          )?.backgroundColor,
        }}
      >
        {
          (columns[1] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "stock"
          )?.Header
        }
        : {item.stock}
      </div>
      <div
        className="p-1 rounded-lg w-1/6 flex items-center justify-center"
        style={{
          backgroundColor: (columns[1] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "offerNo"
          )?.backgroundColor,
        }}
      >
        {
          (columns[1] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "offerNo"
          )?.Header
        }
        : {item.offerNo}
      </div>
      <div
        className="p-1 rounded-lg w-1/6 flex items-center justify-center"
        style={{
          backgroundColor: (columns[1] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "historyIcon"
          )?.backgroundColor,
        }}
      >
        {item.historyIcon}
      </div>
    </div>
  );
  return (
    <Card border="thin" padding="sm" textSize="text-xs" borderColor={colors.gray_300}>
      {convertToFarsiDigits(index + 1)} - {item.pName}
      <hr />
      {row1}
      {row2}
      <div
        className="w-full flex items-center justify-between mt-1"
        style={{
          backgroundColor: (columns[2] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "editIcon2"
          )?.backgroundColor,
        }}
      >
        <TTable columns={regInfoColumns} data={regInfoData} />
        <div className="p-2">{item.editIcon2}</div>
      </div>
      <div
        className="w-full flex items-center justify-between"
        style={{
          backgroundColor: (columns[2] as ColumnGroup).columns.find(
            (col: any) => col.accessor === "editIcon2"
          )?.backgroundColor,
        }}
      >
        <label className="text-center w-full">قیمت {salesPrice?.title}: {item.salePrice}</label>
        <div className="p-2">{item.historyIcon2}</div>
      </div>
    </Card>
  );
};

export default OrderRegShowMobileItem;
