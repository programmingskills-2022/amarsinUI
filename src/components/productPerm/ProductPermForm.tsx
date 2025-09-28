import TrashIcon from "../../assets/images/GrayThem/delete_gray_16.png";
import HistoryIcon from "../../assets/images/GrayThem/history_gray_16.png";
import RestoreIcon from "../../assets/images/GrayThem/restore_gray_16.png";
import Accept from "../../assets/images/GrayThem/img24_3.png";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DefaultOptionTypeStringId, TableColumns } from "../../types/general";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import { handleExport } from "../../utilities/ExcelExport";
import { useGeneralContext } from "../../context/GeneralContext";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import { useProducts } from "../../hooks/useProducts";
import { useProductStore } from "../../store/productStore";
import { debounce } from "lodash";
import { ProductSearchRequest } from "../../types/product";
import { useBrandStore } from "../../store/brandStore";
import { EditableInput } from "../controls/TTable";
import ProductOfferFormParams from "../productOffer/ProductOfferFormParams";
import {
  ProductPerm,
  ProductPermDtl,
  ProductPermDtlHistory,
  ProductPermListItemTable,
  ProductPermListItemTable2,
  ProductPermListRequest,
  ProductPermListResponse,
  ProductPermSaveRequest,
  ProductPermSaveResponse,
} from "../../types/productPerm";
import ProductPermFormList from "./ProductPermFormList";
import { useProductPermStore } from "../../store/productPermStore";

type Props = {
  addProductList: (
    request: ProductPermListRequest
  ) => Promise<ProductPermListResponse>;
  productPermDtlHistory: ProductPermDtlHistory[];
  isLoadingDtlHistory: boolean;
  productPermSave: (
    request: ProductPermSaveRequest
  ) => Promise<ProductPermSaveResponse>;
  isLoadingProductPermSave: boolean;
  selectedProductPerm: ProductPerm | null;
  productPermDtls: ProductPermDtl[] | undefined;
  isNew: boolean;
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  fromWorkFlow: boolean;
  canEditForm1: boolean;
};

export const headCells = [
  {
    Header: "ردیف",
    accessor: "index",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "برند",
    accessor: "bName",
    width: "10%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "کالا",
    accessor: "product",
    width: "40%",
    type: "autoComplete",
    placeholder: "کالا را انتخاب کنید...",
    Cell: EditableInput,
  },
  {
    Header: "تغییر",
    accessor: "lastDate",
    width: "5%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "نیاز به مجوز",
    accessor: "npo",
    width: "5%",
    Cell: ({ value }: any) => value,
  },
  {
    Header: "نیاز به مجوز",
    accessor: "np",
    width: "5%",
    type: "checkbox",
    Cell: EditableInput,
  },
  {
    Header: "شرح",
    accessor: "dtlDsc",
    width: "27%",
    type: "inputText",
    Cell: EditableInput,
  },
  {
    Header: " ",
    accessor: "icons",
    width: "3%",

    Cell: () => {
      return (
        <div className="flex w-full">
          {
            <img
              src={TrashIcon}
              onClick={() => console.log("hello")}
              className="cursor-pointer"
              alt="TrashIcon"
            />
          }
          <img
            src={HistoryIcon}
            onClick={() => console.log("hello")}
            className="cursor-pointer"
            alt="HistoryIcon"
          />
        </div>
      );
    },
  },
];

const ProductPermForm = ({
  addProductList,
  productPermDtlHistory,
  isLoadingDtlHistory,
  productPermSave,
  isLoadingProductPermSave,
  selectedProductPerm,
  productPermDtls,
  isNew,
  setIsNew,
  setIsEdit,
  fromWorkFlow,
  canEditForm1,
}: Props) => {
  const [addList, setAddList] = useState<ProductPermListItemTable[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showDeleted, setShowDeleted] = useState(true);
  const [brand, setBrand] = useState<DefaultOptionTypeStringId[] | null>([]);
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileName = "data_export.xlsx";
  const { products } = useProducts();
  const { setField: setProductField } = useProductStore();
  const { yearId, systemId, chartId } = useGeneralContext();
  const { setField: setBrandField } = useBrandStore();
  const { setField: setProductPermDtlHistoryField } = useProductPermStore();
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<ProductPermListItemTable2[]>(
    []
  );
  const [dat, setDat] = useState<string>("");
  const [tim, setTim] = useState<string>("");
  const [dsc, setDsc] = useState<string>("");
  const [isModalRegOpen, setIsModalRegOpen] = useState(false);

  const columns: TableColumns = useMemo(() => {
    return headCells.map((item) => {
      return {
        ...item,
        options:
          item.accessor === "product"
            ? products &&
              products.map((p) => ({
                id: p.pId,
                title: convertToFarsiDigits(p.n),
              }))
            : undefined,
        setSearch: item.accessor === "product" ? setSearch : undefined,
        Cell:
          item.accessor === "icons"
            ? ({ row }: any) => {
                return (
                  <div className="flex w-full">
                    {canEditForm1 && (
                      <img
                        src={row.original.isDeleted ? RestoreIcon : TrashIcon}
                        onClick={() => updateToDeleted(row)}
                        className="cursor-pointer"
                        alt="TrashIcon"
                      />
                    )}
                    <img
                      src={HistoryIcon}
                      onClick={() => handleShowHistory(row)}
                      className="cursor-pointer"
                      alt="HistoryIcon"
                    />
                  </div>
                );
              }
            : item.Cell,
      };
    });
  }, [products, setSearch]);

  ////////////////////////////////////////////////////////
  const handleShowHistory = (row: any) => {
    if (row.original.pId !== 0) {
      console.log(row.original.pId, "row.original.pId");
      setProductPermDtlHistoryField("pId", row.original.pId);
      setShowHistory(true);
    }
  };

  const updateToDeleted = (row: any) => {
    setOriginalData((old) =>
      old.map((origRow) => {
        if (
          origRow.id === row.original.id &&
          origRow.pId === row.original.pId
        ) {
          return { ...origRow, isDeleted: !origRow.isDeleted };
        }
        return origRow;
      })
    );
  };
  ///////////////////////////////////////////////////////
  useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", brandSearch);
  }, [brandSearch, systemId]);
  ///////////////////////////////////////////////////////
  const newRow: ProductPermListItemTable = {
    id: 0,
    pId: 0,
    bName: "",
    product: "",
    lastDate: "",
    npo: false,
    np: false,
    npCk: null,
    dtlDsc: "",
    deleted: false,
    isDeleted: false,
  };

  const handleShowDeleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDeleted(e.target.checked);
  };
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: number;
    if (isModalOpen) {
      timeoutId = setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalOpen]);

  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (
      isNew === false &&
      selectedProductPerm !== null &&
      (selectedProductPerm.flwId === 0 || fromWorkFlow) &&
      productPermDtls !== undefined
    ) {
      //for edit
      console.log(productPermDtls, "productPermDtls");
      setAddList(
        productPermDtls.map((item) => ({
          ...item,
          npo: item.np,
          id: item.id,
          pId: item.pId,
          bName: item.bName,
          product: item.product,
          lastDate: item.lastDate,
          np: item.np,
          npCk: item.np ? (
            <img src={Accept} alt="Accept" className="w-4 h-4" />
          ) : null,
          dtlDsc: item.dtlDsc,
          deleted: item.deleted,
          isDeleted: false,
          index: productPermDtls.length + 1,
        }))
      );
    }
  }, [selectedProductPerm]);
  ////////////////////////////////////////////////////////

  //send params to /api/Product/search?accSystem=4&accYear=15&page=1&searchTerm=%D8%B3%D9%81
  useEffect(() => {
    setProductField("accSystem", systemId);
    setProductField("accYear", yearId);
    //setProductField("searchTerm", convertToFarsiDigits(search));
    handleDebounceFilterChange("searchTerm", convertToFarsiDigits(search));
    setProductField("page", 1);
  }, [search, systemId, yearId]);
  ///////////////////////////////////////////////////////
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setProductField(field as keyof ProductSearchRequest, value);
    }, 500),
    [setProductField]
  );
  ////////////////////////////////////////////////////////
  const handleSubmit = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    productId: number = 0
  ): Promise<ProductPermListResponse | undefined> => {
    if (e) e.preventDefault();
    let request: ProductPermListRequest;
    request = {
      id: 0,
      productId: productId,
      yearId: yearId,
      systemId: systemId,
      brands: brand?.map((b) => Number(b.id)) ?? [],
    };

    console.log(request, "request");
    try {
      return await addProductList(request);
    } catch (error) {
      console.error("Error editing indents:", error);
    }
  };
  ////////////////////////////////////////////////////////
  const handleSubmitAndAddToTable = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number = 0
  ) => {
    const res = await handleSubmit(e, productId);
    console.log(res?.data.result, "res");
    if (res && res.data.result) {
      // Map through the new products
      res.data.result.forEach((product) => {
        setAddList((prev) => [
          ...prev,
          {
            id: product.id,
            pId: product.pId,
            bName: product.bName,
            product: product.product,
            lastDate: product.lastDate,
            npo: false,
            np: product.np,
            npCk: product.np ? (
              <img src={Accept} alt="Accept" className="w-4 h-4" />
            ) : null,
            dtlDsc: product.dtlDsc,
            deleted: product.deleted,
            isDeleted: false,
          },
        ]);
      });
      setAddList((prev) => [
        ...prev,
        {
          ...newRow,
          //index: addList.length + 1,
          isDeleted: false,
        },
      ]);
    }
  };
  ///////////////////////////////////////////////////////
  const handleAddRow = (
    index: number,
    setData: Dispatch<SetStateAction<ProductPermListItemTable2[]>>
  ) => {
    setData((prev: ProductPermListItemTable2[]) => [
      ...prev,
      { ...newRow, index: index },
    ]);
  };
  ////////////////////////////////////////////////////////
  const handleSubmitSave = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ): Promise<ProductPermSaveResponse | undefined> => {
    if (e) e.preventDefault();
    let request: ProductPermSaveRequest;
    const dtls = originalData
      .filter((item) => item.pId !== 0)
      .map((item) => {
        const dtl = {
          id: item.id,
          pId: item.pId,
          np: item.np,
          dtlDsc: item.dtlDsc,
          deleted: item.isDeleted,
        };
        return dtl;
      });

    request = {
      chartId: chartId,
      id: isNew ? 0 : selectedProductPerm?.id ?? 0, //if isNew is true, id is 0, otherwise id is selectedProductPerm?.id for edit
      systemId: systemId,
      yearId: yearId,
      dsc: convertToLatinDigits(dsc),
      dat: convertToLatinDigits(dat),
      tim: convertToLatinDigits(tim),
      saveAndSend: false,
      dtls: dtls,
    };
    console.log(request);
    try {
      const response = await productPermSave(request);
      setIsModalRegOpen(true);
      //setIsNew(false);
      //setIsEdit(false);
      return response;
      //console.log( "request");
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
  ///////////////////////////////////////////////////////
  return (
    <div className="flex flex-col gap-2">
      <ProductOfferFormParams
        isNew={isNew}
        selectedProductOffer={selectedProductPerm}
        dat={dat}
        tim={tim}
        dsc={dsc}
        setDat={setDat}
        setTim={setTim}
        setDsc={setDsc}
        brand={brand}
        setBrand={setBrand}
        setBrandSearch={setBrandSearch}
        canEditForm1={canEditForm1}
      />
      <ConfirmCard
        variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end"
        backgroundColor="transparent"
      >
        {canEditForm1 && (
          <Button
            text="ایجاد لیست"
            backgroundColor="bg-white"
            color="text-blue-500"
            backgroundColorHover="bg-blue-500"
            colorHover="text-white"
            variant="shadow-lg"
            onClick={handleSubmitAndAddToTable}
          />
        )}
        <Button
          text="اکسل"
          backgroundColor="bg-white"
          color="text-green-500"
          backgroundColorHover="bg-green-500"
          colorHover="text-white"
          variant="shadow-lg"
          onClick={() =>
            handleExport({
              data: originalData,
              setIsModalOpen,
              headCells: columns,
              fileName,
            })
          }
        />
      </ConfirmCard>
      <div className="flex items-center justify-between gap-4">
        <label className="text-lg font-bold">اقلام</label>
        <hr className="w-full border-2 border-gray-300" />
        <div className="flex gap-2 items-center justify-end w-32">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={handleShowDeleted}
          />
          <p className="text-sm whitespace-nowrap">نمایش حذف شده ها</p>
        </div>
      </div>

      <ProductPermFormList
        canEditForm1={canEditForm1}
        setIsNew={setIsNew}
        setIsEdit={setIsEdit}
        columns={columns}
        originalData={originalData}
        setOriginalData={setOriginalData}
        isLoadingProductOfferSave={isLoadingProductPermSave}
        handleSubmitSave={handleSubmitSave}
        isDtlHistoryLoading={isLoadingDtlHistory}
        handleSubmit={handleSubmit}
        addList={addList}
        handleAddRow={handleAddRow}
        showDeleted={showDeleted}
        productPermDtlHistory={productPermDtlHistory}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isModalRegOpen={isModalRegOpen}
        setIsModalRegOpen={setIsModalRegOpen}
      />
    </div>
  );
};

export default ProductPermForm;
