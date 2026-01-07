import { useEffect, useState } from "react";
import { Paper } from "@mui/material";

import { useBrandStore } from "../../store/brandStore";
import { useInventoryStore } from "../../store/inventoryStore";
import { InventoryItem, InventoryItemTbl } from "../../types/inventory";
import { useBrand } from "../../hooks/useBrands";
import Skeleton from "../layout/Skeleton";
import { useNavigate } from "react-router-dom";
//import AutoComplete from "../controls/AutoComplete";
import { useGeneralContext } from "../../context/GeneralContext";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import TTable from "../controls/TTable";
import { convertToFarsiDigits } from "../../utilities/general";
import {
  DefaultOptionTypeStringId,
  HeadCell,
  TableColumns,
} from "../../types/general";
import { useInventory } from "../../hooks/useInventory";
import AutoCompleteSearch from "../controls/AutoCompleteSearch";

export const headCells: HeadCell<InventoryItem>[] = [
  {
    id: "index",
    label: "ردیف",
    disableSorting: true,
    cellWidth: "5%",
  },
  {
    id: "id",
    label: "شناسه",
    disableSorting: true,
    cellWidth: "5%",
    isNotVisible: true,
  },
  { id: "bn", label: "برند", cellWidth: "10%" },
  { id: "fn", label: "نام کالا", cellWidth: "25%" },
  { id: "s", label: "قابل فروش", isNumber: true, cellWidth: "10%" },
  { id: "ns", label: "غیر قابل فروش", isNumber: true, cellWidth: "10%" },
  { id: "c", label: "بچ", isNumber: true, cellWidth: "10%" },
  { id: "uid", label: "UID", isNumber: true, cellWidth: "10%" },
  { id: "gtin", label: "GTIN", isNumber: true, cellWidth: "10%" },
  { id: "ed", label: "انقضاء", isNumber: true, cellWidth: "10%" },
];

export const columns: TableColumns = [
  {
    Header: "ردیف",
    accessor: "index",
    width: "3%",
  },
  {
    Header: "برند",
    accessor: "bn",
    width: "10%",
  },
  {
    Header: "نام کالا",
    accessor: "fn",
    width: "22%",
  },
  {
    Header: "قابل فروش",
    accessor: "s",
    width: "10%",
  },
  {
    Header: "غیر قابل فروش",
    accessor: "ns",
    width: "10%",
  },
  {
    Header: "بچ",
    accessor: "c",
    width: "10%",
  },
  {
    Header: "UID",
    accessor: "uid",
    width: "15%",
  },
  {
    Header: "GTIN",
    accessor: "gtin",
    width: "10%",
  },
  {
    Header: "انقضاء",
    accessor: "ed",
    width: "10%",
  },
];

export default function InventoryGoodListForm() {
  const { inventoryList, error, isLoading } = useInventory();

  const { systemId, yearId } = useGeneralContext();

  //const [search, setSearch] = useState<string>("");
  const [brand, setBrand] = useState<{ id: string; title: string } | null>({
    id: "0",
    title: "",
  });
  const [isBrandEntered, setIsBrandEntered] = useState<boolean>(false);
  const { setField: setBrandField } = useBrandStore();

  const { setField } = useInventoryStore();
  //if error occurred then navigate to login page
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.log(error);
      navigate("/login");
    }
  }, [error, navigate]);

  /*useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", search);
  }, [search, systemId]);*/
  const { brands } = useBrand();

  useEffect(() => {
    setField("accSystem", systemId);
    setField("accYear", yearId);
    setField("brandId", brand === null || !brand ? 0 : brand.id);
  }, [systemId, yearId, brand?.id]);

  if (error) return <div>Error: {error.message} </div>;

  const [data, setData] = useState<InventoryItemTbl[]>([]);

  useEffect(() => {
    setData(
      inventoryList.rpProviderInventories.map((item, idx) => ({
        index: convertToFarsiDigits(idx + 1),
        id: convertToFarsiDigits(item.id),
        bn: convertToFarsiDigits(item.bn),
        c: convertToFarsiDigits(item.c),
        ed: convertToFarsiDigits(item.ed),
        fn: convertToFarsiDigits(item.fn),
        gtin: convertToFarsiDigits(item.gtin),
        ns: convertToFarsiDigits(item.ns),
        s: convertToFarsiDigits(item.s),
        uid: convertToFarsiDigits(item.uid),
      }))
    );
  }, [inventoryList.rpProviderInventories]);

  const { height, width } = useCalculateTableHeight();

  return (
    <>
      <Paper className="p-2 m-2 w-full h-fit md:h-full">
        <AutoCompleteSearch
          label="برند"
          labelWidth="w-20"
          setField={setBrandField}
          fieldValues={[{ field: "accSystem", value: systemId }]}
          fieldSearch="search"
          selectedOption={brand}
          setSelectedOption={(newValue) => {
            setBrand(newValue as DefaultOptionTypeStringId);
          }}
          options={brands.map((b: any) => ({
            id: b.id,
            text: b.text,
          }))}
          isEntered={isBrandEntered}
          setIsEntered={setIsBrandEntered}
        />
        {/*<div className="flex xl:w-1/4 justify-center items-center gap-2">
          <label htmlFor="year" className="">
            برند:
          </label>
          <AutoComplete
            options={brands.map((b) => ({
              id: b.id,
              title: b.text,
            }))}
            value={brand}
            handleChange={(_event, newValue) => {
              return setBrand(newValue as DefaultOptionTypeStringId);
            }}
            setSearch={setSearch}
            showLabel={false}
            inputPadding="0 !important"
          />
        </div>
*/}
        {isLoading ? (
          <div className="text-center">{<Skeleton />}</div>
        ) : inventoryList.err !== 0 ? (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            {inventoryList.msg}
          </p>
        ) : inventoryList.rpProviderInventories.length > 0 ? (
          <div
            className="mt-2 overflow-y-auto"
            style={width > 640 ? { height: height } : { height: "fit" }}
          >
            <TTable columns={columns} data={data} />
          </div>
        ) : (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            هیچ کالایی یافت نشد.
          </p>
        )}
      </Paper>
    </>
  );
}
