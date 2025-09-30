import React, { useEffect, useState } from "react";
import { Paper } from "@mui/material";

import { useBrandStore } from "../../store/brandStore";
import { useBrand } from "../../hooks/useBrands";
import Skeleton from "../layout/Skeleton";
import { useNavigate } from "react-router-dom";
import AutoComplete from "../controls/AutoComplete";
import { useGeneralContext } from "../../context/GeneralContext";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import TTable, { EditableInput } from "../controls/TTable";
import { convertToFarsiDigits } from "../../utilities/general";
import { DefaultOptionTypeStringId, TableColumns } from "../../types/general";
import { useClearBook } from "../../hooks/useClearBook";
import { useClearBookStore } from "../../store/clearBookStore";
import ErrorPage from "../common/ErrorPage";
import { ClearBookProductsSetProductRequest } from "../../types/clearBook";

export default function ClearBookShow() {
  const { clearBookProducts, error, isLoading, refetch, setProduct } =
    useClearBook();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in clearBookShow table
  const columns: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "3%",
    },
    {
      Header: "شناسه",
      accessor: "pId",
      width: "10%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "کد",
      accessor: "code",
      width: "5%",
      Cell: ({ value }: any) => convertToFarsiDigits(value),
    },
    {
      Header: "نام کالا",
      accessor: "name",
      width: "32%",
    },
    {
      Header: "تصویر",
      accessor: "imgUrl2",
      width: "5%",
    },
  ];

  const dynamicColumns = clearBookProducts.clearBooks.map((clearBook) => ({
    Header: clearBook.name,
    accessor: clearBook.id.toString(),
    align: "center",
    width:
      Math.round(50 / clearBookProducts.clearBooks.length).toString() + "%",
    type: "checkbox",
    Cell: EditableInput,
  }));

  //union all columns
  const allColumns = React.useMemo(
    () => [...columns, ...dynamicColumns],
    [dynamicColumns]
  );

  const { systemId, yearId } = useGeneralContext();

  const [search, setSearch] = useState<string>("");
  const [brand, setBrand] = useState<{ id: string; title: string } | null>({
    id: "0",
    title: "",
  });

  const { setField: setBrandField } = useBrandStore();

  const { setField } = useClearBookStore();
  //if error occurred then navigate to login page
  const navigate = useNavigate();
  /////////////////////////////////////////////////////////
  useEffect(() => {
    if (error) {
      console.log(error);
      navigate("/login");
    }
  }, [error, navigate]);
  /////////////////////////////////////////////////////////
  useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", search);
  }, [search, systemId]);
  const { brands } = useBrand();
  /////////////////////////////////////////////////////////
  useEffect(() => {
    setField("systemId", systemId);
    setField("yearId", yearId);
    setField("brandId", brand === null || !brand ? 0 : brand.id);
  }, [systemId, yearId, brand?.id]);

  if (error) return <div>Error: {error.message} </div>;

  const [data, setData] = useState<any[]>([]);
  ////////////////////////////////////////////////////////
  const handleSetProduct = (
    clearBookId: number,
    productId: number,
    check: boolean
  ) => {
    const request: ClearBookProductsSetProductRequest = {
      clearBookId,
      productId,
      check,
    };
    setProduct(request);
  };
  ////////////////////////////////////////////////////////////
  useEffect(() => {
    setData(
      clearBookProducts.clearBookProductsName?.map(
        (clearBookProductName, i) => {
          // Create an object with dynamic keys for each product's clearbook
          const dynamicAmnts: Record<string, React.ReactNode> = {};

          clearBookProducts.clearBooks.forEach((clearBook) => {
            dynamicAmnts[clearBook.id.toString()] = (
              <div className="flex justify-evenly items-center w-full">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={
                    clearBook.pIds.includes(clearBookProductName.pId)
                      ? true
                      : false
                  }
                  onChange={()=>console.log("changed")}
                  /*onClick={() =>
                    handleSetProduct(
                      clearBook.id,
                      clearBookProductName.pId,
                      clearBook.pIds.includes(clearBookProductName.pId)
                        ? false
                        : true
                    )
                  }*/
                />
              </div>
            );
          });
          return {
            ...clearBookProductName,
            imgUrl2: <img src={clearBookProductName.imgUrl} alt="img" />,
            ...dynamicAmnts, // Spread dynamic amnt fields
            index: convertToFarsiDigits(i + 1),
          };
        }
      )
    );
  }, [clearBookProducts]);
  ///////////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    console.log(rowIndex, columnId, value);
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
    );
  };
  const changeRowValues = (
    value: string | boolean,
    rowIndex: number,
    columnId: string
  ) => {
    if (dynamicColumns.some((col) => col.accessor === columnId)) {
      handleSetProduct(Number(columnId), data[rowIndex].pId, value as boolean);
    }
  };
  /////////////////////////////////////////////////////
  const { height, width } = useCalculateTableHeight();

  return (
    <>
      <Paper className="p-2 m-2 w-full h-fit md:h-full">
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
              return setBrand(newValue as DefaultOptionTypeStringId);
            }}
            setSearch={setSearch}
            showLabel={false}
            inputPadding="0 !important"
          />
        </div>

        {error ? (
          <ErrorPage
            error={error}
            title="خطا در بارگذاری اطلاعات"
            onRetry={() => refetch()}
            showHomeButton={true}
          />
        ) : isLoading ? (
          <div className="text-center">{<Skeleton />}</div>
        ) : clearBookProducts.clearBookProductsName?.length > 0 ? (
          <div
            className="mt-2 overflow-y-auto"
            style={width > 640 ? { height: height } : { height: "fit" }}
          >
            <TTable
              columns={allColumns}
              data={data}
              setSelectedRowIndex={setSelectedRowIndex}
              selectedRowIndex={selectedRowIndex}
              changeRowSelectColor={true}
              canEditForm={true}
              updateMyData={updateMyData}
              changeRowValues={changeRowValues}
              maxVisibleColumns={6}
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
