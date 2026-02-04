import { Column, ColumnGroup, TableColumns } from "../../types/general";

type Props = { columns: TableColumns };

const ProductGraceDtlHeader = ({ columns }: Props) => {
  return (
    <>
      <div className="flex text-xs font-bold text-gray-500 w-full">
        {columns.map((item: ColumnGroup | Column) => {
          return (
            <div
              className={`bg-gray-200 p-1 border-t ${
                item.Header === "وصول" || item.Header === "مازاد"
                  ? "border-b"
                  : item.Header === "فروش"
                  ? "border-b border-r"
                  : "border-r"
              } last:border-x border-gray-300 text-center`}
              style={{
                width: item.width,
                backgroundColor: item.backgroundColor,
              }}
            >
              {item.Header === "وصول" ? (
                <div className="flex flex-col gap-2">
                  <p>پورسانت</p>
                </div>
              ) : (
                <p></p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex text-xs font-bold text-gray-500 w-full">
        {columns.map((item: ColumnGroup | Column) => {
          return (
            <div
              className="bg-gray-200 p-1 border-r border-b last:border-x border-gray-300 text-center"
              style={{
                width: item.width,
                backgroundColor: item.backgroundColor,
              }}
            >
              {item.Header}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductGraceDtlHeader;
