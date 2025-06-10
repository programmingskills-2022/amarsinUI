import { useEffect, useState } from "react";
import { Paper } from "@mui/material";

import { useBrandStore } from "../../store/brandStore";
import { useInventoryStore } from "../../store/inventoryStore";
import { InventoryItem } from "../../types/inventory";
import { useInventoryGoodList } from "../../hooks/useInventoryGoodList";
import { useBrand } from "../../hooks/useBrands";
import Skeleton from "../layout/Skeleton";
import { useNavigate } from "react-router-dom";
import AutoComplete from "../controls/AutoComplete";
import { Table } from "../controls/Table";
import { useGeneralContext } from "../../context/GeneralContext";
import { HeadCell } from "../../hooks/useTable";

export const headCells: HeadCell<InventoryItem>[] = [
  {
    id: "index",
    label: "ردیف",
    disableSorting: true,
    cellWidth: "10%",
  },
  { id: "bn", label: "برند" ,cellWidth: "10%"},
  { id: "fn", label: "نام کالا" ,cellWidth: "20%"},
  { id: "s", label: "قابل فروش", isNumber: true ,cellWidth: "10%"},
  { id: "ns", label: "غیر قابل فروش", isNumber: true ,cellWidth: "10%"},
  { id: "c", label: "بچ", isNumber: true ,cellWidth: "10%"},
  { id: "uid", label: "UID", isNumber: true ,cellWidth: "10%"},
  { id: "gtin", label: "GTIN", isNumber: true ,cellWidth: "10%"},
  { id: "ed", label: "انقضاء", isNumber: true ,cellWidth: "10%"},
];

export default function InventoryGoodListForm() {
  const { inventoryList, error, isLoading } = useInventoryGoodList();

  const { systemId, yearId } = useGeneralContext();

  const [search, setSearch] = useState<string>("");
  const [brand, setBrand] = useState<{ id: string; title: string } | null>({
    id: "0",
    title: "",
  });

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

  useEffect(() => {
    setBrandField("accSystem",systemId)
    setBrandField("search", search);
  }, [search, systemId]);
  const { brands } = useBrand();
  
  
  useEffect(() => {
    setField("accSystem", systemId);
    setField("accYear", yearId);
    setField("brandId", brand === null || !brand ? 0 : brand.id);
  }, [systemId, yearId, brand?.id]);

  if (error) return <div>Error: {error.message} </div>;

  return (
    <>
      <Paper className="p-2 m-2 w-full h-full">
        <div className="flex xl:w-1/4 justify-center items-center gap-2">
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
              return setBrand(newValue);
            }}
            setSearch={setSearch}
            showLabel={false}
            inputPadding="0 !important"
          />
        </div>

        {isLoading ? (
          <div className="text-center">{<Skeleton />}</div>
        ) : 
        inventoryList.err !== 0 ? (
          <p className="p-6 text-red-400 text-sm md:text-base font-bold">
            {inventoryList.msg}
          </p>
        ) : inventoryList.rpProviderInventories.length > 0 ? (
          <div className="h-screen-minus-200 mt-2">
            <Table
              data={inventoryList.rpProviderInventories}
              headCells={headCells}
            />
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
