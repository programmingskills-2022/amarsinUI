//کارشناس خرید => دریافت پیش فاکتور
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInvoiceReceipt } from "../../hooks/useInvoiceReceipt";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useInvoiceReceiptStore } from "../../store/invoiceReceiptStore";
import {
  convertPersianDate,
  convertToFarsiDigits,
  parsePersianDateString,
} from "../../utilities/general";
import InvoiceReceiptShowTable from "./InvoiceReceiptShowTable";
import InvoiceReceipShowHeader from "./InvoiceReceipShowHeader";
import { DefaultOptionTypeStringId } from "../../types/general";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import {
  IndentShowProductListRequest,
  IndentShowProductListResponse,
  ProductSearchRequest,
} from "../../types/product";
import { useGeneralContext } from "../../context/GeneralContext";
import { useProducts } from "../../hooks/useProducts";
import { IndentDtl, IndentDtlTable } from "../../types/invoiceReceipt";
import { handleExport } from "../../utilities/ExcelExport";
import { headCells } from "./InvoiceReceiptShowTable";
import { useProductStore } from "../../store/productStore";
import { debounce } from "lodash";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  canEditForm: boolean;
};

export type Fields = {
  customer: DefaultOptionTypeStringId | null;
  customerCondition: DefaultOptionTypeStringId[] | null;
  brand: DefaultOptionTypeStringId[] | null;
  payDuration: number;
  price: { id: number; title: string } | null;
  fdate: Date | null;
  tdate: Date | null;
  dsc: string;
};

const InvoiceReceiptShow = ({
  workFlowRowSelectResponse,
  canEditForm,
}: Props) => {
  //const canEditForm1Mst1 =
   // workFlowRowSelectResponse.workTableForms.canEditForm1Mst1;
  const { setField, mrsId } = useInvoiceReceiptStore();
  const { yearId, systemId } = useGeneralContext();
  const { indentMrsResponse, isLoading, getIndentMrsResponse } =
    useInvoiceReceipt();
  const {
    salesPricesSearchResponse,
    addProductList,
    products,
    saveList,
    isLoadingSaveList,
    isDtHistoryLoading,
  } = useProducts();

  useEffect(() => {
    if (mrsId !== workFlowRowSelectResponse.workTableRow.formId)
      setField("mrsId", workFlowRowSelectResponse.workTableRow.formId);
  }, [workFlowRowSelectResponse.workTableRow.formId]);

  const [fields, setFields] = useState<Fields>({
    customer: {
      id: indentMrsResponse.indents[0]?.cId.toString() ?? "",
      title: indentMrsResponse.indents[0]?.srName ?? "",
    },
    customerCondition: [],
    brand: [],
    payDuration: indentMrsResponse.indents[0]?.payDuration ?? 0,
    dsc: indentMrsResponse.indents[0]?.dsc ?? "",
    price: {
      id: 0,
      title: "",
    },
    fdate: parsePersianDateString(indentMrsResponse.indents[0]?.saleFDate)
      ? parsePersianDateString(indentMrsResponse.indents[0]?.saleFDate)
      : null,
    tdate: parsePersianDateString(indentMrsResponse.indents[0]?.saleTDate)
      ? parsePersianDateString(indentMrsResponse.indents[0]?.saleTDate)
      : null,
  });

  useEffect(() => {
    setFields((prev: Fields) => ({
      ...prev,
      customer: {
        id: indentMrsResponse.indents[0]?.cId.toString() ?? "",
        title: indentMrsResponse.indents[0]?.srName ?? "",
      },
      payDuration: indentMrsResponse.indents[0]?.payDuration ?? 0,
      dsc: indentMrsResponse.indents[0]?.dsc ?? "",
      price: {
        id: indentMrsResponse.indents[0]?.salesPriceId ?? 0,
        title: indentMrsResponse.indents[0]?.salesPriceTitle ?? "",
      },
      fdate: parsePersianDateString(indentMrsResponse.indents[0]?.saleFDate)
        ? parsePersianDateString(indentMrsResponse.indents[0]?.saleFDate)
        : null,
      tdate: parsePersianDateString(indentMrsResponse.indents[0]?.saleTDate)
        ? parsePersianDateString(indentMrsResponse.indents[0]?.saleTDate)
        : null,
    }));
  }, [isLoading, indentMrsResponse]);

  {
    isLoading && <p>در حال بارگذاری...</p>;
  }

  const handleSubmit = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    productId: number = 0
  ): Promise<IndentShowProductListResponse | undefined> => {
    if (e) e.preventDefault();
    let request: IndentShowProductListRequest;
    request = {
      mrsId,
      productId: productId,
      acc_Year: yearId,
      providers:
        fields.customerCondition?.map((provider) => Number(provider.id)) ?? [],
      brands: fields.brand?.map((b) => Number(b.id)) ?? [],
      salesPriceId: Number(fields.price?.id ?? 0),
      saleFDate:
        fields.fdate === null || !fields.fdate
          ? ""
          : convertPersianDate(fields.fdate.toLocaleDateString("fa-IR")),
      saleTDate:
        fields.tdate === null || !fields.tdate
          ? ""
          : convertPersianDate(fields.tdate.toLocaleDateString("fa-IR")),
    };

    console.log(request, "request");
    try {
      return await addProductList(request);
    } catch (error) {
      console.error("Error editing indents:", error);
    }
  };

  const newRow: IndentDtlTable = {
    index: 0,
    id: 0,
    ordr: 0,
    custId: 0,
    customer: "",
    pId: 0,
    bName: "",
    productCode: "",
    product: "",
    sumCompanyCnt: 0,
    sumStoreCnt: 0,
    lbDate: "",
    companyStock: 0,
    storeStock: 0,
    productExp: "",
    cnt: 0,
    offer: 0,
    cost: 0,
    dcrmntPrcnt: 0,
    dcrmnt: 0,
    taxValue: 0,
    total: 0,
    dtlDsc: "",
    del: false,
    recieptId: 0,
    recieptDsc: "",
    isDeleted: false,
  };

  const handleAddRow = (
    index: number,
    setData: Dispatch<SetStateAction<IndentDtlTable[]>>
  ) => {
    setData((prev: IndentDtlTable[]) => [...prev, { ...newRow, index: index }]);
  };

  const [addList, setAddList] = useState<IndentDtl[]>([]);
  const [showDeleted, setShowDeleted] = useState(true);

  const handleSubmitAndAddToTable = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number = 0
  ) => {
    const res = await handleSubmit(e, productId);

    if (res && res.indentProducts) {
      // Map through the new products
      res.indentProducts.forEach((product) => {
        setAddList((prev) => [
          ...prev,
          {
            //index: rowIndex + 1 + i,
            id: product.id,
            ordr: 0,
            custId: 0,
            customer: "",
            pId: product.pId,
            bName: product.bName,
            productCode: "",
            product: product.product,
            sumCompanyCnt: product.sumCompanyCnt ?? 0,
            sumStoreCnt: product.sumStoreCnt ?? 0,
            lbDate: product.lbDate ?? "",
            companyStock: product.companyStock ?? 0,
            storeStock: product.storeStock ?? 0,
            productExp: "",
            cnt: product.cnt ?? 0,
            offer: product.offer ?? 0,
            cost: product.cost ?? 0,
            dcrmntPrcnt: 0,
            dcrmnt: 0,
            taxValue: product.taxValue ?? 0,
            total: product.total ?? 0,
            dtlDsc: product.dtlDsc,
            del: false,
            recieptId: 0,
            recieptDsc: "",
            isDeleted: false,
          },
        ]);
      });
      setAddList((prev) => [
        ...prev,
        {
          ...newRow,
          //  index: rowIndex + res.indentProducts.length + 1
          isDeleted: false,
        },
      ]);
    }
  };

  const handleShowDeleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDeleted(e.target.checked);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileName = "data_export.xlsx";

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

  const [search, setSearch] = useState<string>("");
  const { setField: setProductField } = useProductStore();
  //send params to /api/Product/search?accSystem=4&accYear=15&page=1&searchTerm=%D8%B3%D9%81
  useEffect(() => {
    setProductField("accSystem", systemId);
    setProductField("accYear", yearId);
    //setProductField("searchTerm", convertToFarsiDigits(search));
    handleDebounceFilterChange("searchTerm", convertToFarsiDigits(search));
    setProductField("page", 1);
  }, [search, systemId, yearId]);
  const abortControllerRef = useRef<AbortController | null>(null);
  ///////////////////////////////////////////////////////
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
  //////////////////////////////////////////////////////////
  return (
    <div className="w-full flex flex-col">
      <InvoiceReceipShowHeader
        //canEditForm1Mst1={canEditForm1Mst1}
        canEditForm={canEditForm}
        fields={fields}
        setFields={setFields}
        indentMrsResponse={indentMrsResponse}
        salesPricesSearchResponse={salesPricesSearchResponse}
      />
      <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end">
        {canEditForm && (
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
              data: indentMrsResponse.indentDtls,
              setIsModalOpen,
              headCells,
              fileName,
            })
          }
        />
      </ConfirmCard>

      <div className="flex justify-between items-center">
        <p className="mt-2 px-2 text-sm">اقلام</p>
        <div className="flex gap-2 items-center justify-center">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={handleShowDeleted}
          />
          <p>نمایش حذف شده ها</p>
        </div>
      </div>

      <InvoiceReceiptShowTable
        setProductSearchinTable={setSearch}
        canEditForm={canEditForm}
        indentMrsResponse={indentMrsResponse}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        addList={addList}
        handleAddRow={handleAddRow}
        showDeleted={showDeleted}
        mrsId={mrsId}
        fields={fields}
        newRow={newRow}
        products={products.map((p) => ({
          id: p.pId,
          title: convertToFarsiDigits(p.n),
        }))}
        saveList={saveList}
        isLoadingSaveList={isLoadingSaveList}
        isDtHistoryLoading={isDtHistoryLoading}
        getIndentMrsResponse={getIndentMrsResponse}
      />
    </div>
  );
};

export default InvoiceReceiptShow;
