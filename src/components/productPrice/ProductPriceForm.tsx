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
  currencyStringToNumber,
  formatNumberWithCommas,
} from "../../utilities/general";
import { useProducts } from "../../hooks/useProducts";
import { useProductStore } from "../../store/productStore";
import { v4 as uuidv4 } from "uuid";
//import { useBrandStore } from "../../store/brandStore";
import { EditableInput } from "../controls/TTable";
import ProductOfferFormParams from "../productOffer/ProductOfferFormParams";

import {
  ProductPrice,
  ProductPriceDtl,
  ProductPriceDtlHistory,
  ProductPriceListItemTable,
  ProductPriceListItemTable2,
  ProductPriceListResponse,
  ProductPriceSaveRequest,
  ProductPriceSaveResponse,
} from "../../types/productPrice";
import { useProductPriceStore } from "../../store/productPriceStore";
import ProductPriceFormList from "./ProductPriceFormList";
import { ShowProductListRequest } from "../../types/productOperation";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../utilities/color";
import ModalForm from "../layout/ModalForm";
import PayRequestAttachment from "../payRequest/PayRequestAttachment";
import { useAttachmentStore } from "../../store/attachmentStore";
import { DefinitionDateTime } from "../../types/definitionInvironment";

type Props = {
  addProductList: (
    request: ShowProductListRequest
  ) => Promise<ProductPriceListResponse>;
  productPriceDtlHistory: ProductPriceDtlHistory[];
  isLoadingDtlHistory: boolean;
  productPriceSave: (
    request: ProductPriceSaveRequest
  ) => Promise<ProductPriceSaveResponse>;
  isLoadingProductPriceSave: boolean;
  selectedProductPrice: ProductPrice | null;
  productPriceDtls: ProductPriceDtl[] | undefined;
  isNew: boolean;
  isEdit: boolean;
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
    width: "26%",
    type: "autoComplete",
    placeholder: "کالا را انتخاب کنید...",
    Cell: EditableInput,
  },
  {
    Header: "قیمت خرید",
    accessor: "lastBuyPrice",
    width: "4%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "مالیات",
    accessor: "tax",
    width: "2%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "تغییر",
    accessor: "lastDate",
    width: "4%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "پخش",
    accessor: "p1O",
    width: "4%",
    Cell: ({ value }: any) =>
      convertToFarsiDigits(formatNumberWithCommas(value ?? 0)),
  },
  {
    Header: "داروخانه",
    accessor: "p2O",
    width: "4%",
    Cell: ({ value }: any) =>
      convertToFarsiDigits(formatNumberWithCommas(value ?? 0)),
  },
  {
    Header: "مصرف کننده",
    accessor: "p3O",
    width: "4%",
    Cell: ({ value }: any) =>
      convertToFarsiDigits(formatNumberWithCommas(value ?? 0)),
  },
  {
    Header: "مشتری",
    accessor: "p4O",
    width: "4%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "مشتری",
    accessor: "p5O",
    width: "3%",
    Cell: ({ value }: any) => convertToFarsiDigits(value),
  },
  {
    Header: "پخش",
    accessor: "p1",
    width: "4%",
    type: "inputText",
    isCurrency: true,
    Cell: EditableInput,
  },
  {
    Header: "داروخانه",
    accessor: "p2",
    width: "4%",
    type: "inputText",
    isCurrency: true,
    Cell: EditableInput,
  },
  {
    Header: "مصرف کننده",
    accessor: "p3",
    width: "4%",
    type: "inputText",
    isCurrency: true,
    Cell: EditableInput,
  },
  {
    Header: "مشتری",
    accessor: "p4",
    width: "4%",
    type: "inputText",
    isCurrency: true,
    Cell: EditableInput,
  },
  {
    Header: "مشتری",
    accessor: "p5",
    width: "4%",
    type: "inputText",
    isCurrency: true,
    Cell: EditableInput,
  },
  {
    Header: "شرح",
    accessor: "dtlDsc",
    width: "10%",
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

const ProductPriceForm = ({
  canEditForm1,
  addProductList,
  productPriceDtlHistory,
  isLoadingDtlHistory,
  productPriceSave,
  isLoadingProductPriceSave,
  selectedProductPrice,
  productPriceDtls,
  isNew,
  isEdit,
  setIsNew,
  setIsEdit,
  fromWorkFlow,
  selectedId,
  setSelectedRowIndex,
  definitionDateTime,
}: Props) => {
  const [addList, setAddList] = useState<any[]>([]);
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
  const { setField: setProductPriceDtlHistoryField } = useProductPriceStore();
  const { authApiResponse } = useAuthStore();
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<
    ProductPriceListItemTable2[]
  >([]);
  const [dat, setDat] = useState<string>("");
  const [tim, setTim] = useState<string>("");
  const [dsc, setDsc] = useState<string>("");
  const [isModalRegOpen, setIsModalRegOpen] = useState(false);
  const [isModalEmptyOpen, setIsModalEmptyOpen] = useState(false);
  //for attachment
  //const { attachments } = useAttachments();
  const { setField: setAttachmentField } = useAttachmentStore();
  const [showAttachment, setShowAttachment] = useState<boolean>(false);
  const [guid, setGuid] = useState<string>("");
  const [cnt, setCnt] = useState<number>(0);

  ////////////////////////////////////////////////////////
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
  }, [products, systemId, yearId, productSearchFetchNextPage, productSearchHasNextPage, isProductSearchFetchingNextPage]);
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
      Header: "کد کالا",
      accessor: "productCode",
    },
    {
      Header: "نام کالا",
      accessor: "product",
    },
    {
      Header: "پخش",
      accessor: "p1",
    },
    {
      Header: "داروخانه",
      accessor: "p2",
    },
    {
      Header: "مصرف کننده",
      accessor: "p3",
    },
    {
      Header: "مشتری",
      accessor: "p4",
    },
    {
      Header: "مشتری ",
      accessor: "p5",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
    },
  ];
  ////////////////////////////////////////////////////////
  const handleShowHistory = (row: any) => {
    if (row.original.pId !== 0) {
      console.log(row.original.pId, "row.original.pId");
      setProductPriceDtlHistoryField("pId", row.original.pId);
      setProductPriceDtlHistoryField("pIdTrigger", Date.now());
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
  ///////////////////////////////////////////////////////
  const newRow: ProductPriceListItemTable = {
    id: 0,
    pId: 0,
    bName: "",
    product: "",
    lastDate: "",
    lastBuyPrice: 0,
    tax: 0,
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
    p5: 0,
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
  useEffect(() => {
    console.log(isNew, selectedProductPrice, "selectedProductPrice");
    if (
      isNew === false &&
      selectedProductPrice !== null &&
      (selectedProductPrice.flwId === 0 || fromWorkFlow) &&
      productPriceDtls !== undefined
    ) {
      //for edit
      console.log(productPriceDtls, "productPriceDtls");
      const temp:any[] = productPriceDtls.map((item) => ({
        ...item,
        id: item.id,
        pId: item.pId,
        bName: item.bName,
        product: item.product,
        lastDate: item.lastDate,
        lastBuyPrice: item.lastBuyPrice,
        tax: item.tax,
        p1O: item.p1O,
        p2O: item.p2O,
        p3O: item.p3O,
        p4O: item.p4O,
        p5O: item.p5,
        p1: item.p1,
        p2: item.p2,
        p3: item.p3,
        p4: item.p4,
        p5: item.p5,
        dtlDsc: item.dtlDsc,
        deleted: item.deleted,
        isDeleted: false,
        index: productPriceDtls.length + 1,
      }))
      temp.push({ ...newRow });
      setAddList(temp);
    }
  }, [selectedProductPrice, productPriceDtls]);
  ////////////////////////////////////////////////////////
  const handleSubmit = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    request?: ShowProductListRequest
  ): Promise<ProductPriceListResponse | undefined> => {
    if (e) e.preventDefault();
    if (!request) return;
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
              product: product.product,
              lastDate: product.lastDate,
              lastBuyPrice: product.lastBuyPrice,
              tax: product.tax,
              p1O: product.p1O > 0 ? product.p1O : 0,
              p2O: product.p2O > 0 ? product.p2O : 0,
              p3O: product.p3O > 0 ? product.p3O : 0,
              p4O: product.p4O > 0 ? product.p4O : 0,
              p5O: product.p5O > 0 ? product.p5O : 0,
              dtlDsc: product.dtlDsc,
              deleted: product.deleted,
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
    setData: Dispatch<SetStateAction<ProductPriceListItemTable2[]>>
  ) => {
    setData((prev: ProductPriceListItemTable2[]) => [
      ...prev,
      { ...newRow, index: index },
    ]);
  };
  ////////////////////////////////////////////////////////
  const handleSubmitSave = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    skipWarning: boolean = false
  ): Promise<ProductPriceSaveResponse | undefined> => {
    //: Promise<string | undefined>
    if (e) e.preventDefault();
    let request: ProductPriceSaveRequest;
    const dtls = originalData
      .filter((item) => item.pId !== 0)
      .map((item) => {
        const dtl = {
          id: item.id,
          pId: item.pId,
          ordr: 0,
          p1: Number(
            currencyStringToNumber(convertToLatinDigits(item.p1?.toString())) ??
            0
          ),
          p2: Number(
            currencyStringToNumber(convertToLatinDigits(item.p2?.toString())) ??
            0
          ),
          p3: Number(
            currencyStringToNumber(convertToLatinDigits(item.p3?.toString())) ??
            0
          ),
          p4: Number(
            currencyStringToNumber(convertToLatinDigits(item.p4?.toString())) ??
            0
          ),
          p5: Number(
            currencyStringToNumber(convertToLatinDigits(item.p5?.toString())) ??
            0
          ),
          dtlDsc: item.dtlDsc,
          deleted: item.isDeleted,
        };
        if (
          Number(
            currencyStringToNumber(convertToLatinDigits(item.p1?.toString()))
          ) !== 0 ||
          Number(
            currencyStringToNumber(convertToLatinDigits(item.p2?.toString()))
          ) !== 0 ||
          Number(
            currencyStringToNumber(convertToLatinDigits(item.p3?.toString()))
          ) !== 0 ||
          Number(
            currencyStringToNumber(convertToLatinDigits(item.p4?.toString()))
          ) !== 0 ||
          Number(
            currencyStringToNumber(convertToLatinDigits(item.p5?.toString()))
          ) !== 0
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
      //return "اقلام مشخص نشده!";
    }
    request = {
      guid: guid,
      usrId: authApiResponse?.data.result.login.usrId ?? 0,
      chartId: chartId,
      id: isNew ? 0 : selectedProductPrice?.id ?? 0, //if isNew is true, id is 0, otherwise id is selectedProductPerm?.id for edit
      acc_System: systemId,
      acc_Year: yearId,
      dsc: convertToLatinDigits(dsc),
      dat: convertToLatinDigits(dat),
      tim: convertToLatinDigits(tim),
      saveAndSend: false,
      skipWarning,
      dtls: dtls,
    };
    console.log(request);
    try {
      const response = await productPriceSave(request);
      setIsModalRegOpen(true);
      if (setSelectedRowIndex && isNew) setSelectedRowIndex(0);
      if (response?.meta.message === "") {
        setIsNew(false);
        setIsEdit(false);
        setIsModalRegOpen(false);
      }
      return response;
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
  /////////////////////////////////////////////////////////////for defining cnt
  useEffect(() => {
    let tempCnt = 0;
    console.log(
      isNew,
      //attachments.data.result.length,
      "isNew"
    );
    if (isNew) {
      tempCnt = 0;
      //} else if (attachments.data.result.length !== 0) {
      //  tempCnt = attachments.data.result.length ?? 0;
    } else {
      tempCnt = selectedProductPrice?.attachCount ?? 0;
    }
    setCnt(tempCnt);
  }, [
    //attachments.data.result.length,
    isNew,
    selectedProductPrice?.attachCount,
  ]);
  ///////////////////////////////////////////////////////
  useEffect(() => {
    if (isNew) {
      setGuid(uuidv4());
    } else {
      setGuid(selectedProductPrice?.guid ?? "");
    }
  }, [isNew, selectedProductPrice?.guid]);

  /////////////////////////////////////////////////////////////
  //initializing attachment fields for api/Attachment/list
  const handleAttachmentClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(isNew, selectedProductPrice, "selectedProductPrice");
    if (!isNew) {
      setAttachmentField("systemId", systemId);
      setAttachmentField("yearId", yearId);
      setAttachmentField("formId", selectedProductPrice?.id);
      setAttachmentField("prefix", "ProductPrice");
      setAttachmentField("GUID", guid);
    }
    setShowAttachment(true);
  };
  return (
    <div className="flex flex-col gap-2">
      <ProductOfferFormParams
        isNew={isNew}
        selectedProductOffer={selectedProductPrice}
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
        childButton={
          <Button
            text={`ضمائم ${`(${convertToFarsiDigits(cnt)})`}`}
            backgroundColor={colors.blue_400}
            backgroundColorHover={colors.blue_500}
            variant="w-32"
            onClick={handleAttachmentClick}
          />
        }
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

      <ProductPriceFormList
        canEditForm1={canEditForm1}
        setIsNew={setIsNew}
        setIsEdit={setIsEdit}
        isNew={isNew}
        isEdit={isEdit}
        columns={columns}
        originalData={originalData}
        setOriginalData={setOriginalData}
        isLoadingProductPriceSave={isLoadingProductPriceSave}
        handleSubmitSave={handleSubmitSave}
        isModalEmptyOpen={isModalEmptyOpen} //if user not fill the price, this modal will open
        setIsModalEmptyOpen={setIsModalEmptyOpen} //if user not fill the price, this modal will open
        isDtlHistoryLoading={isLoadingDtlHistory}
        handleSubmit={handleSubmit}
        addList={addList}
        handleAddRow={handleAddRow}
        showDeleted={showDeleted}
        productPriceDtlHistory={productPriceDtlHistory}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isModalRegOpen={isModalRegOpen}
        setIsModalRegOpen={setIsModalRegOpen}
        selectedId={selectedId}
      />
      {/* show attachment component */}
      <ModalForm
        isOpen={showAttachment}
        onClose={() => setShowAttachment(false)}
        title="ضمائم لیست قیمت"
        width="1/2"
        height="90vh"
      >
        <PayRequestAttachment
          formId={
            isNew //|| workFlowRowSelectResponse.msg === "PayRequestOperationForm" //is not in workflow menu
              ? 0
              : selectedProductPrice?.id ?? 0
          }
          setCnt={setCnt}
          prefix={"ProductPrice"}
          guid={guid}
        />
      </ModalForm>
    </div>
  );
};

export default ProductPriceForm;
