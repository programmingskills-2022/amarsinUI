import { Dispatch, SetStateAction, useEffect,  useState } from "react";
import {
  ProductOfferDtlHistory,
  ProductOfferProduct,
  ProductOfferProductTable,
  ProductOfferProductTable2,
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


type Props = {
  addList: ProductOfferProductTable[];
  showDeleted: boolean;
  handleSubmit: (
    e?: React.MouseEvent<HTMLButtonElement>,
    productId?: number
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
  isModalRegOpen:boolean;
  setIsModalRegOpen:Dispatch<SetStateAction<boolean>>;
};


const ProductOfferFormList = ({
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
}: Props) => {

  const [brandSearch, setBrandSearch] = useState<string>("");
  const [dtlDscSearch, setDtlDscSearch] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [deletedData, setDeletedData] = useState<ProductOfferProductTable2[]>(
    []
  );
  const [data, setData] = useState<ProductOfferProductTable2[]>([]);

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
      Header: "پ 1",
      accessor: "s1O",
      width: "10%",
    },
    {
      Header: "پ 2",
      accessor: "s2O",
      width: "10%",
    },
    {
      Header: "پ 3",
      accessor: "s3O",
      width: "10%",
    },
    {
      Header: "پ 4",
      accessor: "s4O",
      width: "10%",
    },
    {
      Header: "پ 5",
      accessor: "s5O",
      width: "10%",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
      width: "25%",
    },
    {
      Header: "بدون آفر",
      accessor: "no",
      width: "5%",
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
    // We also turn on the flag to not reset the page
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
    // Also update the same row in originalData
    const rowInOriginal = data[rowIndex];
    if (rowInOriginal) {
      setOriginalData((origOld) =>
        origOld.map((row) => {
          if (row.id === rowInOriginal.id && row.pId === rowInOriginal.pId) {
            return {
              ...row,
              [columnId]: value,
            };
          }
          return row;
        })
      );
    }
  };
  /////////////////////////////////////////////////////
  const updateMyRow = async (rowIndex: number, value: DefaultOptionType) => {
    const productId = value?.id ?? 0;
    if (productId === 0) return;
    const response = await handleSubmit(undefined, productId);
    let productOfferProducts: ProductOfferProduct[] | undefined =
      response?.data.result.productOfferProducts;
    setOriginalData((old) =>
      old.map((row, index) => {
        if (index === rowIndex && productOfferProducts) {
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
    let timeoutId: number;
    if (isModalRegOpen) {
      timeoutId = setTimeout(() => {
        setIsModalRegOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalRegOpen]);  
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
            canEditForm={true}
            columns={columns}
            data={data}
            updateMyData={updateMyData}
            fontSize="0.75rem"
            changeRowSelectColor={true}
            wordWrap={true}
            updateMyRow={updateMyRow}
            CellColorChange={handleCellColorChange}
            //changeRowValues={changeRowValues}
            showToolTip={true}
          />
        </div>
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
      </div>
      <ProductOfferFormListHistory
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        isDtlHistoryLoading={isDtlHistoryLoading}
        productOfferDtlHistory={productOfferDtlHistory}
        columnsHistory={columnsHistory}
      />
      <ModalMessage 
        isOpen={isModalRegOpen}
        onClose={() => setIsModalRegOpen(false)}
        backgroundColor="bg-green-200"
        bgColorButton="bg-green-500"
        color="text-white"
        message={"اطلاعات با موفقیت ثبت شد."}
        visibleButton={false}
      />
    </>
  );
};

export default ProductOfferFormList;
