import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ProductOfferDtlHistory,
  ProductOfferProduct,
  ProductOfferProductTable,
  ProductOfferProductTable2,
  ProductOfferSaveResponse,
  ShowProductListRequest,
  ShowProductListResponse,
} from "../../types/productOffer";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import ProductOfferFormListHistory from "./ProductOfferFormListHistory";
import ProductOfferFormListHeader from "./ProductOfferFormListHeader";
import TTable from "../controls/TTable";
import { DefaultOptionType, TableColumns } from "../../types/general";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import { red } from "@mui/material/colors";
import ModalMessage from "../layout/ModalMessage";
import { useGeneralContext } from "../../context/GeneralContext";

type Props = {
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  addList: ProductOfferProductTable[];
  showDeleted: boolean;
  handleSubmit: (
    e?: React.MouseEvent<HTMLButtonElement>,
    request?: ShowProductListRequest
  ) => Promise<ShowProductListResponse | undefined>;
  isLoadingProductOfferSave: boolean;
  handleSubmitSave: () => void;
  isDtlHistoryLoading: boolean;
  handleAddRow: (
    index: number,
    setData: Dispatch<SetStateAction<ProductOfferProductTable2[]>>
  ) => void;
  productOfferDtlHistory: ProductOfferDtlHistory[];
  originalData: ProductOfferProductTable2[];
  setOriginalData: Dispatch<SetStateAction<ProductOfferProductTable2[]>>;
  columns: TableColumns;
  showHistory: boolean;
  setShowHistory: Dispatch<SetStateAction<boolean>>;
  isModalRegOpen: boolean;
  setIsModalRegOpen: Dispatch<SetStateAction<boolean>>;
  canEditForm1: boolean;
  selectedId: number;
  isNew: boolean;
  productOfferSaveResponse: ProductOfferSaveResponse;
  isLoadingAddList: boolean;
};

const ProductOfferFormList = ({
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
  productOfferDtlHistory,
  originalData,
  setOriginalData,
  columns,
  showHistory,
  setShowHistory,
  isModalRegOpen,
  setIsModalRegOpen,
  selectedId,
  isNew,
  productOfferSaveResponse,
  isLoadingAddList,
}: Props) => {
  //const { productOfferSaveResponse } = useProductOfferStore();
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [dtlDscSearch, setDtlDscSearch] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [deletedData, setDeletedData] = useState<ProductOfferProductTable2[]>(
    []
  );
  const [data, setData] = useState<ProductOfferProductTable2[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); //for selected row index in productOfferFormList table
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
      const filtered = originalData
        .filter(
          (dtl) =>
            dtl.bName.includes(brandSearch) &&
            dtl.product.includes(productSearch) &&
            dtl.dtlDsc.includes(dtlDscSearch)
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

    const rowInOriginal = originalData.find(
      (row) => row.index === currentRow.index
    );
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
    console.log(
      isNew,
      value,
      rowIndex,
      columnId,
      "come to changeRowValues in productOfferFormList"
    );
    //updateMyData(rowIndex, columnId, value);
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
    console.log("come to updateMyRow in productOfferFormList", request);
    const response = await handleSubmit(undefined, request);
    let productOfferProducts: ProductOfferProduct[] | undefined =
      response?.data.result;
    setOriginalData((old) =>
      old.map((row, index) => {
        if (index === rowIndex && productOfferProducts) {
          console.log(
            productOfferProducts[0].product,
            "productOfferProducts[0].product in updateMyRow"
          );
          return {
            ...old[rowIndex],
            index: rowIndex + 1,
            bName: productOfferProducts[0].bName,
            product: productOfferProducts[0].product,
            pId: productOfferProducts[0].pId,
            lastDate: productOfferProducts[0].lastDate,
            s1O:
              productOfferProducts[0].s1DO + productOfferProducts[0].s1NO > 0
                ? productOfferProducts[0].s1DO.toString() +
                  "+" +
                  productOfferProducts[0].s1NO.toString()
                : "",
            s2O:
              productOfferProducts[0].s2DO + productOfferProducts[0].s2NO > 0
                ? productOfferProducts[0].s2DO.toString() +
                  "+" +
                  productOfferProducts[0].s2NO.toString()
                : "",
            s3O:
              productOfferProducts[0].s3DO + productOfferProducts[0].s3NO > 0
                ? productOfferProducts[0].s3DO.toString() +
                  "+" +
                  productOfferProducts[0].s3NO.toString()
                : "",
            s4O:
              productOfferProducts[0].s4DO + productOfferProducts[0].s4NO > 0
                ? productOfferProducts[0].s4DO.toString() +
                  "+" +
                  productOfferProducts[0].s4NO.toString()
                : "",
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
  // on selecting each row, set the id and productId and yearId in productGraceStore for api/productGrace?id=
  const { yearId } = useGeneralContext();
  //const [selectedDtlId, setSelectedDtlId] = useState<number>(0); // for selected id in productOfferFormList table
  const [res, setRes] = useState<ShowProductListResponse | undefined>(
    undefined
  );
  useEffect(() => {
    console.log(
      "come to useEffect in productOfferFormList",
      isLoadingAddList,
      selectedRowIndex,
      canEditForm1
    );
    if (isLoadingAddList || !canEditForm1 || selectedRowIndex === 0) return;
    const fetchData = async () => {
      if (data.length > 0) {
        console.log(data, selectedRowIndex, "data in useEffect");
        const found = data.find((item) => item.index === selectedRowIndex + 1);
        //console.log(found, "found in useEffect");
        const productId = found?.pId ?? 0;
        /*console.log(
          productId,
          selectedId,
          canEditForm1,
          "productId in useEffect"
        );*/
        if (productId === 0) return;
        const request: ShowProductListRequest = {
          id: selectedId,
          productId,
          acc_Year: yearId,
          brands: [],
        };
        const res = await handleSubmit(undefined, request);
        setRes(res);
        //console.log(res, "res in useEffect");
      }
    };
    fetchData();
  }, [selectedRowIndex, yearId]);
  ////////////////////////////////////////////////////////
  //initialize selectedRowIndex, selectedDtlId, res when selectedId changes
  useEffect(() => {
    if (selectedId === 0) return;
    setSelectedRowIndex(0);
    //setSelectedDtlId(0);
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
  const updateMyRowAfterShowProductList = (res: ShowProductListResponse) => {
    console.log(
      selectedRowIndex,
      "selectedRowIndex in updateMyRowAfterShowProductList"
    );
    setOriginalData((old) =>
      old.map((row, index) => {
        if (index === selectedRowIndex && res.data.result.length > 0) {
          return {
            ...row,
            s1O:
              res.data.result[0].s1DO + res.data.result[0].s1NO > 0
                ? res.data.result[0].s1DO.toString() +
                  "+" +
                  res.data.result[0].s1NO.toString()
                : "",
            s2O:
              res.data.result[0].s2DO + res.data.result[0].s2NO > 0
                ? res.data.result[0].s2DO.toString() +
                  "+" +
                  res.data.result[0].s2NO.toString()
                : "",
            s3O:
              res.data.result[0].s3DO + res.data.result[0].s3NO > 0
                ? res.data.result[0].s3DO.toString() +
                  "+" +
                  res.data.result[0].s3NO.toString()
                : "",
            s4O:
              res.data.result[0].s4DO + res.data.result[0].s4NO > 0
                ? res.data.result[0].s4DO.toString() +
                  "+" +
                  res.data.result[0].s4NO.toString()
                : "",
            s5O:
              res.data.result[0].s5DO + res.data.result[0].s5NO > 0
                ? res.data.result[0].s5DO.toString() +
                  "+" +
                  res.data.result[0].s5NO.toString()
                : "",
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
          <ProductOfferFormListHeader
            columns={columns}
            brandSearch={brandSearch}
            setBrandSearch={setBrandSearch}
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            dtlDscSearch={dtlDscSearch}
            setDtlDscSearch={setDtlDscSearch}
          />

          <TTable
            //setSelectedId={setSelectedDtlId}
            canEditForm={canEditForm1}
            columns={columns}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
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
      <ProductOfferFormListHistory
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isDtlHistoryLoading={isDtlHistoryLoading}
        productOfferDtlHistory={productOfferDtlHistory}
      />
      <ModalMessage
        isOpen={isModalRegOpen}
        onClose={() => setIsModalRegOpen(false)}
        backgroundColor={
          productOfferSaveResponse?.meta.errorCode <= 0
            ? "bg-green-200"
            : "bg-red-200"
        }
        bgColorButton={
          productOfferSaveResponse?.meta.errorCode <= 0
            ? "bg-green-500"
            : "bg-red-500"
        }
        color="text-white"
        message={
          productOfferSaveResponse?.meta.errorCode > 0
            ? productOfferSaveResponse?.meta.message || ""
            : "اطلاعات با موفقیت ثبت شد."
        }
        visibleButton={false}
      />
    </>
  );
};

export default ProductOfferFormList;
