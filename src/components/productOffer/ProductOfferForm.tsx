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
import ProductOfferFormParams from "./ProductOfferFormParams";
import { DefaultOptionTypeStringId, TableColumns } from "../../types/general";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import { handleExport } from "../../utilities/ExcelExport";
import {
  Dtl,
  ProductOffer,
  ProductOfferDtl,
  ProductOfferDtlHistory,
  ProductOfferProductTable,
  ProductOfferProductTable2,
  ProductOfferSaveRequest,
  ProductOfferSaveResponse,
  ShowProductListRequest,
  ShowProductListResponse,
} from "../../types/productOffer";
import { useGeneralContext } from "../../context/GeneralContext";
import ProductOfferFormList from "./ProductOfferFormList";
import {
  convertToFarsiDigits,
  convertToLatinDigits,
} from "../../utilities/general";
import { useProducts } from "../../hooks/useProducts";
import { useProductStore } from "../../store/productStore";
//import { useBrandStore } from "../../store/brandStore";
import { EditableInput } from "../controls/TTable";
import { useProductOfferStore } from "../../store/productOfferStore";
import { DefinitionDateTime } from "../../types/definitionInvironment";

type Props = {
  isLoadingAddList: boolean;
  addProductList: (
    request: ShowProductListRequest
  ) => Promise<ShowProductListResponse>;
  productOfferDtlHistory: ProductOfferDtlHistory[];
  isLoadingProductOfferDtlHistory: boolean;
  productOfferSave: (
    request: ProductOfferSaveRequest
  ) => Promise<ProductOfferSaveResponse>;
  isLoadingProductOfferSave: boolean;
  selectedProductOffer: ProductOffer | null;
  productOfferDtls: ProductOfferDtl[] | undefined;
  isNew: boolean;
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  fromWorkFlow: boolean;
  canEditForm1: boolean;
  selectedId: number;
  setSelectedRowIndex?: (value: SetStateAction<number>) => void;
  definitionDateTime: DefinitionDateTime;
};

export const headCells = [
  {
    Header: "ردیف",
    accessor: "index",
    width: "2%",
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
    width: "33%",
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
    Header: convertToFarsiDigits("پ 1"),
    accessor: "s1O",
    width: "3%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: convertToFarsiDigits("پ 2"),
    accessor: "s2O",
    width: "3%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: convertToFarsiDigits("پ 3"),
    accessor: "s3O",
    width: "3%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: convertToFarsiDigits("پ 4"),
    accessor: "s4O",
    width: "3%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "پ",
    accessor: "s1N",
    width: "2%",
    type: "inputText",
    noLeftBorder: true,
    align: "left",
    Cell: EditableInput,
  },
  {
    Header: convertToFarsiDigits("1"),
    accessor: "s1D",
    width: "2%",
    type: "inputText",
    align: "right",
    Cell: EditableInput,
  },
  {
    Header: "پ",
    accessor: "s2N",
    width: "2%",
    type: "inputText",
    noLeftBorder: true,
    align: "left",
    Cell: EditableInput,
  },
  {
    Header: convertToFarsiDigits("2"),
    accessor: "s2D",
    width: "2%",
    type: "inputText",
    align: "right",
    Cell: EditableInput,
  },
  {
    Header: "پ",
    accessor: "s3N",
    width: "2%",
    type: "inputText",
    noLeftBorder: true,
    align: "left",
    Cell: EditableInput,
  },
  {
    Header: convertToFarsiDigits("3"),
    accessor: "s3D",
    width: "2%",
    type: "inputText",
    align: "right",
    Cell: EditableInput,
  },
  {
    Header: "پ",
    accessor: "s4N",
    width: "2%",
    type: "inputText",
    noLeftBorder: true,
    align: "left",
    Cell: EditableInput,
  },
  {
    Header: convertToFarsiDigits("4"),
    accessor: "s4D",
    width: "2%",
    type: "inputText",
    align: "right",
    Cell: EditableInput,
  },
  {
    Header: "آفر",
    accessor: "no",
    width: "2%",
    type: "checkbox",
    Cell: EditableInput,
  },
  {
    Header: "توضیح",
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

const ProductOfferForm = ({
  canEditForm1,
  isLoadingAddList,
  addProductList,
  productOfferDtlHistory,
  isLoadingProductOfferDtlHistory,
  productOfferSave,
  isLoadingProductOfferSave,
  selectedProductOffer,
  productOfferDtls,
  isNew,
  setIsNew,
  setIsEdit,
  fromWorkFlow,
  selectedId,
  setSelectedRowIndex,
  definitionDateTime,
}: Props) => {
  const [addList, setAddList] = useState<ProductOfferProductTable[]>([]);
  //const [search, setSearch] = useState<string>("");
  const [showDeleted, setShowDeleted] = useState(true);
  const [brand, setBrand] = useState<DefaultOptionTypeStringId[] | null>([]);
  //const [brandSearch, setBrandSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const { setField: setProductOfferDtlHistoryField } = useProductOfferStore();
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<ProductOfferProductTable2[]>(
    []
  );
  const [dat, setDat] = useState<string>("");
  const [tim, setTim] = useState<string>("");
  const [dsc, setDsc] = useState<string>("");
  const [isModalRegOpen, setIsModalRegOpen] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [productOfferSaveResponse, setProductOfferSaveResponse] = useState<ProductOfferSaveResponse>({
    meta: { errorCode: 0, message: "", type: "" },
    data: { result: { systemId: 0, id: 0, err: 0, msg: "", hasFlow: false } },
  });


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
        fetchNextPage:
          item.accessor === "product" ? productSearchFetchNextPage : undefined,
        hasNextPage:
          item.accessor === "product" ? productSearchHasNextPage : undefined,
        isFetchingNextPage:
          item.accessor === "product" ? isProductSearchFetchingNextPage : false,
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
  const excelHeadCellsList: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
    },
    {
      Header: "برند",
      accessor: "bName",
    },
    {
      Header: "کد کالا",
      accessor: "productCode",
    },
    {
      Header: "نام کالا",
      accessor: "product",
    },
    {
      Header: "پ 1",
      accessor: "s1",
    },
    {
      Header: "پ 2",
      accessor: "s2",
    },
    {
      Header: "پ 3",
      accessor: "s3",
    },
    {
      Header: "پ 4",
      accessor: "s4",
    },
    {
      Header: "بدون آفر",
      accessor: "no",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
    },
  ];
  const handleShowHistory = (row: any) => {
    if (row.original.pId !== 0) {
      console.log(row.original, "row in product offer form");
      setProductOfferDtlHistoryField("pId", row.original.pId);
      setProductOfferDtlHistoryField("pIdTrigger", Date.now());
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
  /*useEffect(() => {
    setBrandField("accSystem", systemId);
    setBrandField("search", brandSearch);
  }, [brandSearch, systemId]);*/

  const newRow: ProductOfferProductTable = {
    id: 0,
    pId: 0,
    bName: "",
    productCode: "",
    product: "",
    lastDate: "",
    s1O: "",
    s2O: "",
    s3O: "",
    s4O: "",
    s1N: "",
    s1D: "",
    s2N: "",
    s2D: "",
    s3N: "",
    s3D: "",
    s4N: "",
    s4D: "",
    dtlDsc: "",
    deleted: false,
    no: false,
    //index: 0,
    isDeleted: false,
  };
  ////////////////////////////////////////////////////////
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
  useEffect(() => {
    if (
      isNew === false &&
      selectedProductOffer !== null &&
      (selectedProductOffer.flwId === 0 || fromWorkFlow) &&
      productOfferDtls !== undefined
    ) {
      //for edit
      const temp:ProductOfferProductTable[] = productOfferDtls.map((item) => ({
        ...item,
        s1O:
          item.s1NO + item.s1DO > 0
            ? item.s1DO.toString() + "+" + item.s1NO.toString()
            : "",
        s2O:
          item.s2NO + item.s2DO > 0
            ? item.s2DO.toString() + "+" + item.s2NO.toString()
            : "",
        s3O:
          item.s3NO + item.s3DO > 0
            ? item.s3DO.toString() + "+" + item.s3NO.toString()
            : "",
        s4O:
          item.s4NO + item.s4DO > 0
            ? item.s4DO.toString() + "+" + item.s4NO.toString()
            : "",
        isDeleted: false,
        no: item.no,
        dtlDsc: item.dtlDsc,
        deleted: item.deleted,
        index: productOfferDtls.length + 1,
        id: item.id,
        pId: item.pId,
        bName: item.bName,
        product: item.product,
        lastDate: item.lastDate,
        s1N: item.s1N + item.s1D > 0 ? item.s1N.toString() : "",
        s1D: item.s1D + item.s1N > 0 ? item.s1D.toString() : "",
        s2N: item.s2N + item.s2D > 0 ? item.s2N.toString() : "",
        s2D: item.s2D + item.s2N > 0 ? item.s2D.toString() : "",
        s3N: item.s3N + item.s3D > 0 ? item.s3N.toString() : "",
        s3D: item.s3D + item.s3N > 0 ? item.s3D.toString() : "",
        s4N: item.s4N + item.s4D > 0 ? item.s4N.toString() : "",
        s4D: item.s4D + item.s4N > 0 ? item.s4D.toString() : "",
      }))
      temp.push({ ...newRow });
      setAddList(temp);
    }
  }, [selectedProductOffer, productOfferDtls]);
  ////////////////////////////////////////////////////////

  //send params to /api/Product/search?accSystem=4&accYear=15&page=1&searchTerm=%D8%B3%D9%81
  /*useEffect(() => {
    if (canEditForm1) {
      setProductField("productSearchAccSystem", systemId);
      setProductField("productSearchAccYear", yearId);
      handleDebounceFilterChange("productSearchSearch", search);
    }
  }, [search, systemId, yearId]);
  ///////////////////////////////////////////////////////
  const abortControllerRef = useRef<AbortController | null>(null);
  const handleDebounceFilterChange = useCallback(
    debounce((field: string, value: string | number) => {
      console.log(field, value, "field, value in product offer form");
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
  ): Promise<ShowProductListResponse | undefined> => {
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
      brands: brand?.map((b) => b.id) ?? [],
    };
    const res = await handleSubmit(e, request);
    console.log(res?.data.result, "res");
    if (res && res.data.result) {
      // Map through the new products
      res.data.result.forEach((product) => {
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
              productCode: product.productCode,
              product: product.product,
              lastDate: product.lastDate,
              s1O:
                product.s1NO + product.s1DO > 0
                  ? product.s1DO.toString() + "+" + product.s1NO.toString()
                  : "",
              s2O:
                product.s2NO + product.s2DO > 0
                  ? product.s2DO.toString() + "+" + product.s2NO.toString()
                  : "",
              s3O:
                product.s3NO + product.s3DO > 0
                  ? product.s3DO.toString() + "+" + product.s3NO.toString()
                  : "",
              s4O:
                product.s4NO + product.s4DO > 0
                  ? product.s4DO.toString() + "+" + product.s4NO.toString()
                  : "",
              s1N: "",
              s1D: "",
              s2N: "",
              s2D: "",
              s3N: "",
              s3D: "",
              s4N: "",
              s4D: "",
              dtlDsc: product.dtlDsc,
              deleted: product.deleted,
              no: false,
              //index: index + 1,
              isDeleted: false,
            },
          ];
        });
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
    setData: Dispatch<SetStateAction<ProductOfferProductTable2[]>>
  ) => {
    setData((prev: ProductOfferProductTable2[]) => [
      ...prev,
      { ...newRow, index: index },
    ]);
  };
  ////////////////////////////////////////////////////////
  const convertToLatinDigitsWithPlus = (value1: string, value2: string) => {
    return Number(convertToLatinDigits(value1)) +
      Number(convertToLatinDigits(value2)) >
      0
      ? convertToLatinDigits(value1).toString() +
      "+" +
      convertToLatinDigits(value2).toString()
      : "";
  };
  ////////////////////////////////////////////////////////
  const handleSubmitSave = (
    e?: React.MouseEvent<HTMLButtonElement>
  ): void => {
    if (e) e.preventDefault();
    let request: ProductOfferSaveRequest;
    const dtls: Dtl[] = originalData
      .filter((item) => item.pId !== 0)
      .map((item) => {
        const dtl: Dtl = {
          id: item.id,
          pId: item.pId,
          s1: convertToLatinDigitsWithPlus(item.s1N, item.s1D),
          s2: convertToLatinDigitsWithPlus(item.s2N, item.s2D),
          s3: convertToLatinDigitsWithPlus(item.s3N, item.s3D),
          s4: convertToLatinDigitsWithPlus(item.s4N, item.s4D),
          no: item.no,
          dtlDsc: item.dtlDsc,
          deleted: item.isDeleted,
        };
        if (
          item.s1N !== "" ||
          item.s2N !== "" ||
          item.s3N !== "" ||
          item.s4N !== "" ||
          item.s1D !== "" ||
          item.s2D !== "" ||
          item.s3D !== "" ||
          item.s4D !== "" ||
          item.dtlDsc !== "" ||
          item.no !== false
        ) {
          return dtl;
        } else {
          return undefined;
        }
      })
      .filter((item) => item !== undefined);
    if (dtls.length === 0) {
      console.log(dtls, "اقلام مشخص نشده!");
      const response: ProductOfferSaveResponse = {
        meta: { errorCode: 1, message: "اقلام مشخص نشده!", type: "" },
        data: { result: { systemId: 0, id: 0, err: 1, msg: "اقلام مشخص نشده!", hasFlow: false } },
      };
      setIsModalRegOpen(true);
      setProductOfferSaveResponse(response);
      return;
    }
    request = {
      chartId: chartId,
      id: isNew ? 0 : selectedProductOffer?.id ?? 0, //if isNew is true, id is 0, otherwise id is selectedProductOffer?.id for edit
      acc_System: systemId,
      acc_Year: yearId,
      dsc: convertToLatinDigits(dsc),
      dat: convertToLatinDigits(dat),
      tim: convertToLatinDigits(tim),
      saveAndSend: false,
      dtls: dtls,
    };
    console.log(request);
    productOfferSave(request)
      .then((response) => {
        setIsModalRegOpen(true);
        console.log(
          setSelectedRowIndex,
          "setSelectedRowIndex in handleSubmitSave"
        );
        //if (setSelectedRowIndex && isNew) setSelectedRowIndex(0);
        setProductOfferSaveResponse(response);
        //console.log( "request");
      })
      .catch((error) => {
        console.error("Error ثبت :", error);
      });
  };
  ///////////////////////////////////////////////////////
  useEffect(() => {
    const tempData = originalData.map((dtl, index) => {
      return {
        index: index + 1,
        bName: convertToFarsiDigits(dtl.bName),
        productCode: convertToFarsiDigits(dtl.productCode),
        product: convertToFarsiDigits(dtl.product),
        s1:
          Number(dtl.s1N) + Number(dtl.s1D) > 0
            ? dtl.s1D.toString() + "+" + dtl.s1N.toString()
            : "",
        s2:
          Number(dtl.s2N) + Number(dtl.s2D) > 0
            ? dtl.s2D.toString() + "+" + dtl.s2N.toString()
            : "",
        s3:
          Number(dtl.s3N) + Number(dtl.s3D) > 0
            ? dtl.s3D.toString() + "+" + dtl.s3N.toString()
            : "",
        s4:
          Number(dtl.s4N) + Number(dtl.s4D) > 0
            ? dtl.s4D.toString() + "+" + dtl.s4N.toString()
            : "",
        no: dtl.no ? "TRUE" : "FALSE",
        dtlDsc: dtl.dtlDsc,
      };
    });
    setExcelData(tempData);
  }, [originalData]);
  return (
    <div className="flex flex-col gap-2">
      <ProductOfferFormParams
        isNew={isNew}
        selectedProductOffer={selectedProductOffer}
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
              data: excelData,
              setIsModalOpen,
              headCells: excelHeadCellsList,
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

      <ProductOfferFormList
        canEditForm1={canEditForm1}
        setIsNew={setIsNew}
        setIsEdit={setIsEdit}
        columns={columns}
        originalData={originalData}
        setOriginalData={setOriginalData}
        productOfferSaveResponse={productOfferSaveResponse}
        isLoadingProductOfferSave={isLoadingProductOfferSave}
        handleSubmitSave={handleSubmitSave}
        isDtlHistoryLoading={isLoadingProductOfferDtlHistory}
        handleSubmit={handleSubmit}
        addList={addList}
        handleAddRow={handleAddRow}
        showDeleted={showDeleted}
        productOfferDtlHistory={productOfferDtlHistory}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isModalRegOpen={isModalRegOpen}
        setIsModalRegOpen={setIsModalRegOpen}
        selectedId={selectedId}
        isNew={isNew}
        isLoadingAddList={isLoadingAddList}
      />
    </div>
  );
};

export default ProductOfferForm;
