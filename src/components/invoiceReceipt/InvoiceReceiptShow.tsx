//Indent/_CreateIndent
//کارشناس خرید => دریافت پیش فاکتور
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { useInvoiceReceipt } from "../../hooks/useInvoiceReceipt";
import { WorkflowRowSelectResponse } from "../../types/workflow";
import { useInvoiceReceiptStore } from "../../store/invoiceReceiptStore";
import {
  convertPersianDate,
  convertToFarsiDigits,
  convertToPersianDate,
  parsePersianDateString,
} from "../../utilities/general";
import InvoiceReceiptShowTable from "./InvoiceReceiptShowTable";
import InvoiceReceipShowHeader from "./InvoiceReceipShowHeader";
import { DefaultOptionTypeStringId, TableColumns } from "../../types/general";
import ConfirmCard from "../layout/ConfirmCard";
import Button from "../controls/Button";
import {
  IndentShowProductListRequest,
  IndentShowProductListResponse,
} from "../../types/product";
import { useGeneralContext } from "../../context/GeneralContext";
import { useProducts } from "../../hooks/useProducts";
import { IndentDtl, IndentDtlTable } from "../../types/invoiceReceipt";
import { handleExport } from "../../utilities/ExcelExport";
import { useProductStore } from "../../store/productStore";
import { DefinitionDateTime } from "../../types/definitionInvironment";
import { useBrandStore } from "../../store/brandStore";
import { useCustomers } from "../../hooks/useCustomers";

type Props = {
  workFlowRowSelectResponse: WorkflowRowSelectResponse;
  refetchSwitch: boolean;
  setRefetchSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  isNew: boolean;
  setIsNew: (isNew: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  definitionDateTime: DefinitionDateTime;
  isFromWorkFlow: boolean;
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
  dat: string;
  tim: string;
};

const InvoiceReceiptShow = ({
  workFlowRowSelectResponse,
  refetchSwitch,
  setRefetchSwitch,
  isNew,
  setIsNew,
  setIsEdit,
  definitionDateTime,
  isFromWorkFlow,
}: 
Props) => {
  const canEditForm = workFlowRowSelectResponse.workTableForms.canEditForm1;
  const { setField, mrsId: mrsIdStore } = useInvoiceReceiptStore();
  const { setField: setProductField } = useProductStore();
  const { setField: setBrandField } = useBrandStore();
  const {customers} = useCustomers();
  const { indentMrsResponse, isLoading, getIndentMrsResponse } =
  useInvoiceReceipt();  const {
    salesPricesSearchResponse,
    addProductList,
    //products,
    saveList,
    isLoadingSaveList,
    isDtHistoryLoading,
  } = useProducts();
  const { yearId } = useGeneralContext();
  //for excel data
  const [excelData, setExcelData] = useState<any[]>([]);

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
      Header: "تعداد",
      accessor: "cnt",
    },
    {
      Header: "آفر",
      accessor: "offer",
    },
    {
      Header: "مبلغ",
      accessor: "cost",
    },
    {
      Header: "تخفیف",
      accessor: "dcrmnt",
    },
    {
      Header: "مالیات",
      accessor: "taxValue",
    },
    {
      Header: "جمع",
      accessor: "total",
    },
    {
      Header: "شرح",
      accessor: "dtlDsc",
    },
  ];
  // Set mrsId BEFORE useInvoiceReceipt hook runs to prevent stale queries
  if (mrsIdStore !== workFlowRowSelectResponse.workTableRow.formId) {
    setField("mrsId", workFlowRowSelectResponse.workTableRow.formId);
  }

  useEffect(() => {
    setBrandField("accSystem", -1);
    setProductField("salesPricesSearchPage", -1); // Disable salesPrices query
    setProductField("pId", -1);
    setProductField("mrsId", -1);
  }, []);

  const [fields, setFields] = useState<Fields>({
    customer: {
      id: indentMrsResponse.data.result.indents?.[0]?.cId.toString() ?? "",
      title: indentMrsResponse.data.result.indents?.[0]?.srName ?? "",
    },
    customerCondition: [],
    brand: [],
    payDuration: indentMrsResponse.data.result.indents?.[0]?.payDuration ?? 0,
    dsc: indentMrsResponse.data.result.indents?.[0]?.dsc ?? "",
    price: {
      id: 0,
      title: "",
    },
    fdate: parsePersianDateString(
      indentMrsResponse.data.result.indents?.[0]?.saleFDate ?? ""
    )
      ? parsePersianDateString(
          indentMrsResponse.data.result.indents?.[0]?.saleFDate ?? ""
        )
      : null,
    tdate: parsePersianDateString(
      indentMrsResponse.data.result.indents?.[0]?.saleTDate ?? ""
    )
      ? parsePersianDateString(
          indentMrsResponse.data.result.indents?.[0]?.saleTDate ?? ""
        )
      : null,
    dat: isNew
      ? convertToFarsiDigits(
          convertToPersianDate(new Date(definitionDateTime.date))
        )
      : convertToFarsiDigits(
          indentMrsResponse.data.result.indents?.[0]?.dat ?? ""
        ),
    tim: isNew
      ? convertToFarsiDigits(definitionDateTime.time)
      : convertToFarsiDigits(
          indentMrsResponse.data.result.indents?.[0]?.tim ?? ""
        ),
  });

  //refetch invoiceReceiptShow if refetchSwitch is true
  useEffect(() => {
    if (!refetchSwitch) return;
    if (refetchSwitch) {
      getIndentMrsResponse();
      setRefetchSwitch(false);
    }
  }, [refetchSwitch]);
  ///////////////////////////////////////////////////////
  useEffect(() => {
    setFields((prev: Fields) => ({
      ...prev,
      customer: {
        id: indentMrsResponse.data.result.indents?.[0]?.cId.toString() ?? "",
        title: indentMrsResponse.data.result.indents?.[0]?.srName ?? "",
      },
      payDuration: indentMrsResponse.data.result.indents?.[0]?.payDuration ?? 0,
      dsc: indentMrsResponse.data.result.indents?.[0]?.dsc ?? "",
      price: {
        id: indentMrsResponse.data.result.indents?.[0]?.salesPriceId ?? 0,
        title:
          indentMrsResponse.data.result.indents?.[0]?.salesPriceTitle ?? "",
      },
      fdate: parsePersianDateString(
        indentMrsResponse.data.result.indents?.[0]?.saleFDate ?? ""
      )
        ? parsePersianDateString(
            indentMrsResponse.data.result.indents?.[0]?.saleFDate ?? ""
          )
        : null,
      tdate: parsePersianDateString(
        indentMrsResponse.data.result.indents?.[0]?.saleTDate ?? ""
      )
        ? parsePersianDateString(
            indentMrsResponse.data.result.indents?.[0]?.saleTDate ?? ""
          )
        : null,
      dat: isNew
        ? convertToFarsiDigits(
            convertToPersianDate(new Date(definitionDateTime.date))
          )
        : convertToFarsiDigits(
            indentMrsResponse.data.result.indents?.[0]?.dat ?? ""
          ),
      tim: isNew
        ? convertToFarsiDigits(definitionDateTime.time)
        : convertToFarsiDigits(
            indentMrsResponse.data.result.indents?.[0]?.tim ?? ""
          ),
    }));
  }, [isLoading, indentMrsResponse.data.result.indents?.[0]]);

  {
    isLoading && <p>در حال بارگذاری...</p>;
  }
  ///////////////////////////////////////////////////////
  const handleSubmit = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    productId: number = 0
  ): Promise<IndentShowProductListResponse | undefined> => {
    if (e) e.preventDefault();
    let request: IndentShowProductListRequest;
    request = {
      mrsId: workFlowRowSelectResponse.workTableRow.formId,
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
  ///////////////////////////////////////////////////////
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
    tax: 0,
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

    //console.log(res, "res");
    if (res && res.data.result) {
      // Batch ALL updates into a SINGLE setAddList call to prevent performance violations
      // This prevents multiple state updates and cascading re-renders
      setAddList((prev) => {
        // Filter out newRow entries (empty rows) before adding new records
        const filteredPrev = prev.filter((item: IndentDtl) => {
          // Remove items that match newRow pattern (id === 0 and product is empty)
          return !(
            item.id === 0 &&
            item.productCode === "" &&
            item.product === "" &&
            item.pId === 0
          );
        });
        
        // Map all products at once
        const newProducts = res.data.result.map((product) => ({
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
          tax: product.tax ?? 0,
          taxValue: product.taxValue ?? 0,
          total: product.total ?? 0,
          dtlDsc: product.dtlDsc,
          del: false,
          recieptId: 0,
          recieptDsc: "",
          isDeleted: false,
        }));
        
        // Add new empty row in the SAME update to avoid second state update
        return [
          ...filteredPrev,
          ...newProducts,
          {
            ...newRow,
            isDeleted: false,
          },
        ];
      });
    }
    //setIsOpen!==undefined && setIsOpen(false); //for close modal
  };

  const handleShowDeleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDeleted(e.target.checked);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileName = "data_export.xlsx";

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
  // Track initialization to prevent infinite loops
  const hasInitializedRef = useRef(false);
  
  useEffect(() => {
    // Only initialize once when isNew is true and list is empty
    if (isNew && addList.length === 0 && !hasInitializedRef.current) {
      setAddList([{ ...newRow }]);
      hasInitializedRef.current = true;
    }
    // Reset flag when isNew changes to false
    if (!isNew) {
      hasInitializedRef.current = false;
    }
  }, [isNew]); // Only depend on isNew to avoid reading stale addList.length

  useEffect(() => {
    const tempData = indentMrsResponse.data.result.indentDtls.map(
      (dtl, index) => {
        return {
          index: index + 1,
          bName: convertToFarsiDigits(dtl.bName),
          productCode: convertToFarsiDigits(dtl.productCode),
          product: convertToFarsiDigits(dtl.product),
          cnt: dtl.cnt,
          offer: dtl.offer,
          cost: dtl.cost,
          dcrmnt: dtl.dcrmnt,
          taxValue: dtl.taxValue,
          total: dtl.total,
          dtlDsc: dtl.dtlDsc,
        };
      }
    );
    setExcelData(tempData);
  }, [indentMrsResponse.data.result.indentDtls]);
  
  return (
    <div className="w-full flex flex-col">
      <InvoiceReceipShowHeader
        customers={customers}
        canEditForm={canEditForm}
        fields={fields}
        setFields={setFields}
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
              data: excelData,
              setIsModalOpen,
              headCells: excelHeadCells,
              fileName,
              hasPersianTitle: true,
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
        isNew={isNew}
        canEditForm={canEditForm}
        indentMrsResponse={indentMrsResponse}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        addList={addList}
        handleAddRow={handleAddRow}
        showDeleted={showDeleted}
        mrsId={workFlowRowSelectResponse.workTableRow.formId}
        fields={fields}
        newRow={newRow}
        saveList={saveList}
        isLoadingSaveList={isLoadingSaveList}
        isDtHistoryLoading={isDtHistoryLoading}
        getIndentMrsResponse={getIndentMrsResponse}
        setIsNew={setIsNew}
        setIsEdit={setIsEdit}
        isFromWorkFlow={isFromWorkFlow}
      />
    </div>
  );
};

export default InvoiceReceiptShow;
