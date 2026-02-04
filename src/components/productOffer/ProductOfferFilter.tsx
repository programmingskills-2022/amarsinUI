
import { TableColumns } from "../../types/general";
import { convertToFarsiDigits, convertToLatinDigits } from "../../utilities/general";

type Props = {
  srchId: number;
  srchDate: string;
  srchTime: string;
  srchDsc: string;
  srchAccepted: number;
  srchUsrName: string;
  srchStep: string;
  setSrchId: (value: number) => void;
  setSrchDate: (value: string) => void;
  setSrchTime: (value: string) => void;
  setSrchDsc: (value: string) => void;
  setSrchAccepted: (value: number) => void;
  setSrchUsrName: (value: string) => void;
  setSrchStep: (value: string) => void;
  handleDebounceFilterChange: (field: string, value: string | number) => void;
  columns: TableColumns;
};

const ProductOfferFilter = ({
  columns,
  srchId,
  srchDate,
  srchTime,
  srchDsc,
  srchAccepted,
  srchUsrName,
  srchStep,
  setSrchId,
  setSrchDate,
  setSrchTime,
  setSrchDsc,
  setSrchAccepted,
  setSrchUsrName,
  setSrchStep,
  handleDebounceFilterChange,
}: Props) => {
  return (
    <div className="w-full flex justify-center md:justify-end items-center ">
      <input
        name="index"
        value={""}
        disabled
        style={{ width: columns[0].width }}
        className={`border p-1 text-sm bg-gray-200 rounded-sm border-gray-300`}
      />
      <input
        name="srchId"
        value={srchId===-1 ? "" : srchId}
        onChange={(e) => {
          handleDebounceFilterChange("srchId", e.target.value === "" ? -1 : e.target.value);
          setSrchId(Number(e.target.value));
        }}
        style={{ width: columns[1].width }}
        className={`border p-1 text-sm rounded-sm`}
      />
      <input
        name="srchDate"
        value={convertToFarsiDigits(srchDate ?? "")}
        onChange={(e) => {
          handleDebounceFilterChange("srchDate", convertToLatinDigits(e.target.value));
          setSrchDate(e.target.value);
        }}
        style={{ width: columns[2].width }}
        className={`border p-1 text-sm rounded-sm`}
      />
      <input
        name="srchTime"
        value={convertToFarsiDigits(srchTime ?? "")}
        onChange={(e) => {
          handleDebounceFilterChange("srchTime", convertToLatinDigits(e.target.value));
          setSrchTime(e.target.value);
        }}
        style={{ width: columns[3].width }}
        className={`border p-1 text-sm rounded-sm`}
      />
      <input
        name="srchDsc"
        value={convertToFarsiDigits(srchDsc ?? "")}
        onChange={(e) => {
          handleDebounceFilterChange("srchDsc", convertToLatinDigits(e.target.value));
          setSrchDsc(e.target.value);
        }}
        style={{ width: columns[4].width }}
        className={`border p-1 text-sm rounded-sm`}
      />
      <input
        name="srchAccepted"
        type="checkbox"
        checked={srchAccepted === 1}
        onChange={(e) => {
          handleDebounceFilterChange("srchAccepted", e.target.checked ? 1 : -1);
          setSrchAccepted(Number(e.target.checked ? 1 : -1));
        }}
        style={{ width: columns[5].width }}
        className={`border p-1 text-sm rounded-sm`}
      />
      <input
        name="srchUsrName"
        value={convertToFarsiDigits(srchUsrName ?? "")}
        onChange={(e) => {
          handleDebounceFilterChange("srchUsrName", convertToLatinDigits(e.target.value));
          setSrchUsrName(e.target.value);
        }}
        style={{ width: columns[6].width }}
        className={`border p-1 text-sm rounded-sm`}
      />
      <input
        name="srchStep"
        value={convertToFarsiDigits(srchStep ?? "")}
        onChange={(e) => {
          handleDebounceFilterChange("srchStep", convertToLatinDigits(e.target.value));
          setSrchStep(e.target.value);
        }}
        style={{ width: columns[7].width }}
        className={`border p-1 text-sm rounded-sm`}
      />
    </div>
  );
};

export default ProductOfferFilter;
