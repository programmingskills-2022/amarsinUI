import { useEffect, useState } from "react";
import { TableColumns } from "../../types/general";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";

type Props = {
  columns: TableColumns;
  brandSearch: string;
  setBrandSearch: (brandSearch: string) => void;
  productSearch: string;
  setProductSearch: (productSearch: string) => void;
  dtlDscSearch: string;
  setDtlDscSearch: (dtlDscSearch: string) => void;
};

const ProductOfferFormListHeader = ({
  columns,
  brandSearch,
  setBrandSearch,
  productSearch,
  setProductSearch,
  dtlDscSearch,
  setDtlDscSearch,
}: Props) => {
  const [oldWidth, setOldWidth] = useState(0);
  const [emptyWidth, setEmptyWidth] = useState(0);
  useEffect(() => {
    console.log(oldWidth, emptyWidth);
    if (
      columns[3].width &&
      columns[4].width &&
      columns[5].width &&
      columns[6].width &&
      columns[7].width
    ) {
      setOldWidth(
        Number(columns[3].width.replace("%", "")) +
          Number(columns[4].width.replace("%", "")) +
          Number(columns[5].width.replace("%", "")) +
          Number(columns[6].width.replace("%", "")) +
          Number(columns[7].width.replace("%", ""))
      );
    }
    if (
      columns[8]?.width &&
      columns[9]?.width &&
      columns[10]?.width &&
      columns[11]?.width &&
      columns[12]?.width &&
      columns[13]?.width &&
      columns[14]?.width &&
      columns[15]?.width
    ) {
      setEmptyWidth(
        Number(columns[8].width.replace("%", "")) +
          Number(columns[9].width.replace("%", "")) +
          Number(columns[10].width.replace("%", "")) +
          Number(columns[11].width.replace("%", "")) +
          Number(columns[12].width.replace("%", "")) +
          Number(columns[13].width.replace("%", "")) +
          Number(columns[14].width.replace("%", "")) +
          Number(columns[15].width.replace("%", ""))
      );
    }
  }, []);
  return (
    <div
      className="w-full h-8 flex justify-center md:justify-end items-center text-gray-500"
      style={{
        fontSize: "12px",
        fontWeight: "bold",
        border: "1px solid lightgray",
      }}
    >
      <div
        className="md:h-full border border-x-gray-300 bg-gray-200"
        style={{ width: columns[0].width }}
      ></div>
      <input
        name="brandSearch"
        value={convertToFarsiDigits(brandSearch)}
        onChange={(e) => {
          setBrandSearch(convertToLatinDigits(e.target.value));
        }}
        className={`border p-1 text-sm`}
        style={{ width: columns[1].width }}
      />
      <input
        name="productSearch"
        value={convertToFarsiDigits(productSearch)}
        onChange={(e) => {
          setProductSearch(convertToLatinDigits(e.target.value));
        }}
        className={`border p-1 text-sm`}
        style={{ width: columns[2].width }}
      />
      <div
        className="md:h-full border place-content-center text-center border-x-gray-300 bg-gray-200"
        style={{
          width: oldWidth.toString() + "%",
        }}
      >
        قدیم
      </div>
      <div
        className="md:h-full border place-content-center text-center border-x-gray-300 bg-gray-200"
        style={{
          width: emptyWidth.toString() + "%",
        }}
      ></div>
      {columns[16] && (
        <div
          className="md:h-full border place-content-center text-center border-x-gray-300 bg-gray-200"
          style={{
            width: columns[16].width ? columns[16].width : "10%",
          }}
        >
          بدون
        </div>
      )}
      {columns[17] && (
        <input
          name="dtlDscSearch"
          value={convertToFarsiDigits(dtlDscSearch)}
          onChange={(e) => {
            setDtlDscSearch(convertToLatinDigits(e.target.value));
          }}
          className={`border p-1 text-sm`}
          style={{ width: columns[17].width }}
        />
      )}
      {columns[18] && (
        <div
          className="md:h-full border border-x-gray-300 bg-gray-200"
          style={{ width: columns[18].width }}
        ></div>
      )}
    </div>
  );
};

export default ProductOfferFormListHeader;
