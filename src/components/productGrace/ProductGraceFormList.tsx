import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import TTable from "../controls/TTable";
import { DefaultOptionType, TableColumns } from "../../types/general";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import { red } from "@mui/material/colors";
import ModalMessage from "../layout/ModalMessage";
import {
  ProductGraceDtlHistory,
  ProductGraceListItem,
  ProductGraceListItemTable,
  ProductGraceListItemTable2,
  ProductGraceListResponse,
} from "../../types/productGrace";
import { useProductGraceStore } from "../../store/productGraceStore";
import ProductGraceFormListHistory from "./ProductGraceFormListHistory";
import ProductGraceFormListHeader from "./ProductGraceFormListHeader";
import { useGeneralContext } from "../../context/GeneralContext";
import { ShowProductListRequest } from "../../types/productOperation";
import { normalizeInputForSearch } from "../../utilities/general";

type Props = {
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  addList: ProductGraceListItemTable[];
  showDeleted: boolean;
  handleSubmit: (
    e?: React.MouseEvent<HTMLButtonElement>,
    request?: ShowProductListRequest
  ) => Promise<ProductGraceListResponse | undefined>;
  isLoadingProductOfferSave: boolean;
  handleSubmitSave: () => Promise<string | undefined>;
  isDtlHistoryLoading: boolean;
  handleAddRow: (
    index: number,
    setData: Dispatch<SetStateAction<ProductGraceListItemTable2[]>>
  ) => void;
  productGraceDtlHistory: ProductGraceDtlHistory[];
  originalData: ProductGraceListItemTable2[];
  setOriginalData: Dispatch<SetStateAction<ProductGraceListItemTable2[]>>;
  columns: TableColumns;
  showHistory: boolean;
  setShowHistory: Dispatch<SetStateAction<boolean>>;
  isModalRegOpen: boolean;
  setIsModalRegOpen: Dispatch<SetStateAction<boolean>>;
  isModalEmptyOpen: boolean;
  setIsModalEmptyOpen: Dispatch<SetStateAction<boolean>>;
  canEditForm1: boolean;
  selectedId: number;
  isNew: boolean;
};

const ProductGraceFormList = ({
  canEditForm1,
  setIsNew,
  setIsEdit,
  addList,
  showDeleted,
  handleSubmit,
  isLoadingProductOfferSave,
  handleSubmitSave,
  isDtlHistoryLoading,
  handleAddRow,
  productGraceDtlHistory,
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
  isNew,
}: Props) => {
  const { productGraceSaveResponse } = useProductGraceStore();
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [dtlDscSearch, setDtlDscSearch] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [deletedData, setDeletedData] = useState<ProductGraceListItemTable2[]>(
    []
  );
  const [data, setData] = useState<ProductGraceListItemTable2[]>([]);

  ////////////////////////////////////////////////////////
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
      Header: "تعداد روز فرجه",
      accessor: "graceDays",
      width: "10%",
    },
    {
      Header: "کمیته فروش ",
      accessor: "salesCommission",
      width: "10%",
    },
    {
      Header: "کمیته وصول",
      accessor: "collectionCommission",
      width: "10%",
    },
    {
      Header: "کمیته مازاد",
      accessor: "extraCommission",
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
    //if (addList.length > 0) {
    let i = 1;
    let initialData = addList.map((item) => ({
      ...item,
      index: i++,
      isDeleted: false,
    }));
    //initialData.push({ ...newRow, index: initialData.length + 1 });
    setOriginalData(initialData);
    setData(initialData);
    //}
  }, [addList]);
  ////////////////////////////////////////////////////////
  // Filter data based on search terms
  useEffect(() => {
    const normalizedBrandSearch = normalizeInputForSearch(brandSearch);
    const normalizedProductSearch = normalizeInputForSearch(productSearch);
    const normalizedDtlDscSearch = normalizeInputForSearch(dtlDscSearch);
    if (originalData.length > 0) {
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
    (currentRow as any)[columnId] = value;
    if (!currentRow) return;
    
    const rowInOriginal = originalData.find((row) => row.index === currentRow.index);
    if (rowInOriginal) {
      (rowInOriginal as any)[columnId] = value;
    }
  };
  ////////////////////////////////////////////////////
  const changeRowValues = (
    value: string,
    rowIndex: number,
    columnId: string
  ) => {
    console.log(value, rowIndex, columnId, "come to changeRowValues in productGraceFormList");
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
    let productGraceProducts: ProductGraceListItem[] | undefined =
      response?.data.result.productGraceProducts;
    console.log(productGraceProducts, "productGraceProducts");
    setOriginalData((old) =>
      old.map((row, index) => {
        if (index === rowIndex && productGraceProducts) {
          return {
            ...old[rowIndex],
            index: rowIndex + 1,
            bName: productGraceProducts[0].bName,
            product: productGraceProducts[0].product,
            pId: productGraceProducts[0].pId,
            lastDate: productGraceProducts[0].lastDate,
            gd:
              productGraceProducts[0].gdo > 0 ? productGraceProducts[0].gdo : 0,
            sc:
              productGraceProducts[0].sco > 0 ? productGraceProducts[0].sco : 0,
            cc:
              productGraceProducts[0].cco > 0 ? productGraceProducts[0].cco : 0,
            ec:
              productGraceProducts[0].eco > 0 ? productGraceProducts[0].eco : 0,
            gdo: productGraceProducts[0].gdo > 0 ? productGraceProducts[0].gdo : 0,
            sco: productGraceProducts[0].sco > 0 ? productGraceProducts[0].sco : 0,
            cco: productGraceProducts[0].cco > 0 ? productGraceProducts[0].cco : 0,
            eco: productGraceProducts[0].eco > 0 ? productGraceProducts[0].eco : 0,
            dtlDsc: productGraceProducts[0].dtlDsc,
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
    if (isModalRegOpen) {
      timeoutId = setTimeout(() => {
        setIsModalRegOpen(false);
        setIsNew(false);
        setIsEdit(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalRegOpen]);
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
  // on selecting each row, set the id and productId and yearId in productGraceStore for api/productGrace?id=
  const [selectedDtlId, setSelectedDtlId] = useState<number>(0); // for selected id in productGraceFormList table
  const { yearId } = useGeneralContext();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in productGraceFormList table
  const [res, setRes] = useState<ProductGraceListResponse | undefined>(
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
    if (res && res.data.result.productGraceProducts.length > 0) {
      updateMyRowAfterShowProductList(res);
    }
  }, [res]);
  ////////////////////////////////////////////////////////
  const updateMyRowAfterShowProductList = (res: ProductGraceListResponse) => {
    console.log(
      selectedRowIndex,
      "selectedRowIndex in updateMyRowAfterShowProductList"
    );
    setOriginalData((old) =>
      old.map((row, index) => {
        if (
          index === selectedRowIndex &&
          res.data.result.productGraceProducts.length > 0
        ) {
          return {
            ...row,
            gdo: res.data.result.productGraceProducts[0].gdo,
            sco: res.data.result.productGraceProducts[0].sco,
            cco: res.data.result.productGraceProducts[0].cco,
            eco: res.data.result.productGraceProducts[0].eco,
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
          <ProductGraceFormListHeader
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
        {canEditForm1 && (
          <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end ">
            <Button
              text={isLoadingProductOfferSave ? "در حال ثبت اطلاعات..." : "ثبت"}
              backgroundColor="bg-green-500"
              color="text-white"
              backgroundColorHover="bg-green-600"
              colorHover="text-white"
              variant="shadow-lg w-64"
              onClick={handleSubmitSave}
            />
          </ConfirmCard>
        )}
      </div>
      <ProductGraceFormListHistory
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isDtlHistoryLoading={isDtlHistoryLoading}
        productGraceDtlHistory={productGraceDtlHistory}
        columnsHistory={columnsHistory}
      />
      <ModalMessage
        isOpen={isModalEmptyOpen}
        onClose={() => setIsModalEmptyOpen(false)}
        backgroundColor={"bg-red-200"}
        bgColorButton={"bg-red-500"}
        color="text-white"
        message={"اقلام مشخص نشده!"}
        visibleButton={false}
      />
      <ModalMessage
        isOpen={isModalRegOpen}
        onClose={() => setIsModalRegOpen(false)}
        backgroundColor={
          productGraceSaveResponse?.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          productGraceSaveResponse?.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={
          productGraceSaveResponse?.meta.errorCode >0
            ? productGraceSaveResponse?.meta.message || ""
            : "اطلاعات با موفقیت ثبت شد."
        }
        visibleButton={false}
      />
    </>
  );
};

export default ProductGraceFormList;
