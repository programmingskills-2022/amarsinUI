import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import TTable from "../controls/TTable";
import { DefaultOptionType, TableColumns } from "../../types/general";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import { red } from "@mui/material/colors";
import ModalMessage from "../layout/ModalMessage";
import {
  ProductPriceDtlHistory,
  ProductPriceListItemTable,
  ProductPriceListItemTable2,
  ProductPriceListResponse,
  ProductPriceSaveResponse,
} from "../../types/productPrice";
import { useProductPriceStore } from "../../store/productPriceStore";
import ProductPriceFormListHistory from "./ProductPriceFormListHistory";
import ProductPriceFormListHeader from "./ProductPriceFormListHeader";
import { colors } from "../../utilities/color";
import ModalForm from "../layout/ModalForm";
import ShowMessages from "../controls/ShowMessages";
import { ShowProductListRequest } from "../../types/productOperation";
import { useGeneralContext } from "../../context/GeneralContext";
import { convertToLatinDigits, currencyStringToNumber, normalizeInputForSearch } from "../../utilities/general";

type Props = {
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  isNew: boolean;
  isEdit: boolean;
  addList: ProductPriceListItemTable[];
  showDeleted: boolean;
  handleSubmit: (
    e?: React.MouseEvent<HTMLButtonElement>,
    request?: ShowProductListRequest
  ) => Promise<ProductPriceListResponse | undefined>;
  isLoadingProductPriceSave: boolean;
  handleSubmitSave: (
    e?: React.MouseEvent<HTMLButtonElement>,
    skipWarning?: boolean
  ) => Promise<ProductPriceSaveResponse | undefined>;
  isDtlHistoryLoading: boolean;
  handleAddRow: (
    index: number,
    setData: Dispatch<SetStateAction<ProductPriceListItemTable2[]>>
  ) => void;
  productPriceDtlHistory: ProductPriceDtlHistory[];
  originalData: ProductPriceListItemTable2[];
  setOriginalData: Dispatch<SetStateAction<ProductPriceListItemTable2[]>>;
  columns: TableColumns;
  showHistory: boolean;
  setShowHistory: Dispatch<SetStateAction<boolean>>;
  isModalRegOpen: boolean;
  setIsModalRegOpen: Dispatch<SetStateAction<boolean>>;
  isModalEmptyOpen: boolean;
  setIsModalEmptyOpen: Dispatch<SetStateAction<boolean>>;
  canEditForm1: boolean;
  selectedId: number;
};

const ProductPriceFormList = ({
  canEditForm1,
  setIsNew,
  setIsEdit,
  isNew,
  isEdit,
  addList,
  showDeleted,
  handleSubmit,
  isLoadingProductPriceSave,
  handleSubmitSave,
  isDtlHistoryLoading,
  handleAddRow,
  productPriceDtlHistory,
  originalData,
  setOriginalData,
  columns,
  showHistory,
  setShowHistory,
  isModalRegOpen,
  setIsModalRegOpen,
  isModalEmptyOpen,
  setIsModalEmptyOpen,
  selectedId,
}: Props) => {
  const { productPriceSaveResponse } = useProductPriceStore();
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [dtlDscSearch, setDtlDscSearch] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [deletedData, setDeletedData] = useState<ProductPriceListItemTable2[]>(
    []
  );
  const [data, setData] = useState<ProductPriceListItemTable2[]>([]);

  const columnsHistory: TableColumns = [
    {
      Header: "ردیف",
      accessor: "index",
      width: "5%",
    },
    {
      Header: "تغییر",
      accessor: "date",
      width: "10%",
    },
    {
      Header: "تایید",
      accessor: "accepted",
      width: "5%",
    },
    {
      Header: "پخش",
      accessor: "p1",
      width: "10%",
    },
    {
      Header: "داروخانه",
      accessor: "p2",
      width: "10%",
    },
    {
      Header: "مصرف کننده",
      accessor: "p3",
      width: "10%",
    },
    {
      Header: "مشتری",
      accessor: "p4",
      width: "10%",
    },
    {
      Header: "مشتری",
      accessor: "p5",
      width: "10%",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
      width: "40%",
    },
  ];

  // Initialize data when addList changes
  useEffect(() => {
    if (addList.length > 0) {
      let i = 1;
      let initialData = addList.map((item) => ({
        ...item,
        index: i++,
        isDeleted: false,
      }));
      //initialData.push({ ...newRow, index: initialData.length + 1 });
      setOriginalData(initialData);
      setData(initialData);
    }
  }, [addList]);
  ////////////////////////////////////////////////////////
  // Filter data based on search terms
  useEffect(() => {
    if (originalData.length > 0) {
      const normalizedBrandSearch = normalizeInputForSearch(brandSearch);
      const normalizedProductSearch = normalizeInputForSearch(productSearch);
      const normalizedDtlDscSearch = normalizeInputForSearch(dtlDscSearch);
      const filtered = originalData
        .filter(
          (dtl) =>
            normalizeInputForSearch(dtl.bName).includes(normalizedBrandSearch) &&
            normalizeInputForSearch(dtl.product).includes(normalizedProductSearch) &&
            normalizeInputForSearch(dtl.dtlDsc).includes(normalizedDtlDscSearch)
        )
        .map((row, idx) => ({ ...row, index: idx + 1 }));

      setData(filtered);
    }
  }, [brandSearch, productSearch, dtlDscSearch, originalData]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (!showDeleted) {
      // Show only records where isDeleted is false
      setDeletedData(originalData.filter((row) => row.isDeleted === true)); //save deleted rows in deletedData
      setOriginalData((old) => old.filter((row) => row.isDeleted === false)); //save undeleted rows in Data
    } else {
      // Show all records
      setOriginalData((old) =>
        [...old, ...deletedData].sort((a, b) => a.index - b.index)
      ); //  full dataset
      setDeletedData([]);
    }
  }, [!showDeleted]);
  //////////////////////////////////////////////////////
  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    // Direct mutation - fastest approach
    // Just find and update the row directly, no state updates needed
    // The mutation persists in the object, React will see it when state is read
    const currentRow = data[rowIndex];
    let val="";
    if (columnId==="p1" || columnId==="p2" || columnId==="p3" || columnId==="p4" || columnId==="p5")
      val=currencyStringToNumber(convertToLatinDigits(value)).toString()
    else 
      val=value;    
    (currentRow as any)[columnId] = val;
    if (!currentRow) return;
    
    const rowInOriginal = originalData.find((row) => row.index === currentRow.index);
    if (rowInOriginal) {
      (rowInOriginal as any)[columnId] = val;
    }
  };
  ////////////////////////////////////////////////////
  const changeRowValues = (
    value: string,
    rowIndex: number,
    columnId: string
  ) => {
    console.log(value, rowIndex, columnId, "come to changeRowValues in productPriceFormList");
  };
  /////////////////////////////////////////////////////
  const updateMyRow = async (rowIndex: number, value: DefaultOptionType) => {
    const productId = value?.id ?? 0;
    if (productId === 0) return;
    const request = {
      id: 0,
      productId: productId,
      acc_Year: yearId,
      brands: [],
    };
    const response = await handleSubmit(undefined, request);
    let productPriceProducts: any[] | undefined =
      response?.data.result;
    setOriginalData((old) =>
      old.map((row, index) => {
        if (index === rowIndex && productPriceProducts) {
          return {
            ...old[rowIndex],
            index: rowIndex + 1,
            bName: productPriceProducts[0].bName,
            product: productPriceProducts[0].product,
            pId: productPriceProducts[0].pId,
            lastDate: productPriceProducts[0].lastDate,
            lastBuyPrice: productPriceProducts[0].lastBuyPrice,
            tax: productPriceProducts[0].tax,
            p1O: productPriceProducts[0].p1O,
            p2O: productPriceProducts[0].p2O,
            p3O: productPriceProducts[0].p3O,
            p4O: productPriceProducts[0].p4O,
            p5O: productPriceProducts[0].p5O,
            dtlDsc: productPriceProducts[0].dtlDsc,
            isDeleted: false,
          };
        }
        return row;
      })
    );
    if (rowIndex === originalData.length - 1) {
      handleAddRow(rowIndex + 2, setOriginalData);
    }
  };
  /////////////////////////////////////////////////////
  // Custom cell click handler for Table
  const handleCellColorChange = (row: any): string | null => {
    if (row.original.isDeleted) {
      return red[100];
    }
    return null;
  };
  /////////////////////////////////////////////////////
  const { height, width } = useCalculateTableHeight();
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    console.log(isModalRegOpen,isNew,isEdit, "isModalRegOpen in useEffect");
    if (isModalRegOpen && !isNew && !isEdit) {
      timeoutId = setTimeout(() => {
        setIsModalRegOpen(false);
        //setIsNew(false);
        //setIsEdit(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isNew, isEdit]);
  ////////////////////////////////////////////////////////
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isModalEmptyOpen) {
      timeoutId = setTimeout(() => {
        setIsModalEmptyOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalEmptyOpen]);
  ////////////////////////////////////////////////////////
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in productGraceFormList table
  const handleSubmitSaveWithSkipWarning = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const response = await handleSubmitSave(e, true);
      console.log(response?.meta.errorCode, "response");
      if (response?.meta.errorCode > 0) {
        setIsNew(true);
        setIsEdit(true);
      } else {
        setIsNew(false);
        setIsEdit(false);
        setIsModalRegOpen(false)
      }
    } catch (error) {
      console.error("Error ثبت :", error);
    }
  };
    ////////////////////////////////////////////////////////
  // on selecting each row, set the id and productId and yearId in productGraceStore for api/productGrace?id=
  const [selectedDtlId, setSelectedDtlId] = useState<number>(0); // for selected id in productGraceFormList table
  const { yearId } = useGeneralContext();
  const [res, setRes] = useState<ProductPriceListResponse | undefined>(
    undefined
  );
  useEffect(() => {
    if (isNew || selectedId === 0 || !canEditForm1) return;
    const fetchData = async () => {
      if (data.length > 0) {
        const found = data.find((item) => item.id === selectedDtlId);
        const productId = found?.pId ?? 0;
        console.log(
          productId,
          selectedId,
          canEditForm1,
          "productId in useEffect"
        );
        if (productId === 0) return;
        const request: ShowProductListRequest = {
          id: selectedId,
          productId,
          acc_Year: yearId,
          brands: [],
        };
        const res = await handleSubmit(undefined, request);
        setRes(res);
        console.log(res, "res in useEffect");
      }
    };
    fetchData();
  }, [selectedDtlId, yearId]);
  ////////////////////////////////////////////////////////
  //initialize selectedRowIndex, selectedDtlId, res when selectedId changes
  useEffect(() => {
    if (selectedId === 0) return;
    setSelectedRowIndex(0);
    setSelectedDtlId(0);
    setRes(undefined);
  }, [selectedId]);
  ////////////////////////////////////////////////////////
  //update originalData when res (productGraceListResponse) changes
  useEffect(() => {
    if (res && res.data.result.length > 0) {
      updateMyRowAfterShowProductList(res);
    }
  }, [res]);
  ////////////////////////////////////////////////////////
  const updateMyRowAfterShowProductList = (res: any) => {
    console.log(
      selectedRowIndex,
      "selectedRowIndex in updateMyRowAfterShowProductList"
    );
    setOriginalData((old) =>
      old.map((row, index) => {
        if (
          index === selectedRowIndex &&
          res.data.result.length > 0
        ) {
          return {
            ...row,
            lastBuyPrice: res.data.result[0].lastBuyPrice,
            tax: res.data.result[0].tax,
            p1O: res.data.result[0].p1O,
            p2O: res.data.result[0].p2O,
            p3O: res.data.result[0].p3O,
            p4O: res.data.result[0].p4O,
            p5O: res.data.result[0].p5O,
          };
        }
        return row;
      })
    );
  };
  ////////////////////////////////////////////////////////
  return (
    <>
      <div className="mt-2 w-full bg-white rounded-md">
        <div
          className="overflow-y-auto"
          style={width > 640 ? { height: height - 400 } : {}}
        >
          <ProductPriceFormListHeader
            columns={columns}
            brandSearch={brandSearch}
            setBrandSearch={setBrandSearch}
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            dtlDscSearch={dtlDscSearch}
            setDtlDscSearch={setDtlDscSearch}
          />

          <TTable
            setSelectedId={setSelectedDtlId}
            canEditForm={canEditForm1}
            columns={columns}
            data={data}
            originalData={originalData}
            updateMyData={updateMyData}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={true}
            updateMyRow={updateMyRow}
            CellColorChange={handleCellColorChange}
            changeRowValues={changeRowValues}
            showToolTip={true}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
          />
        </div>
        <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end ">
          <Button
            text={isLoadingProductPriceSave ? "در حال ثبت اطلاعات..." : "ثبت"}
            backgroundColor="bg-green-500"
            color="text-white"
            backgroundColorHover="bg-green-600"
            colorHover="text-white"
            variant="shadow-lg w-64"
            onClick={(e) => handleSubmitSave(e, false)}
          />
        </ConfirmCard>
      </div>
      <ProductPriceFormListHistory
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isDtlHistoryLoading={isDtlHistoryLoading}
        productPriceDtlHistory={productPriceDtlHistory}
        columnsHistory={columnsHistory}
      />
      <ModalMessage
        isOpen={isModalRegOpen}
        onClose={() => setIsModalRegOpen(false)}
        backgroundColor={
          productPriceSaveResponse?.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          productPriceSaveResponse?.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={productPriceSaveResponse?.meta.message}
        visibleButton={false}
      />
      {
        <ModalMessage
          isOpen={isModalEmptyOpen}
          onClose={() => setIsModalEmptyOpen(false)}
          backgroundColor={"bg-red-200"}
          bgColorButton={"bg-red-500"}
          color="text-white"
          message={"اقلام مشخص نشده!"}
          visibleButton={false}
        />
      }

      {productPriceSaveResponse?.data.result.dtlErrMsgs?.length > 0 && (
        <ModalForm
          isOpen={isModalRegOpen}
          onClose={() => setIsModalRegOpen(false)}
          title="پیام ها"
          width="1/2"
          isCloseable={true}
        >
          <ShowMessages
            dtlErrMsgs={productPriceSaveResponse.data.result.dtlErrMsgs || []}
            color={colors.red100}
            heightWindow={300}
          >
            <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end ">
              <Button
                text={
                  isLoadingProductPriceSave ? "در حال ثبت اطلاعات..." : "ثبت"
                }
                backgroundColor="bg-green-500"
                color="text-white"
                backgroundColorHover="bg-green-600"
                colorHover="text-white"
                variant="shadow-lg w-64"
                onClick={handleSubmitSaveWithSkipWarning}
              />
            </ConfirmCard>
          </ShowMessages>
        </ModalForm>
      )}
    </>
  );
};

export default ProductPriceFormList;
