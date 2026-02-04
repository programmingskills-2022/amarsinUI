import TrashIcon from "../../assets/images/GrayThem/delete_gray_16.png";
import HistoryIcon from "../../assets/images/GrayThem/history_gray_16.png";
import RestoreIcon from "../../assets/images/GrayThem/restore_gray_16.png";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
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
//import { useBrandStore } from "../../store/brandStore";
import { EditableInput } from "../controls/TTable";
import ProductOfferFormParams from "../productOffer/ProductOfferFormParams";

import {
  ProductGrace,
  ProductGraceDtl,
  ProductGraceDtlHistory,
  ProductGraceListItem,
  ProductGraceListItemTable,
  ProductGraceListItemTable2,
  ProductGraceListResponse,
  ProductGraceSaveRequest,
  ProductGraceSaveResponse,
} from "../../types/productGrace";
import { useProductGraceStore } from "../../store/productGraceStore";
import ProductGraceFormList from "./ProductGraceFormList";
import { colors } from "../../utilities/color";
import { ShowProductListRequest } from "../../types/productOperation";
import { DefinitionDateTime } from "../../types/definitionInvironment";

type Props = {
  addProductList: (
    request: ShowProductListRequest
  ) => Promise<ProductGraceListResponse>;
  productGraceDtlHistory: ProductGraceDtlHistory[];
  isLoadingDtlHistory: boolean;
  productGraceSave: (
    request: ProductGraceSaveRequest
  ) => Promise<ProductGraceSaveResponse>;
  isLoadingProductGraceSave: boolean;
  selectedProductGrace: ProductGrace | null;
  productGraceDtls: ProductGraceDtl[] | undefined;
  isNew: boolean;
  setIsNew: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: (isEdit: boolean) => void;
  fromWorkFlow: boolean; //for check if the form is from work flow
  canEditForm1: boolean;
  selectedId: number;
  setSelectedRowIndex?: (value: SetStateAction<number>) => void;
  definitionDateTime: DefinitionDateTime;
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
    width: "31%",
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
    Header: "فرجه",
    accessor: "gdo",
    width: "3%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "فروش",
    accessor: "sco",
    width: "3%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "وصول",
    accessor: "cco",
    width: "3%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "مازاد",
    accessor: "eco",
    width: "3%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "فرجه کالا",
    accessor: "gd",
    width: "4%",
    type: "inputText",
    backgroundColor: colors.indigo50,
    Cell: EditableInput,
  },
  {
    Header: "فروش",
    accessor: "sc",
    width: "4%",
    type: "inputText",
    backgroundColor: colors.indigo50,
    Cell: EditableInput,
  },
  {
    Header: "وصول",
    accessor: "cc",
    width: "4%",
    type: "inputText",
    backgroundColor: colors.indigo50,
    Cell: EditableInput,
  },
  {
    Header: "مازاد",
    accessor: "ec",
    width: "4%",
    type: "inputText",
    backgroundColor: colors.indigo50,
    Cell: EditableInput,
  },
  {
    Header: "شرح",
    accessor: "dtlDsc",
    width: "18%",
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

const ProductGraceForm = ({
  addProductList,
  productGraceDtlHistory,
  isLoadingDtlHistory,
  productGraceSave,
  isLoadingProductGraceSave,
  selectedProductGrace,
  productGraceDtls,
  fromWorkFlow,
  isNew,
  setIsNew,
  setIsEdit,
  canEditForm1,
  selectedId,
  setSelectedRowIndex,
  definitionDateTime,
}: Props) => {
  const [addList, setAddList] = useState<ProductGraceListItemTable[]>([]);
  //const [search, setSearch] = useState<string>("");
  const [showDeleted, setShowDeleted] = useState(true);
  const [brand, setBrand] = useState<DefaultOptionTypeStringId[] | null>([]);
  //const [brandSearch, setBrandSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEmptyOpen, setIsModalEmptyOpen] = useState(false);
  const fileName = "data_export.xlsx";
  const {
    products,
    isProductSearchLoading,
    productSearchFetchNextPage,
    productSearchHasNextPage,
    isProductSearchFetchingNextPage,
  } = useProducts();
  const { setField: setProductField } = useProductStore();
  const { yearId, systemId, chartId } = useGeneralContext();
  //const { setField: setBrandField } = useBrandStore();
  const { setField: setProductGraceDtlHistoryField } = useProductGraceStore();
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<
    ProductGraceListItemTable2[]
  >([]);
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
                title: p.n,
              }))
            : undefined,
        //setSearch: item.accessor === "product" ? setSearch : undefined,
        isLoading: item.accessor === "product" ? isProductSearchLoading : false,
        setField: item.accessor === "product" ? setProductField : undefined,
        fieldValues:
          item.accessor === "product"
            ? [
                { field: "productSearchAccSystem", value: systemId },
                { field: "productSearchAccYear", value: yearId },
                { field: "productSearchPage", value: 1 },
              ]
            : undefined,
        fieldSearch:
          item.accessor === "product" ? "productSearchSearch" : undefined,
        fetchNextPage:
          item.accessor === "product" ? productSearchFetchNextPage : undefined,
        hasNextPage:
          item.accessor === "product" ? productSearchHasNextPage : undefined,
        isFetchingNextPage:
          item.accessor === "product" ? isProductSearchFetchingNextPage : false,         
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
  }, [products]);
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  //for excel head cells
  const excelHeadCells: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
    },
    {
      Header: "برند",
      accessor: "bName",
    },
    {
      Header: "کد",
      accessor: "productCode",
    },
    {
      Header: "کالا",
      accessor: "product",
    },
    {
      Header: "فرجه",
      accessor: "gd",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
    },
  ];
  const handleShowHistory = (row: any) => {
    if (row.original.pId !== 0) {
      console.log(row.original.pId, "row.original.pId");
      setProductGraceDtlHistoryField("pId", row.original.pId);
      setProductGraceDtlHistoryField("pIdTrigger", Date.now());
      setShowHistory(true);
    }
  };
  ////////////////////////////////////////////////////////
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
  /*useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", brandSearch);
  }, [brandSearch, systemId]);*/
  ///////////////////////////////////////////////////////
  const newRow: ProductGraceListItemTable = {
    id: 0,
    pId: 0,
    bName: "",
    product: "",
    lastDate: "",
    gd: 0,
    sc: 0,
    cc: 0,
    ec: 0,
    gdo: 0,
    sco: 0,
    cco: 0,
    eco: 0,
    dtlDsc: "",
    deleted: false,
    isDeleted: false,
  };

  const handleShowDeleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDeleted(e.target.checked);
  };
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
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
    if (isNew && addList.length === 0) {
      setAddList([newRow]);
    }
  }, []);
  ////////////////////////////////////////////////////////
  useEffect(()=>{
    setProductField("acc_YearIndentRequest",-1) 
  },[])
  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (
      isNew === false &&
      selectedProductGrace !== null &&
      (selectedProductGrace.flwId === 0 || fromWorkFlow) &&
      productGraceDtls !== undefined
    ) {
      //for edit
      const loadData = async () => {
        const results:any[] = await Promise.all(
          productGraceDtls.map(async (item) => {
            /*const request = {
              id: 0,
              productId: item.pId,
              acc_Year: yearId,
              brands: brand?.map((b) => Number(b.id)) ?? [],
            };*/
            //const res = await handleSubmit(undefined, request);
            //console.log(res, "res");
            console.log(item, "item");
            return {
              ...item,
              id: item.id,
              pId: item.pId,
              bName: item.bName,
              product: item.product,
              lastDate: item.lastDate,
              gd: item.gd,
              sc: item.sc,
              cc: item.cc,
              ec: item.ec,
              gdo:0,
                //res?.data.result.productGraceProducts[0].gdo ?? 0, //item.gdo > 0 ? item.gdo : 0,
              sco:0,
                //res?.data.result.productGraceProducts[0].sco ?? 0, //item.sco > 0 ? item.sco : 0,
              cco:0,
                //res?.data.result.productGraceProducts[0].cco ?? 0, //item.cco > 0 ? item.cco : 0,
              eco:0,
                //es?.data.result.productGraceProducts[0].eco ?? 0, //item.eco > 0 ? item.eco : 0,
              dtlDsc: item.dtlDsc,
              deleted: item.deleted,
              isDeleted: false,
              index: productGraceDtls.length + 1,
            };
          })
        );
        results.push({ ...newRow });
        setAddList(results);
      };
      loadData();
    }
  }, [selectedProductGrace, productGraceDtls]);
  ////////////////////////////////////////////////////////

  //send params to /api/Product/search?accSystem=4&accYear=15&page=1&searchTerm=%D8%B3%D9%81
  /*useEffect(() => {
    if (canEditForm1) {
      setProductField("salesPricesSearchPage",-1)
      setProductField("productSearchAccSystem", systemId);
      setProductField("productSearchAccYear", yearId);
      handleDebounceFilterChange("productSearchSearch", search);
      setProductField("productSearchPage", 1);
    }
    // to not allow calling salesPricesSearch when productSearch is called
    //setProductField("salesPricesSearchPage", -1);
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
  );*/
  ////////////////////////////////////////////////////////
  const handleSubmit = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    request?: ShowProductListRequest
  ): Promise<ProductGraceListResponse | undefined> => {
    if (e) e.preventDefault();
    if (!request) return;
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
    const request = {
      id: 0,
      productId: productId,
      acc_Year: yearId,
      brands: brand?.map((b) => Number(b.id)) ?? [],
    };
    console.log("come to handleSubmitAndAddToTable")
    const res = await handleSubmit(e, request);
    if (res && res.data.result) {
      // Map through the new products
      res.data.result.productGraceProducts.forEach(
        (product: ProductGraceListItem) => {
          setAddList((prev) => {
            // Filter out newRow entries (empty rows) before adding new records
            // Check by properties since items might be clones of newRow
            const filteredPrev = prev.filter((item) => {
              // Remove items that match newRow pattern (id === 0 and product is empty)
              return !(item.id === 0 && item.product === "" && item.pId === 0);
            });
            return [
              ...filteredPrev,
              {
                id: product.id,
                pId: product.pId,
                bName: product.bName,
                product: product.product,
                lastDate: product.lastDate,
                gd: product.gdo > 0 ? product.gdo : 0, //مقادیر جدید
                sc: product.sco > 0 ? product.sco : 0,
                cc: product.cco > 0 ? product.cco : 0,
                ec: product.eco > 0 ? product.eco : 0,
                gdo: product.gdo > 0 ? product.gdo : 0, //مقادیر قدیمی
                sco: product.sco > 0 ? product.sco : 0,
                cco: product.cco > 0 ? product.cco : 0,
                eco: product.eco > 0 ? product.eco : 0,
                dtlDsc: product.dtlDsc,
                deleted: product.deleted,
                isDeleted: false,
              },
            ];
          });
        }
      );
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
    setData: Dispatch<SetStateAction<ProductGraceListItemTable2[]>>
  ) => {
    setData((prev: ProductGraceListItemTable2[]) => [
      ...prev,
      { ...newRow, index: index },
    ]);
  };
  ////////////////////////////////////////////////////////
  const handleSubmitSave = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ): Promise<string | undefined> => {
    if (e) e.preventDefault();
    let request: ProductGraceSaveRequest;
    const dtls = originalData
      .filter((item) => item.pId !== 0)
      .map((item) => {
        const dtl = {
          id: item.id,
          pId: item.pId,
          gd: Number(convertToLatinDigits(item.gd.toString())),
          sc: Number(convertToLatinDigits(item.sc.toString())),
          cc: Number(convertToLatinDigits(item.cc.toString())),
          ec: Number(convertToLatinDigits(item.ec.toString())),
          dtlDsc: item.dtlDsc,
          deleted: item.isDeleted,
        };

        if (
          Number(convertToLatinDigits(item.gd.toString())) === 0 ||
          Number(convertToLatinDigits(item.sc.toString())) !== 0 ||
          Number(convertToLatinDigits(item.cc.toString())) !== 0 ||
          Number(convertToLatinDigits(item.ec.toString())) !== 0
        ) {
          return dtl;
        } else {
          return undefined;
        }
      })
      .filter((item) => item !== undefined);

    console.log(dtls, "dtls");
    if (dtls.length === 0) {
      setIsModalEmptyOpen(true);
      return "اقلام مشخص نشده!";
    }
    request = {
      chartId: chartId,
      id: isNew ? 0 : selectedProductGrace?.id ?? 0, //if isNew is true, id is 0, otherwise id is selectedProductPerm?.id for edit
      acc_System: systemId,
      acc_Year: yearId,
      dsc: convertToLatinDigits(dsc),
      dat: convertToLatinDigits(dat),
      tim: convertToLatinDigits(tim),
      saveAndSend: false,
      dtls: dtls,
    };
    console.log(request);
    try {
      await productGraceSave(request);
      setIsModalRegOpen(true);
      //setIsNew(false);
      //setIsEdit(false);
      if (setSelectedRowIndex && isNew) setSelectedRowIndex(0);
      return "اطلاعات با موفقیت ثبت شد.";
      //console.log( "request");
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
  //////////////////////////////////////////////////////
  return (
    <div className="flex flex-col gap-2">
      <ProductOfferFormParams
        isNew={isNew}
        selectedProductOffer={selectedProductGrace}
        dat={dat}
        tim={tim}
        dsc={dsc}
        setDat={setDat}
        setTim={setTim}
        setDsc={setDsc}
        brand={brand}
        setBrand={setBrand}
        //setBrandSearch={setBrandSearch}
        canEditForm1={canEditForm1}
        definitionDateTime={definitionDateTime}
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
              headCells: excelHeadCells,
              fileName,
              hasPersianTitle: true,
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

      <ProductGraceFormList
        canEditForm1={canEditForm1}
        setIsNew={setIsNew}
        isNew={isNew}
        setIsEdit={setIsEdit}
        columns={columns}
        originalData={originalData}
        setOriginalData={setOriginalData}
        isLoadingProductOfferSave={isLoadingProductGraceSave}
        handleSubmitSave={handleSubmitSave}
        isDtlHistoryLoading={isLoadingDtlHistory}
        handleSubmit={handleSubmit}
        addList={addList}
        handleAddRow={handleAddRow}
        showDeleted={showDeleted}
        productGraceDtlHistory={productGraceDtlHistory}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isModalRegOpen={isModalRegOpen}
        setIsModalRegOpen={setIsModalRegOpen}
        isModalEmptyOpen={isModalEmptyOpen} //if user not fill the grace, this modal will open
        setIsModalEmptyOpen={setIsModalEmptyOpen} //if user not fill the grace, this modal will open
        selectedId={selectedId}
      />
    </div>
  );
};

export default ProductGraceForm;
